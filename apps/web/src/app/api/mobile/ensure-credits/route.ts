import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/supabase/get-request-user';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ensureUserCredits, getCreditBalances } from '@pixio/credits';

/**
 * Idempotently grant the free-tier starter credits to a user that never
 * received them (e.g. a mobile signup). Called by the app on sign-in.
 */
export async function POST(req: NextRequest) {
  const user = await getRequestUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const granted = await ensureUserCredits(supabaseAdmin, user.id);
    const balances = await getCreditBalances(supabaseAdmin, user.id);
    return NextResponse.json({ granted, ...balances });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
