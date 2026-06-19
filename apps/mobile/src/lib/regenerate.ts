import type { GeneratedMedia } from '@pixio/database/types';
import type { GenerateParams } from '@pixio/generation';

type MediaMetadata = {
  generationMode?: string;
  width?: number;
  height?: number;
  positivePrompt?: string;
  negativePrompt?: string;
  videoLength?: number;
};

/** Build generation params from an existing media row (same models as web). */
export function buildRegenerateParams(media: GeneratedMedia): GenerateParams | null {
  const metadata = (media.metadata ?? {}) as MediaMetadata;
  const mode = metadata.generationMode ?? 'image';

  if (mode === 'image') {
    return {
      mode: 'image',
      prompt: media.prompt,
      width: metadata.width ?? 1024,
      height: metadata.height ?? 1024,
    };
  }

  if (mode === 'video') {
    const imageUrl = media.media_url;
    if (!imageUrl) return null;
    return {
      mode: 'video',
      image1Url: imageUrl,
      positivePrompt: metadata.positivePrompt ?? media.prompt,
      negativePrompt: metadata.negativePrompt ?? '',
    };
  }

  if (mode === 'firstLastFrameVideo') {
    if (!media.start_image_url || !media.end_image_url) return null;
    return {
      mode: 'firstLastFrameVideo',
      prompt: media.prompt,
      startImageUrl: media.start_image_url,
      endImageUrl: media.end_image_url,
      videoWidth: metadata.width ?? 512,
      videoHeight: metadata.height ?? 512,
      videoLength: metadata.videoLength ?? 81,
    };
  }

  return null;
}
