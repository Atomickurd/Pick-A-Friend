import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * When a paw_request status changes to 'accepted', create a message channel
 * and notify the sender.
 */
export const onPawRequestAccept = functions.firestore
  .document('paw_requests/{requestId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    if (!before || !after) return;
    if (before.status === after.status) return; // no status change
    if (after.status !== 'accepted') return;

    const channelId = `ch_${change.after.id}`;

    // Create message channel
    await db.collection('message_channels').doc(channelId).set({
      participantUids: [after.fromUid, after.toUid],
      participantDogIds: [after.fromDogId, after.toDogId],
      lastMessage: '',
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      unreadCounts: { [after.fromUid]: 0, [after.toUid]: 0 },
      isPremiumRequired: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update the paw request with channel ID
    await change.after.ref.update({ channelId });

    // Notify the sender
    const senderDoc = await db.collection('users').doc(after.fromUid).get();
    const pushToken = senderDoc.data()?.pushToken;
    if (pushToken) {
      await messaging.send({
        token: pushToken,
        notification: {
          title: '🐾 Paw Request Accepted!',
          body: 'You can now chat with your new dog friend!',
        },
        data: { type: 'paw_accepted', channelId },
      });
    }
  });
