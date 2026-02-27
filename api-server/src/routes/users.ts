import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

export const usersRouter = Router();
usersRouter.use(authMiddleware);

usersRouter.get('/me', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const user = await prisma.user.findUniqueOrThrow({ where: { id: uid } });
    res.json(user);
  } catch (e) { next(e); }
});

const UpdateUserSchema = z.object({
  displayName: z.string().optional(),
  city: z.string().optional(),
  neighbourhood: z.string().optional(),
  pushToken: z.string().nullable().optional(),
});

usersRouter.patch('/me', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const body = UpdateUserSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: uid }, data: body });
    res.json(user);
  } catch (e) { next(e); }
});
