/** Dispatched when a generation row is created so the library can update immediately. */
export const GENERATION_STARTED_EVENT = 'pixio:generation-started';

export type GenerationStartedDetail = { mediaId: string };

export function dispatchGenerationStarted(mediaId: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<GenerationStartedDetail>(GENERATION_STARTED_EVENT, {
      detail: { mediaId },
    }),
  );
}
