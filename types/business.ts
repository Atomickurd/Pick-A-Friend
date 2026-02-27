export type BusinessCategory =
  | 'vet'
  | 'groomer'
  | 'trainer'
  | 'pet_store'
  | 'dog_cafe'
  | 'dog_park'
  | 'boarding'
  | 'daycare'
  | 'other';

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  photoURLs: string[];
  rating: number; // 0–5
  reviewCount: number;
  openingHours: OpeningHours;
  isPremiumPartner: boolean;
  createdAt: string;
}

export interface OpeningHours {
  monday: DayHours | null;
  tuesday: DayHours | null;
  wednesday: DayHours | null;
  thursday: DayHours | null;
  friday: DayHours | null;
  saturday: DayHours | null;
  sunday: DayHours | null;
}

export interface DayHours {
  open: string; // 'HH:mm'
  close: string;
}

export interface BusinessReview {
  id: string;
  businessId: string;
  authorUid: string;
  rating: number; // 1–5
  text: string;
  createdAt: string;
}
