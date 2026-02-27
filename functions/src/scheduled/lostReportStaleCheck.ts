import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Daily: remind owners of reports that are still 'lost' after 48h
 * to update the status or add new sighting info.
 */
export const lostReportStaleCheck = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const stale = await db
      .collection('lost_reports')
      .where('status', '==', 'lost')
      .where('updatedAt', '<', cutoff)
      .get();

    let notified = 0;
    for (const doc of stale.docs) {
      const report = doc.data();
      const userDoc = await db.collection('users').doc(report.reporterUid).get();
      const pushToken: string | undefined = userDoc.data()?.pushToken;
      if (pushToken) {
        await messaging.send({
          token: pushToken,
          notification: {
            title: `Any news about ${report.dogName}?`,
            body: 'Update your lost dog report to keep the community informed.',
          },
          data: { type: 'lost_report_stale', reportId: doc.id },
        });
        notified++;
      }
    }
    console.log(`[lostReportStaleCheck] Reminded ${notified} reporters`);
  });
