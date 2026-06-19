import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { processPixioWebhook, type PixioWebhookPayload } from '@pixio/generation';

/**
 * Pixio API webhook handler. Verifies the optional shared secret, then hands
 * the payload to the package processor which performs the idempotent
 * download → store → DB-update flow. Always returns 200 to avoid retries.
 */
export async function POST(req: NextRequest) {
  try {
    // Optional shared-secret check (set PIXIO_WEBHOOK_SECRET to enable).
    const expectedSecret = process.env.PIXIO_WEBHOOK_SECRET;
    if (expectedSecret) {
      const provided =
        req.headers.get('x-pixio-webhook-secret') ??
        new URL(req.url).searchParams.get('secret');
      if (provided !== expectedSecret) {
        console.warn('[Pixio Webhook] Rejected: invalid secret');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const payload: PixioWebhookPayload = await req.json();
    const result = await processPixioWebhook(supabaseAdmin, payload);

    if (!result.received) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Pixio Webhook] Error processing webhook:', error);
    // Acknowledge receipt to prevent retries on our own processing errors.
    return NextResponse.json({ received: true, error: error.message }, { status: 200 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-pixio-webhook-secret',
      },
    },
  );
}
