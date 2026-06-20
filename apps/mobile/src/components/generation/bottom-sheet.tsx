import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsFrostedView } from '@/components/settings/settings-frosted-view';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { useAppBottomMenuState } from '@/components/options/app-bottom-menu-state';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

/**
 * A frosted bottom sheet rendered as an in-tree, edge-to-edge overlay (not a
 * RN Modal). On Android a Modal window does not reliably extend under the
 * navigation/gesture bar, which left a gap below the sheet; an in-tree overlay
 * fills the whole screen down to the physical bottom. The floating tab bar is
 * hidden while the sheet is open (see pushOverlay/popOverlay), so nothing
 * paints over the sheet. The backdrop dims the content behind; only the sheet
 * slides up.
 */
export function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const colors = useSettingsColors();
  const insets = useSafeAreaInsets();
  const { pushOverlay, popOverlay } = useAppBottomMenuState();
  const keyboard = useAnimatedKeyboard();

  // Lift the sheet by the live keyboard height. The sheet itself stays anchored
  // to the bottom (bottom: 0), so when the keyboard closes (height → 0) it snaps
  // back flush with the bottom edge.
  const keyboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  useEffect(() => {
    if (!visible) return;
    pushOverlay();
    return () => popOverlay();
  }, [visible, pushOverlay, popOverlay]);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View
        entering={FadeIn.duration(180)}
        exiting={FadeOut.duration(150)}
        style={[styles.backdrop, { backgroundColor: colors.overlay }]}
      >
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Dismiss" />
      </Animated.View>

      <Animated.View entering={SlideInDown.duration(260)} style={[styles.sheetWrap, keyboardStyle]}>
        <SettingsFrostedView
          style={[
            styles.sheet,
            {
              borderColor: colors.border,
              paddingBottom: insets.bottom + Spacing.four,
              backgroundColor: colors.sheetBackground,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.sheetHandle }]} />
          <View style={styles.header}>
            <ThemedText type="smallBold" style={{ color: colors.text, fontSize: 18 }}>
              {title}
            </ThemedText>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary as string} />
            </Pressable>
          </View>
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: Spacing.three, paddingBottom: Spacing.two }}
          >
            {children}
          </ScrollView>
        </SettingsFrostedView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '90%' },
  sheet: {
    flexShrink: 1,
    minHeight: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  scroll: { flexShrink: 1 },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 999, marginBottom: Spacing.two },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
