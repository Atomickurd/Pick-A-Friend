export type PawRequestStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface PawRequest {
  id: string;
  fromUid: string;
  fromDogId: string;
  toUid: string;
  toDogId: string;
  message: string;
  status: PawRequestStatus;
  matchScore: number;
  channelId: string | null; // set when accepted
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}
