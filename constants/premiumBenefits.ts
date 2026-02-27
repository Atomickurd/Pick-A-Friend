export interface PremiumBenefit {
  headline: string;
  subtitle: string;
  benefits: string[];
  illustration: string; // emoji for now, can be replaced with image asset
}

export const premiumBenefits: Record<string, PremiumBenefit> = {
  ghost_mode: {
    headline: 'Go Invisible with Ghost Mode',
    subtitle: 'Be a mystery on the map',
    benefits: [
      'Your pin disappears from the map for everyone except your Friends',
      'You can still see all nearby dogs',
      'A discreet indicator shows you\'re invisible',
    ],
    illustration: '👻',
  },
  advanced_filters: {
    headline: 'Find Your Perfect Match',
    subtitle: 'Filter by interests, schedule, and more',
    benefits: [
      'Filter by activity hours and typical schedule',
      'Match by shared interests beyond energy level',
      'See full compatibility breakdown — not just a score',
    ],
    illustration: '🔍',
  },
  unlimited_messaging: {
    headline: 'Chat Without Limits',
    subtitle: 'Never hit a daily message cap again',
    benefits: [
      'Unlimited messages, images, and videos in every chat',
      'Send voice messages and file attachments',
      'Your message limit resets — forever',
    ],
    illustration: '💬',
  },
  calendar_sync: {
    headline: 'Sync to Google Calendar',
    subtitle: 'Your dog\'s schedule, everywhere',
    benefits: [
      'Full two-way sync with Google Calendar',
      'Dog appointments appear in your personal calendar',
      'Never miss a vet, grooming, or playdate',
    ],
    illustration: '📅',
  },
  lost_found_boost: {
    headline: 'Supercharge Lost Dog Alerts',
    subtitle: 'Reach more people, faster',
    benefits: [
      'Amplify your alert radius up to 10km',
      'Priority placement in the feed for boosted alerts',
      'More eyes on your report = faster reunion',
    ],
    illustration: '🚨',
  },
  unlimited_radius: {
    headline: 'Expand Your World',
    subtitle: 'See dogs beyond your 5km bubble',
    benefits: [
      'View dogs up to 50km away on the map',
      'Discover communities and events in other cities',
      'Great for travel with your dog',
    ],
    illustration: '🗺️',
  },
  adoption_early_access: {
    headline: 'Meet Shelter Dogs First',
    subtitle: 'Early access to new adoption listings',
    benefits: [
      'See new shelter dog listings before free users',
      'Unlimited adoption swipes every day',
      'Priority placement of your application',
    ],
    illustration: '🐶',
  },
  premium_events: {
    headline: 'Exclusive Community Events',
    subtitle: 'Access VIP dog meetups and events',
    benefits: [
      'Join Premium-only dog meetups and events',
      'Exclusive access to partnered shelter adoption days',
      'Priority RSVP for popular community events',
    ],
    illustration: '🎉',
  },
  dogmart_ai: {
    headline: 'Unlimited AI Dog Advisor',
    subtitle: 'Your 24/7 vet and behavior coach',
    benefits: [
      'Ask unlimited questions to DogSmart AI',
      'Get behavior coaching, nutrition advice, and health tips',
      'Powered by veterinary-reviewed knowledge',
    ],
    illustration: '🤖',
  },
  default: {
    headline: 'Unlock Premium Features',
    subtitle: 'Get the most out of PickAFriend',
    benefits: [
      'Ghost Mode — go invisible on the map',
      'Unlimited messaging with your dog friends',
      'Advanced match filters and full compatibility insights',
    ],
    illustration: '✨',
  },
};
