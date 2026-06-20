import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PIXIO_MODELS, type GenerateParams } from '@pixio/generation';

import { ScreenShell } from '@/components/screen-shell';
import { SettingsHero } from '@/components/settings/settings-hero';
import { SettingsCard } from '@/components/settings/settings-card';
import { SettingsFrostedView } from '@/components/settings/settings-frosted-view';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { Button, Field } from '@/components/primitives';
import { useAuth } from '@/lib/auth';
import { useCredits } from '@/lib/hooks';
import { api } from '@/lib/api';
import { uploadInputImage } from '@/lib/upload';
import { BottomTabInset, Spacing } from '@/constants/theme';

type ModelId = 'krea-flux' | 'qwen-edit' | 'wan-first-last-frame';

const MODELS: { id: ModelId; model: (typeof PIXIO_MODELS)[keyof typeof PIXIO_MODELS] }[] = [
  { id: 'krea-flux', model: PIXIO_MODELS.kreaFlux },
  { id: 'qwen-edit', model: PIXIO_MODELS.qwenEdit },
  { id: 'wan-first-last-frame', model: PIXIO_MODELS.wanFirstLastFrame },
];

export default function GenerateScreen() {
  const colors = useSettingsColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { total, refresh } = useCredits();

  const [selectedId, setSelectedId] = useState<ModelId>('krea-flux');
  const [prompt, setPrompt] = useState('');
  const [negative, setNegative] = useState('');
  const [image1, setImage1] = useState<string | null>(null);
  const [startImg, setStartImg] = useState<string | null>(null);
  const [endImg, setEndImg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selected = useMemo(() => MODELS.find((m) => m.id === selectedId)!, [selectedId]);
  const model = selected.model;

  const pickImage = async (setter: (uri: string) => void) => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
    if (!res.canceled && res.assets?.[0]) setter(res.assets[0].uri);
  };

  const resetInputs = () => {
    setPrompt('');
    setNegative('');
    setImage1(null);
    setStartImg(null);
    setEndImg(null);
  };

  const onGenerate = async () => {
    if (!user) {
      Alert.alert('Not signed in', 'Please sign in again.');
      return;
    }

    // Validate per model
    if (selectedId === 'krea-flux' && !prompt.trim()) {
      Alert.alert('Enter a prompt', 'Describe the image you want to create.');
      return;
    }
    if (selectedId === 'qwen-edit' && !image1) {
      Alert.alert('Add an image', 'Pick an image to edit.');
      return;
    }
    if (selectedId === 'wan-first-last-frame' && (!startImg || !endImg || !prompt.trim())) {
      Alert.alert('Missing inputs', 'Add a start frame, an end frame, and a prompt.');
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
        resetInputs();
        Alert.alert('Generating', 'Your creation is being made — track it in the Assets tab.');
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

  return (
    <ScreenShell>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.four,
          paddingHorizontal: Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          gap: Spacing.three,
        }}
      >
        <SettingsHero
          title="Generate"
          subtitle="Create images and video with Pixio models — your latest work lands in Assets."
          symbol="generate"
        />

        {/* Credit balance */}
        <SettingsFrostedView
          style={[styles.creditBar, { borderColor: colors.border, boxShadow: `0 16px 32px ${colors.shadow}` }]}
        >
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            Available credits
          </ThemedText>
          <ThemedText type="smallBold" style={{ color: colors.primary }}>
            {total.toLocaleString()}
          </ThemedText>
        </SettingsFrostedView>

        {/* Model selector */}
        <SettingsCard title="Model" symbol="generate" tone="primary">
          <View style={styles.modelRow}>
            {MODELS.map(({ id, model: m }) => {
              const active = id === selectedId;
              return (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setSelectedId(id)}
                  style={[
                    styles.modelChip,
                    {
                      backgroundColor: active ? colors.primaryContainer : colors.chip,
                      borderColor: active ? colors.primaryContainer : colors.border,
                    },
                  ]}
                >
                  <ThemedText
                    type="smallBold"
                    style={{ color: active ? colors.onPrimaryContainer : colors.text }}
                  >
                    {m.name}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: active ? colors.onPrimaryContainer : colors.textSecondary }}
                  >
                    {m.creditCost} cr
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            {model.description}
          </ThemedText>
        </SettingsCard>

        {/* Inputs */}
        <SettingsCard title="Inputs" symbol="assets" tone="secondary">
          {selectedId === 'qwen-edit' ? (
            <ImagePickerRow label="Image to edit" uri={image1} onPick={() => pickImage(setImage1)} onClear={() => setImage1(null)} />
          ) : null}
          {selectedId === 'wan-first-last-frame' ? (
            <>
              <ImagePickerRow label="Start frame" uri={startImg} onPick={() => pickImage(setStartImg)} onClear={() => setStartImg(null)} />
              <ImagePickerRow label="End frame" uri={endImg} onPick={() => pickImage(setEndImg)} onClear={() => setEndImg(null)} />
            </>
          ) : null}

          <Field
            placeholder={
              selectedId === 'qwen-edit'
                ? 'Describe the edit (optional)…'
                : 'A neon-lit street at night, cinematic…'
            }
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            style={styles.promptInput}
            testID="generate-prompt"
          />

          {selectedId === 'qwen-edit' ? (
            <Field placeholder="Negative prompt (optional)…" value={negative} onChangeText={setNegative} />
          ) : null}

          <View style={styles.costRow}>
            <ThemedText type="small" style={{ color: colors.textSecondary }}>
              Cost
            </ThemedText>
            <ThemedText type="smallBold" style={{ color: colors.text }}>
              {model.creditCost} credits
            </ThemedText>
          </View>

          <Button
            title={`Generate · ${model.creditCost} credits`}
            onPress={onGenerate}
            loading={submitting}
            testID="generate-submit"
          />
        </SettingsCard>
      </ScrollView>
    </ScreenShell>
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
        <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbEmpty, { borderColor: colors.border }]}>
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            None
          </ThemedText>
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

const styles = StyleSheet.create({
  creditBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  modelRow: { flexDirection: 'row', gap: Spacing.two },
  modelChip: {
    flex: 1,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: 2,
  },
  promptInput: { minHeight: 110, textAlignVertical: 'top' },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerRow: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  thumb: { width: 64, height: 64, borderRadius: 14 },
  thumbEmpty: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
