import { RequestHandler } from 'express';
import admin from 'firebase-admin';

export interface AuthRequest extends Express.Request {
  uid: string;
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = auth.slice(7);
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as unknown as AuthRequest).uid = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
