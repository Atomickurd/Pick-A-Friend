export type SubscriptionTier = 'free' | 'premium';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  city: string;
  neighbourhood: string;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry: string | null; // ISO date string
  stripeCustomerId: string | null;
  pushToken: string | null;
  privacySettings: PrivacySettings;
  createdAt: string;
  updatedAt: string;
}

export interface PrivacySettings {
  showOnMap: boolean;
  showLastSeen: boolean;
  allowPawRequests: boolean;
  allowMessages: 'everyone' | 'friends' | 'none';
  showInFeed: boolean;
}
