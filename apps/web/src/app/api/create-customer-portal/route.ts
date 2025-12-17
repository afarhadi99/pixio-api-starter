// src/app/api/create-customer-portal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@repo/supabase/server';
import { stripe } from '@repo/stripe/client';
import { createOrRetrieveCustomer } from '@repo/supabase/admin';
import { getURL } from '@repo/ui/utils';

export async function POST(request: NextRequest) {
  try {
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
      throw new Error('Could not get customer');
    }
    
    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getURL()}/account`,
    });
    
    // Return the URL
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating customer portal session:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
