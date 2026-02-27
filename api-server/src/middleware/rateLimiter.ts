import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const r = req as unknown as { uid?: string };
    return r.uid ?? req.ip ?? 'unknown';
  },
  message: { error: 'Too many requests, please slow down.' },
});

export const matchingRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => {
    const r = req as unknown as { uid?: string };
    return r.uid ?? req.ip ?? 'unknown';
  },
  message: { error: 'Matching rate limit exceeded.' },
});
