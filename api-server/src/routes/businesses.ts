import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

export const businessesRouter = Router();
businessesRouter.use(authMiddleware);

businessesRouter.get('/', async (req, res, next) => {
  try {
    const { lat, lng, radius = '5', category } = req.query;
    const businesses = await prisma.business.findMany({
      where: category ? { category: category as string } : undefined,
      orderBy: { rating: 'desc' },
      take: 50,
    });
    res.json(businesses);
  } catch (e) { next(e); }
});

businessesRouter.get('/:id', async (req, res, next) => {
  try {
    const business = await prisma.business.findUniqueOrThrow({
      where: { id: req.params.id },
      include: { reviews: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
    res.json(business);
  } catch (e) { next(e); }
});

const ReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1).max(1000),
});

businessesRouter.post('/:id/reviews', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const body = ReviewSchema.parse(req.body);
    const review = await prisma.businessReview.create({
      data: { businessId: req.params.id, authorUid: uid, ...body },
    });
    // Recompute average rating
    const agg = await prisma.businessReview.aggregate({
      where: { businessId: req.params.id },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.business.update({
      where: { id: req.params.id },
      data: { rating: agg._avg.rating ?? 0, reviewCount: agg._count },
    });
    res.status(201).json(review);
  } catch (e) { next(e); }
});
