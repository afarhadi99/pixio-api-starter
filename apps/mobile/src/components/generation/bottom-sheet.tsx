import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsFrostedView } from '@/components/settings/settings-frosted-view';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

/** A frosted bottom sheet (Modal) matching the app's drawer/sheet styling. */
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

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={onClose} />
        <SettingsFrostedView
          style={[
            styles.sheet,
            { borderColor: colors.border, paddingBottom: insets.bottom + Spacing.four, backgroundColor: colors.sheetBackground },
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
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.three }}>
            {children}
          </ScrollView>
        </SettingsFrostedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    maxHeight: '82%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 999, marginBottom: Spacing.two },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
