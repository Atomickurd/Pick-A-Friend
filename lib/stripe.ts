import { StripeProvider } from '@stripe/stripe-react-native';

export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

/**
 * Re-export StripeProvider for use in the root layout.
 * Usage:
 *   <AppStripeProvider>
 *     {children}
 *   </AppStripeProvider>
 */
export { StripeProvider as AppStripeProvider };
