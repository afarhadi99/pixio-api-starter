import React from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

import { IosGlassSurface } from '@/components/ui/ios-glass-surface';

import { useSettingsColors } from './settings-colors';
import { settingsFrostedViewStyles } from './settings-frosted-view.styles';

type SettingsFrostedViewProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

/**
 * Frosted surface. On iOS this uses the native liquid-glass effect. On Android
 * we render a translucent solid surface instead of expo-blur's BlurView:
 * live blur with a blurTarget capture renders on the GPU RenderThread and was
 * causing a native SIGSEGV crash. A translucent fill over the animated
 * background keeps the glassy look without the unstable GPU path.
 */
export function SettingsFrostedView(props: SettingsFrostedViewProps) {
  const { children, style } = props;
  const colors = useSettingsColors();

  if (Platform.OS === 'ios') {
    return (
      <IosGlassSurface
        glassEffectStyle="regular"
        glassAnimate={false}
        fallbackBackgroundColor={colors.surface}
        style={[settingsFrostedViewStyles.container, style]}
      >
        {children}
      </IosGlassSurface>
    );
  }

  return (
    <View
      style={[settingsFrostedViewStyles.container, { backgroundColor: colors.blurFallback }, style]}
    >
      {children}
    </View>
  );
}
