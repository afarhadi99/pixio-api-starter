import { NextResponse } from 'next/server';
import { PRICING_TIERS, CREDIT_PACKS } from '@pixio/config';

/**
 * Public pricing/config for the mobile app. Price IDs only live server-side
 * (env), so the app fetches them here along with the Stripe publishable key.
 */
export async function GET() {
  return NextResponse.json({
    tiers: PRICING_TIERS,
    creditPacks: CREDIT_PACKS,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  });
}
