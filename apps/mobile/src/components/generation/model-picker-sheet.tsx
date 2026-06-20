import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { PixioModel } from '@pixio/generation';

import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { BottomSheet } from './bottom-sheet';

export type ModelOption = { id: string; model: PixioModel };

export function ModelPickerSheet({
  visible,
  models,
  selectedId,
  onSelect,
  onClose,
}: {
  visible: boolean;
  models: ModelOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const colors = useSettingsColors();

  return (
    <BottomSheet visible={visible} title="Choose a model" onClose={onClose}>
      {models.map(({ id, model }) => {
        const active = id === selectedId;
        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => {
              onSelect(id);
              onClose();
            }}
            style={[
              styles.row,
              {
                backgroundColor: active ? colors.primaryContainer : colors.chip,
                borderColor: active ? colors.primaryContainer : colors.border,
              },
            ]}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <View style={styles.titleRow}>
                <ThemedText
                  type="smallBold"
                  style={{ color: active ? colors.onPrimaryContainer : colors.text, fontSize: 16 }}
                >
                  {model.name}
                </ThemedText>
                <View style={[styles.creditBadge, { borderColor: active ? colors.onPrimaryContainer : colors.border }]}>
                  <Ionicons name="flash" size={11} color={active ? colors.onPrimaryContainer : (colors.primary as string)} />
                  <ThemedText type="small" style={{ color: active ? colors.onPrimaryContainer : colors.textSecondary }}>
                    {model.creditCost}
                  </ThemedText>
                </View>
              </View>
              <ThemedText
                type="small"
                style={{ color: active ? colors.onPrimaryContainer : colors.textSecondary }}
              >
                {model.description}
              </ThemedText>
            </View>
            {active ? (
              <Ionicons name="checkmark-circle" size={22} color={colors.onPrimaryContainer as string} />
            ) : null}
          </Pressable>
        );
      })}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: Spacing.three,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
});
