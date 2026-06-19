import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PIXIO_MODELS } from '@pixio/generation/pixio';
import { Button, Card, Field, Heading, Muted, Screen } from '@/components/ui';
import { useCredits } from '@/lib/hooks';
import { api } from '@/lib/api';
import { colors, spacing } from '@/lib/theme';

/** Image model on mobile — same Krea Flux model as the web dashboard default. */
const model = PIXIO_MODELS.kreaFlux;

export default function GenerateScreen() {
  const { total, loading: creditsLoading, refresh } = useCredits();
  const [prompt, setPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Enter a prompt', 'Describe the image you want to generate.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.generate({
        mode: 'image',
        prompt,
        width: 1024,
        height: 1024,
      });
      if (res.success) {
        setPrompt('');
        Alert.alert('Generating', 'Your image is being created — check the Assets tab.');
        refresh();
      } else {
        Alert.alert('Generation failed', res.error ?? 'Unknown error');
      }
    } catch (e: any) {
      Alert.alert('Generation failed', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Heading>Generate</Heading>
          <View style={styles.creditPill}>
            <Text style={styles.creditText}>
              {creditsLoading ? '—' : total.toLocaleString()} credits
            </Text>
          </View>
        </View>

        <Card>
          <Text style={styles.modelName}>{model.name}</Text>
          <Muted>{model.description}</Muted>
          <View style={{ height: spacing.md }} />
          <Field
            placeholder="A neon-lit street at night, cinematic..."
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            style={styles.promptInput}
            testID="generate-prompt"
          />
          <View style={styles.costRow}>
            <Muted>Cost</Muted>
            <Text style={styles.cost}>{model.creditCost} credits</Text>
          </View>
          <Button
            title="Generate image"
            onPress={onGenerate}
            loading={submitting}
            testID="generate-submit"
          />
        </Card>

        <Pressable>
          <Muted>
            Uses the same {model.name} model as the web app. Open any asset to view, regenerate,
            download, share, or delete.
          </Muted>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  creditPill: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  creditText: { color: colors.primary, fontWeight: '700' },
  modelName: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing.xs },
  promptInput: { minHeight: 110, textAlignVertical: 'top' },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cost: { color: colors.text, fontWeight: '600' },
});
