// src/lib/actions/media.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { useCredits } from '@/lib/credits';
import { revalidatePath } from 'next/cache';
import { MediaType, CREDIT_COSTS, GenerationResult, GenerationMode } from '@/lib/constants/media';
// Import the specific Insert type and GeneratedMedia type
import { Database, GeneratedMedia } from '@/types/db_types';
import { supabaseAdmin } from '@/lib/supabase/admin';
// Import only the necessary storage service functions (used by actions below)
import { listUserFiles as listUserFilesService, deleteFile as deleteFileService } from '@/lib/storage/supabase-storage';
// Import Pixio API client and models
import {
  PIXIO_MODELS,
  queuePixioRun,
  cancelPixioRun,
  createRunRequest,
  type KreaFluxInputs,
  type WanFirstLastFrameInputs
} from '@/lib/pixio-api';

// Define the specific type for insertion, derived from db_types.ts
type GeneratedMediaInsert = Database['public']['Tables']['generated_media']['Insert'];

/**
 * Initiates media generation by creating a record and invoking the Supabase Function.
 * Expects image URLs for modes that require input images (client handles upload).
 */
export async function generateMedia(formData: FormData): Promise<{
  success: boolean;
  mediaId?: string;
  error?: string;
}> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user || userError) {
    return { success: false, error: 'Authentication error' };
  }

  // --- Read data from FormData ---
  const generationMode = formData.get('generationMode') as GenerationMode;
  
  // Determine media type based on model category, not generation mode name
  const mediaType: MediaType = generationMode === 'firstLastFrameVideo' ? 'video' : 'image';
  // Krea Flux (image mode) → image
  // Qwen Edit (video mode) → image (it's editing, not generating video)
  // Wan 2.2 (firstLastFrameVideo mode) → video

  // --- Validation ---
  if (!generationMode) {
    return { success: false, error: 'Missing required fields' };
  }

  // Mode-specific input extraction and validation
  let prompt = '';
  let startImageUrl: string | null = null;
  let endImageUrl: string | null = null;
  let image1Url: string | null = null;
  let image2Url: string | null = null;
  let image3Url: string | null = null;
  let positivePrompt = '';
  let negativePrompt = '';
  let width = 1024;
  let height = 1024;
  let videoWidth = 512;
  let videoHeight = 512;
  let videoLength = 81;

  if (generationMode === 'image') {
    // Krea Flux
    prompt = formData.get('prompt') as string;
    width = parseInt(formData.get('width') as string) || 1024;
    height = parseInt(formData.get('height') as string) || 1024;
    if (!prompt?.trim()) return { success: false, error: 'Missing prompt' };
  } else if (generationMode === 'video') {
    // Qwen Edit
    image1Url = formData.get('image1Url') as string;
    image2Url = formData.get('image2Url') as string || null;
    image3Url = formData.get('image3Url') as string || null;
    positivePrompt = formData.get('positivePrompt') as string || '';
    negativePrompt = formData.get('negativePrompt') as string || '';
    if (!image1Url) return { success: false, error: 'Missing image for editing' };
  } else if (generationMode === 'firstLastFrameVideo') {
    // Wan 2.2
    prompt = formData.get('prompt') as string;
    startImageUrl = formData.get('startImageUrl') as string;
    endImageUrl = formData.get('endImageUrl') as string;
    videoWidth = parseInt(formData.get('width') as string) || 512;
    videoHeight = parseInt(formData.get('height') as string) || 512;
    videoLength = parseInt(formData.get('length') as string) || 81;
    if (!prompt?.trim()) return { success: false, error: 'Missing prompt' };
    if (!startImageUrl) return { success: false, error: 'Missing start image URL' };
    if (!endImageUrl) return { success: false, error: 'Missing end image URL' };
  }

  const creditCost = CREDIT_COSTS[generationMode];
  if (creditCost === undefined) {
    return { success: false, error: 'Invalid generation mode' };
  }

  try {
    // 1. Check and deduct credits
    const creditSuccess = await useCredits(
      user.id,
      creditCost,
      `Generate ${generationMode}: "${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}"`
    );
    if (!creditSuccess) { return { success: false, error: 'Not enough credits' }; }
    console.log(`[Action] Credits deducted successfully for user ${user.id}`);

    // 2. Create initial 'pending' record in DB
    const insertPayload: GeneratedMediaInsert = {
        user_id: user.id,
        prompt: prompt || positivePrompt || 'Image edit', // Use appropriate prompt
        media_type: mediaType,
        credits_used: creditCost,
        status: 'pending',
        media_url: '', // Required by Insert type
        storage_path: '', // Required by Insert type
        metadata: {
          generationMode,
          ...(generationMode === 'image' && { width, height }),
          ...(positivePrompt && { positivePrompt, negativePrompt })
        }
    };
    if (generationMode === 'firstLastFrameVideo') {
        insertPayload.start_image_url = startImageUrl;
        insertPayload.end_image_url = endImageUrl;
    }
    const { data: newMediaRecord, error: insertError } = await supabaseAdmin
      .from('generated_media').insert(insertPayload).select('id').single();
    if (insertError || !newMediaRecord) {
      console.error("[Action] Failed to insert initial media record:", insertError);
      // TODO: Consider refunding credits here if insert fails after deduction
      return { success: false, error: `Failed to create generation record: ${insertError?.message}` };
    }
    const mediaId = newMediaRecord.id;
    console.log(`[Action] Initial media record created with ID: ${mediaId}`);

    // 3. Prepare webhook URL for Pixio API callbacks
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/pixio`;
    console.log(`[Action] Using webhook URL: ${webhookUrl}`);

    // 4. Get API key
    const apiKey = process.env.PIXIO_DEPLOY_API_KEY;
    if (!apiKey) {
      console.error('[Action] PIXIO_DEPLOY_API_KEY not configured');
      return { success: false, error: 'API key not configured' };
    }

    // 5. Select model and call Pixio API based on generation mode
    let pixioResult;
    let selectedModel;

    if (generationMode === 'image') {
      // Use Krea Flux model
      selectedModel = PIXIO_MODELS.kreaFlux;
      const inputs: KreaFluxInputs = {
        text: prompt,
        width,
        height
      };
      const request = createRunRequest(selectedModel, inputs, {
        webhook: webhookUrl,
        webhookIntermediateStatus: false
      });
      
      console.log(`[Action] Calling Pixio API for mediaId: ${mediaId}, model: ${selectedModel.name}`);
      pixioResult = await queuePixioRun(request, apiKey);
      
    } else if (generationMode === 'video') {
      // Use Qwen Edit model
      selectedModel = PIXIO_MODELS.qwenEdit;
      const inputs: import('@/lib/pixio-api').QwenEditInputs = {
        image1: image1Url!,
        positive: positivePrompt,
        negative: negativePrompt,
        ...(image2Url && { image2: image2Url }),
        ...(image3Url && { image3: image3Url })
      };
      const request = createRunRequest(selectedModel, inputs, {
        webhook: webhookUrl,
        webhookIntermediateStatus: false
      });
      
      console.log(`[Action] Calling Pixio API for mediaId: ${mediaId}, model: ${selectedModel.name}`);
      pixioResult = await queuePixioRun(request, apiKey);
      
    } else if (generationMode === 'firstLastFrameVideo') {
      // Use Wan First/Last Frame model
      selectedModel = PIXIO_MODELS.wanFirstLastFrame;
      const inputs: WanFirstLastFrameInputs = {
        start_image: startImageUrl!,
        end_image: endImageUrl!,
        positive: prompt, // Wan uses 'positive' not 'prompt'
        negative: '',
        width: videoWidth,
        height: videoHeight,
        length: videoLength
      };
      const request = createRunRequest(selectedModel, inputs, {
        webhook: webhookUrl,
        webhookIntermediateStatus: false
      });
      
      console.log(`[Action] Calling Pixio API for mediaId: ${mediaId}, model: ${selectedModel.name}`);
      pixioResult = await queuePixioRun(request, apiKey);
      
    } else {
      console.error(`[Action] Unsupported generation mode: ${generationMode}`);
      return { success: false, error: 'Unsupported generation mode' };
    }

    // 6. Check Pixio API result

    if (!pixioResult.success || !pixioResult.data) {
      console.error(`[Action] Pixio API error:`, pixioResult.error);
      
      // Update record to failed
      await supabaseAdmin
        .from('generated_media')
        .update({
          status: 'failed',
          metadata: {
            error: pixioResult.error || 'API request failed',
            failed_at: new Date().toISOString()
          }
        })
        .eq('id', mediaId);
      
      return { success: false, error: pixioResult.error || 'API request failed' };
    }

    const runId = pixioResult.data.run_id;

    console.log(`[Action] Pixio API run started with ID: ${runId} using model: ${selectedModel.name}`);

    // 7. Update record with run_id, model info, and processing status
    const { error: runIdUpdateError } = await supabaseAdmin
      .from('generated_media')
      .update({
        status: 'processing',
        metadata: {
          run_id: runId,
          generationMode,
          model_id: selectedModel.id,
          model_name: selectedModel.name,
          started_at: new Date().toISOString()
        }
      })
      .eq('id', mediaId);

    if (runIdUpdateError) {
      console.error(`[Action] Error updating record with run_id:`, runIdUpdateError);
    }

    // 8. Revalidate path to show processing state
    revalidatePath('/dashboard');

    // 9. Return success (webhook will handle completion)
    console.log(`[Action] Successfully initiated generation for ${mediaId}`);
    return { success: true, mediaId: mediaId };

  } catch (error: any) {
    console.error('[Action] Error in generateMedia action:', error);
    // If the error happened before invocation (e.g., credit deduction), return error
    return { success: false, error: error.message };
  }
}

/**
 * Cancels a running media generation
 */
export async function cancelGeneration(mediaId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!mediaId) {
    return { success: false, error: 'Media ID is required' };
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user || userError) {
    return { success: false, error: 'Authentication error' };
  }

  console.log(`[Action] Cancelling generation for mediaId: ${mediaId}`);

  try {
    // Fetch the media record to verify ownership and get run_id
    const { data: mediaRecord, error: fetchError } = await supabaseAdmin
      .from('generated_media')
      .select('id, user_id, status, metadata')
      .eq('id', mediaId)
      .single();

    if (fetchError || !mediaRecord) {
      console.error(`[Action] Error fetching media ${mediaId}:`, fetchError);
      return { success: false, error: 'Media record not found' };
    }

    // Verify ownership
    if (mediaRecord.user_id !== user.id) {
      console.warn(`[Action] User ${user.id} attempted to cancel media ${mediaId} owned by ${mediaRecord.user_id}`);
      return { success: false, error: 'Permission denied' };
    }

    // Check if cancellable
    if (!['pending', 'processing'].includes(mediaRecord.status)) {
      return { success: false, error: `Cannot cancel ${mediaRecord.status} generation` };
    }

    // Get run_id from metadata
    const runId = (mediaRecord.metadata as any)?.run_id;
    
    if (!runId) {
      // No run_id yet, just update status to failed
      console.log(`[Action] No run_id for ${mediaId}, marking as cancelled locally`);
      
      const { error: updateError } = await supabaseAdmin
        .from('generated_media')
        .update({
          status: 'failed',
          metadata: {
            ...(mediaRecord.metadata as object || {}),
            error: 'Cancelled by user',
            cancelled_at: new Date().toISOString()
          }
        })
        .eq('id', mediaId);

      if (updateError) {
        console.error('[Action] Error updating cancelled status:', updateError);
        return { success: false, error: 'Failed to cancel generation' };
      }

      revalidatePath('/dashboard');
      return { success: true };
    }

    // Call Pixio API to cancel the run using the client
    console.log(`[Action] Calling Pixio API to cancel run: ${runId}`);
    
    const apiKey = process.env.PIXIO_DEPLOY_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'API key not configured' };
    }

    const cancelResult = await cancelPixioRun(runId, apiKey);

    // Note: Even if the cancel API call fails, we still mark it as cancelled locally
    if (!cancelResult.success) {
      console.warn(`[Action] Pixio cancel API failed: ${cancelResult.error}, but continuing with local cancellation`);
    }

    // Update database to cancelled/failed status
    const { error: updateError } = await supabaseAdmin
      .from('generated_media')
      .update({
        status: 'failed',
        metadata: {
          ...(mediaRecord.metadata as object || {}),
          error: 'Cancelled by user',
          cancelled_at: new Date().toISOString(),
          cancel_api_status: cancelResult.success ? 'success' : 'failed'
        }
      })
      .eq('id', mediaId);

    if (updateError) {
      console.error('[Action] Error updating cancelled status:', updateError);
      return { success: false, error: 'Failed to update cancellation status' };
    }

    console.log(`[Action] Successfully cancelled generation ${mediaId}`);
    revalidatePath('/dashboard');
    return { success: true };

  } catch (error: any) {
    console.error(`[Action] Error cancelling generation ${mediaId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes a media item record and its associated file from storage.
 */
export async function deleteMedia(mediaId: string, storagePath: string | null): Promise<{
    success: boolean;
    error?: string;
  }> {
    if (!mediaId) { return { success: false, error: "Media ID is required." }; }
    const supabase = await createClient(); // Use server client to get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) { return { success: false, error: 'Authentication error' }; }

    console.log(`[Action] Deleting media ${mediaId} (path: ${storagePath || 'N/A'}) for user ${user.id}`);
    try {
      // Verify ownership using admin client
      const { data: mediaRecord, error: fetchError } = await supabaseAdmin
        .from('generated_media').select('id, user_id, storage_path').eq('id', mediaId).single();
      if (fetchError || !mediaRecord) { console.error(`[Action] Error fetching media ${mediaId} for deletion or not found:`, fetchError); return { success: false, error: 'Media record not found.' }; }
      if (mediaRecord.user_id !== user.id) { console.warn(`[Action] User ${user.id} attempted to delete media ${mediaId} owned by ${mediaRecord.user_id}. Denying.`); return { success: false, error: 'Permission denied.' }; }

      const actualStoragePath = mediaRecord.storage_path;

      // Delete from Storage *only if path exists* using the service function
      if (actualStoragePath) {
        console.log(`[Action] Calling service to delete file from storage: ${actualStoragePath}`);
        const { success: deleteSuccess, error: deleteError } = await deleteFileService(actualStoragePath); // Use storage service
        if (!deleteSuccess) { console.error(`[Action] Error deleting file ${actualStoragePath} from storage (continuing):`, deleteError); }
        else { console.log(`[Action] Successfully deleted file ${actualStoragePath} via service.`); }
      } else { console.log(`[Action] No storage path for media ${mediaId}, skipping storage deletion.`); }

      // Delete from Database using admin client
      console.log(`[Action] Deleting record from database: ${mediaId}`);
      const { error: dbError } = await supabaseAdmin.from('generated_media').delete().eq('id', mediaId);
      if (dbError) { console.error(`[Action] Error deleting record ${mediaId} from database:`, dbError); throw new Error(`Database deletion failed: ${dbError.message}`); }
      console.log(`[Action] Successfully deleted record ${mediaId} from database.`);

      revalidatePath('/dashboard');
      return { success: true };
    } catch (error: any) {
      console.error(`[Action] Unexpected error during media deletion for ${mediaId}:`, error);
      return { success: false, error: error.message };
    }
}

/**
 * Fetches completed and processing media items for the current user.
 */
export async function fetchUserMedia(): Promise<{
  success: boolean;
  media: GeneratedMedia[];
  error?: string;
}> {
  const supabase = await createClient(); // Uses server client
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) { return { success: false, error: 'Authentication error', media: [] }; }

  try {
    // Use user-context client for RLS
    const { data, error } = await supabase
      .from('generated_media')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['pending', 'processing', 'completed', 'failed'])
      .order('created_at', { ascending: false })
      .limit(50); // Adjust limit as needed

    if (error) { throw new Error(`Failed to fetch media: ${error.message}`); }
    return { success: true, media: data || [], error: undefined };
  } catch (error: any) {
    console.error('[Action] Error fetching user media:', error);
    return { success: false, error: error.message, media: [] };
  }
}

