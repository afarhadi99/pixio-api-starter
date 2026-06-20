import { supabase } from './supabase';

const BUCKET = 'generated-media';

/**
 * Upload a picked local image (file:// URI) into the user's `inputs` folder and
 * return its public URL — mirrors the web app's direct-to-Supabase upload so
 * input-image models (Qwen Edit, Wan 2.2) work natively.
 */
export async function uploadInputImage(
  userId: string,
  uri: string,
  kind: 'start' | 'end' | 'image1',
): Promise<string> {
  const ext = (uri.split('.').pop() || 'jpg').toLowerCase().split('?')[0];
  const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const path = `${userId}/inputs/${kind}-${Date.now()}.${ext}`;

  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, { contentType, upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
