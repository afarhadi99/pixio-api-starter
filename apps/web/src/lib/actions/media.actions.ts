'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  listUserFiles as listUserFilesService,
  deleteFile as deleteFileService,
} from '@/lib/storage/supabase-storage';
import type { GeneratedMedia } from '@/types/db_types';
import {
  queueGeneration,
  cancelGeneration as cancelGenerationCore,
  type GenerationMode,
  type GenerateParams,
} from '@pixio/generation';

function getApiKey(): string | undefined {
  return process.env.PIXIO_DEPLOY_API_KEY || process.env.COMFY_DEPLOY_API_KEY;
}

/**
 * Initiates media generation. Parses the form, then delegates the credit
 * deduction + Pixio call to @pixio/generation. Completion arrives via webhook.
 */
export async function generateMedia(formData: FormData): Promise<{
  success: boolean;
  mediaId?: string;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    return { success: false, error: 'Authentication error' };
  }

  const generationMode = formData.get('generationMode') as GenerationMode;
  if (!generationMode) {
    return { success: false, error: 'Missing required fields' };
  }

  const params: GenerateParams = { mode: generationMode };
  if (generationMode === 'image') {
    params.prompt = (formData.get('prompt') as string) || '';
    params.width = parseInt(formData.get('width') as string) || 1024;
    params.height = parseInt(formData.get('height') as string) || 1024;
  } else if (generationMode === 'video') {
    params.image1Url = (formData.get('image1Url') as string) || undefined;
    params.image2Url = (formData.get('image2Url') as string) || null;
    params.image3Url = (formData.get('image3Url') as string) || null;
    params.positivePrompt = (formData.get('positivePrompt') as string) || '';
    params.negativePrompt = (formData.get('negativePrompt') as string) || '';
  } else if (generationMode === 'firstLastFrameVideo') {
    params.prompt = (formData.get('prompt') as string) || '';
    params.startImageUrl = (formData.get('startImageUrl') as string) || undefined;
    params.endImageUrl = (formData.get('endImageUrl') as string) || undefined;
    params.videoWidth = parseInt(formData.get('width') as string) || 512;
    params.videoHeight = parseInt(formData.get('height') as string) || 512;
    params.videoLength = parseInt(formData.get('length') as string) || 81;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'API key not configured' };
  }

  const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/pixio`;

  const result = await queueGeneration({ admin: supabaseAdmin, apiKey, webhookUrl }, user.id, params);
  if (result.success) {
    revalidatePath('/dashboard');
  }
  return result;
}

/** Cancels a running media generation. */
export async function cancelGeneration(mediaId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    return { success: false, error: 'Authentication error' };
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'API key not configured' };
  }

  const result = await cancelGenerationCore({ admin: supabaseAdmin, apiKey }, user.id, mediaId);
  if (result.success) {
    revalidatePath('/dashboard');
  }
  return result;
}

/** Deletes a media item record and its associated file from storage. */
export async function deleteMedia(
  mediaId: string,
  _storagePath: string | null,
): Promise<{ success: boolean; error?: string }> {
  if (!mediaId) return { success: false, error: 'Media ID is required.' };
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return { success: false, error: 'Authentication error' };

  try {
    const { data: mediaRecord, error: fetchError } = await supabaseAdmin
      .from('generated_media')
      .select('id, user_id, storage_path')
      .eq('id', mediaId)
      .single();
    if (fetchError || !mediaRecord) return { success: false, error: 'Media record not found.' };
    if (mediaRecord.user_id !== user.id) return { success: false, error: 'Permission denied.' };

    if (mediaRecord.storage_path) {
      const { success: deleteSuccess, error: deleteError } = await deleteFileService(
        mediaRecord.storage_path,
      );
      if (!deleteSuccess) {
        console.error(`[Action] Error deleting file (continuing):`, deleteError);
      }
    }

    const { error: dbError } = await supabaseAdmin
      .from('generated_media')
      .delete()
      .eq('id', mediaId);
    if (dbError) throw new Error(`Database deletion failed: ${dbError.message}`);

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/** Fetches completed and processing media items for the current user. */
export async function fetchUserMedia(): Promise<{
  success: boolean;
  media: GeneratedMedia[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return { success: false, error: 'Authentication error', media: [] };

  try {
    const { data, error } = await supabase
      .from('generated_media')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['pending', 'processing', 'completed', 'failed'])
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw new Error(`Failed to fetch media: ${error.message}`);
    return { success: true, media: data || [], error: undefined };
  } catch (error: any) {
    return { success: false, error: error.message, media: [] };
  }
}

/** Lists a user's generated + input images for selection dropdowns. */
export async function listUserImagesForSelection(): Promise<{
  success: boolean;
  images: { value: string; label: string; type: 'generated' | 'input' }[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return { success: false, images: [], error: 'Authentication error' };

  try {
    const [generatedResult, inputResult] = await Promise.all([
      supabase
        .from('generated_media')
        .select('id, prompt, media_url')
        .eq('user_id', user.id)
        .eq('media_type', 'image')
        .eq('status', 'completed')
        .not('media_url', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50),
      listUserFilesService(user.id, 'inputs'),
    ]);

    const fetchedImages: { value: string; label: string; type: 'generated' | 'input' }[] = [];

    if (!generatedResult.error && generatedResult.data) {
      generatedResult.data.forEach((item) => {
        fetchedImages.push({
          value: item.media_url!,
          label: item.prompt
            ? `Gen: ${item.prompt.substring(0, 30)}...`
            : `Generated Image ${item.id.substring(0, 6)}`,
          type: 'generated',
        });
      });
    }

    if (inputResult.success && inputResult.files) {
      inputResult.files.forEach((file) => {
        if (file.publicUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)) {
          fetchedImages.push({ value: file.publicUrl, label: `Input: ${file.name}`, type: 'input' });
        }
      });
    }

    fetchedImages.sort((a, b) => a.label.localeCompare(b.label));
    return { success: true, images: fetchedImages };
  } catch (error: any) {
    return { success: false, images: [], error: error.message };
  }
}
