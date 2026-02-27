import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

const db = admin.firestore();
const STALE_MINUTES = 15;

/**
 * Every 10 minutes: delete dog_location docs older than 15 minutes.
 * Keeps the map fresh — stale pins removed automatically.
 */
export const staleLocationCleanup = functions.pubsub
  .schedule('every 10 minutes')
  .onRun(async () => {
    const cutoff = new Date(Date.now() - STALE_MINUTES * 60 * 1000);
    const stale = await db
      .collection('dog_locations')
      .where('updatedAt', '<', cutoff)
      .get();

    const batch = db.batch();
    stale.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`[staleLocationCleanup] Deleted ${stale.size} stale pins`);
  });
