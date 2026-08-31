import { ensureContentSchema, type ContentStatus, type ContentType, type ManagedContent } from '@/lib/content-db';

export const dynamic = 'force-dynamic';

const validTypes = new Set<ContentType>(['post', 'note', 'lab']);
const validStatuses = new Set<ContentStatus>(['draft', 'published']);

class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function cleanSlug(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 100);
}

async function requireOwner(request: Request) {
  const userId = request.headers.get('oai-authenticated-user-id');
  const email = request.headers.get('oai-authenticated-user-email') ?? '';
  if (!userId) throw new AuthError(401, 'ChatGPT 로그인이 필요합니다.');

  const db = await ensureContentSchema();
  const now = new Date().toISOString();
  await db
    .prepare("INSERT OR IGNORE INTO site_settings (key, value, updated_at) VALUES ('owner_user_id', ?, ?)")
    .bind(userId, now)
    .run();
  if (email) {
    await db
      .prepare("INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES ('owner_email', ?, ?)")
      .bind(email, now)
      .run();
  }
  const owner = await db
    .prepare("SELECT value FROM site_settings WHERE key = 'owner_user_id' LIMIT 1")
    .first<{ value: string }>();
  if (!owner || owner.value !== userId) throw new AuthError(403, '이 사이트의 관리자만 사용할 수 있습니다.');
  return { db, email };
}

function errorResponse(error: unknown) {
  if (error instanceof AuthError) return Response.json({ error: error.message }, { status: error.status });
  if (error instanceof Error && /UNIQUE constraint failed/i.test(error.message)) {
    return Response.json({ error: '이미 사용 중인 주소입니다.' }, { status: 409 });
  }
  return Response.json({ error: '저장 중 문제가 발생했습니다.' }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    const { db, email } = await requireOwner(request);
    const result = await db
      .prepare(`SELECT id, slug, title, summary, content_type, topic, body, status, created_at, updated_at, published_at
        FROM managed_content ORDER BY updated_at DESC`)
      .all<ManagedContent>();
    return Response.json({ items: result.results, ownerEmail: email });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await requireOwner(request);
    const input = (await request.json()) as Partial<ManagedContent>;
    const title = String(input.title ?? '').trim().slice(0, 180);
    const slug = cleanSlug(input.slug);
    const type = input.content_type as ContentType;
    const status = input.status as ContentStatus;
    if (!title || !slug || !validTypes.has(type) || !validStatuses.has(status)) {
      return Response.json({ error: '제목, 영문 주소, 종류와 상태를 확인하세요.' }, { status: 400 });
    }
    const now = new Date().toISOString();
    const item: ManagedContent = {
      id: crypto.randomUUID(),
      slug,
      title,
      summary: String(input.summary ?? '').trim().slice(0, 400),
      content_type: type,
      topic: String(input.topic ?? '').trim().slice(0, 60),
      body: String(input.body ?? '').slice(0, 200_000),
      status,
      created_at: now,
      updated_at: now,
      published_at: status === 'published' ? now : null,
    };
    await db
      .prepare(`INSERT INTO managed_content
        (id, slug, title, summary, content_type, topic, body, status, created_at, updated_at, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`) 
      .bind(item.id, item.slug, item.title, item.summary, item.content_type, item.topic, item.body, item.status, item.created_at, item.updated_at, item.published_at)
      .run();
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await requireOwner(request);
    const input = (await request.json()) as Partial<ManagedContent>;
    const id = String(input.id ?? '');
    const title = String(input.title ?? '').trim().slice(0, 180);
    const slug = cleanSlug(input.slug);
    const type = input.content_type as ContentType;
    const status = input.status as ContentStatus;
    if (!id || !title || !slug || !validTypes.has(type) || !validStatuses.has(status)) {
      return Response.json({ error: '수정할 글의 필수 항목을 확인하세요.' }, { status: 400 });
    }
    const existing = await db
      .prepare('SELECT published_at FROM managed_content WHERE id = ? LIMIT 1')
      .bind(id)
      .first<{ published_at: string | null }>();
    if (!existing) return Response.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
    const now = new Date().toISOString();
    const publishedAt = status === 'published' ? existing.published_at ?? now : null;
    await db
      .prepare(`UPDATE managed_content SET slug = ?, title = ?, summary = ?, content_type = ?, topic = ?, body = ?,
        status = ?, updated_at = ?, published_at = ? WHERE id = ?`)
      .bind(slug, title, String(input.summary ?? '').trim().slice(0, 400), type, String(input.topic ?? '').trim().slice(0, 60), String(input.body ?? '').slice(0, 200_000), status, now, publishedAt, id)
      .run();
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { db } = await requireOwner(request);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return Response.json({ error: '삭제할 글을 찾을 수 없습니다.' }, { status: 400 });
    await db.prepare('DELETE FROM managed_content WHERE id = ?').bind(id).run();
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

