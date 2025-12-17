// src/app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@repo/supabase/server';
import { stripe } from '@repo/stripe/client';
import { createOrRetrieveCustomer } from '@repo/supabase/admin';
import { getURL } from '@repo/ui/utils';

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();
    
    if (!priceId) {
      return NextResponse.json({ error: 'Missing price ID' }, { status: 400 });
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
    
    // Create checkout session with redirect
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
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
      success_url: `${getURL()}/account?success=true`,
      cancel_url: `${getURL()}/`,
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
