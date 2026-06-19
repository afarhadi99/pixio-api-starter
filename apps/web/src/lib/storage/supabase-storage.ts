// App-level shim binding the service-role client to the @pixio/generation
// storage helpers, preserving the original `@/lib/storage/supabase-storage` API.
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { MediaType } from '@/lib/constants/media';
import {
  uploadFile as _uploadFile,
  uploadGenerationInputImage as _uploadGenerationInputImage,
  deleteFile as _deleteFile,
  listUserFiles as _listUserFiles,
} from '@pixio/generation';

export const uploadFile = (
  userId: string,
  fileBuffer: ArrayBuffer,
  mediaType: MediaType,
  fileExtension: string,
  contentType: string,
) => _uploadFile(supabaseAdmin, userId, fileBuffer, mediaType, fileExtension, contentType);

export const uploadGenerationInputImage = (
  userId: string,
  file: File,
  type: 'start' | 'end' | string,
) => _uploadGenerationInputImage(supabaseAdmin, userId, file, type);

export const deleteFile = (path: string) => _deleteFile(supabaseAdmin, path);

export const listUserFiles = (userId: string, mediaType?: MediaType | 'inputs') =>
  _listUserFiles(supabaseAdmin, userId, mediaType);
