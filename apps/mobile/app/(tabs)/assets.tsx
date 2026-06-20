import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { GeneratedMedia } from '@pixio/database/types';

import { ScreenShell } from '@/components/screen-shell';
import { SettingsHero } from '@/components/settings/settings-hero';
import { SETTINGS_SYMBOLS } from '@/components/settings/settings.constants';
import { SettingsFrostedView } from '@/components/settings/settings-frosted-view';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useMedia } from '@/lib/hooks';

const statusLabel: Record<string, string> = {
  completed: 'Done',
  failed: 'Failed',
  processing: 'Working…',
  pending: 'Queued',
};

function MediaTile({ item, onPress }: { item: GeneratedMedia; onPress: () => void }) {
  const colors = useSettingsColors();
  const isReady = item.media_url && item.status === 'completed';
  const statusColor =
    item.status === 'completed'
      ? colors.positive
      : item.status === 'failed'
        ? colors.negative
        : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.prompt}`}
      onPress={onPress}
      style={styles.tile}
      testID={`asset-tile-${item.id}`}
    >
      <SettingsFrostedView style={[styles.tileSurface, { borderColor: colors.border }]}>
        {isReady ? (
          <Image source={{ uri: item.media_url }} style={styles.image} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.image, styles.placeholder, { backgroundColor: colors.chip }]}>
            <ThemedText type="smallBold" style={{ color: statusColor }}>
              {statusLabel[item.status] ?? item.status}
            </ThemedText>
          </View>
        )}
        <ThemedText type="small" numberOfLines={1} style={[styles.caption, { color: colors.textSecondary }]}>
          {item.prompt || 'Untitled'}
        </ThemedText>
      </SettingsFrostedView>
    </Pressable>
  );
}

export default function AssetsScreen() {
  const { media, loading, refresh } = useMedia();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useSettingsColors();

  return (
    <ScreenShell>
      <FlatList
        data={media}
        keyExtractor={(m) => m.id}
        numColumns={2}
        columnWrapperStyle={{ gap: Spacing.three, paddingHorizontal: Spacing.three }}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          gap: Spacing.three,
        }}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: Spacing.three, paddingBottom: Spacing.three }}>
            <SettingsHero
              title="Assets"
              subtitle="Everything you've generated, updated live as renders finish."
              symbol={SETTINGS_SYMBOLS.assets}
            />
          </View>
        }
        renderItem={({ item }) => (
          <MediaTile item={item} onPress={() => router.push(`/media/${item.id}`)} />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={{ paddingHorizontal: Spacing.three }}>
              <ThemedText type="small" style={{ color: colors.textSecondary }}>
                No generations yet. Create one from the Generate tab.
              </ThemedText>
            </View>
          )
        }
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1 },
  tileSurface: { borderRadius: 20, borderCurve: 'continuous', borderWidth: 1, padding: Spacing.two, gap: Spacing.two },
  image: { width: '100%', aspectRatio: 1, borderRadius: 14 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  caption: {},
});
