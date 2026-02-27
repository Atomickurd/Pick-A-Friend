import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

export const adoptRouter = Router();
adoptRouter.use(authMiddleware);

adoptRouter.get('/dogs', async (_req, res, next) => {
  try {
    const dogs = await prisma.adoptionDog.findMany({
      where: { status: 'available' },
      orderBy: { createdAt: 'desc' },
      take: 40,
    });
    res.json(dogs);
  } catch (e) { next(e); }
});

const ApplySchema = z.object({ message: z.string().min(10).max(1000) });

adoptRouter.post('/dogs/:id/apply', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const { message } = ApplySchema.parse(req.body);
    const app = await prisma.adoptionApplication.create({
      data: { dogId: req.params.id, applicantUid: uid, message },
    });
    await prisma.adoptionDog.update({
      where: { id: req.params.id },
      data: { applicationCount: { increment: 1 } },
    });
    res.status(201).json(app);
  } catch (e) { next(e); }
});
