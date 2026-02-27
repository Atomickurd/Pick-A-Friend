import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { apiClient } from './api/client';

export async function startPremiumSubscription(): Promise<'success' | 'cancelled' | 'error'> {
  try {
    // 1. Ask our server to create a PaymentIntent / SetupIntent
    const { data } = await apiClient.post<{
      paymentIntent: string;
      ephemeralKey: string;
      customer: string;
    }>('/stripe/create-payment-sheet');

    // 2. Initialise the Stripe Payment Sheet
    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: data.paymentIntent,
      customerEphemeralKeySecret: data.ephemeralKey,
      customerId: data.customer,
      merchantDisplayName: 'PickAFriend',
      style: 'automatic',
    });
    if (initError) return 'error';

    // 3. Present the sheet
    const { error: presentError } = await presentPaymentSheet();
    if (presentError) {
      return presentError.code === 'Canceled' ? 'cancelled' : 'error';
    }

    return 'success';
  } catch {
    return 'error';
  }
}
