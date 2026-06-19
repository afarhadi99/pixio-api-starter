import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { processStripeEvent, RELEVANT_STRIPE_EVENTS } from '@pixio/billing';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return new NextResponse('Webhook secret not configured', { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (RELEVANT_STRIPE_EVENTS.has(event.type)) {
      try {
        await processStripeEvent(event, { admin: supabaseAdmin, stripe });
      } catch (error) {
        console.error('Webhook handler error:', error);
        return new NextResponse('Webhook handler failed', { status: 400 });
      }
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('General webhook error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
