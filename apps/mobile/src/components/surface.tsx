import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type ColorValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { colors, elevation, radius } from '@/lib/theme';

export type SurfaceProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** iOS glass style; Android uses Material elevation instead. */
  variant?: 'card' | 'tabBar' | 'pill';
  testID?: string;
};

function getFallbackBackground(variant: SurfaceProps['variant']): ColorValue {
  if (variant === 'tabBar') return colors.surfaceTab;
  if (variant === 'pill') return colors.surfaceElevated;
  return colors.surface;
}

function getAndroidElevation(variant: SurfaceProps['variant']): number {
  if (variant === 'tabBar') return elevation.high;
  if (variant === 'pill') return elevation.low;
  return elevation.medium;
}

/** iOS liquid glass (when available) or blurred fallback; Android Material surface. */
export function Surface({ children, style, variant = 'card', testID }: SurfaceProps) {
  const borderRadius = variant === 'pill' ? radius.lg : radius.md;
  const baseStyle: ViewStyle = {
    borderRadius,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'ios' ? StyleSheetHairline : 0,
    borderColor: colors.border,
  };

  if (Platform.OS === 'ios' && isGlassEffectAPIAvailable()) {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme="dark"
        style={[baseStyle, style]}
      >
        {children}
      </GlassView>
    );
  }

  if (Platform.OS === 'ios') {
    // Older iOS / simulator without Liquid Glass API
    return (
      <View
        testID={testID}
        style={[
          baseStyle,
          {
            backgroundColor: `${String(getFallbackBackground(variant))}E6`,
            borderWidth: 1,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // Android Material surface
  return (
    <View
      testID={testID}
      style={[
        baseStyle,
        {
          backgroundColor: getFallbackBackground(variant),
          elevation: getAndroidElevation(variant),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Avoid importing StyleSheet only for hairlineWidth in this module. */
const StyleSheetHairline = Platform.OS === 'android' ? 0 : 0.5;
