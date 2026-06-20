import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { GeneratedMedia } from '@pixio/database/types';

import { useSettingsColors } from '@/components/settings/settings-colors';

type IoniconName = keyof typeof Ionicons.glyphMap;
export type GalleryActionKey = 'regenerate' | 'share' | 'download' | 'delete';

type ActionDef = {
  key: GalleryActionKey;
  icon: IoniconName;
  label: string;
  destructive?: boolean;
};

const ACTION_DEFS: Record<GalleryActionKey, ActionDef> = {
  regenerate: { key: 'regenerate', icon: 'refresh', label: 'Regenerate' },
  share: { key: 'share', icon: 'share-outline', label: 'Share' },
  download: { key: 'download', icon: 'download-outline', label: 'Download' },
  delete: { key: 'delete', icon: 'trash-outline', label: 'Delete', destructive: true },
};

/**
 * Horizontal row of circular action buttons beneath each generation, mirroring
 * Pixio's AssetActionRow: 48×48 circular buttons, white icon, status-dependent
 * set of actions.
 */
export function AssetActionRow({
  item,
  busy,
  onAction,
}: {
  item: GeneratedMedia;
  busy: GalleryActionKey | null;
  onAction: (key: GalleryActionKey) => void;
}) {
  const colors = useSettingsColors();

  const actions = useMemo<ActionDef[]>(() => {
    if (item.status === 'completed' && item.media_url) {
      return [ACTION_DEFS.regenerate, ACTION_DEFS.share, ACTION_DEFS.download, ACTION_DEFS.delete];
    }
    if (item.status === 'failed') {
      return [ACTION_DEFS.regenerate, ACTION_DEFS.delete];
    }
    // pending / processing
    return [ACTION_DEFS.delete];
  }, [item.status, item.media_url]);

  const disabledAll = busy !== null;

  return (
    <View style={styles.row}>
      {actions.map((action) => {
        const isBusy = busy === action.key;
        const tone = action.destructive ? (colors.negative as string) : (colors.primary as string);
        return (
          <Pressable
            key={action.key}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            testID={`gallery-action-${action.key}-${item.id}`}
            disabled={disabledAll}
            onPress={() => onAction(action.key)}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: tone,
                borderColor: tone,
                shadowColor: colors.shadow as string,
                opacity: disabledAll && !isBusy ? 0.5 : pressed ? 0.85 : 1,
              },
            ]}
          >
            {isBusy ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Ionicons name={action.icon} size={22} color="#FFFFFF" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderCurve: 'continuous',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
