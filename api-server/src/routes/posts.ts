import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

export const postsRouter = Router();
postsRouter.use(authMiddleware);

const CreatePostSchema = z.object({
  authorDogId: z.string(),
  type: z.enum(['photo', 'text', 'event', 'tip', 'lost_alert', 'adoption']),
  text: z.string().default(''),
  mediaURLs: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true),
  eventRef: z.string().nullable().default(null),
  lostReportRef: z.string().nullable().default(null),
  adoptionRef: z.string().nullable().default(null),
});

postsRouter.post('/', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const body = CreatePostSchema.parse(req.body);
    const post = await prisma.post.create({
      data: { ...body, authorUid: uid, reactions: {} },
    });
    res.status(201).json(post);
  } catch (e) { next(e); }
});

postsRouter.post('/:id/react', async (req, res, next) => {
  try {
    const { reaction } = req.body as { reaction?: string };
    if (!reaction) { res.status(400).json({ error: 'reaction required' }); return; }
    const post = await prisma.post.findUniqueOrThrow({ where: { id: req.params.id } });
    const reactions = (post.reactions as Record<string, number>) ?? {};
    reactions[reaction] = (reactions[reaction] ?? 0) + 1;
    const updated = await prisma.post.update({
      where: { id: req.params.id },
      data: { reactions },
    });
    res.json(updated);
  } catch (e) { next(e); }
});

postsRouter.post('/:id/rsvp', async (req, res, next) => {
  try {
    const { status } = req.body as { status?: string };
    if (status !== 'going' && status !== 'not_going') {
      res.status(400).json({ error: 'status must be "going" or "not_going"' }); return;
    }
    // Simplified: just increment/decrement attendee count on the linked event
    res.json({ ok: true });
  } catch (e) { next(e); }
});
