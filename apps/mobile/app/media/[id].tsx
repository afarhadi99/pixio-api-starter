import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { GeneratedMedia } from '@pixio/database/types';

import { ScreenShell } from '@/components/screen-shell';
import { SettingsFrostedView } from '@/components/settings/settings-frosted-view';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/primitives';
import { api } from '@/lib/api';
import { buildRegenerateParams } from '@/lib/regenerate';
import { downloadMediaToCache, shareMediaUrl } from '@/lib/media-actions';
import { supabase } from '@/lib/supabase';
import { Spacing } from '@/constants/theme';

export default function MediaDetailScreen() {
  const colors = useSettingsColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [media, setMedia] = useState<GeneratedMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await supabase.from('generated_media').select('*').eq('id', id).single();
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
      <ScreenShell>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </ScreenShell>
    );
  }

  const canActOnMedia = media.status === 'completed' && !!media.media_url;

  return (
    <ScreenShell>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.three,
          paddingHorizontal: Spacing.three,
          paddingBottom: insets.bottom + Spacing.five,
          gap: Spacing.three,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <ThemedText type="default" style={{ color: colors.text }}>
            Back
          </ThemedText>
        </Pressable>

        <ThemedText type="subtitle" style={{ color: colors.text }}>
          {media.status === 'completed' ? 'Your generation' : 'Generation'}
        </ThemedText>
        <ThemedText type="small" numberOfLines={3} style={{ color: colors.textSecondary }}>
          {media.prompt}
        </ThemedText>

        <SettingsFrostedView style={[styles.preview, { borderColor: colors.border }]}>
          {canActOnMedia ? (
            <Pressable accessibilityRole="imagebutton" onPress={handleView} testID="media-view">
              <Image source={{ uri: media.media_url }} style={styles.image} resizeMode="contain" />
            </Pressable>
          ) : (
            <View style={[styles.image, styles.placeholder, { backgroundColor: colors.chip }]}>
              <ThemedText type="smallBold" style={{ color: colors.textSecondary, textTransform: 'capitalize' }}>
                {media.status}
              </ThemedText>
            </View>
          )}
        </SettingsFrostedView>

        <View style={styles.actions}>
          <ActionChip icon="eye-outline" label="View" disabled={!canActOnMedia || !!busy} onPress={handleView} testID="media-action-view" />
          <ActionChip icon="refresh-outline" label="Regenerate" disabled={!!busy} loading={busy === 'regenerate'} onPress={handleRegenerate} testID="media-action-regenerate" />
          <ActionChip icon="download-outline" label="Download" disabled={!canActOnMedia || !!busy} loading={busy === 'download'} onPress={handleDownload} testID="media-action-download" />
          <ActionChip icon="share-outline" label="Share" disabled={!canActOnMedia || !!busy} loading={busy === 'share'} onPress={handleShare} testID="media-action-share" />
          <ActionChip icon="trash-outline" label="Delete" disabled={!!busy} loading={busy === 'delete'} onPress={handleDelete} testID="media-action-delete" danger />
        </View>

        <Button title="Close" variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </ScreenShell>
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
  const colors = useSettingsColors();
  const tint = danger ? colors.negative : colors.primary;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, (pressed || disabled || loading) && { opacity: 0.55 }]}
    >
      <SettingsFrostedView style={[styles.chipInner, { borderColor: colors.border }]}>
        {loading ? (
          <ActivityIndicator color={tint} size="small" />
        ) : (
          <Ionicons name={icon} size={20} color={tint} />
        )}
        <ThemedText type="small" style={{ color: danger ? colors.negative : colors.text }}>
          {label}
        </ThemedText>
      </SettingsFrostedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  preview: { borderRadius: 24, borderCurve: 'continuous', borderWidth: 1, padding: Spacing.two, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 1, borderRadius: 16 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { width: '31%', minWidth: 96 },
  chipInner: {
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    gap: Spacing.one,
  },
});
