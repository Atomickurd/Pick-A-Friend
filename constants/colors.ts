export const Colors = {
  // Brand — Primary Purple
  purple: '#6B21A8',
  midPurple: '#7C3AED',
  lightPurple: '#EDE9FE',

  // Brand — Teal (business pins, events)
  teal: '#0D9488',
  lightTeal: '#CCFBF1',

  // Mood colors
  moodCalm: '#C2410C',       // Deep orange
  moodPlayful: '#F59E0B',    // Yellow-amber
  moodUnavailable: '#9CA3AF', // Gray

  // Relationship border colors
  friend: '#15803D',         // Green
  pawtential: '#CA8A04',     // Gold
  frenemy: '#B91C1C',        // Red

  // Status / alerts
  amber: '#F59E0B',
  red: '#EF4444',
  green: '#22C55E',
  orange: '#F97316',

  // Text
  dark: '#111827',
  midGray: '#6B7280',
  lightGray: '#E5E7EB',

  // Backgrounds
  white: '#FFFFFF',
  background: '#FAFAFA',
  border: '#E5E7EB',

  // Code / debug
  codeBg: '#1E1E2E',
  codeText: '#CDD6F4',

  // Tab bar
  tabActive: '#6B21A8',
  tabInactive: '#9CA3AF',

  // Map pin overlay
  lostPin: '#EF4444',
  businessPin: '#0D9488',

  // Feed reactions
  woofColor: '#F97316',
  heartColor: '#EF4444',
  pawColor: '#6B21A8',
  boneColor: '#D97706',
  treatColor: '#92400E',
} as const;

export type ColorKey = keyof typeof Colors;

/** Semantic alias used throughout components */
export const COLORS = {
  primary: Colors.purple,
  primaryLight: Colors.lightPurple,
  secondary: Colors.teal,
  secondaryLight: Colors.lightTeal,
  text: Colors.dark,
  textLight: Colors.midGray,
  background: Colors.background,
  surface: Colors.white,
  border: Colors.border,
  error: Colors.red,
  success: Colors.green,
  warning: Colors.amber,
} as const;
