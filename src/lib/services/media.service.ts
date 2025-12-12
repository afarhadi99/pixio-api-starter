// src/lib/services/media.service.ts
import { supabaseAdmin } from '@/lib/supabase/admin';
import { DEPLOYMENT_IDS, CREDIT_COSTS, MediaType, MediaStatus, GenerationResult } from '@/lib/constants/media';
import { GeneratedMedia } from '@/types/db_types';

/**
 * Triggers the generation of media (image or video) using the ComfyUI API
 */
export async function triggerMediaGeneration(
  userId: string, 
  prompt: string, 
  mediaType: MediaType
): Promise<GenerationResult> {
  try {
    // Get deployment ID and credit cost
    const deploymentId = DEPLOYMENT_IDS[mediaType];
    const creditCost = CREDIT_COSTS[mediaType];
    
    // Create a new record in the database for tracking
    const { data: mediaRecord, error: recordError } = await supabaseAdmin
      .from('generated_media')
      .insert({
        user_id: userId,
        prompt,
        media_type: mediaType,
        media_url: '', // Will be updated later
        storage_path: '', // Will be updated later
        credits_used: creditCost,
        status: 'processing'
      })
      .select()
      .single();
    
    if (recordError || !mediaRecord) {
      throw new Error(`Failed to create media record: ${recordError?.message}`);
    }
    
    console.log(`Starting ${mediaType} generation for user ${userId} with prompt: "${prompt.substring(0, 30)}..."`);
    
    // Trigger generation via API
    const response = await fetch("https://api.myapps.ai/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.PIXIO_DEPLOY_API_KEY,
      },
      body: JSON.stringify({
        deployment_id: deploymentId,
        inputs: {
          "prompt": prompt
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    const run_id = result.run_id;
    
    if (!run_id) {
      throw new Error('No run ID returned from API');
    }
    
    console.log(`ComfyUI generation started with run ID: ${run_id}`);
    
    // Update the record with the run ID
    const { error: updateError } = await supabaseAdmin
      .from('generated_media')
      .update({
        status: 'processing',
      })
      .eq('id', mediaRecord.id);
      
    if (updateError) {
      console.error('Error updating record with run ID:', updateError);
    }
    
    return { 
      success: true, 
      mediaId: mediaRecord.id, 
      runId: run_id,
      status: 'processing'
    };
  } catch (error: any) {
    console.error('Error triggering media generation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Checks the status of a media generation task and saves the result to Supabase storage
 */
export async function checkGenerationStatus(mediaId: string, runId: string): Promise<GenerationResult> {
  try {
    // Get the media record
    const { data: mediaRecord, error: fetchError } = await supabaseAdmin
      .from('generated_media')
      .select('*')
      .eq('id', mediaId)
      .single();
    
    if (fetchError) {
      throw new Error(`Failed to fetch media record: ${fetchError.message}`);
    }
    
    if (!mediaRecord) {
      throw new Error('Media record not found');
    }
    
    console.log(`Checking status for media ${mediaId}, run ${runId}`);
    
    // Check the status via API
    const response = await fetch("https://api.myapps.ai/api/run?run_id=" + runId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.PIXIO_DEPLOY_API_KEY,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const output = await response.json();
    console.log(`ComfyUI run status: ${output.status}`);
    console.log('Full ComfyUI response:', JSON.stringify(output, null, 2));
    
    if (output.status === 'success' || output.status === 'complete') {
      // FIXED: Corrected URL formation
      const fileExtension = mediaRecord.media_type === 'image' ? '.png' : '.webp';
      const mediaUrl = `https://comfy-deploy.nyc3.cdn.digitaloceanspaces.com/outputs/runs/${runId}/ComfyUI_00001_${fileExtension}`;
      
      console.log(`Downloading generated ${mediaRecord.media_type} from: ${mediaUrl}`);
      
      // Test if the URL is accessible
      try {
        const testResponse = await fetch(mediaUrl, { method: 'HEAD' });
        console.log(`URL check status: ${testResponse.status}`);
        if (!testResponse.ok) {
          console.error(`Cannot access output URL: ${mediaUrl}`);
          throw new Error(`Cannot access output URL: ${mediaUrl}`);
        }
      } catch (urlError: any) {
        console.error(`Error testing URL: ${urlError.message}`);
        throw urlError;
      }
      
      // Download the media
      const mediaResponse = await fetch(mediaUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!mediaResponse.ok) {
        console.error(`Failed to download media: ${mediaResponse.status} ${mediaResponse.statusText}`);
        throw new Error(`Failed to download media: ${mediaResponse.statusText}`);
      }
      
      const mediaBuffer = await mediaResponse.arrayBuffer();
      const contentSize = mediaBuffer.byteLength;
      console.log(`Downloaded media size: ${(contentSize / 1024).toFixed(2)} KB`);
      
      if (contentSize === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      // Generate a unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}-${mediaId.substring(0, 8)}${fileExtension}`;
      const storagePath = `${mediaRecord.user_id}/${mediaRecord.media_type}s/${fileName}`;
      
      console.log(`Uploading to Supabase storage path: ${storagePath}`);
      
      // Test Supabase storage access
      try {
        const { data: storageData, error: storageTestError } = await supabaseAdmin
          .storage
          .from('generated-media')
          .list(mediaRecord.user_id, { limit: 1 });
          
        console.log('Supabase storage access:', storageTestError ? 'Failed' : 'Success');
        if (storageTestError) {
          console.error('Storage test error:', storageTestError);
        }
      } catch (storageError) {
        console.error('Failed to test storage:', storageError);
      }
      
      // Set content type based on media type
      const contentType = mediaRecord.media_type === 'image' 
        ? 'image/png' 
        : 'video/webm';
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('generated-media')
        .upload(storagePath, mediaBuffer, {
          contentType,
          upsert: true, // Changed to true to overwrite if exists
          cacheControl: '3600'
        });
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Storage upload error: ${uploadError.message}`);
      }
      
      console.log(`Successfully uploaded to storage: ${uploadData?.path}`);
      
      // Get public URL
      const { data: publicUrlData } = supabaseAdmin
        .storage
        .from('generated-media')
        .getPublicUrl(storagePath);
      
      // Fix: Use proper type handling for metadata
      const existingMetadata = mediaRecord.metadata && typeof mediaRecord.metadata === 'object' 
        ? mediaRecord.metadata 
        : {};
      
      // Update the media record with explicit error checking
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from('generated_media')
        .update({
          status: 'completed',
          media_url: publicUrlData.publicUrl,
          storage_path: storagePath,
        })
        .eq('id', mediaId)
        .select();
      
      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error(`Failed to update media record: ${updateError.message}`);
      }
      
      // Log the full updated record to verify
      console.log(`Media record updated:`, JSON.stringify(updateData, null, 2));
      console.log(`Media record updated with URL: ${publicUrlData.publicUrl}`);
      
      // Double-check the update with a separate query
      const { data: verifyData, error: verifyError } = await supabaseAdmin
        .from('generated_media')
        .select('*')
        .eq('id', mediaId)
        .single();
        
      if (verifyError) {
        console.error('Verification query error:', verifyError);
      } else {
        console.log('Verification of media record:', JSON.stringify(verifyData, null, 2));
      }
      
      return { 
        success: true, 
        status: 'completed', 
        mediaUrl: publicUrlData.publicUrl 
      };
    } else if (output.status === 'failed') {
      console.error(`Generation failed for media ${mediaId}`, output.error);
      
      // Fix: Use proper type handling for metadata
      const existingMetadata = mediaRecord.metadata && typeof mediaRecord.metadata === 'object' 
        ? mediaRecord.metadata 
        : {};
      
      // Update the record to mark as failed
      const { error: updateError } = await supabaseAdmin
        .from('generated_media')
        .update({ 
          status: 'failed',
        
        })
        .eq('id', mediaId);
        
      if (updateError) {
        console.error('Failed to update error status:', updateError);
      }
      
      return { 
        success: false, 
        status: 'failed', 
        error: output.error || 'Generation failed' 
      };
    }
    
    // Still processing
    return { 
      success: true, 
      status: output.status || 'processing' 
    };
  } catch (error: any) {
    console.error('Error checking generation status:', error);
    
    // Update the record with the error
    try {
      const { error: updateError } = await supabaseAdmin
        .from('generated_media')
        .update({
          status: 'failed',
          metadata: {
            error: error.message,
            failed_at: new Date().toISOString()
          }
        })
        .eq('id', mediaId);
        
      if (updateError) {
        console.error('Failed to update error status:', updateError);
      }
    } catch (dbError) {
      console.error('Failed to update error status:', dbError);
    }
    
    return { success: false, error: error.message };
  }
}

/**
 * Retrieves generated media for a user
 */
export async function getUserMedia(userId: string, limit: number = 20): Promise<{ 
  success: boolean; 
  media?: GeneratedMedia[];
  error?: string; 
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from('generated_media')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch media: ${error.message}`);
    }
    
    // Log to debug empty media list issue
    console.log(`Found ${data?.length || 0} completed media items for user ${userId}`);
    
    return { success: true, media: data || [] };
  } catch (error: any) {
    console.error('Error fetching user media:', error);
    return { success: false, error: error.message, media: [] };
  }
}

/**
 * Gets details of a specific media item
 */
export async function getMediaDetails(mediaId: string, userId: string): Promise<{
  success: boolean;
  media?: GeneratedMedia;
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from('generated_media')
      .select('*')
      .eq('id', mediaId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      throw new Error(`Failed to fetch media details: ${error.message}`);
    }
    
    if (!data) {
      return { success: false, error: 'Media not found' };
    }
    
    return { success: true, media: data };
  } catch (error: any) {
    console.error('Error fetching media details:', error);
    return { success: false, error: error.message };
  }
}
