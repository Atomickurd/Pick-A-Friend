import { BusinessCategory } from './business';
import { MoodStatus } from './dog';

export type MapDisplayMode = 'standard' | 'satellite';

export type MapPinType = 'dog' | 'business' | 'lost' | 'event';

export interface MapFilter {
  ageMin: number | null; // months
  ageMax: number | null;
  size: string[];
  gender: string[];
  energy: string[];
  nature: string[]; // dogSocialPref values
}

export interface DogMapPin {
  type: 'dog';
  dogId: string;
  ownerUid: string;
  name: string;
  photoURL: string;
  latitude: number;
  longitude: number;
  moodStatus: MoodStatus;
  isBirthday: boolean;
  isFrenemy: boolean;
  updatedAt: string;
}

export interface BusinessMapPin {
  type: 'business';
  businessId: string;
  name: string;
  category: BusinessCategory;
  latitude: number;
  longitude: number;
  rating: number;
}

export interface LostMapPin {
  type: 'lost';
  reportId: string;
  dogName: string;
  photoURL: string;
  latitude: number;
  longitude: number;
  lastSeenAt: string;
}

export type MapPin = DogMapPin | BusinessMapPin | LostMapPin;
