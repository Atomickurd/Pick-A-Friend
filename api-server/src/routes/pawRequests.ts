import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import admin from 'firebase-admin';

export const pawRequestsRouter = Router();
pawRequestsRouter.use(authMiddleware);

const CreatePawRequestSchema = z.object({
  fromDogId: z.string(),
  toDogId: z.string(),
  message: z.string().default(''),
});

pawRequestsRouter.get('/', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const requests = await prisma.pawRequest.findMany({
      where: { OR: [{ fromUid: uid }, { toUid: uid }] },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (e) { next(e); }
});

pawRequestsRouter.post('/', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const body = CreatePawRequestSchema.parse(req.body);

    const toDog = await prisma.dog.findUniqueOrThrow({ where: { id: body.toDogId } });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const pawReq = await prisma.pawRequest.create({
      data: {
        fromUid: uid,
        fromDogId: body.fromDogId,
        toUid: toDog.ownerUid,
        toDogId: body.toDogId,
        message: body.message,
        matchScore: 0,
        expiresAt,
      },
    });

    // FCM notification to recipient (fire and forget)
    prisma.user
      .findUnique({ where: { id: toDog.ownerUid }, select: { pushToken: true } })
      .then((u) => {
        if (u?.pushToken) {
          admin.messaging().send({
            token: u.pushToken,
            notification: { title: 'New Paw Request! 🐾', body: 'Someone wants to be friends with your pup!' },
            data: { type: 'paw_request', pawRequestId: pawReq.id },
          }).catch(console.warn);
        }
      });

    res.status(201).json(pawReq);
  } catch (e) { next(e); }
});

pawRequestsRouter.patch('/:id', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const { status } = req.body as { status?: string };
    if (status !== 'accepted' && status !== 'declined') {
      res.status(400).json({ error: 'status must be "accepted" or "declined"' }); return;
    }

    const existing = await prisma.pawRequest.findUniqueOrThrow({ where: { id: req.params.id, toUid: uid } });

    let channelId: string | undefined;
    if (status === 'accepted') {
      // Create Firestore message channel
      channelId = `ch_${existing.id}`;
      const db = admin.firestore();
      await db.collection('message_channels').doc(channelId).set({
        participantUids: [existing.fromUid, existing.toUid],
        participantDogIds: [existing.fromDogId, existing.toDogId],
        lastMessage: '',
        lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
        unreadCounts: { [existing.fromUid]: 0, [existing.toUid]: 0 },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const updated = await prisma.pawRequest.update({
      where: { id: req.params.id },
      data: { status, channelId: channelId ?? null },
    });

    res.json(updated);
  } catch (e) { next(e); }
});
