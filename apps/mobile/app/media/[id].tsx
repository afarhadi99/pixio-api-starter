import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { GeneratedMedia } from '@pixio/database/types';
import { Button, Heading, Muted, Screen } from '@/components/ui';
import { Surface } from '@/components/surface';
import { api } from '@/lib/api';
import { buildRegenerateParams } from '@/lib/regenerate';
import { downloadMediaToCache, shareMediaUrl } from '@/lib/media-actions';
import { supabase } from '@/lib/supabase';
import { colors, spacing } from '@/lib/theme';

export default function MediaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [media, setMedia] = useState<GeneratedMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('generated_media')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      Alert.alert('Not found', 'This generation could not be loaded.');
      router.back();
      return;
    }
    setMedia(data);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRegenerate = async () => {
    if (!media) return;
    const params = buildRegenerateParams(media);
    if (!params) {
      Alert.alert('Cannot regenerate', 'Missing metadata for this generation mode.');
      return;
    }
    setBusy('regenerate');
    try {
      const res = await api.generate(params);
      if (res.success) {
        Alert.alert('Regenerating', 'A new generation has been queued.');
        router.back();
      } else {
        Alert.alert('Failed', res.error ?? 'Could not regenerate');
      }
    } catch (e: any) {
      Alert.alert('Failed', e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleDownload = async () => {
    if (!media?.media_url) return;
    setBusy('download');
    try {
      const uri = await downloadMediaToCache(media.media_url, media.media_type);
      Alert.alert('Saved to cache', uri);
    } catch (e: any) {
      Alert.alert('Download failed', e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    if (!media?.media_url) return;
    setBusy('share');
    try {
      await shareMediaUrl(media.media_url, media.media_type);
    } catch (e: any) {
      Alert.alert('Share failed', e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = () => {
    if (!media) return;
    Alert.alert('Delete generation', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setBusy('delete');
          try {
            await api.deleteMedia(media.id);
            router.back();
          } catch (e: any) {
            Alert.alert('Delete failed', e.message);
          } finally {
            setBusy(null);
          }
        },
      },
    ]);
  };

  const handleView = () => {
    if (media?.media_url) Linking.openURL(media.media_url);
  };

  if (loading || !media) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} size="large" />
      </Screen>
    );
  }

  const canActOnMedia = media.status === 'completed' && !!media.media_url;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Heading>{media.status === 'completed' ? 'Your generation' : 'Generation'}</Heading>
        <Muted numberOfLines={3}>{media.prompt}</Muted>
        <View style={{ height: spacing.md }} />

        <Surface variant="card" style={styles.preview}>
          {canActOnMedia ? (
            <Pressable accessibilityRole="imagebutton" onPress={handleView} testID="media-view">
              <Image source={{ uri: media.media_url! }} style={styles.image} resizeMode="contain" />
            </Pressable>
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.status}>{media.status}</Text>
            </View>
          )}
        </Surface>

        <View style={styles.actions}>
          <ActionChip
            icon="eye-outline"
            label="View"
            disabled={!canActOnMedia || !!busy}
            onPress={handleView}
            testID="media-action-view"
          />
          <ActionChip
            icon="refresh-outline"
            label="Regenerate"
            disabled={!!busy}
            loading={busy === 'regenerate'}
            onPress={handleRegenerate}
            testID="media-action-regenerate"
          />
          <ActionChip
            icon="download-outline"
            label="Download"
            disabled={!canActOnMedia || !!busy}
            loading={busy === 'download'}
            onPress={handleDownload}
            testID="media-action-download"
          />
          <ActionChip
            icon="share-outline"
            label="Share"
            disabled={!canActOnMedia || !!busy}
            loading={busy === 'share'}
            onPress={handleShare}
            testID="media-action-share"
          />
          <ActionChip
            icon="trash-outline"
            label="Delete"
            disabled={!!busy}
            loading={busy === 'delete'}
            onPress={handleDelete}
            testID="media-action-delete"
            danger
          />
        </View>

        <Button title="Close" variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </Screen>
  );
}

function ActionChip({
  icon,
  label,
  onPress,
  disabled,
  loading,
  testID,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  danger?: boolean;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        pressed && styles.chipPressed,
        (disabled || loading) && styles.chipDisabled,
      ]}
    >
      <Surface variant="pill" style={styles.chipInner}>
        {loading ? (
          <ActivityIndicator color={danger ? colors.danger : colors.primary} size="small" />
        ) : (
          <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.primary} />
        )}
        <Text style={[styles.chipLabel, danger && { color: colors.danger }]}>{label}</Text>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  backText: { color: colors.text, fontSize: 16, marginLeft: 4 },
  preview: { padding: spacing.sm, marginBottom: spacing.md },
  image: { width: '100%', aspectRatio: 1, borderRadius: 8 },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card },
  status: { color: colors.textMuted, fontWeight: '700', textTransform: 'capitalize' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: { width: '30%', minWidth: 96 },
  chipInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    gap: spacing.xs,
  },
  chipLabel: { color: colors.text, fontSize: 12, fontWeight: '600' },
  chipPressed: { opacity: 0.85 },
  chipDisabled: { opacity: 0.45 },
});
