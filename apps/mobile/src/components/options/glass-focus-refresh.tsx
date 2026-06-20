import { useFocusEffect } from 'expo-router/react-navigation';
import { useCallback } from 'react';

import {
  useBumpIosGlassGeneration,
  useMarkIosGlassHostReady,
} from '@/components/ui/ios-glass-host-context';

export function GlassFocusRefresh() {
  const markGlassHostReady = useMarkIosGlassHostReady();
  const bumpGlassGeneration = useBumpIosGlassGeneration();

  useFocusEffect(
    useCallback(() => {
      markGlassHostReady?.();
      bumpGlassGeneration?.();

      const frame = requestAnimationFrame(() => {
        bumpGlassGeneration?.();
      });
      const shortDelay = setTimeout(() => {
        bumpGlassGeneration?.();
      }, 120);
      const longDelay = setTimeout(() => {
        bumpGlassGeneration?.();
      }, 420);

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(shortDelay);
        clearTimeout(longDelay);
      };
    }, [bumpGlassGeneration, markGlassHostReady]),
  );

  return null;
}
