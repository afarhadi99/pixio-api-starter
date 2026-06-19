import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/supabase/get-request-user';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { deleteFile } from '@/lib/storage/supabase-storage';

/** Delete a generated media record and its storage object (mobile bearer auth). */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getRequestUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id: mediaId } = await params;
  if (!mediaId) {
    return NextResponse.json({ success: false, error: 'Media ID is required' }, { status: 400 });
  }

  const { data: mediaRecord, error: fetchError } = await supabaseAdmin
    .from('generated_media')
    .select('id, user_id, storage_path')
    .eq('id', mediaId)
    .single();

  if (fetchError || !mediaRecord) {
    return NextResponse.json({ success: false, error: 'Media record not found' }, { status: 404 });
  }
  if (mediaRecord.user_id !== user.id) {
    return NextResponse.json({ success: false, error: 'Permission denied' }, { status: 403 });
  }

  if (mediaRecord.storage_path) {
    const { success, error } = await deleteFile(mediaRecord.storage_path);
    if (!success) {
      console.warn('[mobile/media] storage delete failed (continuing):', error);
    }
  }

  const { error: dbError } = await supabaseAdmin.from('generated_media').delete().eq('id', mediaId);
  if (dbError) {
    return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
