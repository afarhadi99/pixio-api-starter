// src/lib/actions/stripe.actions.ts
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@repo/supabase/server';
import { stripe } from '@repo/stripe/client';
import { createOrRetrieveCustomer } from '@repo/supabase/admin';
import { getURL } from '@repo/ui/utils';

/**
 * Creates a Stripe customer portal session.
 * Redirects the user to the Stripe customer portal on success.
 */
export async function createCustomerPortalSession() {
  // Call cookies to prevent caching
  cookies();

  // Get current user
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return redirect('/login');
  }
  
  try {
    // Get customer
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
    
    if (session.url) {
      return redirect(session.url);
    } else {
      throw new Error('Failed to create portal session');
    }
  } catch (error: any) {
    console.error('Error creating portal session:', error.message);
    return redirect('/account?error=portal_failed');
  }
}
