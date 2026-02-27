import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

const FRENEMY_RADIUS_M = 200;
const CROWD_THRESHOLD = 5;
const CROWD_RADIUS_M = 100;

/** Haversine distance in metres between two lat/lng pairs */
function distanceM(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const onLocationWrite = functions.firestore
  .document('dog_locations/{dogId}')
  .onWrite(async (change) => {
    const after = change.after.data();
    if (!after) return; // deleted

    const { latitude, longitude, ownerUid, dogId } = after;

    // Fetch all other active locations (exclude own)
    const snap = await db
      .collection('dog_locations')
      .where('ownerUid', '!=', ownerUid)
      .get();

    const nearbyFrenemies: string[] = [];
    let crowdCount = 0;

    snap.forEach((doc) => {
      const loc = doc.data();
      const dist = distanceM(latitude, longitude, loc.latitude, loc.longitude);
      if (dist <= FRENEMY_RADIUS_M) nearbyFrenemies.push(loc.ownerUid);
      if (dist <= CROWD_RADIUS_M) crowdCount++;
    });

    // Send frenemy proximity notification
    if (nearbyFrenemies.length > 0) {
      const usersSnap = await db
        .collection('users')
        .where(admin.firestore.FieldPath.documentId(), 'in', nearbyFrenemies.slice(0, 10))
        .get();
      const tokens: string[] = [];
      usersSnap.forEach((d) => { if (d.data().pushToken) tokens.push(d.data().pushToken); });

      if (tokens.length) {
        await messaging.sendEachForMulticast({
          tokens,
          notification: {
            title: '🐾 A dog you know is nearby!',
            body: 'Head outside — a furry friend is close by!',
          },
          data: { type: 'frenemy_nearby', dogId },
        });
      }
    }

    // Crowd detection — notify the dog's owner
    if (crowdCount >= CROWD_THRESHOLD) {
      const userDoc = await db.collection('users').doc(ownerUid).get();
      const pushToken = userDoc.data()?.pushToken;
      if (pushToken) {
        await messaging.send({
          token: pushToken,
          notification: {
            title: '🐕 Dog crowd spotted!',
            body: `There are ${crowdCount} dogs near you right now!`,
          },
          data: { type: 'crowd_detected', count: String(crowdCount) },
        });
      }
    }
  });
