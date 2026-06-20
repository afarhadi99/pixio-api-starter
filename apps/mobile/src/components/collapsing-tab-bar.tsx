import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { IosGlassSurface } from '@/components/ui/ios-glass-surface';
import { AppBottomMenuHeight, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppBottomMenuState } from '@/components/options/app-bottom-menu-state';

type IoniconName = keyof typeof Ionicons.glyphMap;

const TABS: Record<string, { label: string; icon: IoniconName; iconOutline: IoniconName }> = {
  index: { label: 'Generate', icon: 'sparkles', iconOutline: 'sparkles-outline' },
  assets: { label: 'Assets', icon: 'images', iconOutline: 'images-outline' },
  account: { label: 'Account', icon: 'person-circle', iconOutline: 'person-circle-outline' },
};

const TAB_ORDER = ['index', 'assets', 'account'] as const;

const EXPANDED_MENU_WIDTH = 264;
const COMPACT_MENU_WIDTH = 212;
const COMPACT_MENU_HEIGHT = 48;
const MENU_ANIMATION_MS = 220;

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: boolean }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
};

/**
 * Floating glass bottom bar with three links (Generate / Assets / Account).
 * At rest it is a centered pill showing icon + label. On scroll it collapses
 * into the bottom-LEFT corner — shrinking its width/height and sliding left via
 * a negative translateX (mirrors Pixio's old "Options" menu) — and cross-fades
 * to an icon-only compact pill. No drawer.
 */
export function CollapsingTabBar({ state, navigation }: TabBarProps) {
  const colors = useSettingsColors();
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { compact, expand, overlayOpen } = useAppBottomMenuState();

  const compactProgress = useSharedValue(compact ? 1 : 0);
  useEffect(() => {
    compactProgress.value = withTiming(compact ? 1 : 0, {
      duration: MENU_ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [compact, compactProgress]);

  const expandedMenuWidth = Math.min(EXPANDED_MENU_WIDTH, width - Spacing.three * 2, MaxContentWidth);
  const compactMenuWidth = Math.min(COMPACT_MENU_WIDTH, expandedMenuWidth);
  const compactTranslateX = -Math.max(0, (width - Spacing.three * 2 - compactMenuWidth) / 2);

  const activeBg = scheme === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.48)';

  const barAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    borderRadius: interpolate(compactProgress.value, [0, 1], [30, 24]),
    height: interpolate(compactProgress.value, [0, 1], [AppBottomMenuHeight, COMPACT_MENU_HEIGHT]),
    width: interpolate(compactProgress.value, [0, 1], [expandedMenuWidth, compactMenuWidth]),
    transform: [
      { translateX: interpolate(compactProgress.value, [0, 1], [0, compactTranslateX]) },
      { translateY: interpolate(compactProgress.value, [0, 1], [0, 4]) },
    ],
  }));

  const expandedControlsStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: interpolate(compactProgress.value, [0, 0.65, 1], [1, 0, 0]),
    transform: [{ scale: interpolate(compactProgress.value, [0, 1], [1, 0.96]) }],
  }));

  const compactControlsStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: interpolate(compactProgress.value, [0, 0.45, 1], [0, 0, 1]),
    transform: [{ translateX: interpolate(compactProgress.value, [0, 1], [-8, 0]) }],
  }));

  const onPress = useCallback(
    (routeName: string, focused: boolean) => {
      if (Platform.OS === 'ios') void Haptics.selectionAsync().catch(() => undefined);
      const route = state.routes.find((r) => r.name === routeName);
      const event = navigation.emit({
        type: 'tabPress',
        target: route?.key ?? routeName,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) navigation.navigate(routeName);
    },
    [navigation, state.routes],
  );

  const activeName = state.routes[state.index]?.name;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.root,
        { paddingBottom: insets.bottom + Spacing.two },
        overlayOpen && styles.hidden,
      ]}
    >
      <Animated.View style={[styles.barFrame, barAnimatedStyle]}>
        <IosGlassSurface
          glassAnimate={false}
          glassEffectStyle="regular"
          colorScheme={scheme === 'dark' ? 'dark' : 'light'}
          fallbackBackgroundColor={colors.sheetBackground}
          style={[styles.barSurface, { borderColor: colors.border }]}
        >
          <Animated.View
            pointerEvents={compact ? 'none' : 'auto'}
            style={[styles.controlsRow, expandedControlsStyle]}
          >
            {TAB_ORDER.map((name) => {
              const meta = TABS[name];
              const focused = activeName === name;
              const tint = focused ? (colors.primary as string) : (colors.textSecondary as string);
              return (
                <Pressable
                  key={`exp-${name}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: focused }}
                  accessibilityLabel={meta.label}
                  testID={`tab-${meta.label.toLowerCase()}`}
                  onPress={() => onPress(name, focused)}
                  style={({ pressed }) => [
                    styles.expandedTab,
                    focused && { backgroundColor: activeBg },
                    pressed && { opacity: 0.72 },
                  ]}
                >
                  <Ionicons name={focused ? meta.icon : meta.iconOutline} size={22} color={tint} />
                  <ThemedText
                    type="small"
                    numberOfLines={1}
                    style={{ color: tint, fontSize: 11, lineHeight: 13, fontWeight: '600' }}
                  >
                    {meta.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </Animated.View>

          <Animated.View
            pointerEvents={compact ? 'auto' : 'none'}
            style={[styles.controlsRow, styles.compactRow, compactControlsStyle]}
          >
            {TAB_ORDER.map((name) => {
              const meta = TABS[name];
              const focused = activeName === name;
              const tint = focused ? (colors.primary as string) : (colors.textSecondary as string);
              return (
                <Pressable
                  key={`cmp-${name}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: focused }}
                  accessibilityLabel={meta.label}
                  testID={`tab-compact-${meta.label.toLowerCase()}`}
                  onPress={() => onPress(name, focused)}
                  style={({ pressed }) => [
                    styles.compactTab,
                    focused && { backgroundColor: activeBg },
                    pressed && { opacity: 0.72 },
                  ]}
                >
                  <Ionicons name={focused ? meta.icon : meta.iconOutline} size={20} color={tint} />
                </Pressable>
              );
            })}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Expand menu"
              testID="tab-expand"
              onPress={() => {
                if (Platform.OS === 'ios') void Haptics.selectionAsync().catch(() => undefined);
                expand();
              }}
              style={({ pressed }) => [styles.expandButton, pressed && { opacity: 0.72 }]}
            >
              <Ionicons name="chevron-up" size={20} color={colors.text as string} />
            </Pressable>
          </Animated.View>
        </IosGlassSurface>
      </Animated.View>
    </View>
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
    zIndex: 30,
  },
  hidden: { display: 'none' },
  barFrame: { overflow: 'hidden' },
  barSurface: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderCurve: 'continuous',
    borderWidth: 1,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  controlsRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
  },
  compactRow: { justifyContent: 'center' },
  expandedTab: {
    flex: 1,
    height: '100%',
    borderRadius: 22,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  compactTab: {
    flex: 1,
    height: '100%',
    borderRadius: 16,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandButton: {
    width: 34,
    height: '100%',
    borderRadius: 16,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
