import type { AdminClient } from '@pixio/database/admin';
import type { Database } from '@pixio/database/types';
import { useCredits } from '@pixio/credits';
import {
  PIXIO_MODELS,
  queuePixioRun,
  cancelPixioRun,
  createRunRequest,
  type PixioRunRequest,
  type KreaFluxInputs,
  type QwenEditInputs,
  type WanFirstLastFrameInputs,
} from './pixio-api';
import { CREDIT_COSTS, type GenerationMode, type MediaType } from './media';

type GeneratedMediaInsert = Database['public']['Tables']['generated_media']['Insert'];

export interface GenerateParams {
  mode: GenerationMode;
  // image (Krea Flux)
  prompt?: string;
  width?: number;
  height?: number;
  // video/edit (Qwen)
  image1Url?: string;
  image2Url?: string | null;
  image3Url?: string | null;
  positivePrompt?: string;
  negativePrompt?: string;
  // firstLastFrameVideo (Wan 2.2)
  startImageUrl?: string;
  endImageUrl?: string;
  videoWidth?: number;
  videoHeight?: number;
  videoLength?: number;
}

export interface GenerateDeps {
  admin: AdminClient;
  apiKey: string;
  webhookUrl: string;
}

export interface GenerateOutcome {
  success: boolean;
  mediaId?: string;
  error?: string;
}

/**
 * Core generation orchestration shared by web server actions and the mobile
 * API route: validate → deduct credits → insert pending row → call Pixio →
 * update with run_id. Completion is delivered asynchronously via webhook.
 */
