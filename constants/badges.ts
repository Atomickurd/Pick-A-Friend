export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: string;
  category: 'social' | 'explorer' | 'community' | 'special';
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'park_king',
    name: 'Park King',
    description: 'Visited a park 10 times via the live map',
    emoji: '👑',
    condition: '10 park visits tracked on map',
    category: 'explorer',
  },
  {
    id: 'beach_pup',
    name: 'Beach Pup',
    description: 'Hit the beach 3 times',
    emoji: '🏖️',
    condition: '3 beach visits tracked on map',
    category: 'explorer',
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Accepted 10 Paw Requests',
    emoji: '🦋',
    condition: '10 mutual Paw Requests accepted',
    category: 'social',
  },
  {
    id: 'latte_lad',
    name: 'Latte Lad',
    description: 'Visited a dog-friendly café via the map',
    emoji: '☕',
    condition: 'Check-in at a café in the Business Directory',
    category: 'explorer',
  },
  {
    id: 'lost_dog_hero',
    name: 'Lost Dog Hero',
    description: 'Helped in a Lost & Found case',
    emoji: '🦸',
    condition: 'Responded to a Lost Dog alert (Seen Now or Contact Owner)',
    category: 'community',
  },
  {
    id: 'pawtner_in_crime',
    name: 'Pawtner in Crime',
    description: 'Got your first mutual Woof match!',
    emoji: '🐾',
    condition: 'First mutual Paw Request accepted',
    category: 'social',
  },
  {
    id: 'early_adopter',
    name: 'Early Paw',
    description: 'Joined PickAFriend in the first month',
    emoji: '🌟',
    condition: 'Account created in first 30 days of launch',
    category: 'special',
  },
  {
    id: 'adopted_via_paf',
    name: 'Forever Family',
    description: 'Adopted a dog via PickAFriend',
    emoji: '🏠',
    condition: 'Adoption completed through the app',
    category: 'community',
  },
  {
    id: 'neighborhood_star',
    name: 'Neighborhood Star',
    description: 'Most active dog in your area this week',
    emoji: '⭐',
    condition: 'Top 1 in neighborhood leaderboard for the week',
    category: 'social',
  },
  {
    id: 'kilometer_king',
    name: 'Kilometer King',
    description: 'Walked 50km tracked via the app',
    emoji: '🏃',
    condition: '50km total walk distance recorded',
    category: 'explorer',
  },
];
