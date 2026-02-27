import type { Dog } from '@prisma/client';

interface MatchBreakdown {
  traits: number;
  energy: number;
  size: number;
  social: number;
  distance: number;
}

const SIZE_ORDER: Record<string, number> = {
  tiny: 0, small: 1, medium: 2, large: 3, giant: 4,
};

const ENERGY_ORDER: Record<string, number> = {
  low: 0, medium: 1, high: 2,
};

const SOCIAL_ORDER: Record<string, number> = {
  loves: 2, okay: 1, prefers_not: 0,
};

function traitScore(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 50;
  const setA = new Set(a);
  const intersection = b.filter((t) => setA.has(t)).length;
  const union = new Set([...a, ...b]).size;
  return Math.round((intersection / union) * 100);
}

function energyScore(a: string, b: string): number {
  const diff = Math.abs((ENERGY_ORDER[a] ?? 1) - (ENERGY_ORDER[b] ?? 1));
  return diff === 0 ? 100 : diff === 1 ? 60 : 20;
}

function sizeScore(a: string, b: string): number {
  const diff = Math.abs((SIZE_ORDER[a] ?? 2) - (SIZE_ORDER[b] ?? 2));
  return Math.max(0, 100 - diff * 20);
}

function socialScore(dogSocialPref: string, humanSocialPref: string): number {
  const dogScore = (SOCIAL_ORDER[dogSocialPref] ?? 1) / 2;
  const humanScore = (SOCIAL_ORDER[humanSocialPref] ?? 1) / 2;
  return Math.round(((dogScore + humanScore) / 2) * 100);
}

function distanceScore(distanceKm: number): number {
  if (distanceKm <= 0.5) return 100;
  if (distanceKm <= 1) return 90;
  if (distanceKm <= 2) return 80;
  if (distanceKm <= 5) return 60;
  if (distanceKm <= 10) return 40;
  return 20;
}

export function computeMatchScore(
  dogA: Dog,
  dogB: Dog,
  distanceKm: number,
): { score: number; breakdown: MatchBreakdown } {
  const breakdown: MatchBreakdown = {
    traits: traitScore(dogA.traits, dogB.traits),
    energy: energyScore(dogA.energyLevel, dogB.energyLevel),
    size: sizeScore(dogA.size, dogB.size),
    social: socialScore(dogB.dogSocialPref, dogB.humanSocialPref),
    distance: distanceScore(distanceKm),
  };

  const score = Math.round(
    breakdown.traits * 0.35 +
    breakdown.energy * 0.25 +
    breakdown.size * 0.15 +
    breakdown.social * 0.10 +
    breakdown.distance * 0.15,
  );

  return { score, breakdown };
}
