export interface Trait {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const TRAITS: Trait[] = [
  {
    id: 'playful',
    label: 'Playful',
    emoji: '🎾',
    description: 'Always ready to play! This pup brings the energy and fun to every hangout.',
  },
  {
    id: 'drama_queen',
    label: 'Drama Queen',
    emoji: '🎭',
    description: 'Every scratch is a tragedy. Every meal is a standing ovation. Life is theater.',
  },
  {
    id: 'affectionate',
    label: 'Affectionate',
    emoji: '🥰',
    description: 'Cuddles are non-negotiable. This dog lives for love and will snuggle anyone.',
  },
  {
    id: 'gentle_soul',
    label: 'Gentle Soul',
    emoji: '🕊️',
    description: 'Calm, kind, and peaceful. This dog never rushes and never judges.',
  },
  {
    id: 'loyal',
    label: 'Loyal',
    emoji: '🤝',
    description: "Your ride-or-die. Once they pick you, you're family — forever.",
  },
  {
    id: 'couch_potato',
    label: 'Couch Potato',
    emoji: '🛋️',
    description: 'Born to Netflix and chill. The perfect low-energy companion for lazy Sundays.',
  },
  {
    id: 'bark_and_hide',
    label: 'Bark & Hide',
    emoji: '🙈',
    description: 'Big bark, tiny bravery. They WILL alert you — then hide behind your legs.',
  },
  {
    id: 'stubborn_nugget',
    label: 'Stubborn Nugget',
    emoji: '🐾',
    description:
      "Has opinions. Strong ones. Will sit in the middle of the road until you reconsider.",
  },
  {
    id: 'protective_hero',
    label: 'Protective Hero',
    emoji: '🦸',
    description:
      'Takes their guardian duties very seriously. Nothing gets past this watchful pup.',
  },
  {
    id: 'possessive_paw',
    label: 'Possessive Paw',
    emoji: '💎',
    description:
      "Their toys. Their human. Their spot on the couch. Everything is theirs. Deal with it.",
  },
  {
    id: 'shy_bean',
    label: 'Shy Bean',
    emoji: '🫘',
    description:
      'Takes time to warm up, but once they trust you, they are the sweetest thing alive.',
  },
  {
    id: 'social_butterfly',
    label: 'Social Butterfly',
    emoji: '🦋',
    description: 'Loves everyone, immediately, loudly. Best friend to all, stranger to none.',
  },
  {
    id: 'ball_enthusiast',
    label: 'Ball Enthusiast',
    emoji: '⚽',
    description:
      'Fetch is not a game, it is a lifestyle. The ball is life. All other activities are inferior.',
  },
  {
    id: 'snacks_addict',
    label: 'Snacks Addict',
    emoji: '🍖',
    description:
      'Will do literally anything for a treat. Sits, shakes, lies down — all for snacks.',
  },
  {
    id: 'snack_hunter',
    label: 'Snack Hunter',
    emoji: '🔍',
    description: 'Always on the scent. No crumb is safe, no bag is un-sniffed. A true forager.',
  },
  {
    id: 'jealous_jellybean',
    label: 'Jealous Jellybean',
    emoji: '😤',
    description:
      "If you pet another dog, you will hear about it. Your attention is theirs and theirs alone.",
  },
];

export const SOCIAL_PREFS_DOGS = [
  { id: 'loves_everyone', label: 'Loves Everyone', emoji: '🌍' },
  { id: 'bro_code', label: 'Bro-Code Only', emoji: '🤜' },
  { id: 'girl_squad', label: 'Girl Squad Vibes', emoji: '💅' },
  { id: 'lone_wolf', label: 'Lone Wolf', emoji: '🐺' },
  { id: 'puppy_lover', label: 'Puppy Lover', emoji: '🐶' },
] as const;

export const SOCIAL_PREFS_HUMANS = [
  { id: 'loves_everyone', label: 'Loves Everyone & Everything', emoji: '🤗' },
  { id: 'mens_best', label: "Men's Best Friend", emoji: '👨' },
  { id: 'ladys_dog', label: "Lady's Dog", emoji: '👩' },
  { id: 'selective', label: 'Selective Sniffer', emoji: '🧐' },
  { id: 'kid_approved', label: 'Kid-Approved', emoji: '👧' },
  { id: 'no_kids', label: 'No Little Guys', emoji: '🚫' },
] as const;
