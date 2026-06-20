import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PIXIO_MODELS, type GenerateParams, type PixioModel } from '@pixio/generation';
import type { GeneratedMedia } from '@pixio/database/types';

import { ScreenShell } from '@/components/screen-shell';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { SettingsFrostedView } from '@/components/settings/settings-frosted-view';
import { ThemedText } from '@/components/themed-text';
import { IosGlassSurface, useIosGlassEligible } from '@/components/ui/ios-glass-surface';
import { ModelSelectorTrigger } from '@/components/generation/model-selector-trigger';
import { ModelPickerSheet } from '@/components/generation/model-picker-sheet';
import { BottomSheet } from '@/components/generation/bottom-sheet';
import { Button } from '@/components/primitives';
import { useAuth } from '@/lib/auth';
import { useCredits, useMedia } from '@/lib/hooks';
import { api } from '@/lib/api';
import { uploadInputImage } from '@/lib/upload';
import { AppBottomMenuInset, Spacing } from '@/constants/theme';

type ModelId = 'krea-flux' | 'qwen-edit' | 'wan-first-last-frame';

const MODELS: { id: ModelId; model: PixioModel }[] = [
  { id: 'krea-flux', model: PIXIO_MODELS.kreaFlux },
  { id: 'qwen-edit', model: PIXIO_MODELS.qwenEdit },
  { id: 'wan-first-last-frame', model: PIXIO_MODELS.wanFirstLastFrame },
];

