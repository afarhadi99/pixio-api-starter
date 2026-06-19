import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { GeneratedMedia } from '@pixio/database/types';
import { Heading, Muted, Screen } from '@/components/ui';
import { Surface } from '@/components/surface';
import { useMedia } from '@/lib/hooks';
import { colors, spacing } from '@/lib/theme';

const statusColor: Record<string, string> = {
  completed: colors.success,
  failed: colors.danger,
  processing: colors.primary,
  pending: colors.textMuted,
};

function MediaTile({ item, onPress }: { item: GeneratedMedia; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.prompt}`}
      onPress={onPress}
      style={styles.tile}
      testID={`asset-tile-${item.id}`}
    >
      <Surface variant="card" style={styles.tileSurface}>
        {item.media_url && item.status === 'completed' ? (
          <Image source={{ uri: item.media_url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={[styles.status, { color: statusColor[item.status] ?? colors.textMuted }]}>
              {item.status}
            </Text>
          </View>
        )}
        <Text numberOfLines={1} style={styles.caption}>
          {item.prompt}
        </Text>
      </Surface>
    </Pressable>
  );
}

export default function AssetsScreen() {
  const { media, loading, refresh } = useMedia();
  const router = useRouter();

  return (
    <Screen>
      <Heading>Assets</Heading>
      <FlatList
        data={media}
        keyExtractor={(m) => m.id}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.md }}
        contentContainerStyle={{ gap: spacing.md, paddingVertical: spacing.md }}
        renderItem={({ item }) => (
          <MediaTile item={item} onPress={() => router.push(`/media/${item.id}`)} />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          loading ? null : <Muted>No generations yet. Create one from the Generate tab.</Muted>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1 },
  tileSurface: { padding: spacing.sm },
  image: { width: '100%', aspectRatio: 1, borderRadius: 8 },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  status: { fontWeight: '700', textTransform: 'capitalize' },
  caption: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
});
