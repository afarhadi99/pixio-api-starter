import React, { useCallback, useEffect } from 'react';

import { useAppBottomMenuState } from './app-bottom-menu-state';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { IosGlassSurface } from '@/components/ui/ios-glass-surface';
import { AppBottomMenuHeight, MaxContentWidth, Spacing } from '@/constants/theme';
import { useNavigation } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowUp, ChevronRight, Menu } from 'lucide-react-native';
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

const COMPACT_MENU_WIDTH = 76;
const COMPACT_MENU_WITH_SCROLL_TOP_WIDTH = 132;
const COMPACT_MENU_HEIGHT = 48;
const EXPANDED_MENU_WIDTH = 156;
const EXPANDED_MENU_WITH_SCROLL_TOP_WIDTH = 284;
const MENU_ANIMATION_MS = 220;

type DrawerNavigation = {
  openDrawer: () => void;
};

export function AppBottomMenu() {
  const colors = useSettingsColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<DrawerNavigation>();
  const { canScrollToTop, compact, expand, requestReevaluation, scrollToTop } =
    useAppBottomMenuState();
  const compactProgress = useSharedValue(compact ? 1 : 0);
  const optionsIconColor = String(colors.text);
  const inactiveIconColor = String(colors.textSecondary);
  const expandedMenuWidth = Math.min(
    canScrollToTop ? EXPANDED_MENU_WITH_SCROLL_TOP_WIDTH : EXPANDED_MENU_WIDTH,
    width - Spacing.three * 2,
    MaxContentWidth,
  );
  const compactMenuWidth = Math.min(
    canScrollToTop ? COMPACT_MENU_WITH_SCROLL_TOP_WIDTH : COMPACT_MENU_WIDTH,
    expandedMenuWidth,
  );
  const compactTranslateX = -Math.max(0, (width - Spacing.three * 2 - compactMenuWidth) / 2);
  const activeButtonBackground =
    colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.48)';
  const inactiveButtonBackground =
    colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.22)';

  useEffect(() => {
    compactProgress.value = withTiming(compact ? 1 : 0, {
      duration: MENU_ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [compact, compactProgress]);

  const barAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    borderRadius: interpolate(compactProgress.value, [0, 1], [30, 24]),
    height: interpolate(compactProgress.value, [0, 1], [AppBottomMenuHeight, COMPACT_MENU_HEIGHT]),
    transform: [
      { translateX: interpolate(compactProgress.value, [0, 1], [0, compactTranslateX]) },
      { translateY: interpolate(compactProgress.value, [0, 1], [0, 4]) },
    ],
    width: interpolate(compactProgress.value, [0, 1], [expandedMenuWidth, compactMenuWidth]),
  }));

  const expandedControlsAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: interpolate(compactProgress.value, [0, 0.65, 1], [1, 0, 0]),
    transform: [{ scale: interpolate(compactProgress.value, [0, 1], [1, 0.96]) }],
  }));

  const compactControlsAnimatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: interpolate(compactProgress.value, [0, 0.45, 1], [0, 0, 1]),
    transform: [{ translateX: interpolate(compactProgress.value, [0, 1], [-8, 0]) }],
  }));

  const triggerHaptic = useCallback(() => {
    if (Platform.OS === 'ios') {
      void Haptics.selectionAsync().catch(() => undefined);
    }
  }, []);

  const openOptions = useCallback(() => {
    triggerHaptic();
    expand();
    navigation.openDrawer();
  }, [expand, navigation, triggerHaptic]);

  const handleScrollToTop = useCallback(() => {
    triggerHaptic();
    scrollToTop();
    requestReevaluation();
  }, [requestReevaluation, scrollToTop, triggerHaptic]);

  const expandMenu = useCallback(() => {
    triggerHaptic();
    expand();
  }, [expand, triggerHaptic]);

  return (
    <View pointerEvents="box-none" style={[styles.root, { paddingBottom: insets.bottom + Spacing.two }]}>
      <Animated.View style={[styles.barFrame, barAnimatedStyle]}>
        <IosGlassSurface
          glassAnimate={false}
          glassEffectStyle="regular"
          colorScheme={colorScheme === 'dark' ? 'dark' : 'light'}
          fallbackBackgroundColor={colors.sheetBackground}
          style={[styles.barSurface, { borderColor: colors.border }]}
        >
          <Animated.View
            pointerEvents={compact ? 'none' : 'auto'}
            style={[styles.expandedControls, expandedControlsAnimatedStyle]}
          >
            {canScrollToTop ? (
              <MenuButton
                label="Top"
                focused={false}
                onPress={handleScrollToTop}
                icon={<ArrowUp size={20} color={inactiveIconColor} />}
                backgroundColor={inactiveButtonBackground}
              />
            ) : null}
            <MenuButton
              label="Options"
              focused
              onPress={openOptions}
              icon={<Menu size={20} color={optionsIconColor} />}
              backgroundColor={activeButtonBackground}
            />
          </Animated.View>

          <Animated.View
            pointerEvents={compact ? 'auto' : 'none'}
            style={[styles.compactControls, compactControlsAnimatedStyle]}
          >
            {canScrollToTop ? (
              <Pressable
                accessibilityLabel="Scroll to top"
                accessibilityRole="button"
                onPress={handleScrollToTop}
                style={({ pressed }) => [
                  styles.compactIconButton,
                  { backgroundColor: inactiveButtonBackground, opacity: pressed ? 0.72 : 1 },
                ]}
              >
                <ArrowUp size={19} color={inactiveIconColor} />
              </Pressable>
            ) : null}
            <Pressable
              accessibilityLabel="Expand bottom menu"
              accessibilityRole="button"
              onPress={expandMenu}
              style={({ pressed }) => [
                styles.compactButton,
                { backgroundColor: inactiveButtonBackground, opacity: pressed ? 0.72 : 1 },
              ]}
            >
              <Menu size={20} color={optionsIconColor} />
              <ChevronRight size={18} color={optionsIconColor} />
            </Pressable>
          </Animated.View>
        </IosGlassSurface>
      </Animated.View>
    </View>
  );
}

function MenuButton(props: {
  label: string;
  focused: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  backgroundColor: string;
}) {
  const colors = useSettingsColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: props.focused }}
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: props.backgroundColor, opacity: pressed ? 0.72 : 1 },
      ]}
    >
      {props.icon}
      <ThemedText
        numberOfLines={1}
        type="smallBold"
        style={{ color: props.focused ? colors.text : colors.textSecondary }}
      >
        {props.label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    paddingHorizontal: Spacing.three,
    position: 'absolute',
    right: 0,
    zIndex: 20,
  },
  barFrame: { overflow: 'hidden' },
  barSurface: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 999,
    borderWidth: 1,
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  expandedControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.two,
  },
  compactControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.two,
  },
  compactButton: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 20,
    flexDirection: 'row',
    flex: 1,
    gap: Spacing.one,
    height: '100%',
    justifyContent: 'center',
  },
  compactIconButton: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 20,
    height: '100%',
    justifyContent: 'center',
    width: 40,
  },
  button: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 22,
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    height: '100%',
    justifyContent: 'center',
    minWidth: 0,
    paddingHorizontal: Spacing.two,
  },
});
