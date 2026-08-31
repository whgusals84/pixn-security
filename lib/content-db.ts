import { env } from 'cloudflare:workers';
import { contentSchemaStatements } from '@/db/schema';

export type ContentType = 'post' | 'note' | 'lab';
export type ContentStatus = 'draft' | 'published';

export type ManagedContent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content_type: ContentType;
  topic: string;
  body: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

function database() {
  return (env as unknown as { DB: D1Database }).DB;
}

export async function ensureContentSchema() {
  const db = database();
  await db.batch(contentSchemaStatements.map((statement) => db.prepare(statement)));
  return db;
}

export async function listPublishedContent(filters?: { type?: ContentType; topic?: string }) {
  const db = await ensureContentSchema();
  const clauses = ["status = 'published'"];
  const values: string[] = [];

  if (filters?.type) {
    clauses.push('content_type = ?');
    values.push(filters.type);
  }
  if (filters?.topic) {
    clauses.push('topic = ?');
    values.push(filters.topic);
  }

  const query = `SELECT id, slug, title, summary, content_type, topic, body, status, created_at, updated_at, published_at
    FROM managed_content
    WHERE ${clauses.join(' AND ')}
    ORDER BY COALESCE(published_at, updated_at) DESC`;
  const result = await db.prepare(query).bind(...values).all<ManagedContent>();
  return result.results;
}

export async function getPublishedContent(slug: string) {
  const db = await ensureContentSchema();
  return db
    .prepare(`SELECT id, slug, title, summary, content_type, topic, body, status, created_at, updated_at, published_at
      FROM managed_content WHERE slug = ? AND status = 'published' LIMIT 1`)
    .bind(slug)
    .first<ManagedContent>();
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function inlineMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');
}

export function renderMarkdown(markdown: string) {
  const escaped = escapeHtml(markdown.replaceAll('\r\n', '\n'));
  const blocks: string[] = [];
  const withCodeBlocks = escaped.replace(/```([^\n]*)\n([\s\S]*?)```/g, (_match, language, code) => {
    const token = `@@CODE_BLOCK_${blocks.length}@@`;
    blocks.push(`<pre><code data-language="${language.trim()}">${code.trimEnd()}</code></pre>`);
    return token;
  });

  const lines = withCodeBlocks.split('\n');
  const output: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(`<p>${inlineMarkdown(paragraph.join('<br>'))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    output.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`);
    list = [];
  };

  for (const line of lines) {
    if (/^@@CODE_BLOCK_\d+@@$/.test(line)) {
      flushParagraph();
      flushList();
      output.push(line);
    } else if (/^###\s+/.test(line)) {
      flushParagraph();
      flushList();
      output.push(`<h3>${inlineMarkdown(line.replace(/^###\s+/, ''))}</h3>`);
    } else if (/^##\s+/.test(line)) {
      flushParagraph();
      flushList();
      output.push(`<h2>${inlineMarkdown(line.replace(/^##\s+/, ''))}</h2>`);
    } else if (/^#\s+/.test(line)) {
      flushParagraph();
      flushList();
      output.push(`<h2>${inlineMarkdown(line.replace(/^#\s+/, ''))}</h2>`);
    } else if (/^-\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^-\s+/, ''));
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return output
    .join('\n')
    .replace(/@@CODE_BLOCK_(\d+)@@/g, (_match, index) => blocks[Number(index)] ?? '');
}

