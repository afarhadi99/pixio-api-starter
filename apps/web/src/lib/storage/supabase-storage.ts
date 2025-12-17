// src/lib/storage/supabase-storage.ts
import { supabaseAdmin } from '@repo/supabase/admin';
// Removed createClient import as it's not used here
import { MediaType } from '@/lib/constants/media';

// Upload a file to Supabase Storage (Existing function - no changes needed for now)
export async function uploadFile(
  userId: string,
  fileBuffer: ArrayBuffer,
  mediaType: MediaType,
  fileExtension: string,
  contentType: string
): Promise<{ success: boolean; path?: string; url?: string; error?: string }> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;

    // Create path based on user ID and media type
    const storagePath = `${userId}/${mediaType}s/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('generated-media')
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Storage upload error: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('generated-media')
      .getPublicUrl(storagePath);

    return {
      success: true,
      path: storagePath,
      url: publicUrlData.publicUrl
    };
  } catch (error: any) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// --- NEW FUNCTION ---
// Upload an input image for generation (e.g., start/end frame)
export async function uploadGenerationInputImage(
  userId: string,
  file: File,
  type: 'start' | 'end' | string // Allow generic type string for future use
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!file || !userId) {
    return { success: false, error: 'User ID and file are required.' };
  }

  try {
    const fileExtension = file.name.split('.').pop() || 'png'; // Default to png if no extension
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${type}-${timestamp}-${randomString}.${fileExtension}`;

    // Store input images in a specific 'inputs' folder per user
    const storagePath = `${userId}/inputs/${fileName}`;

    console.log(`Uploading input image to: ${storagePath}`);

    // Upload to Supabase Storage using admin client
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('generated-media') // Use the same bucket for simplicity
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false, // Don't overwrite existing files
        cacheControl: '3600' // Cache for 1 hour
      });

    if (uploadError) {
      console.error('Input image upload error:', uploadError);
      throw new Error(`Input image upload failed: ${uploadError.message}`);
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('generated-media')
      .getPublicUrl(storagePath);

    if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded input image.');
    }

    console.log(`Input image uploaded successfully: ${publicUrlData.publicUrl}`);

    return {
      success: true,
      url: publicUrlData.publicUrl
    };
  } catch (error: any) {
    console.error(`Error uploading input image (${type}):`, error);
    return {
      success: false,
      error: error.message
    };
  }
}


// Delete a file from Supabase Storage (Existing function - no changes needed)
export async function deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .storage
      .from('generated-media')
      .remove([path]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

// List user files (Existing function - might be used by ImageSelectorPopover)
export async function listUserFiles(userId: string, mediaType?: MediaType | 'inputs') { // Added 'inputs' possibility
  try {
    let pathPrefix = `${userId}`;
    if (mediaType) {
        pathPrefix = `${userId}/${mediaType === 'inputs' ? 'inputs' : mediaType + 's'}`;
    }

    const { data, error } = await supabaseAdmin
      .storage
      .from('generated-media')
      .list(pathPrefix, {
        limit: 100, // Adjust as needed
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error(`Error listing files at path "${pathPrefix}":`, error);
      throw error;
    }

    // Construct full public URLs
    const filesWithUrls = data?.map(file => {
        const { data: publicUrlData } = supabaseAdmin
            .storage
            .from('generated-media')
            .getPublicUrl(`${pathPrefix}/${file.name}`);
        return {
            ...file,
            publicUrl: publicUrlData?.publicUrl || null
        };
    }).filter(file => file.publicUrl); // Filter out files where URL couldn't be generated

    return { success: true, files: filesWithUrls || [] };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      files: []
    };
  }
}
