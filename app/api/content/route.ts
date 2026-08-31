import { listPublishedContent, type ContentType } from '@/lib/content-db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedType = url.searchParams.get('type');
  const type = requestedType && ['post', 'note', 'lab'].includes(requestedType)
    ? (requestedType as ContentType)
    : undefined;
  const topic = url.searchParams.get('topic') || undefined;
  const items = await listPublishedContent({ type, topic });
  return Response.json({ items });
}

