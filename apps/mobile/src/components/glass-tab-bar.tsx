import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, useColorScheme } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsColors } from '@/components/settings/settings-colors';
import { SETTINGS_SYMBOLS } from '@/components/settings/settings.constants';
import { IosGlassSurface } from '@/components/ui/ios-glass-surface';
import { Spacing } from '@/constants/theme';
import { useScroll } from '@/lib/scroll-context';

const TABS: Record<string, { label: string; symbol: keyof typeof SETTINGS_SYMBOLS }> = {
  index: { label: 'Generate', symbol: 'generate' },
  assets: { label: 'Assets', symbol: 'assets' },
  account: { label: 'Account', symbol: 'account' },
};

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (event: {
      type: 'tabPress';
      target: string;
      canPreventDefault: boolean;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

/**
 * Floating glass bottom bar of circular icon buttons (Pixio-style). It hides
 * when scrolling down and reappears scrolling up — no extra quick actions.
 */
export function GlassTabBar({ state, navigation }: TabBarProps) {
  const colors = useSettingsColors();
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { tabHidden } = useScroll();

  const activeBg = scheme === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.6)';

  const containerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(tabHidden.value, [0, 1], [1, 0]),
    transform: [{ translateY: interpolate(tabHidden.value, [0, 1], [0, 120]) }],
  }));

  const onPress = useCallback(
    (routeName: string, routeKey: string, focused: boolean) => {
      if (Platform.OS === 'ios') void Haptics.selectionAsync().catch(() => undefined);
      const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(routeName);
    },
    [navigation],
  );

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.root, { paddingBottom: insets.bottom + Spacing.two }, containerStyle]}
    >
      <IosGlassSurface
        glassAnimate={false}
        glassEffectStyle="regular"
        colorScheme={scheme === 'dark' ? 'dark' : 'light'}
        fallbackBackgroundColor={colors.sheetBackground}
        style={[styles.bar, { borderColor: colors.border }]}
      >
        {state.routes.map((route, index) => {
          const meta = TABS[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={meta.label}
              testID={`tab-${route.name}`}
              onPress={() => onPress(route.name, route.key, focused)}
              style={({ pressed }) => [
                styles.tab,
                focused && { backgroundColor: activeBg },
                pressed && { opacity: 0.7 },
              ]}
            >
              <SymbolView
                name={SETTINGS_SYMBOLS[meta.symbol]}
                size={24}
                tintColor={focused ? (colors.primary as string) : (colors.textSecondary as string)}
                type={Platform.OS === 'ios' ? 'hierarchical' : undefined}
                weight="medium"
              />
            </Pressable>
          );
        })}
      </IosGlassSurface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    zIndex: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    height: 64,
    borderRadius: 999,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: Spacing.three,
  },
  tab: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
