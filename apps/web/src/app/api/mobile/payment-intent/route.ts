import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/supabase/get-request-user';
import { createOrRetrieveCustomer } from '@/lib/supabase/admin';
import { stripe } from '@/lib/stripe/client';
import { createPaymentIntentForCreditPack } from '@pixio/billing';

/** Build a PaymentSheet payload for a one-time credit-pack purchase. */
export async function POST(req: NextRequest) {
  const user = await getRequestUser(req);
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { priceId } = await req.json();
    if (!priceId) return NextResponse.json({ error: 'Missing price ID' }, { status: 400 });

    const customerId = await createOrRetrieveCustomer({ uuid: user.id, email: user.email });
    const payload = await createPaymentIntentForCreditPack(stripe, {
      customerId,
      priceId,
      userId: user.id,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
    });
    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
