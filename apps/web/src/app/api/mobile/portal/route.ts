import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/supabase/get-request-user';
import { createOrRetrieveCustomer } from '@/lib/supabase/admin';
import { stripe } from '@/lib/stripe/client';
import { createCustomerPortalSession } from '@pixio/billing';

/** Return a Stripe billing-portal URL for managing an existing subscription. */
export async function POST(req: NextRequest) {
  const user = await getRequestUser(req);
  if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const customerId = await createOrRetrieveCustomer({ uuid: user.id, email: user.email });
    const returnUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
    const session = await createCustomerPortalSession(stripe, { customerId, returnUrl });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
