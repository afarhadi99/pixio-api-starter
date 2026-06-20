import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  type LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useIsFocused } from 'expo-router/react-navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { GeneratedMedia } from '@pixio/database/types';

import { ScreenShell } from '@/components/screen-shell';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useMedia } from '@/lib/hooks';
import { useAppBottomMenuNativeScrollHandler } from '@/components/options/app-bottom-menu-state';

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
      <View style={[styles.tileSurface, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {isReady ? (
          <Image source={{ uri: item.media_url }} style={styles.image} resizeMode="cover" />
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
      </View>
    </Pressable>
  );
}

export default function AssetsScreen() {
  const { media, loading, refresh } = useMedia();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useSettingsColors();
  const scheme = useColorScheme();
  const isFocused = useIsFocused();
  const onScroll = useAppBottomMenuNativeScrollHandler(isFocused);

  const [search, setSearch] = useState('');
  const [headerHeight, setHeaderHeight] = useState(insets.top + 64);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return media;
    return media.filter((m) => (m.prompt ?? '').toLowerCase().includes(term));
  }, [media, search]);

  const searchFill = scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

  return (
    <ScreenShell>
      <FlatList
        data={filtered}
        keyExtractor={(m: GeneratedMedia) => m.id}
        numColumns={2}
        onScroll={onScroll}
        scrollEventThrottle={16}
        columnWrapperStyle={styles.column}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          gap: Spacing.three,
        }}
        renderItem={({ item }: { item: GeneratedMedia }) => (
          <MediaTile item={item} onPress={() => router.push(`/media/${item.id}`)} />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary as string} />
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={{ paddingHorizontal: Spacing.three }}>
              <ThemedText type="small" style={{ color: colors.textSecondary }}>
                {search.trim()
                  ? 'No assets match your search.'
                  : 'No generations yet. Create one from the Generate tab.'}
              </ThemedText>
            </View>
          )
        }
      />

      {/* Pinned search bar — stays at the top while the grid scrolls under it */}
      <View
        onLayout={(e: LayoutChangeEvent) => setHeaderHeight(Math.round(e.nativeEvent.layout.height))}
        style={[styles.searchHeader, { paddingTop: insets.top + Spacing.two }]}
      >
        <View style={[styles.searchBar, { backgroundColor: searchFill }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary as string} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text as string }]}
            placeholder="Search assets..."
            placeholderTextColor={colors.textSecondary as string}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            testID="assets-search"
          />
          {search.length > 0 ? (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary as string} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  searchHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    alignItems: 'center',
  },
  searchBar: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    borderCurve: 'continuous',
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, height: '100%' },
  column: { gap: Spacing.three, paddingHorizontal: Spacing.three },
  tile: { flex: 1 },
  tileSurface: { borderRadius: 20, borderCurve: 'continuous', borderWidth: 1, padding: Spacing.two, gap: Spacing.two },
  image: { width: '100%', aspectRatio: 1, borderRadius: 14 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  caption: {},
});
