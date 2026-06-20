import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { SettingsAnimatedBackground } from '@/components/settings/settings-animated-background';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { SettingsEffectsProvider } from '@/components/settings/settings-effects-context';
import {
  useBumpIosGlassGeneration,
  useMarkIosGlassHostReady,
} from '@/components/ui/ios-glass-host-context';

/**
 * Per-screen shell that hosts the blur target (so Android frosted views can
 * sample it) and the animated gradient background — mirrors the Pixio app's
 * AppScreenShell. The glass host is marked ready once the target lays out.
 */
export function ScreenShell({ children }: { children: React.ReactNode }) {
  const colors = useSettingsColors();
  const blurTargetRef = useRef<View>(null);
  const markGlassHostReady = useMarkIosGlassHostReady();
  const bumpGlassGeneration = useBumpIosGlassGeneration();

  const handleLayout = useCallback(() => {
    markGlassHostReady?.();
    bumpGlassGeneration?.();
    requestAnimationFrame(() => bumpGlassGeneration?.());
  }, [bumpGlassGeneration, markGlassHostReady]);

  return (
    <SettingsEffectsProvider blurTargetRef={blurTargetRef}>
      <View
        ref={blurTargetRef}
        collapsable={false}
        onLayout={handleLayout}
        style={[styles.shell, { backgroundColor: colors.background }]}
      >
        <SettingsAnimatedBackground />
        {children}
      </View>
    </SettingsEffectsProvider>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
});
