import type { GeneratedMedia } from '@pixio/database/types';
import { buildRegenerateParams } from './regenerate';

const baseMedia = {
  id: '1',
  user_id: 'u1',
  prompt: 'test prompt',
  media_type: 'image',
  media_url: 'https://example.com/a.png',
  storage_path: 'path',
  credits_used: 10,
  status: 'completed',
  created_at: new Date().toISOString(),
  metadata: {},
  start_image_url: null,
  end_image_url: null,
} satisfies GeneratedMedia;

describe('buildRegenerateParams', () => {
  it('builds image params from metadata', () => {
    const params = buildRegenerateParams({
      ...baseMedia,
      metadata: { generationMode: 'image', width: 512, height: 768 },
    });
    expect(params).toEqual({
      mode: 'image',
      prompt: 'test prompt',
      width: 512,
      height: 768,
    });
  });

  it('defaults image dimensions when metadata is missing', () => {
    const params = buildRegenerateParams(baseMedia);
    expect(params).toEqual({
      mode: 'image',
      prompt: 'test prompt',
      width: 1024,
      height: 1024,
    });
  });

  it('builds video edit params when media url exists', () => {
    const params = buildRegenerateParams({
      ...baseMedia,
      metadata: { generationMode: 'video', positivePrompt: 'enhance' },
    });
    expect(params).toEqual({
      mode: 'video',
      image1Url: 'https://example.com/a.png',
      positivePrompt: 'enhance',
      negativePrompt: '',
    });
  });

  it('returns null for video mode without media url', () => {
    const params = buildRegenerateParams({
      ...baseMedia,
      media_url: '',
      metadata: { generationMode: 'video' },
    });
    expect(params).toBeNull();
  });

  it('builds first/last frame video params', () => {
    const params = buildRegenerateParams({
      ...baseMedia,
      media_type: 'video',
      start_image_url: 'https://example.com/start.png',
      end_image_url: 'https://example.com/end.png',
      metadata: { generationMode: 'firstLastFrameVideo', width: 640, height: 480, videoLength: 60 },
    });
    expect(params).toEqual({
      mode: 'firstLastFrameVideo',
      prompt: 'test prompt',
      startImageUrl: 'https://example.com/start.png',
      endImageUrl: 'https://example.com/end.png',
      videoWidth: 640,
      videoHeight: 480,
      videoLength: 60,
    });
  });
});
