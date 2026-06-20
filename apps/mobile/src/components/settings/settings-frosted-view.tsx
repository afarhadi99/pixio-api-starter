import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, useColorScheme, type StyleProp, type ViewStyle } from 'react-native';

import { IosGlassSurface } from '@/components/ui/ios-glass-surface';

import { useSettingsColors } from './settings-colors';
import { useSettingsEffects } from './settings-effects-context';
import { settingsFrostedViewStyles } from './settings-frosted-view.styles';

type SettingsFrostedViewProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

export function SettingsFrostedView(props: SettingsFrostedViewProps) {
  const { children, style, intensity } = props;
  const colors = useSettingsColors();
  const { blurTargetRef } = useSettingsEffects();
  const scheme = useColorScheme();
  const resolvedIntensity = intensity ?? colors.frostedIntensity;

  if (Platform.OS === 'ios') {
    return (
      <IosGlassSurface
        glassEffectStyle="regular"
        glassAnimate={false}
        colorScheme={scheme === 'dark' ? 'dark' : 'light'}
        fallbackBackgroundColor={colors.surface}
        style={[settingsFrostedViewStyles.container, style]}
      >
        {children}
      </IosGlassSurface>
    );
  }

  return (
    <BlurView
      blurTarget={blurTargetRef ?? undefined}
      intensity={resolvedIntensity}
      tint={colors.blurTint}
      blurMethod="dimezisBlurViewSdk31Plus"
      blurReductionFactor={2}
      style={[settingsFrostedViewStyles.container, { backgroundColor: colors.blurFallback }, style]}
    >
      {children}
    </BlurView>
  );
}