export default function GenerateScreen() {
  const colors = useSettingsColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const iosGlass = Platform.OS === 'ios' && useIosGlassEligible();

  const { user } = useAuth();
  const { total, refresh: refreshCredits } = useCredits();
  const { media, loading, refresh } = useMedia();

  const [selectedId, setSelectedId] = useState<ModelId>('krea-flux');
  const [prompt, setPrompt] = useState('');
  const [negative, setNegative] = useState('');
  const [image1, setImage1] = useState<string | null>(null);
  const [startImg, setStartImg] = useState<string | null>(null);
  const [endImg, setEndImg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modelPickerVisible, setModelPickerVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [composerHeight, setComposerHeight] = useState(150);

  const selected = useMemo(() => MODELS.find((m) => m.id === selectedId)!, [selectedId]);
  const model = selected.model;

  const pickImage = async (setter: (uri: string) => void) => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
    if (!res.canceled && res.assets?.[0]) setter(res.assets[0].uri);
  };

  const onGenerate = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in again.');
      return;
    }
    if (selectedId === 'krea-flux' && !prompt.trim()) {
      Alert.alert('Enter a prompt', 'Describe the image you want to create.');
      return;
    }
    if (selectedId === 'qwen-edit' && !image1) {
      setOptionsVisible(true);
      Alert.alert('Add an image', 'Pick an image to edit in the options panel.');
      return;
    }
    if (selectedId === 'wan-first-last-frame' && (!startImg || !endImg || !prompt.trim())) {
      setOptionsVisible(true);
      Alert.alert('Missing inputs', 'Add a start frame, end frame, and a prompt.');
      return;
    }

    setSubmitting(true);
    try {
      let params: GenerateParams;
      if (selectedId === 'krea-flux') {
        params = { mode: 'image', prompt, width: 1024, height: 1024 };
      } else if (selectedId === 'qwen-edit') {
        const url = await uploadInputImage(user.id, image1!, 'image1');
        params = { mode: 'video', image1Url: url, positivePrompt: prompt, negativePrompt: negative };
      } else {
        const [s, e] = await Promise.all([
          uploadInputImage(user.id, startImg!, 'start'),
          uploadInputImage(user.id, endImg!, 'end'),
        ]);
        params = { mode: 'firstLastFrameVideo', prompt, startImageUrl: s, endImageUrl: e };
      }
      const res = await api.generate(params);
      if (res.success) {
        setPrompt('');
        setNegative('');
        setImage1(null);
        setStartImg(null);
        setEndImg(null);
        refreshCredits();
        refresh();
      } else {
        Alert.alert('Generation failed', res.error ?? 'Unknown error');
      }
    } catch (e: any) {
      Alert.alert('Generation failed', e.message ?? 'Unexpected error');
    } finally {
      setSubmitting(false);
    }
  };

  const accentColor = colors.primary as string;

  return (
    <ScreenShell>
      {/* Feed of generations */}
      <FlatList
        data={media}
        keyExtractor={(m) => m.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: composerHeight + Spacing.three,
          paddingBottom: insets.bottom + AppBottomMenuInset + Spacing.four,
          paddingHorizontal: Spacing.two,
        }}
        onRefresh={refresh}
        refreshing={loading}
        renderItem={({ item }) => (
          <MediaTile item={item} onPress={() => router.push(`/media/${item.id}`)} />
        )}
        ListEmptyComponent={
          loading ? null : (
            <Animated.View entering={FadeIn} style={styles.empty}>
              <Ionicons name="sparkles" size={40} color={colors.textSecondary as string} />
              <ThemedText type="smallBold" style={{ color: colors.text, marginTop: Spacing.two }}>
                Nothing here yet
              </ThemedText>
              <ThemedText type="small" style={{ color: colors.textSecondary, textAlign: 'center' }}>
                Pick a model, write a prompt, and tap Generate.
              </ThemedText>
            </Animated.View>
          )
        }
      />

      {/* Floating composer */}
      <View
        pointerEvents="box-none"
        style={[styles.composer, { paddingTop: insets.top + Spacing.two }]}
        onLayout={(e) => setComposerHeight(e.nativeEvent.layout.height)}
      >
        {/* Prompt bar */}
        <SettingsFrostedView style={[styles.promptBar, { borderColor: colors.border }]}>
          <Ionicons name="create-outline" size={18} color={colors.textSecondary as string} />
          <TextInput
            style={[styles.promptInput, { color: colors.text as string }]}
            placeholder={selectedId === 'qwen-edit' ? 'Describe the edit…' : 'Describe what to create…'}
            placeholderTextColor={colors.textSecondary as string}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            testID="generate-prompt"
          />
          {prompt.length > 0 ? (
            <TouchableOpacity onPress={() => setPrompt('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary as string} />
            </TouchableOpacity>
          ) : null}
        </SettingsFrostedView>

        {/* Controls row */}
        <View style={styles.controlsRow}>
          <View style={{ flex: 1 }}>
            <ModelSelectorTrigger
              modelName={model.name}
              estimatedCredits={model.creditCost}
              onPress={() => setModelPickerVisible(true)}
            />
          </View>

          <GlassIconButton icon="options-outline" onPress={() => setOptionsVisible(true)} iosGlass={iosGlass} />

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Generate"
            testID="generate-submit"
            disabled={submitting}
            onPress={onGenerate}
            activeOpacity={0.85}
            style={[styles.generateBtn, { backgroundColor: accentColor, opacity: submitting ? 0.7 : 1 }]}
          >
            <Ionicons name="sparkles" size={18} color="#fff" />
            <ThemedText type="smallBold" style={{ color: '#fff' }}>
              {submitting ? 'Generating…' : 'Generate'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Credit hint */}
        <ThemedText type="small" style={{ color: colors.textSecondary, marginTop: Spacing.one }}>
          {model.creditCost} credits · {total.toLocaleString()} available
        </ThemedText>
      </View>

      <ModelPickerSheet
        visible={modelPickerVisible}
        models={MODELS}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id as ModelId)}
        onClose={() => setModelPickerVisible(false)}
      />

      <BottomSheet visible={optionsVisible} title={`${model.name} options`} onClose={() => setOptionsVisible(false)}>
        {selectedId === 'krea-flux' ? (
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            Krea Flux generates from your prompt — no extra inputs needed.
          </ThemedText>
        ) : null}
        {selectedId === 'qwen-edit' ? (
          <>
            <ImagePickerRow label="Image to edit" uri={image1} onPick={() => pickImage(setImage1)} onClear={() => setImage1(null)} />
            <FrostedField placeholder="Negative prompt (optional)…" value={negative} onChangeText={setNegative} />
          </>
        ) : null}
        {selectedId === 'wan-first-last-frame' ? (
          <>
            <ImagePickerRow label="Start frame" uri={startImg} onPick={() => pickImage(setStartImg)} onClear={() => setStartImg(null)} />
            <ImagePickerRow label="End frame" uri={endImg} onPick={() => pickImage(setEndImg)} onClear={() => setEndImg(null)} />
          </>
        ) : null}
      </BottomSheet>
    </ScreenShell>
  );
}

