import type { AdminClient } from '@pixio/database/admin';
import type { MediaType } from './media';

const BUCKET = 'generated-media';

export async function uploadFile(
  admin: AdminClient,
  userId: string,
  fileBuffer: ArrayBuffer,
  mediaType: MediaType,
  fileExtension: string,
  contentType: string,
): Promise<{ success: boolean; path?: string; url?: string; error?: string }> {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const storagePath = `${userId}/${mediaType}s/${fileName}`;

    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, { contentType, upsert: false });
    if (uploadError) throw new Error(`Storage upload error: ${uploadError.message}`);

    const { data: publicUrlData } = admin.storage.from(BUCKET).getPublicUrl(storagePath);
    return { success: true, path: storagePath, url: publicUrlData.publicUrl };
  } catch (error: any) {
    console.error('File upload error:', error);
    return { success: false, error: error.message };
  }
}

export async function uploadGenerationInputImage(
  admin: AdminClient,
  userId: string,
  file: File,
  type: 'start' | 'end' | string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!file || !userId) {
    return { success: false, error: 'User ID and file are required.' };
  }
  try {
    const fileExtension = file.name.split('.').pop() || 'png';
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${type}-${timestamp}-${randomString}.${fileExtension}`;
    const storagePath = `${userId}/inputs/${fileName}`;

    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(storagePath, file, { contentType: file.type, upsert: false, cacheControl: '3600' });
    if (uploadError) throw new Error(`Input image upload failed: ${uploadError.message}`);

    const { data: publicUrlData } = admin.storage.from(BUCKET).getPublicUrl(storagePath);
    if (!publicUrlData?.publicUrl) throw new Error('Failed to get public URL for input image.');
    return { success: true, url: publicUrlData.publicUrl };
  } catch (error: any) {
    console.error(`Error uploading input image (${type}):`, error);
    return { success: false, error: error.message };
  }
}

export async function deleteFile(
  admin: AdminClient,
  path: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await admin.storage.from(BUCKET).remove([path]);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function listUserFiles(
  admin: AdminClient,
  userId: string,
  mediaType?: MediaType | 'inputs',
) {
  try {
    let pathPrefix = `${userId}`;
    if (mediaType) {
      pathPrefix = `${userId}/${mediaType === 'inputs' ? 'inputs' : mediaType + 's'}`;
    }

    const { data, error } = await admin.storage
      .from(BUCKET)
      .list(pathPrefix, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) throw error;

    const filesWithUrls = data
      ?.map((file) => {
        const { data: publicUrlData } = admin.storage
          .from(BUCKET)
          .getPublicUrl(`${pathPrefix}/${file.name}`);
        return { ...file, publicUrl: publicUrlData?.publicUrl || null };
      })
      .filter((file) => file.publicUrl);

    return { success: true, files: filesWithUrls || [] };
  } catch (error: any) {
    return { success: false, error: error.message, files: [] };
  }
}
