import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, SubscriptionTier } from '../types';

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  // actions
  setUser: (user: UserProfile | null) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      updateUser: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : s.user })),
      setLoading: (isLoading) => set({ isLoading }),
      clear: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'paf-user',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ user: s.user }),
    },
  ),
);

// Convenience selectors
export const selectTier = (s: UserState): SubscriptionTier =>
  s.user?.subscriptionTier ?? 'free';

export const selectIsPremium = (s: UserState) =>
  s.user?.subscriptionTier === 'premium';
