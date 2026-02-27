import { prisma } from '../db/prisma';

export interface FeedPage {
  items: unknown[];
  cursor: string | null;
  hasMore: boolean;
}

const PAGE_SIZE = 20;

/**
 * Compose an ordered feed for a user.
 * Current order: newest posts first.
 * Future: inject match widgets, lost alerts, adoption cards.
 */
export async function composeFeed(
  uid: string,
  cursor?: string | null,
): Promise<FeedPage> {
  const posts = await prisma.post.findMany({
    where: {
      isPublic: true,
      ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: PAGE_SIZE + 1,
  });

  const hasMore = posts.length > PAGE_SIZE;
  const items = hasMore ? posts.slice(0, PAGE_SIZE) : posts;
  const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null;

  return { items, cursor: nextCursor, hasMore };
}
