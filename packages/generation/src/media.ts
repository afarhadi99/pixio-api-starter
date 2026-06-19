import { PIXIO_MODELS } from './pixio-api';

// Credit costs derived from each model:
//   image               = Krea Flux (10)
//   video               = Qwen Edit (15)  [image edit, returns an image]
//   firstLastFrameVideo = Wan 2.2  (100)
export const CREDIT_COSTS = {
  image: PIXIO_MODELS.kreaFlux.creditCost,
  video: PIXIO_MODELS.qwenEdit.creditCost,
  firstLastFrameVideo: PIXIO_MODELS.wanFirstLastFrame.creditCost,
} as const;

export const MEDIA_TYPES = ['image', 'video'] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const GENERATION_MODES = ['image', 'video', 'firstLastFrameVideo'] as const;
export type GenerationMode = (typeof GENERATION_MODES)[number];

export type MediaStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type GenerationResult = {
  success: boolean;
  mediaId?: string;
  runId?: string;
  status?: string;
  mediaUrl?: string;
  error?: string;
};
