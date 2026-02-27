import { useEffect, useState } from 'react';
import { fsListen } from '../services/firebase/firestore';

/**
 * Subscribe to a single Firestore document.
 * Returns { data, loading, error }.
 */
export function useFirestoreDoc<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = fsListen<T>(
      path,
      (d) => {
        setData(d);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return unsub;
  }, [path]);

  return { data, loading, error };
}