function MediaTile({ item, onPress }: { item: GeneratedMedia; onPress: () => void }) {
  const colors = useSettingsColors();
  const ready = item.media_url && item.status === 'completed';
  const statusColor =
    item.status === 'completed' ? colors.positive : item.status === 'failed' ? colors.negative : colors.primary;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.tile} testID={`asset-tile-${item.id}`}>
      <SettingsFrostedView style={[styles.tileSurface, { borderColor: colors.border }]}>
        {ready ? (
          <Image source={{ uri: item.media_url }} style={styles.tileImage} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.tileImage, styles.tilePlaceholder, { backgroundColor: colors.chip }]}>
            <ThemedText type="smallBold" style={{ color: statusColor, textTransform: 'capitalize' }}>
              {item.status}
            </ThemedText>
          </View>
        )}
        <ThemedText type="small" numberOfLines={1} style={{ color: colors.textSecondary, marginTop: Spacing.one }}>
          {item.prompt || 'Untitled'}
        </ThemedText>
      </SettingsFrostedView>
    </Pressable>
  );
}

function GlassIconButton({
  icon,
  onPress,
  iosGlass,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  iosGlass: boolean;
}) {
  const colors = useSettingsColors();
  return (
    <TouchableOpacity activeOpacity={iosGlass ? 1 : 0.85} onPress={onPress} style={styles.gearButton}>
      {iosGlass ? (
        <IosGlassSurface isInteractive glassEffectStyle="clear" fallbackBackgroundColor={colors.chip} style={styles.gearInner}>
          <Ionicons name={icon} size={20} color={colors.text as string} />
        </IosGlassSurface>
      ) : (
        <View style={[styles.gearInner, { backgroundColor: colors.chip, borderColor: colors.border, borderWidth: 1 }]}>
          <Ionicons name={icon} size={20} color={colors.text as string} />
        </View>
      )}
    </TouchableOpacity>
  );
}

function ImagePickerRow({
  label,
  uri,
  onPick,
  onClear,
}: {
  label: string;
  uri: string | null;
  onPick: () => void;
  onClear: () => void;
}) {
  const colors = useSettingsColors();
  return (
    <View style={styles.pickerRow}>
      {uri ? (
        <Image source={{ uri }} style={styles.pickerThumb} contentFit="cover" />
      ) : (
        <View style={[styles.pickerThumb, styles.pickerThumbEmpty, { borderColor: colors.border }]}>
          <Ionicons name="image-outline" size={20} color={colors.textSecondary as string} />
        </View>
      )}
      <View style={{ flex: 1, gap: Spacing.one }}>
        <ThemedText type="smallBold" style={{ color: colors.text }}>
          {label}
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          <Button title={uri ? 'Change' : 'Pick image'} variant="ghost" onPress={onPick} />
          {uri ? <Button title="Remove" variant="ghost" onPress={onClear} /> : null}
        </View>
      </View>
    </View>
  );
}

function FrostedField(props: React.ComponentProps<typeof TextInput>) {
  const colors = useSettingsColors();
  return (
    <TextInput
      placeholderTextColor={colors.textSecondary as string}
      style={[styles.field, { backgroundColor: colors.chip, borderColor: colors.border, color: colors.text as string }]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  composer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, paddingHorizontal: Spacing.three },
  promptBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 52,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  promptInput: { flex: 1, fontSize: 16, lineHeight: 22, maxHeight: 96, paddingTop: 0 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.two },
  gearButton: { width: 48, height: 48 },
  gearInner: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    height: 48,
    paddingHorizontal: Spacing.three,
    borderRadius: 14,
    borderCurve: 'continuous',
  },
  empty: { alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 80, paddingHorizontal: Spacing.four },
  tile: { flex: 1, padding: Spacing.one },
  tileSurface: { borderRadius: 18, borderCurve: 'continuous', borderWidth: 1, padding: Spacing.two },
  tileImage: { width: '100%', aspectRatio: 1, borderRadius: 12 },
  tilePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  pickerRow: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  pickerThumb: { width: 64, height: 64, borderRadius: 14 },
  pickerThumbEmpty: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  field: {
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: Spacing.three,
    fontSize: 16,
    minHeight: 52,
  },
});
