import { create } from 'zustand';
import type { MapFilter, MapPin, MapDisplayMode } from '../types';

const DEFAULT_FILTER: MapFilter = {
  ageMin: null,
  ageMax: null,
  size: [],
  gender: [],
  energy: [],
  nature: [],
};

interface MapState {
  pins: MapPin[];
  filter: MapFilter;
  displayMode: MapDisplayMode;
  showBusinesses: boolean;
  showLostDogs: boolean;
  selectedPinId: string | null;
  // actions
  setPins: (pins: MapPin[]) => void;
  upsertPin: (pin: MapPin) => void;
  removePin: (dogId: string) => void;
  setFilter: (filter: Partial<MapFilter>) => void;
  resetFilter: () => void;
  setDisplayMode: (mode: MapDisplayMode) => void;
  setShowBusinesses: (v: boolean) => void;
  setShowLostDogs: (v: boolean) => void;
  setSelectedPinId: (id: string | null) => void;
}

export const useMapStore = create<MapState>()((set) => ({
  pins: [],
  filter: DEFAULT_FILTER,
  displayMode: 'standard',
  showBusinesses: true,
  showLostDogs: true,
  selectedPinId: null,

  setPins: (pins) => set({ pins }),

  upsertPin: (pin) =>
    set((s) => {
      const key =
        pin.type === 'dog'
          ? pin.dogId
          : pin.type === 'business'
            ? pin.businessId
            : pin.reportId;
      const existing = s.pins.findIndex((p) => {
        if (p.type !== pin.type) return false;
        if (p.type === 'dog') return p.dogId === key;
        if (p.type === 'business') return p.businessId === key;
        return p.reportId === key;
      });
      const next = [...s.pins];
      if (existing >= 0) next[existing] = pin;
      else next.push(pin);
      return { pins: next };
    }),

  removePin: (dogId) =>
    set((s) => ({
      pins: s.pins.filter((p) => !(p.type === 'dog' && p.dogId === dogId)),
    })),

  setFilter: (partial) =>
    set((s) => ({ filter: { ...s.filter, ...partial } })),

  resetFilter: () => set({ filter: DEFAULT_FILTER }),

  setDisplayMode: (displayMode) => set({ displayMode }),

  setShowBusinesses: (showBusinesses) => set({ showBusinesses }),

  setShowLostDogs: (showLostDogs) => set({ showLostDogs }),

  setSelectedPinId: (selectedPinId) => set({ selectedPinId }),
}));
