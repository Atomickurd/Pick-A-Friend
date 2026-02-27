import { useState, useCallback } from 'react';
import { fetchMatches, dismissMatch, MatchResult } from '../services/api/matching';
import { useDogStore, selectActiveDog } from '../store/dog';

export function useMatching() {
  const activeDog = useDogStore(selectActiveDog);
  const [stack, setStack] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    if (!activeDog) return;
    setIsLoading(true);
    setError(null);
    try {
      const results = await fetchMatches(activeDog.id);
      setStack(results);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load matches');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDog?.id]);

  const swipeRight = useCallback(async () => {
    if (stack.length === 0) return;
    const [current, ...rest] = stack;
    setStack(rest);
    if (rest.length < 3) loadMatches();
    return current;
  }, [stack, loadMatches]);

  const swipeLeft = useCallback(async () => {
    if (stack.length === 0) return;
    const [current, ...rest] = stack;
    setStack(rest);
    await dismissMatch(current.match.targetDogId);
    if (rest.length < 3) loadMatches();
  }, [stack, loadMatches]);

  return { stack, isLoading, error, loadMatches, swipeRight, swipeLeft };
}
