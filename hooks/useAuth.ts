import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSegments } from 'expo-router';
import { auth } from '../lib/firebase';
import { useUserStore } from '../store/user';
import { useDogStore } from '../store/dog';
import { fsGet } from '../services/firebase/firestore';
import type { UserProfile } from '../types';

export function useAuth() {
  const { setUser, setLoading, clear: clearUser } = useUserStore();
  const { clear: clearDogs } = useDogStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fsGet<UserProfile>(`users/${firebaseUser.uid}`);
        setUser(
          profile ?? {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? '',
            photoURL: firebaseUser.photoURL,
            city: '',
            neighbourhood: '',
            subscriptionTier: 'free',
            subscriptionExpiry: null,
            stripeCustomerId: null,
            pushToken: null,
            privacySettings: {
              showOnMap: true,
              showLastSeen: true,
              allowPawRequests: true,
              allowMessages: 'everyone',
              showInFeed: true,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        );
        setLoading(false);

        const inAuthGroup = segments[0] === 'auth';
        if (inAuthGroup) router.replace('/(tabs)/map');
      } else {
        clearUser();
        clearDogs();
        setLoading(false);

        const inProtected = segments[0] !== 'auth';
        if (inProtected) router.replace('/auth/login');
      }
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
