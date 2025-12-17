// src/app/api/check-session-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@repo/stripe/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
  }
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return NextResponse.json({
      status: session.status,
      customer: session.customer,
      payment_status: session.payment_status,
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
