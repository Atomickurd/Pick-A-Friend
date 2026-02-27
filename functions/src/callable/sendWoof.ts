import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

interface SendWoofData {
  targetDogId: string;
  message?: string;
}

/**
 * HTTPS Callable: send a "Woof" to another dog.
 * Creates a notification and optionally sends a push.
 */
export const sendWoof = functions.https.onCall(async (data: SendWoofData, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

  const { uid } = context.auth;
  const { targetDogId, message = '🐾 Woof!' } = data;

  const targetDogDoc = await db.collection('dogs').doc(targetDogId).get();
  if (!targetDogDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Target dog not found');
  }
  const targetOwnerUid: string = targetDogDoc.data()!.ownerUid;

  // Create notification doc
  await db.collection('notifications').add({
    recipientUid: targetOwnerUid,
    type: 'match_nearby',
    title: '🐾 Woof!',
    body: message,
    data: { senderUid: uid, targetDogId },
    isRead: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Push notification
  const targetUserDoc = await db.collection('users').doc(targetOwnerUid).get();
  const pushToken: string | undefined = targetUserDoc.data()?.pushToken;
  if (pushToken) {
    await messaging.send({
      token: pushToken,
      notification: { title: '🐾 Woof!', body: message },
      data: { type: 'woof', senderUid: uid },
    });
  }

  return { ok: true };
});
