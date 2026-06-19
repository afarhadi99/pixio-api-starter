import { useStripe } from '@stripe/stripe-react-native';
import { api, type NativePaymentParams } from './api';

export type PaymentResult = { status: 'completed' | 'canceled' | 'failed'; error?: string };

/**
 * Native Stripe PaymentSheet flows. Both credit-pack (one-time) and
 * subscription (incomplete PaymentIntent) flows confirm fully on-device;
 * the Stripe webhook then grants credits / syncs the subscription.
 */
export function usePayments() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  async function runSheet(params: NativePaymentParams): Promise<PaymentResult> {
    const init = await initPaymentSheet({
      merchantDisplayName: 'Pixio',
      customerId: params.customerId,
      customerEphemeralKeySecret: params.ephemeralKey,
      paymentIntentClientSecret: params.paymentIntentClientSecret,
      allowsDelayedPaymentMethods: false,
    });
    if (init.error) return { status: 'failed', error: init.error.message };

    const result = await presentPaymentSheet();
    if (result.error) {
      const canceled = result.error.code === 'Canceled';
      return { status: canceled ? 'canceled' : 'failed', error: result.error.message };
    }
    return { status: 'completed' };
  }

  return {
    buyCreditPack: async (priceId: string): Promise<PaymentResult> => {
      try {
        const params = await api.createCreditPackPayment(priceId);
        return await runSheet(params);
      } catch (e: any) {
        return { status: 'failed', error: e.message };
      }
    },
    subscribe: async (priceId: string): Promise<PaymentResult> => {
      try {
        const params = await api.createSubscription(priceId);
        return await runSheet(params);
      } catch (e: any) {
        return { status: 'failed', error: e.message };
      }
    },
  };
}
