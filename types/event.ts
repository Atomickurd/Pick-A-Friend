export type EventCategory =
  | 'playdate'
  | 'training'
  | 'agility'
  | 'birthday'
  | 'meetup'
  | 'charity'
  | 'other';

export interface DogEvent {
  id: string;
  creatorUid: string;
  title: string;
  description: string;
  category: EventCategory;
  latitude: number;
  longitude: number;
  locationName: string;
  address: string;
  startAt: string; // ISO datetime
  endAt: string; // ISO datetime
  maxAttendees: number | null;
  attendeeCount: number;
  isRSVPd: boolean;
  coverImageURL: string | null;
  isPremiumOnly: boolean;
  createdAt: string;
}

export interface CalendarEntry {
  id: string;
  ownerUid: string;
  dogId: string;
  eventId: string | null;
  title: string;
  notes: string;
  startAt: string;
  endAt: string;
  category: EventCategory | 'vet' | 'grooming' | 'medication' | 'personal';
  reminderMinutes: number | null;
  createdAt: string;
}
