import { GlassView, isGlassEffectAPIAvailable, type GlassViewProps } from 'expo-glass-effect';
import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  View,
  type ColorValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useIosGlassGeneration, useIosGlassHostReady } from './ios-glass-host-context';

export function useIosGlassEligible(): boolean {
  const [reduceTransparency, setReduceTransparency] = useState<boolean | null>(() => {
    if (Platform.OS !== 'ios') return true;
    return null;
  });

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    let cancelled = false;
    void AccessibilityInfo.isReduceTransparencyEnabled().then((enabled) => {
      if (!cancelled) setReduceTransparency(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', (enabled) => {
      setReduceTransparency(enabled);
    });
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  if (Platform.OS !== 'ios') return false;
  if (!isGlassEffectAPIAvailable()) return false;
  if (reduceTransparency === true) return false;
  return true;
}

export type IosGlassSurfaceProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  fallbackBackgroundColor?: ColorValue;
  glassEffectStyle?: GlassViewProps['glassEffectStyle'];
  colorScheme?: GlassViewProps['colorScheme'];
  isInteractive?: boolean;
  tintColor?: string;
  glassAnimate?: boolean;
};

function resolveAnimatedGlassEffectStyle(
  glassEffectStyle: NonNullable<GlassViewProps['glassEffectStyle']>,
  glassAnimate: boolean,
): GlassViewProps['glassEffectStyle'] {
  if (typeof glassEffectStyle === 'string') {
    return { style: glassEffectStyle, animate: glassAnimate };
  }
  return {
    ...glassEffectStyle,
    style: glassEffectStyle.style,
    animate: glassEffectStyle.animate ?? glassAnimate,
  };
}

export function IosGlassSurface({
  children,
  style,
  fallbackBackgroundColor,
  glassEffectStyle = 'regular',
  colorScheme = 'auto',
  isInteractive = false,
  tintColor,
  glassAnimate = false,
}: IosGlassSurfaceProps) {
  const eligible = useIosGlassEligible();
  const glassHostReady = useIosGlassHostReady();
  const glassGeneration = useIosGlassGeneration();
  const resolvedGlassEffectStyle = resolveAnimatedGlassEffectStyle(glassEffectStyle, glassAnimate);

  if (eligible && glassHostReady) {
    return (
      <GlassView
        key={`ios-glass-${glassGeneration}`}
        collapsable={false}
        colorScheme={colorScheme}
        glassEffectStyle={resolvedGlassEffectStyle}
        isInteractive={isInteractive}
        tintColor={tintColor}
        style={style}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View
      style={[style, fallbackBackgroundColor ? { backgroundColor: fallbackBackgroundColor } : undefined]}
    >
      {children}
    </View>
  );
}
