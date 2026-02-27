import { Router } from 'express';
import { prisma } from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { matchingRateLimiter } from '../middleware/rateLimiter';
import { computeMatchScore } from '../services/matchingEngine';

export const matchesRouter = Router();
matchesRouter.use(authMiddleware, matchingRateLimiter);

// GET /matches?dogId=xxx
matchesRouter.get('/', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const { dogId } = req.query;
    if (!dogId || typeof dogId !== 'string') {
      res.status(400).json({ error: 'dogId query param required' });
      return;
    }

    const ownDog = await prisma.dog.findUniqueOrThrow({ where: { id: dogId, ownerUid: uid } });

    // Get dismissed dog IDs
    const dismissed = await prisma.dogDismissal.findMany({
      where: { dogId },
      select: { targetDogId: true },
    });
    const dismissedIds = dismissed.map((d) => d.targetDogId);

    // Candidate dogs (different owner, not dismissed, active)
    const candidates = await prisma.dog.findMany({
      where: {
        id: { notIn: [dogId, ...dismissedIds] },
        ownerUid: { not: uid },
        isActive: true,
      },
      take: 50,
    });

    // Score and sort
    const results = candidates
      .map((dog) => {
        const { score, breakdown } = computeMatchScore(ownDog, dog, 1); // distance = 1km placeholder
        return {
          dog,
          match: {
            dogId,
            targetDogId: dog.id,
            score,
            breakdown,
            computedAt: new Date().toISOString(),
          },
        };
      })
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, 20);

    res.json(results);
  } catch (e) { next(e); }
});

// POST /matches/:targetDogId/dismiss
matchesRouter.post('/:targetDogId/dismiss', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const { dogId } = req.body as { dogId?: string };
    if (!dogId) { res.status(400).json({ error: 'dogId required' }); return; }

    await prisma.dogDismissal.upsert({
      where: { dogId_targetDogId: { dogId, targetDogId: req.params.targetDogId } },
      update: {},
      create: { dogId, targetDogId: req.params.targetDogId },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});