/**
 * Server Action to list user's generated images and input images for selection.
 */
export async function listUserImagesForSelection(): Promise<{
    success: boolean;
    images: { value: string; label: string; type: 'generated' | 'input' }[];
    error?: string;
}> {
    const supabase = await createClient(); // Use server client to get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) { return { success: false, images: [], error: 'Authentication error' }; }

    try {
        const [generatedResult, inputResult] = await Promise.all([
            // Fetch completed generated images using RLS-enabled client
            supabase
                .from('generated_media')
                .select('id, prompt, media_url')
                .eq('user_id', user.id)
                .eq('media_type', 'image')
                .eq('status', 'completed')
                .not('media_url', 'is', null)
                .order('created_at', { ascending: false })
                .limit(50), // Limit generated images shown
            // Fetch input images using the service function (uses admin client)
            listUserFilesService(user.id, 'inputs')
        ]);

        const fetchedImages: { value: string; label: string; type: 'generated' | 'input' }[] = [];

        // Process generated images
        if (generatedResult.error) { console.error("[Action] Error fetching generated images:", generatedResult.error); }
        else if (generatedResult.data) { generatedResult.data.forEach(item => { fetchedImages.push({ value: item.media_url!, label: item.prompt ? `Gen: ${item.prompt.substring(0, 30)}...` : `Generated Image ${item.id.substring(0, 6)}`, type: 'generated', }); }); }

        // Process input images
        if (!inputResult.success) { console.error("[Action] Error fetching input images:", inputResult.error); }
        else if (inputResult.files) { inputResult.files.forEach(file => { if (file.publicUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)) { fetchedImages.push({ value: file.publicUrl, label: `Input: ${file.name}`, type: 'input', }); } }); }

        fetchedImages.sort((a, b) => a.label.localeCompare(b.label));
        return { success: true, images: fetchedImages };

    } catch (error: any) {
        console.error('[Action] Error listing user images:', error);
        return { success: false, images: [], error: error.message };
    }
}
