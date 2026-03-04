import { create } from 'zustand';
import type { Post } from '../types';

interface FeedState {
  items: Post[];
  cursor: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  // actions
  setItems: (items: Post[]) => void;
  appendItems: (items: Post[]) => void;
  updateItem: (id: string, partial: Partial<Post>) => void;
  setCursor: (cursor: string | null) => void;
  setLoading: (v: boolean) => void;
  setRefreshing: (v: boolean) => void;
  setHasMore: (v: boolean) => void;
  clear: () => void;
}

export const useFeedStore = create<FeedState>()((set) => ({
  items: [],
  cursor: null,
  isLoading: false,
  isRefreshing: false,
  hasMore: true,

  setItems: (items) => set({ items }),
  appendItems: (items) =>
    set((s) => {
      const seen = new Set(s.items.map((i) => i.id));
      return { items: [...s.items, ...items.filter((i) => !seen.has(i.id))] };
    }),
  updateItem: (id, partial) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, ...partial } : i)),
    })),
  setCursor: (cursor) => set({ cursor }),
  setLoading: (isLoading) => set({ isLoading }),
  setRefreshing: (isRefreshing) => set({ isRefreshing }),
  setHasMore: (hasMore) => set({ hasMore }),
  clear: () =>
    set({ items: [], cursor: null, isLoading: false, hasMore: true }),
}));
