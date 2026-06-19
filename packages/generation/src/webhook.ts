import type { AdminClient } from '@pixio/database/admin';
import type { Database } from '@pixio/database/types';

type GeneratedMediaUpdate = Database['public']['Tables']['generated_media']['Update'];

export interface PixioWebhookPayload {
  run_id: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
  outputs?: Array<{
    type?: string;
    url?: string;
    data?: {
      images?: Array<{ url: string }>;
      files?: Array<{ url: string; filename?: string; type?: string }>;
      [key: string]: any;
    };
    [key: string]: any;
  }>;
  error?: string;
  metadata?: Record<string, any>;
}

export interface WebhookResult {
  received: boolean;
  status?: string;
  mediaId?: string;
  warning?: string;
  error?: string;
}

const BUCKET = 'generated-media';

function extractOutputUrl(outputs: PixioWebhookPayload['outputs']): string | undefined {
  if (!outputs || outputs.length === 0) return undefined;
  const first = outputs[0];
  if (first.data?.files?.length) return first.data.files[0].url;
  if (first.data?.images?.length) return first.data.images[0].url;
  if (first.url) return first.url;
  return undefined;
}

/**
 * Process a Pixio status webhook: look up the media row by run_id, and on
 * success download the asset, persist it to Storage, and mark completed.
 *
 * Hardened vs. the original route:
 *  - idempotent: ignores updates for rows already in a terminal state
 *  - never throws (always returns a result) so the route can ack with 200
 */
export async function processPixioWebhook(
  admin: AdminClient,
  payload: PixioWebhookPayload,
): Promise<WebhookResult> {
  const { run_id, status, outputs, error: apiError } = payload;
  if (!run_id || !status) {
    return { received: false, error: 'Missing required fields: run_id and status' };
  }

  const { data: mediaRecord, error: fetchError } = await admin
    .from('generated_media')
    .select('*')
    .eq('metadata->>run_id', run_id)
    .single();

  if (fetchError || !mediaRecord) {
    return { received: true, warning: 'Media record not found' };
  }

  // Idempotency: don't reprocess rows that already reached a terminal state.
  if (mediaRecord.status === 'completed' || mediaRecord.status === 'failed') {
    return { received: true, status: mediaRecord.status, warning: 'Already in terminal state' };
  }

  const existingMetadata =
    mediaRecord.metadata && typeof mediaRecord.metadata === 'object'
      ? (mediaRecord.metadata as Record<string, any>)
      : {};

  if (status === 'processing' || status === 'pending') {
    await admin.from('generated_media').update({ status }).eq('id', mediaRecord.id);
    return { received: true, status };
  }

  if (status === 'failed' || status === 'cancelled') {
    await admin
      .from('generated_media')
      .update({
        status: 'failed',
        metadata: {
          ...existingMetadata,
          error: apiError || (status === 'cancelled' ? 'Generation cancelled' : 'Generation failed'),
          failed_at: new Date().toISOString(),
          final_api_status: status,
        },
      })
      .eq('id', mediaRecord.id);
    return { received: true, status };
  }

  if (status === 'success') {
    const outputUrl = extractOutputUrl(outputs);
    if (!outputUrl) {
      await admin
        .from('generated_media')
        .update({
          status: 'failed',
          metadata: {
            ...existingMetadata,
            error: 'No output URL provided in webhook',
            failed_at: new Date().toISOString(),
          },
        })
        .eq('id', mediaRecord.id);
      return { received: true, error: 'No output URL' };
    }

    try {
      const mediaResponse = await fetch(outputUrl, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      if (!mediaResponse.ok) {
        throw new Error(`Failed to download media: ${mediaResponse.statusText}`);
      }

      const mediaBuffer = await mediaResponse.arrayBuffer();
      if (mediaBuffer.byteLength === 0) throw new Error('Downloaded file is empty');

      const urlExtension = outputUrl.match(/\.(png|jpg|jpeg|webp|gif|mp4)$/i)?.[0]?.toLowerCase();
      let fileExtension: string;
      let contentType: string;
      switch (mediaRecord.media_type) {
        case 'image':
          fileExtension = urlExtension || '.png';
          contentType = `image/${fileExtension.substring(1)}`;
          break;
        case 'video':
          if (urlExtension === '.mp4') {
            fileExtension = '.mp4';
            contentType = 'video/mp4';
          } else {
            fileExtension = '.webp';
            contentType = 'video/webm';
          }
          break;
        default:
          fileExtension = urlExtension || '.bin';
          contentType = 'application/octet-stream';
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}-${mediaRecord.id.substring(0, 8)}${fileExtension}`;
      const storagePath = `${mediaRecord.user_id}/${mediaRecord.media_type}s/${fileName}`;

      const { error: uploadError } = await admin.storage
        .from(BUCKET)
        .upload(storagePath, mediaBuffer, { contentType, upsert: true, cacheControl: '3600' });
      if (uploadError) throw new Error(`Storage upload error: ${uploadError.message}`);

      const { data: publicUrlData } = admin.storage.from(BUCKET).getPublicUrl(storagePath);
      if (!publicUrlData?.publicUrl) throw new Error('Failed to get public URL after upload');

      const updatePayload: GeneratedMediaUpdate = {
        status: 'completed',
        media_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        metadata: {
          ...existingMetadata,
          original_url: outputUrl,
          file_size: mediaBuffer.byteLength,
          completed_at: new Date().toISOString(),
          error: undefined,
        },
      };
      await admin.from('generated_media').update(updatePayload).eq('id', mediaRecord.id);

      return { received: true, status: 'completed', mediaId: mediaRecord.id };
    } catch (processingError: any) {
      await admin
        .from('generated_media')
        .update({
          status: 'failed',
          metadata: {
            ...existingMetadata,
            error: `Processing error: ${processingError.message}`,
            failed_at: new Date().toISOString(),
          },
        })
        .eq('id', mediaRecord.id);
      return { received: true, error: processingError.message };
    }
  }

  return { received: true, warning: `Unknown status: ${status}` };
}
