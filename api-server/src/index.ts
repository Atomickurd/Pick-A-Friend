import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import admin from 'firebase-admin';
import { healthRouter } from './routes/health';
import { dogsRouter } from './routes/dogs';
import { matchesRouter } from './routes/matches';
import { feedRouter } from './routes/feed';
import { postsRouter } from './routes/posts';
import { pawRequestsRouter } from './routes/pawRequests';
import { businessesRouter } from './routes/businesses';
import { adoptRouter } from './routes/adopt';
import { usersRouter } from './routes/users';
import { stripeRouter } from './routes/stripe';
import { apiRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

// Firebase Admin init
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const app = express();

// Security & logging
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Stripe webhook needs raw body
app.use('/stripe/webhook', express.raw({ type: 'application/json' }));

// JSON body for all other routes
app.use(express.json({ limit: '2mb' }));

// Global rate limiter
app.use(apiRateLimiter);

// Routes
app.use('/health', healthRouter);
app.use('/users', usersRouter);
app.use('/dogs', dogsRouter);
app.use('/matches', matchesRouter);
app.use('/feed', feedRouter);
app.use('/posts', postsRouter);
app.use('/paw-requests', pawRequestsRouter);
app.use('/businesses', businessesRouter);
app.use('/adopt', adoptRouter);
app.use('/stripe', stripeRouter);

// Error handler (must be last)
app.use(errorHandler);

const PORT = parseInt(process.env.PORT ?? '4000', 10);
app.listen(PORT, () => {
  console.log(`[API] Listening on port ${PORT} (${process.env.NODE_ENV ?? 'development'})`);
});

export default app;
