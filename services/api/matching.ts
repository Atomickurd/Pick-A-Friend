import { apiClient } from './client';
import type { DogProfile, MatchScore } from '../../types';

export interface MatchResult {
  dog: DogProfile;
  match: MatchScore;
}

export async function fetchMatches(dogId: string): Promise<MatchResult[]> {
  const { data } = await apiClient.get<MatchResult[]>('/matches', {
    params: { dogId },
  });
  return data;
}

export async function dismissMatch(matchId: string): Promise<void> {
  await apiClient.post(`/matches/${matchId}/dismiss`);
}