export async function queueGeneration(
  deps: GenerateDeps,
  userId: string,
  params: GenerateParams,
): Promise<GenerateOutcome> {
  const { admin, apiKey, webhookUrl } = deps;
  const { mode } = params;

  if (!mode) return { success: false, error: 'Missing generation mode' };

  const mediaType: MediaType = mode === 'firstLastFrameVideo' ? 'video' : 'image';

  // Mode-specific validation
  const prompt = params.prompt ?? '';
  const positivePrompt = params.positivePrompt ?? '';
  if (mode === 'image') {
    if (!prompt.trim()) return { success: false, error: 'Missing prompt' };
  } else if (mode === 'video') {
    if (!params.image1Url) return { success: false, error: 'Missing image for editing' };
  } else if (mode === 'firstLastFrameVideo') {
    if (!prompt.trim()) return { success: false, error: 'Missing prompt' };
    if (!params.startImageUrl) return { success: false, error: 'Missing start image URL' };
    if (!params.endImageUrl) return { success: false, error: 'Missing end image URL' };
  }

  const creditCost = CREDIT_COSTS[mode];
  if (creditCost === undefined) return { success: false, error: 'Invalid generation mode' };

  try {
    const creditSuccess = await useCredits(
      admin,
      userId,
      creditCost,
      `Generate ${mode}: "${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}"`,
    );
    if (!creditSuccess) return { success: false, error: 'Not enough credits' };

    const insertPayload: GeneratedMediaInsert = {
      user_id: userId,
      prompt: prompt || positivePrompt || 'Image edit',
      media_type: mediaType,
      credits_used: creditCost,
      status: 'pending',
      media_url: '',
      storage_path: '',
      metadata: {
        generationMode: mode,
        ...(mode === 'image' && { width: params.width ?? 1024, height: params.height ?? 1024 }),
        ...(positivePrompt && { positivePrompt, negativePrompt: params.negativePrompt ?? '' }),
      },
    };
    if (mode === 'firstLastFrameVideo') {
      insertPayload.start_image_url = params.startImageUrl ?? null;
      insertPayload.end_image_url = params.endImageUrl ?? null;
    }

    const { data: newMediaRecord, error: insertError } = await admin
      .from('generated_media')
      .insert(insertPayload)
      .select('id')
      .single();
    if (insertError || !newMediaRecord) {
      return { success: false, error: `Failed to create generation record: ${insertError?.message}` };
    }
    const mediaId = newMediaRecord.id;

    // Build the typed Pixio request per mode
    let selectedModel;
    let request: PixioRunRequest;
    if (mode === 'image') {
      selectedModel = PIXIO_MODELS.kreaFlux;
      const inputs: KreaFluxInputs = {
        text: prompt,
        width: params.width ?? 1024,
        height: params.height ?? 1024,
      };
      request = createRunRequest(selectedModel, inputs, { webhook: webhookUrl });
    } else if (mode === 'video') {
      selectedModel = PIXIO_MODELS.qwenEdit;
      const inputs: QwenEditInputs = {
        image1: params.image1Url!,
        positive: positivePrompt,
        negative: params.negativePrompt ?? '',
        ...(params.image2Url && { image2: params.image2Url }),
        ...(params.image3Url && { image3: params.image3Url }),
      };
      request = createRunRequest(selectedModel, inputs, { webhook: webhookUrl });
    } else {
      selectedModel = PIXIO_MODELS.wanFirstLastFrame;
      const inputs: WanFirstLastFrameInputs = {
        start_image: params.startImageUrl!,
        end_image: params.endImageUrl!,
        positive: prompt,
        negative: '',
        width: params.videoWidth ?? 512,
        height: params.videoHeight ?? 512,
        length: params.videoLength ?? 81,
      };
      request = createRunRequest(selectedModel, inputs, { webhook: webhookUrl });
    }

    const pixioResult = await queuePixioRun(request, apiKey);
    if (!pixioResult.success || !pixioResult.data) {
      await admin
        .from('generated_media')
        .update({
          status: 'failed',
          metadata: {
            error: pixioResult.error || 'API request failed',
            failed_at: new Date().toISOString(),
          },
        })
        .eq('id', mediaId);
      return { success: false, error: pixioResult.error || 'API request failed' };
    }

    const runId = pixioResult.data.run_id;
    await admin
      .from('generated_media')
      .update({
        status: 'processing',
        metadata: {
          run_id: runId,
          generationMode: mode,
          model_id: selectedModel.id,
          model_name: selectedModel.name,
          started_at: new Date().toISOString(),
        },
      })
      .eq('id', mediaId);

    return { success: true, mediaId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/** Cancel a generation. Verifies ownership, calls Pixio, marks failed locally. */
export async function cancelGeneration(
  deps: { admin: AdminClient; apiKey: string },
  userId: string,
  mediaId: string,
): Promise<{ success: boolean; error?: string }> {
  const { admin, apiKey } = deps;
  if (!mediaId) return { success: false, error: 'Media ID is required' };

  try {
    const { data: mediaRecord, error: fetchError } = await admin
      .from('generated_media')
      .select('id, user_id, status, metadata')
      .eq('id', mediaId)
      .single();
    if (fetchError || !mediaRecord) return { success: false, error: 'Media record not found' };
    if (mediaRecord.user_id !== userId) return { success: false, error: 'Permission denied' };
    if (!['pending', 'processing'].includes(mediaRecord.status)) {
      return { success: false, error: `Cannot cancel ${mediaRecord.status} generation` };
    }

    const runId = (mediaRecord.metadata as any)?.run_id;
    const existingMetadata = (mediaRecord.metadata as object) || {};

    if (runId) {
      const cancelResult = await cancelPixioRun(runId, apiKey);
      await admin
        .from('generated_media')
        .update({
          status: 'failed',
          metadata: {
            ...existingMetadata,
            error: 'Cancelled by user',
            cancelled_at: new Date().toISOString(),
            cancel_api_status: cancelResult.success ? 'success' : 'failed',
          },
        })
        .eq('id', mediaId);
    } else {
      await admin
        .from('generated_media')
        .update({
          status: 'failed',
          metadata: {
            ...existingMetadata,
            error: 'Cancelled by user',
            cancelled_at: new Date().toISOString(),
          },
        })
        .eq('id', mediaId);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
