import { apiClient } from './client';
import { MOCK_MATCHES } from '../mockData';
import type { DogProfile, MatchScore } from '../../types';

export interface MatchResult {
  dog: DogProfile;
  match: MatchScore;
}

export async function fetchMatches(dogId: string): Promise<MatchResult[]> {
  try {
    const { data } = await apiClient.get<MatchResult[]>('/matches', {
      params: { dogId },
    });
    return data;
  } catch {
    // Backend not yet deployed — return mock matches.
    return MOCK_MATCHES;
  }
}

export async function dismissMatch(matchId: string): Promise<void> {
  await apiClient.post(`/matches/${matchId}/dismiss`);
}
