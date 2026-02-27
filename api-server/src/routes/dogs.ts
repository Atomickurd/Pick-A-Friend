import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

export const dogsRouter = Router();
dogsRouter.use(authMiddleware);

const UpdateDogSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  traits: z.array(z.string()).optional(),
  energyLevel: z.enum(['low', 'medium', 'high']).optional(),
  moodStatus: z.enum(['happy', 'playful', 'calm', 'tired', 'grumpy']).optional(),
  isActive: z.boolean().optional(),
});

// GET /dogs/me — own dogs
dogsRouter.get('/me', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const dogs = await prisma.dog.findMany({ where: { ownerUid: uid } });
    res.json(dogs);
  } catch (e) { next(e); }
});

// PATCH /dogs/me/:dogId
dogsRouter.patch('/me/:dogId', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const body = UpdateDogSchema.parse(req.body);
    const dog = await prisma.dog.update({
      where: { id: req.params.dogId, ownerUid: uid },
      data: body,
    });
    res.json(dog);
  } catch (e) { next(e); }
});

// GET /dogs/:id — any dog
dogsRouter.get('/:id', async (req, res, next) => {
  try {
    const dog = await prisma.dog.findUniqueOrThrow({ where: { id: req.params.id } });
    res.json(dog);
  } catch (e) { next(e); }
});
