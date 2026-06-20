import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from 'expo-router/react-navigation';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
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
import { GeneratedGallery } from '@/components/gallery/generated-gallery';
import { Button } from '@/components/primitives';
import {
  useAppBottomMenuState,
  useCompactBottomMenuOnScroll,
} from '@/components/options/app-bottom-menu-state';
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

// How far the feed scrolls before the composer is fully collapsed.
const COLLAPSE_DISTANCE = 120;
// Max height reserved for the collapsible controls (model + buttons + credits).
const EXPANDED_AREA_MAX = 132;

export default function GenerateScreen() {
  const colors = useSettingsColors();
  const insets = useSafeAreaInsets();
  const iosGlass = Platform.OS === 'ios' && useIosGlassEligible();

  const { user } = useAuth();
  const { total, refresh: refreshCredits } = useCredits();
  const { media, loading, refresh } = useMedia();

  const [selectedId, setSelectedId] = useState<ModelId>('krea-flux');
  const [prompt, setPrompt] = useState('');
  const [negative, setNegative] = useState('');
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [image3, setImage3] = useState<string | null>(null);
  const [startImg, setStartImg] = useState<string | null>(null);
  const [endImg, setEndImg] = useState<string | null>(null);
  // Krea Flux dimensions
  const [width, setWidth] = useState('1024');
  const [height, setHeight] = useState('1024');
  // Wan video dimensions
  const [vWidth, setVWidth] = useState('512');
  const [vHeight, setVHeight] = useState('512');
  const [vLength, setVLength] = useState('81');
  const [submitting, setSubmitting] = useState(false);
  const [modelPickerVisible, setModelPickerVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [promptBarHeight, setPromptBarHeight] = useState(52);

  // Reanimated scroll position drives both the bottom-bar compact state and the
  // composer collapse — the prompt field always stays visible (Pixio behaviour).
  const isFocused = useIsFocused();
  const scrollY = useSharedValue(0);
  useCompactBottomMenuOnScroll(scrollY, isFocused);
  const { compact } = useAppBottomMenuState();

  const selected = useMemo(() => MODELS.find((m) => m.id === selectedId)!, [selectedId]);
  const model = selected.model;

  const expandedAreaStyle = useAnimatedStyle(() => {
    const p = Math.min(Math.max(scrollY.value / COLLAPSE_DISTANCE, 0), 1);
    return {
      opacity: interpolate(p, [0, 0.6], [1, 0], Extrapolation.CLAMP),
      maxHeight: interpolate(p, [0, 1], [EXPANDED_AREA_MAX, 0], Extrapolation.CLAMP),
      transform: [{ translateY: interpolate(p, [0, 1], [0, -8], Extrapolation.CLAMP) }],
    };
  });

  const promptPadStyle = useAnimatedStyle(() => {
    const p = Math.min(Math.max(scrollY.value / COLLAPSE_DISTANCE, 0), 1);
    return { paddingRight: interpolate(p, [0, 1], [0, 92], Extrapolation.CLAMP) };
  });

  const collapsedIconsStyle = useAnimatedStyle(() => {
    const p = Math.min(Math.max(scrollY.value / COLLAPSE_DISTANCE, 0), 1);
    return {
      opacity: interpolate(p, [0.55, 1], [0, 1], Extrapolation.CLAMP),
      transform: [{ scale: interpolate(p, [0.38, 0.85], [0.6, 1], Extrapolation.CLAMP) }],
    };
  });

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
        params = {
          mode: 'image',
          prompt,
          width: parseInt(width, 10) || 1024,
          height: parseInt(height, 10) || 1024,
        };
      } else if (selectedId === 'qwen-edit') {
        const [url1, url2, url3] = await Promise.all([
          uploadInputImage(user.id, image1!, 'image1'),
          image2 ? uploadInputImage(user.id, image2, 'image1') : Promise.resolve(null),
          image3 ? uploadInputImage(user.id, image3, 'image1') : Promise.resolve(null),
        ]);
        params = {
          mode: 'video',
          image1Url: url1,
          image2Url: url2,
          image3Url: url3,
          positivePrompt: prompt,
          negativePrompt: negative,
        };
      } else {
        const [s, e] = await Promise.all([
          uploadInputImage(user.id, startImg!, 'start'),
          uploadInputImage(user.id, endImg!, 'end'),
        ]);
        params = {
          mode: 'firstLastFrameVideo',
          prompt,
          startImageUrl: s,
          endImageUrl: e,
          videoWidth: parseInt(vWidth, 10) || 512,
          videoHeight: parseInt(vHeight, 10) || 512,
          videoLength: parseInt(vLength, 10) || 81,
        };
      }
      const res = await api.generate(params);
      if (res.success) {
        setPrompt('');
        setNegative('');
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setStartImg(null);
        setEndImg(null);
        refreshCredits();
        refresh();
      } else {
        Alert.alert('Generation failed', res.error ?? 'Unknown error');
      }
    } catch (e: unknown) {
      Alert.alert('Generation failed', e instanceof Error ? e.message : 'Unexpected error');
    } finally {
      setSubmitting(false);
    }
  };

  const onRegenerate = (item: GeneratedMedia) => {
    if (item.prompt) setPrompt(item.prompt);
    Alert.alert('Prompt loaded', 'The prompt was added to the composer. Tap Generate to create a new version.');
  };

  const accentColor = colors.primary as string;
  const contentTopPadding = insets.top + Spacing.two + promptBarHeight + Spacing.two;

  return (
    <ScreenShell>
      <GeneratedGallery
        media={media}
        loading={loading}
        refresh={refresh}
        contentTopPadding={contentTopPadding}
        bottomInset={insets.bottom + AppBottomMenuInset}
        scrollY={scrollY}
        onRegenerate={onRegenerate}
        emptyTitle="Nothing here yet"
        emptyDescription="Pick a model, write a prompt, and tap Generate."
      />

      {/* Floating composer — prompt stays visible; the rest collapses on scroll */}
      <View pointerEvents="box-none" style={[styles.composer, { paddingTop: insets.top + Spacing.two }]}>
        <View
          style={styles.topRow}
          onLayout={(e: LayoutChangeEvent) => setPromptBarHeight(Math.round(e.nativeEvent.layout.height))}
        >
          <SettingsFrostedView style={[styles.promptBar, { borderColor: colors.border }]}>
            <Animated.View style={[styles.promptInner, promptPadStyle]}>
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
            </Animated.View>
          </SettingsFrostedView>

          {/* Collapsed-state controls: small Generate + options icons */}
          <Animated.View
            pointerEvents={compact ? 'auto' : 'none'}
            style={[styles.collapsedIcons, collapsedIconsStyle]}
          >
            <SmallIconButton
              icon="options-outline"
              onPress={() => setOptionsVisible(true)}
              iosGlass={iosGlass}
            />
            <SmallGenerateButton accent={accentColor} disabled={submitting} onPress={onGenerate} />
          </Animated.View>
        </View>

        <Animated.View
          pointerEvents={compact ? 'none' : 'auto'}
          style={[styles.expandedArea, expandedAreaStyle]}
        >
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

          <ThemedText type="small" style={{ color: colors.textSecondary, marginTop: Spacing.one }}>
            {model.creditCost} credits · {total.toLocaleString()} available
          </ThemedText>
        </Animated.View>
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
          <View style={styles.numberRow}>
            <LabeledNumber label="Width" value={width} onChangeText={setWidth} />
            <LabeledNumber label="Height" value={height} onChangeText={setHeight} />
          </View>
        ) : null}
        {selectedId === 'qwen-edit' ? (
          <>
            <ImagePickerRow label="Primary image" uri={image1} onPick={() => pickImage(setImage1)} onClear={() => setImage1(null)} />
            <ImagePickerRow label="Reference image 2 (optional)" uri={image2} onPick={() => pickImage(setImage2)} onClear={() => setImage2(null)} />
            <ImagePickerRow label="Reference image 3 (optional)" uri={image3} onPick={() => pickImage(setImage3)} onClear={() => setImage3(null)} />
            <FieldLabel>Negative prompt (optional)</FieldLabel>
            <FrostedField placeholder="What to avoid…" value={negative} onChangeText={setNegative} />
          </>
        ) : null}
        {selectedId === 'wan-first-last-frame' ? (
          <>
            <ImagePickerRow label="Start frame" uri={startImg} onPick={() => pickImage(setStartImg)} onClear={() => setStartImg(null)} />
            <ImagePickerRow label="End frame" uri={endImg} onPick={() => pickImage(setEndImg)} onClear={() => setEndImg(null)} />
            <View style={styles.numberRow}>
              <LabeledNumber label="Width" value={vWidth} onChangeText={setVWidth} />
              <LabeledNumber label="Height" value={vHeight} onChangeText={setVHeight} />
              <LabeledNumber label="Frames" value={vLength} onChangeText={setVLength} />
            </View>
          </>
        ) : null}
      </BottomSheet>
    </ScreenShell>
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

