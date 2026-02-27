import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

const db = admin.firestore();

/**
 * Daily: set isBirthday=true on dog_locations whose DOB matches today,
 * and clear it for all others.
 */
export const birthdayPinCheck = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayMmDd = `${mm}-${dd}`;

    // Get all active dog_locations
    const locsSnap = await db.collection('dog_locations').get();

    const batch = db.batch();
    let birthdays = 0;

    for (const locDoc of locsSnap.docs) {
      const { dogId } = locDoc.data();
      // Look up dog DOB from Firestore dogs collection
      const dogDoc = await db.collection('dogs').doc(dogId).get();
      if (!dogDoc.exists) continue;
      const dob: string = dogDoc.data()!.dateOfBirth ?? '';
      const dobMmDd = dob.slice(5, 10); // "YYYY-MM-DD" → "MM-DD"
      const isBirthday = dobMmDd === todayMmDd;
      batch.update(locDoc.ref, { isBirthday });
      if (isBirthday) birthdays++;
    }

    await batch.commit();
    console.log(`[birthdayPinCheck] ${birthdays} birthday pins updated`);
  });
