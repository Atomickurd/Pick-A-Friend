export type Gender = 'male' | 'female';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type SocialPreference = 'loves' | 'okay' | 'prefers_not';
export type DogSize = 'tiny' | 'small' | 'medium' | 'large' | 'giant';
export type MoodStatus = 'happy' | 'playful' | 'calm' | 'tired' | 'grumpy';

export interface DogProfile {
  id: string;
  ownerUid: string;
  name: string;
  breed: string;
  gender: Gender;
  dateOfBirth: string; // ISO date string YYYY-MM-DD
  weightKg: number;
  size: DogSize;
  photoURLs: string[];
  bio: string;
  traits: string[]; // max 10, from TRAITS constant
  badges: string[];
  energyLevel: EnergyLevel;
  /** How the dog feels about other dogs */
  dogSocialPref: SocialPreference;
  /** How the dog feels about humans */
  humanSocialPref: SocialPreference;
  isNeutered: boolean;
  isMicrochipped: boolean;
  vaccinated: boolean;
  moodStatus: MoodStatus;
  moodUpdatedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DogLocation {
  dogId: string;
  ownerUid: string;
  latitude: number;
  longitude: number;
  geohash: string;
  moodStatus: MoodStatus;
  isBirthday: boolean;
  updatedAt: string; // Firestore server timestamp ISO string
}

export interface MatchScore {
  dogId: string;
  targetDogId: string;
  score: number; // 0–100
  breakdown: MatchBreakdown;
  computedAt: string;
}

export interface MatchBreakdown {
  traits: number;
  energy: number;
  size: number;
  social: number;
  distance: number;
}
