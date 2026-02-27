import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { composeFeed } from '../services/feedComposer';

export const feedRouter = Router();
feedRouter.use(authMiddleware);

feedRouter.get('/', async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null;
    const page = await composeFeed(uid, cursor);
    res.json(page);
  } catch (e) { next(e); }
});
