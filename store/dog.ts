import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DogProfile } from '../types';

interface DogState {
  dogs: DogProfile[];
  activeDogId: string | null;
  isLoading: boolean;
  // actions
  setDogs: (dogs: DogProfile[]) => void;
  addDog: (dog: DogProfile) => void;
  updateDog: (id: string, partial: Partial<DogProfile>) => void;
  removeDog: (id: string) => void;
  setActiveDogId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useDogStore = create<DogState>()(
  persist(
    (set) => ({
      dogs: [],
      activeDogId: null,
      isLoading: false,
      setDogs: (dogs) =>
        set({ dogs, activeDogId: dogs.length ? dogs[0].id : null }),
      addDog: (dog) =>
        set((s) => ({ dogs: [...s.dogs, dog], activeDogId: dog.id })),
      updateDog: (id, partial) =>
        set((s) => ({
          dogs: s.dogs.map((d) => (d.id === id ? { ...d, ...partial } : d)),
        })),
      removeDog: (id) =>
        set((s) => {
          const dogs = s.dogs.filter((d) => d.id !== id);
          return {
            dogs,
            activeDogId:
              s.activeDogId === id ? (dogs[0]?.id ?? null) : s.activeDogId,
          };
        }),
      setActiveDogId: (activeDogId) => set({ activeDogId }),
      setLoading: (isLoading) => set({ isLoading }),
      clear: () => set({ dogs: [], activeDogId: null }),
    }),
    {
      name: 'paf-dogs',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ dogs: s.dogs, activeDogId: s.activeDogId }),
    },
  ),
);

// Convenience selector
export const selectActiveDog = (s: DogState) =>
  s.dogs.find((d) => d.id === s.activeDogId) ?? null;
