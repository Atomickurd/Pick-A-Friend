export type LostReportStatus = 'lost' | 'sighted' | 'found' | 'reunited';

export interface LostReport {
  id: string;
  reporterUid: string;
  dogId: string | null; // null if not registered in app
  dogName: string;
  dogBreed: string;
  dogPhotoURL: string;
  dogDescription: string;
  status: LostReportStatus;
  lastSeenLatitude: number;
  lastSeenLongitude: number;
  lastSeenAddress: string;
  lastSeenAt: string; // ISO datetime
  rewardOffered: boolean;
  rewardAmount: number | null;
  contactPhone: string;
  sightings: Sighting[];
  isBroadcast: boolean; // was FCM broadcast sent
  createdAt: string;
  updatedAt: string;
}

export interface Sighting {
  id: string;
  reportId: string;
  reporterUid: string;
  latitude: number;
  longitude: number;
  address: string;
  note: string;
  photoURL: string | null;
  seenAt: string;
  createdAt: string;
}
