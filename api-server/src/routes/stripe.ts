import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../db/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-04-10',
});

export const stripeRouter = Router();

stripeRouter.post('/create-payment-sheet', authMiddleware, async (req, res, next) => {
  try {
    const uid = (req as unknown as AuthRequest).uid;
    const user = await prisma.user.findUniqueOrThrow({ where: { id: uid } });

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      await prisma.user.update({ where: { id: uid }, data: { stripeCustomerId: customerId } });
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2024-04-10' },
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 499, // £4.99
      currency: 'gbp',
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      metadata: { uid },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
    });
  } catch (e) { next(e); }
});

// Webhook: handle successful payment → upgrade subscription
stripeRouter.post(
  '/webhook',
  (req, res, next) => {
    // Raw body middleware required — ensure express.raw() is applied upstream
    next();
  },
  async (req, res, next) => {
    const sig = req.headers['stripe-signature'] as string;
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET ?? '',
      );

      if (event.type === 'payment_intent.succeeded') {
        const pi = event.data.object as Stripe.PaymentIntent;
        const uid = pi.metadata?.uid;
        if (uid) {
          const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await prisma.user.update({
            where: { id: uid },
            data: { subscriptionTier: 'premium', subscriptionExpiry: expiry },
          });
        }
      }
      res.json({ received: true });
    } catch (e) { next(e); }
  },
);
