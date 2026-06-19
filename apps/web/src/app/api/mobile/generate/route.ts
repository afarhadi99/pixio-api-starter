import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/supabase/get-request-user';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { queueGeneration, cancelGeneration, type GenerateParams } from '@pixio/generation';

function getApiKey() {
  return process.env.PIXIO_DEPLOY_API_KEY || process.env.COMFY_DEPLOY_API_KEY;
}

/** Start a generation from the mobile app (bearer-authenticated). */
export async function POST(req: NextRequest) {
  const user = await getRequestUser(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'API key not configured' }, { status: 500 });
  }

  const body = (await req.json()) as GenerateParams;
  const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/pixio`;
  const result = await queueGeneration({ admin: supabaseAdmin, apiKey, webhookUrl }, user.id, body);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

/** Cancel a running generation. */
export async function DELETE(req: NextRequest) {
  const user = await getRequestUser(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'API key not configured' }, { status: 500 });
  }

  const { mediaId } = await req.json();
  const result = await cancelGeneration({ admin: supabaseAdmin, apiKey }, user.id, mediaId);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