function SmallIconButton({
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
    <TouchableOpacity activeOpacity={iosGlass ? 1 : 0.85} onPress={onPress}>
      {iosGlass ? (
        <IosGlassSurface isInteractive glassEffectStyle="clear" fallbackBackgroundColor={colors.chip} style={styles.smallButton}>
          <Ionicons name={icon} size={18} color={colors.text as string} />
        </IosGlassSurface>
      ) : (
        <View style={[styles.smallButton, { backgroundColor: colors.chip, borderColor: colors.border, borderWidth: 1 }]}>
          <Ionicons name={icon} size={18} color={colors.text as string} />
        </View>
      )}
    </TouchableOpacity>
  );
}

function SmallGenerateButton({
  accent,
  disabled,
  onPress,
}: {
  accent: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Generate"
      testID="generate-submit-compact"
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.smallButton, { backgroundColor: accent, opacity: disabled ? 0.6 : 1 }]}
    >
      <Ionicons name="sparkles" size={18} color="#fff" />
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
        <Image source={{ uri }} style={styles.pickerThumb} resizeMode="cover" />
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  const colors = useSettingsColors();
  return (
    <ThemedText type="smallBold" style={{ color: colors.text }}>
      {children}
    </ThemedText>
  );
}

function LabeledNumber({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  const colors = useSettingsColors();
  return (
    <View style={{ flex: 1, gap: Spacing.one }}>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        style={[
          styles.field,
          { backgroundColor: colors.chip, borderColor: colors.border, color: colors.text as string, minHeight: 48 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  composer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, paddingHorizontal: Spacing.three },
  topRow: { position: 'relative', justifyContent: 'center' },
  promptBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  promptInner: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  promptInput: { flex: 1, fontSize: 16, lineHeight: 22, maxHeight: 96, paddingTop: 0 },
  collapsedIcons: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingRight: Spacing.one,
  },
  expandedArea: { overflow: 'hidden' },
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
  smallButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
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
  numberRow: { flexDirection: 'row', gap: Spacing.two },
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
