// src/lib/constants/media.ts
// Re-exports from pixio-api.ts for backwards compatibility

import { PIXIO_MODELS } from '@/lib/pixio-api';

// Export credit costs from models
// image = Krea Flux (10 credits)
// video = Qwen Edit (15 credits)
// firstLastFrameVideo = Wan 2.2 (100 credits)
export const CREDIT_COSTS = {
  image: PIXIO_MODELS.kreaFlux.creditCost,                    // 10 credits
  video: PIXIO_MODELS.qwenEdit.creditCost,                    // 15 credits
  firstLastFrameVideo: PIXIO_MODELS.wanFirstLastFrame.creditCost, // 100 credits
} as const;

// Media types
export const MEDIA_TYPES = ['image', 'video'] as const;
export type MediaType = typeof MEDIA_TYPES[number];

// Generation modes (maps to models)
export const GENERATION_MODES = ['image', 'video', 'firstLastFrameVideo'] as const;
export type GenerationMode = typeof GENERATION_MODES[number];

// Status types
export type MediaStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Generation result type
export type GenerationResult = {
  success: boolean;
  mediaId?: string;
  runId?: string;
  status?: string;
  mediaUrl?: string;
  error?: string;
};