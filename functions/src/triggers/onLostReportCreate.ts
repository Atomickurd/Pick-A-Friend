import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

export const onLostReportCreate = functions.firestore
  .document('lost_reports/{reportId}')
  .onCreate(async (snap) => {
    const report = snap.data();
    if (!report) return;

    // Broadcast to all users with a push token
    const usersSnap = await db
      .collection('users')
      .where('pushToken', '!=', null)
      .get();

    const tokens: string[] = [];
    usersSnap.forEach((d) => {
      const token = d.data().pushToken;
      if (token && d.id !== report.reporterUid) tokens.push(token);
    });

    if (!tokens.length) return;

    // FCM sendEachForMulticast supports max 500 tokens per call
    const CHUNK = 500;
    for (let i = 0; i < tokens.length; i += CHUNK) {
      await messaging.sendEachForMulticast({
        tokens: tokens.slice(i, i + CHUNK),
        notification: {
          title: `🚨 Lost Dog Alert: ${report.dogName}`,
          body: `Last seen near ${report.lastSeenAddress}. Can you help?`,
        },
        data: {
          type: 'lost_alert',
          reportId: snap.id,
        },
      });
    }

    // Mark as broadcast
    await snap.ref.update({ isBroadcast: true });
  });
