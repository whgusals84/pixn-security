export const contentSchemaStatements = [
  `CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS managed_content (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    content_type TEXT NOT NULL CHECK (content_type IN ('post', 'note', 'lab')),
    topic TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_managed_content_slug ON managed_content(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_managed_content_status_updated ON managed_content(status, updated_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_managed_content_type_status ON managed_content(content_type, status)`,
] as const;

