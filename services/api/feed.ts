import { apiClient } from './client';
import { MOCK_FEED_PAGE } from '../mockData';
import type { Post } from '../../types';

export interface FeedPage {
  items: Post[];
  cursor: string | null;
  hasMore: boolean;
}

export async function fetchFeed(cursor?: string | null): Promise<FeedPage> {
  try {
    const { data } = await apiClient.get<FeedPage>('/feed', {
      params: cursor ? { cursor } : undefined,
    });
    return data;
  } catch {
    // Backend not yet deployed — return mock data.
    return MOCK_FEED_PAGE;
  }
}

export async function createPost(
  payload: Partial<Post>,
): Promise<Post> {
  const { data } = await apiClient.post<Post>('/posts', payload);
  return data;
}

export async function reactToPost(
  postId: string,
  reaction: string,
): Promise<void> {
  await apiClient.post(`/posts/${postId}/react`, { reaction });
}

export async function rsvpEvent(
  postId: string,
  status: 'going' | 'not_going',
): Promise<void> {
  await apiClient.post(`/posts/${postId}/rsvp`, { status });
}
