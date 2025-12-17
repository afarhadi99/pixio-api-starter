// src/app/api/webhooks/pixio/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@repo/supabase/admin';
import { Database } from '@/types/db_types';

// Expected webhook payload structure from Pixio API
interface PixioWebhookPayload {
  run_id: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
  outputs?: Array<{
    type?: string;
    url?: string;
    data?: {
      images?: Array<{ url: string }>;
      files?: Array<{ url: string; filename?: string; type?: string }>;
      [key: string]: any; // Allow other properties
    };
    [key: string]: any; // Allow other properties like node_meta, id, etc.
  }>;
  error?: string;
  metadata?: Record<string, any>;
}

type GeneratedMediaUpdate = Database['public']['Tables']['generated_media']['Update'];

/**
 * Pixio API Webhook Handler
 * Receives status updates for running media generations
 */
export async function POST(req: NextRequest) {
  console.log('[Pixio Webhook] Received webhook request');

  try {
    // Parse the webhook payload
    const payload: PixioWebhookPayload = await req.json();
    console.log('[Pixio Webhook] Payload:', JSON.stringify(payload, null, 2));

    const { run_id, status, outputs, error: apiError } = payload;

    // Validate required fields
    if (!run_id || !status) {
      console.error('[Pixio Webhook] Missing required fields:', { run_id, status });
      return NextResponse.json(
        { error: 'Missing required fields: run_id and status' },
        { status: 400 }
      );
    }

    // Find the media record by run_id stored in metadata
    console.log('[Pixio Webhook] Looking up media record for run_id:', run_id);
    const { data: mediaRecord, error: fetchError } = await supabaseAdmin
      .from('generated_media')
      .select('*')
      .eq('metadata->>run_id', run_id)
      .single();

    if (fetchError || !mediaRecord) {
      console.error('[Pixio Webhook] Media record not found for run_id:', run_id, fetchError);
      // Still return 200 to acknowledge webhook receipt
      return NextResponse.json({ 
        received: true, 
        warning: 'Media record not found' 
      });
    }

    console.log('[Pixio Webhook] Found media record:', mediaRecord.id);

    // Handle different status updates
    if (status === 'processing' || status === 'pending') {
      // Update status only
      console.log(`[Pixio Webhook] Updating status to ${status} for media:`, mediaRecord.id);
      
      const { error: updateError } = await supabaseAdmin
        .from('generated_media')
        .update({ status })
        .eq('id', mediaRecord.id);

      if (updateError) {
        console.error('[Pixio Webhook] Error updating status:', updateError);
        throw updateError;
      }

      return NextResponse.json({ received: true, status });
    }

    if (status === 'success') {
      console.log('[Pixio Webhook] Processing successful generation for media:', mediaRecord.id);

      // Extract output URL from payload - Pixio uses different structures for different models
      let outputUrl: string | undefined;
      
      if (outputs && outputs.length > 0) {
        const firstOutput = outputs[0];
        // Try files array (for videos like Wan 2.2)
        if (firstOutput.data?.files && Array.isArray(firstOutput.data.files) && firstOutput.data.files.length > 0) {
          outputUrl = firstOutput.data.files[0].url;
        }
        // Try images array (for images like Krea Flux, Qwen Edit)
        else if (firstOutput.data?.images && Array.isArray(firstOutput.data.images) && firstOutput.data.images.length > 0) {
          outputUrl = firstOutput.data.images[0].url;
        }
        // Fallback to direct URL
        else if (firstOutput.url) {
          outputUrl = firstOutput.url;
        }
      }
      
      console.log('[Pixio Webhook] Extracted output URL:', outputUrl);
      console.log('[Pixio Webhook] Full outputs:', JSON.stringify(outputs, null, 2));
      
      if (!outputUrl) {
        console.error('[Pixio Webhook] No output URL in successful webhook. Full outputs:', JSON.stringify(outputs, null, 2));
        
        // Mark as failed since we can't retrieve the result
        await supabaseAdmin
          .from('generated_media')
          .update({
            status: 'failed',
            metadata: {
              ...mediaRecord.metadata as object,
              error: 'No output URL provided in webhook',
              failed_at: new Date().toISOString()
            }
          })
          .eq('id', mediaRecord.id);

        return NextResponse.json({ 
          received: true, 
          error: 'No output URL' 
        });
      }

      try {
        // Download the media from Pixio's output URL
        console.log('[Pixio Webhook] Downloading media from:', outputUrl);
        
        const mediaResponse = await fetch(outputUrl, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (!mediaResponse.ok) {
          throw new Error(`Failed to download media: ${mediaResponse.statusText}`);
        }

        const mediaBuffer = await mediaResponse.arrayBuffer();
        const contentSize = mediaBuffer.byteLength;
        
        console.log(`[Pixio Webhook] Downloaded media size: ${(contentSize / 1024).toFixed(2)} KB`);

        if (contentSize === 0) {
          throw new Error('Downloaded file is empty');
        }

        // Determine file extension and content type
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

        // Generate storage path
        const timestamp = Date.now();
        const fileName = `${timestamp}-${mediaRecord.id.substring(0, 8)}${fileExtension}`;
        const storagePath = `${mediaRecord.user_id}/${mediaRecord.media_type}s/${fileName}`;

        console.log('[Pixio Webhook] Uploading to Supabase storage:', storagePath);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin
          .storage
          .from('generated-media')
          .upload(storagePath, mediaBuffer, {
            contentType,
            upsert: true,
            cacheControl: '3600'
          });

        if (uploadError) {
          throw new Error(`Storage upload error: ${uploadError.message}`);
        }

        console.log('[Pixio Webhook] Upload successful:', uploadData?.path);

        // Get public URL
        const { data: publicUrlData } = supabaseAdmin
          .storage
          .from('generated-media')
          .getPublicUrl(storagePath);

        if (!publicUrlData?.publicUrl) {
          throw new Error('Failed to get public URL after upload');
        }

        // Update database record with completed status
        const existingMetadata = (mediaRecord.metadata && typeof mediaRecord.metadata === 'object') 
          ? mediaRecord.metadata as Record<string, any>
          : {};

        const updatePayload: GeneratedMediaUpdate = {
          status: 'completed',
          media_url: publicUrlData.publicUrl,
          storage_path: storagePath,
          metadata: {
            ...existingMetadata,
            original_url: outputUrl,
            file_size: contentSize,
            completed_at: new Date().toISOString(),
            error: undefined
          }
        };

        const { error: finalUpdateError } = await supabaseAdmin
          .from('generated_media')
          .update(updatePayload)
          .eq('id', mediaRecord.id);

        if (finalUpdateError) {
          console.error('[Pixio Webhook] Error updating final record:', finalUpdateError);
          throw finalUpdateError;
        }

        console.log('[Pixio Webhook] Successfully processed media:', mediaRecord.id);

        return NextResponse.json({ 
          received: true, 
          status: 'completed',
          mediaId: mediaRecord.id 
        });

      } catch (processingError: any) {
        console.error('[Pixio Webhook] Error processing successful result:', processingError);

        // Update record as failed if processing failed
        const existingMetadata = (mediaRecord.metadata && typeof mediaRecord.metadata === 'object') 
          ? mediaRecord.metadata as Record<string, any>
          : {};

        await supabaseAdmin
          .from('generated_media')
          .update({
            status: 'failed',
            metadata: {
              ...existingMetadata,
              error: `Processing error: ${processingError.message}`,
              failed_at: new Date().toISOString()
            }
          })
          .eq('id', mediaRecord.id);

        return NextResponse.json({ 
          received: true, 
          error: processingError.message 
        });
      }
    }

    if (status === 'failed' || status === 'cancelled') {
      console.log(`[Pixio Webhook] Updating media to ${status}:`, mediaRecord.id);

      const existingMetadata = (mediaRecord.metadata && typeof mediaRecord.metadata === 'object') 
        ? mediaRecord.metadata as Record<string, any>
        : {};

      const { error: updateError } = await supabaseAdmin
        .from('generated_media')
        .update({
          status: status === 'cancelled' ? 'failed' : status,
          metadata: {
            ...existingMetadata,
            error: apiError || (status === 'cancelled' ? 'Generation cancelled' : 'Generation failed'),
            failed_at: new Date().toISOString(),
            final_api_status: status
          }
        })
        .eq('id', mediaRecord.id);

      if (updateError) {
        console.error('[Pixio Webhook] Error updating to failed status:', updateError);
        throw updateError;
      }

      return NextResponse.json({ received: true, status });
    }

    // Unknown status
    console.warn('[Pixio Webhook] Unknown status received:', status);
    return NextResponse.json({ 
      received: true, 
      warning: `Unknown status: ${status}` 
    });

  } catch (error: any) {
    console.error('[Pixio Webhook] Error processing webhook:', error);
    
    // Return 200 to prevent webhook retries for our application errors
    // Log the error but acknowledge receipt
    return NextResponse.json({ 
      received: true, 
      error: error.message 
    }, { status: 200 });
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return NextResponse.json({}, { 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}