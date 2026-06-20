import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { SettingsEffectsProvider } from '@/components/settings/settings-effects-context';
import {
  useBumpIosGlassGeneration,
  useMarkIosGlassHostReady,
} from '@/components/ui/ios-glass-host-context';

import { AppBottomMenu } from './app-bottom-menu';
import { GlassFocusRefresh } from './glass-focus-refresh';

export function AppScreenShell(props: { children: React.ReactNode }) {
  const blurTargetRef = useRef<View>(null);
  const markGlassHostReady = useMarkIosGlassHostReady();
  const bumpGlassGeneration = useBumpIosGlassGeneration();

  const handleBlurTargetLayout = useCallback(() => {
    markGlassHostReady?.();
    bumpGlassGeneration?.();
    requestAnimationFrame(() => {
      bumpGlassGeneration?.();
    });
  }, [bumpGlassGeneration, markGlassHostReady]);

  return (
    <SettingsEffectsProvider blurTargetRef={blurTargetRef}>
      <View ref={blurTargetRef} collapsable={false} onLayout={handleBlurTargetLayout} style={styles.shell}>
        <GlassFocusRefresh />
        {props.children}
        <AppBottomMenu />
      </View>
    </SettingsEffectsProvider>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
});
