import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, { useAnimatedScrollHandler, type SharedValue } from 'react-native-reanimated';
import type { GeneratedMedia } from '@pixio/database/types';

import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { api } from '@/lib/api';
import { downloadMediaToCache, shareMediaUrl } from '@/lib/media-actions';
import { AssetActionRow, type GalleryActionKey } from './asset-action-row';

const HORIZONTAL_PADDING = 12;

const STATUS_LABEL: Record<string, string> = {
  pending: 'Queued',
  processing: 'Processing',
  failed: 'Failed',
  completed: 'Ready',
};

type BusyState = { id: string; key: GalleryActionKey } | null;

const AnimatedFlatList = Animated.FlatList;

export type GeneratedGalleryProps = {
  media: GeneratedMedia[];
  loading: boolean;
  refresh: () => void;
  contentTopPadding: number;
  bottomInset: number;
  scrollY?: SharedValue<number>;
  onRegenerate?: (item: GeneratedMedia) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Full-screen, one-at-a-time vertical pager of generations (mirrors Pixio's
 * GeneratedGallery). Each page fills the list viewport and snaps via
 * `pagingEnabled`; below the square media sits a prompt/status panel and a row
 * of circular action buttons.
 */
export function GeneratedGallery({
  media,
  loading,
  refresh,
  contentTopPadding,
  bottomInset,
  scrollY,
  onRegenerate,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'Pick a model, write a prompt, and tap Generate.',
}: GeneratedGalleryProps) {
  const colors = useSettingsColors();
  const { width } = useWindowDimensions();
  const [listHeight, setListHeight] = useState(0);
  const [busy, setBusy] = useState<BusyState>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (scrollY) scrollY.value = event.contentOffset.y;
    },
  });

  const columnWidth = Math.max(Math.min(width, MaxContentWidth) - HORIZONTAL_PADDING * 2, 140);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setListHeight(Math.round(e.nativeEvent.layout.height));
  }, []);

  const handleAction = useCallback(
    async (item: GeneratedMedia, key: GalleryActionKey) => {
      if (key === 'regenerate') {
        onRegenerate?.(item);
        return;
      }
      if (key === 'delete') {
        Alert.alert('Delete generation', 'This cannot be undone.', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              setBusy({ id: item.id, key });
              try {
                await api.deleteMedia(item.id);
                refresh();
              } catch (e: unknown) {
                Alert.alert('Delete failed', e instanceof Error ? e.message : 'Please try again.');
              } finally {
                setBusy(null);
              }
            },
          },
        ]);
        return;
      }
      if (!item.media_url) return;
      setBusy({ id: item.id, key });
      try {
        if (key === 'share') {
          await shareMediaUrl(item.media_url, item.media_type);
        } else if (key === 'download') {
          const uri = await downloadMediaToCache(item.media_url, item.media_type);
          Alert.alert('Saved to cache', uri);
        }
      } catch (e: unknown) {
        Alert.alert('Action failed', e instanceof Error ? e.message : 'Please try again.');
      } finally {
        setBusy(null);
      }
    },
    [onRegenerate, refresh],
  );

  const pageHeight = listHeight > 0 ? listHeight : 0;
  // Keep the whole page (media + prompt + actions) inside one viewport.
  const mediaSize = Math.max(Math.min(columnWidth, pageHeight - 184), 140);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({ length: pageHeight, offset: pageHeight * index, index }),
    [pageHeight],
  );

  const renderItem = useCallback(
    ({ item }: { item: GeneratedMedia }) => (
      <GalleryPage
        item={item}
        pageHeight={pageHeight}
        mediaSize={mediaSize}
        busy={busy?.id === item.id ? busy.key : null}
        onAction={(key) => handleAction(item, key)}
      />
    ),
    [pageHeight, mediaSize, busy, handleAction],
  );

  return (
    <View style={[styles.container, { top: contentTopPadding, bottom: bottomInset }]} onLayout={onLayout}>
      {pageHeight > 0 ? (
        <AnimatedFlatList
          data={media}
          keyExtractor={(m: GeneratedMedia) => m.id}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          pagingEnabled
          decelerationRate="fast"
          snapToAlignment="start"
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary as string} />
          }
          ListEmptyComponent={
            loading ? (
              <View style={[styles.stateWrap, { height: pageHeight }]}>
                <ActivityIndicator color={colors.primary as string} />
              </View>
            ) : (
              <View style={[styles.stateWrap, { height: pageHeight }]}>
                <View
                  style={[
                    styles.stateCard,
                    { backgroundColor: colors.blurFallback as string, borderColor: colors.border },
                  ]}
                >
                  <Ionicons name="sparkles" size={32} color={colors.textSecondary as string} />
                  <ThemedText type="smallBold" style={{ color: colors.text, textAlign: 'center' }}>
                    {emptyTitle}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: colors.textSecondary, textAlign: 'center' }}>
                    {emptyDescription}
                  </ThemedText>
                </View>
              </View>
            )
          }
        />
      ) : null}
    </View>
  );
}

function GalleryPage({
  item,
  pageHeight,
  mediaSize,
  busy,
  onAction,
}: {
  item: GeneratedMedia;
  pageHeight: number;
  mediaSize: number;
  busy: GalleryActionKey | null;
  onAction: (key: GalleryActionKey) => void;
}) {
  const colors = useSettingsColors();
  const ready = item.status === 'completed' && !!item.media_url;
  const statusColor =
    item.status === 'completed'
      ? colors.positive
      : item.status === 'failed'
        ? colors.negative
        : colors.primary;

  return (
    <View style={[styles.page, { height: pageHeight }]}>
      <View style={styles.pageContent}>
        <View
          style={[
            styles.card,
            { width: mediaSize, height: mediaSize, backgroundColor: colors.chip, borderColor: colors.border },
          ]}
        >
          {ready ? (
            <Image source={{ uri: item.media_url ?? undefined }} style={styles.media} resizeMode="cover" />
          ) : (
            <View style={styles.mediaPlaceholder}>
              {item.status === 'pending' || item.status === 'processing' ? (
                <ActivityIndicator color={colors.primary as string} />
              ) : (
                <Ionicons name="alert-circle-outline" size={28} color={colors.negative as string} />
              )}
            </View>
          )}
          {item.status !== 'completed' ? (
            <View style={[styles.badge, { backgroundColor: colors.sheetBackground as string, borderColor: colors.border }]}>
              <ThemedText type="small" style={{ color: statusColor, fontWeight: '600' }}>
                {STATUS_LABEL[item.status] ?? item.status}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText
          type="small"
          numberOfLines={3}
          style={[styles.prompt, { color: colors.textSecondary }]}
        >
          {item.prompt || 'Untitled'}
        </ThemedText>

        <AssetActionRow item={item} busy={busy} onAction={onAction} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0 },
  page: { paddingHorizontal: HORIZONTAL_PADDING, justifyContent: 'center' },
  pageContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  media: { width: '100%', height: '100%' },
  mediaPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  prompt: { textAlign: 'center', maxWidth: 420, paddingHorizontal: Spacing.three },
  stateWrap: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: HORIZONTAL_PADDING },
  stateCard: {
    maxWidth: 360,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.two,
    alignItems: 'center',
  },
});
