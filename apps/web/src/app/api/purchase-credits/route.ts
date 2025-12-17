// src/app/api/purchase-credits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@repo/supabase/server';
import { stripe } from '@repo/stripe/client';
import { createOrRetrieveCustomer } from '@repo/supabase/admin';
import { getURL } from '@repo/ui/utils';
import { CREDIT_PACKS } from '@/lib/config/pricing';

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();
    
    if (!priceId) {
      return NextResponse.json({ error: 'Missing price ID' }, { status: 400 });
    }
    
    // Validate that the priceId corresponds to a credit pack
    const creditPack = CREDIT_PACKS.find(pack => pack.priceId === priceId);
    if (!creditPack) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
    }
    
    // Get current user
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get or create customer
    const customerId = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user.email!,
    });
    
    if (!customerId) {
      throw new Error('Could not create or retrieve customer');
    }
    
    // Create checkout session for one-time purchase
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // one-time payment
      allow_promotion_codes: true,
      metadata: {
        userId: user.id,
        creditAmount: creditPack.amount.toString(),
        type: 'credit_purchase',
        priceId: priceId,  // Explicitly include priceId in metadata
      },
      success_url: `${getURL()}/account?credit_success=true`,
      cancel_url: `${getURL()}/account`,
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating credit purchase session:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
