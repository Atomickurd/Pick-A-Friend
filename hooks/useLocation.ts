import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useDogStore, selectActiveDog } from '../store/dog';
import { useUserStore } from '../store/user';
import { writeDogLocation } from '../services/firebase/firestore';
import { encodeGeohash } from '../services/geohash';
import type { DogLocation } from '../types';

const UPDATE_INTERVAL_MS = 30_000; // 30 s

export function useLocation() {
  const activeDog = useDogStore(selectActiveDog);
  const user = useUserStore((s) => s.user);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    if (!activeDog || !user) return;
    if (!user.privacySettings.showOnMap) return;

    let mounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: UPDATE_INTERVAL_MS,
          distanceInterval: 20,
        },
        async (loc) => {
          if (!mounted) return;
          const today = new Date();
          const dob = new Date(activeDog.dateOfBirth);
          const isBirthday =
            today.getMonth() === dob.getMonth() &&
            today.getDate() === dob.getDate();

          const dogLoc: DogLocation = {
            dogId: activeDog.id,
            ownerUid: user.uid,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            geohash: encodeGeohash(
              loc.coords.latitude,
              loc.coords.longitude,
              9,
            ),
            moodStatus: activeDog.moodStatus,
            isBirthday,
            updatedAt: new Date().toISOString(),
          };

          await writeDogLocation(dogLoc);
        },
      );
    })();

    return () => {
      mounted = false;
      watchRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDog?.id, user?.uid, user?.privacySettings.showOnMap]);
}
