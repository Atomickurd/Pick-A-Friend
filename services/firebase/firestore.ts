import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { DogLocation, AppNotification } from '../../types';

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

export async function fsGet<T>(path: string): Promise<T | null> {
  const snap = await getDoc(doc(db, path));
  return snap.exists() ? (snap.data() as T) : null;
}

export async function fsSet<T extends DocumentData>(
  path: string,
  data: T,
): Promise<void> {
  await setDoc(doc(db, path), { ...data, updatedAt: serverTimestamp() });
}

export async function fsUpdate(
  path: string,
  data: Partial<DocumentData>,
): Promise<void> {
  await updateDoc(doc(db, path), { ...data, updatedAt: serverTimestamp() });
}

export async function fsDelete(path: string): Promise<void> {
  await deleteDoc(doc(db, path));
}

export function fsListen<T>(
  path: string,
  onData: (data: T | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, path),
    (snap) => onData(snap.exists() ? (snap.data() as T) : null),
    onError,
  );
}

export function fsQuery<T>(
  collectionPath: string,
  constraints: QueryConstraint[],
  onData: (items: T[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(collection(db, collectionPath), ...constraints);
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)),
    onError,
  );
}

// ---------------------------------------------------------------------------
// Dog locations (live positions on map)
// ---------------------------------------------------------------------------

export async function writeDogLocation(loc: DogLocation): Promise<void> {
  await setDoc(doc(db, 'dog_locations', loc.dogId), {
    ...loc,
    updatedAt: serverTimestamp(),
  });
}

export function listenNearbyDogLocations(
  geohashPrefix: string,
  onData: (locs: DogLocation[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'dog_locations'),
    where('geohash', '>=', geohashPrefix),
    where('geohash', '<=', geohashPrefix + '\uf8ff'),
    orderBy('geohash'),
    limit(200),
  );
  return onSnapshot(q, (snap) =>
    onData(snap.docs.map((d) => d.data() as DogLocation)),
  );
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export function listenNotifications(
  uid: string,
  onData: (items: AppNotification[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'notifications'),
    where('recipientUid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(50),
  );
  return onSnapshot(q, (snap) =>
    onData(
      snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AppNotification),
    ),
  );
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', id), { isRead: true });
}
