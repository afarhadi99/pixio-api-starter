import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { SettingsActionButton } from './settings-action-button';
import { SettingsCard } from './settings-card';
import { SETTINGS_SYMBOLS } from './settings.constants';
import { useSettingsColors } from './settings-colors';
import { subscriptionSummaryCardStyles } from './subscription-summary-card.styles';
import type { SubscriptionSummary } from './settings.types';
import { toErrorMessage } from './settings.utils';

type SubscriptionSummaryCardProps = {
  subscription?: SubscriptionSummary;
  isLoading: boolean;
  error?: unknown;
  onManageSubscription: () => void;
};

export function SubscriptionSummaryCard(props: SubscriptionSummaryCardProps) {
  const { subscription, isLoading, error, onManageSubscription } = props;
  const colors = useSettingsColors();

  const headline = subscription?.productName ?? 'Free';
  const accessibilitySummary = [
    headline,
    subscription?.productDescription,
    subscription?.statusText,
    subscription?.intervalText,
    subscription?.renewalText,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <SettingsCard
      eyebrow="Plan"
      title="Subscription"
      symbol={SETTINGS_SYMBOLS.subscription}
      tone="secondary"
      description="Resolved from the same billing config as the web app. Manage your plan any time."
    >
      {isLoading ? (
        <View style={subscriptionSummaryCardStyles.loadingState}>
          <ActivityIndicator color={colors.text} />
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            Loading subscription...
          </ThemedText>
        </View>
      ) : (
        <View
          style={subscriptionSummaryCardStyles.content}
          accessibilityRole="summary"
          accessibilityLabel={accessibilitySummary}
        >
          <View style={subscriptionSummaryCardStyles.summaryBlock}>
            <ThemedText selectable style={[subscriptionSummaryCardStyles.productName, { color: colors.text }]}>
              {headline}
            </ThemedText>

            {subscription?.productDescription ? (
              <ThemedText selectable style={[subscriptionSummaryCardStyles.productDescription, { color: colors.textSecondary }]}>
                {subscription.productDescription}
              </ThemedText>
            ) : null}

            <View style={subscriptionSummaryCardStyles.metaRow}>
              {subscription?.statusText ? <MetaBadge label={subscription.statusText} /> : null}
              {subscription?.intervalText ? <MetaBadge label={subscription.intervalText} /> : null}
            </View>

            {error ? (
              <ThemedText type="small" selectable style={{ color: colors.textSecondary }}>
                {toErrorMessage(error)}
              </ThemedText>
            ) : subscription?.renewalText ? (
              <ThemedText type="small" selectable style={{ color: colors.textSecondary }}>
                {subscription.renewalText}
              </ThemedText>
            ) : null}
          </View>

          <SettingsActionButton
            label="Manage Subscription"
            onPress={onManageSubscription}
            variant="primary"
            symbol={SETTINGS_SYMBOLS.subscription}
          />
        </View>
      )}
    </SettingsCard>
  );
}

function MetaBadge(props: { label: string }) {
  const colors = useSettingsColors();
  return (
    <View style={[subscriptionSummaryCardStyles.badge, { backgroundColor: colors.chip, borderColor: colors.border }]}>
      <ThemedText type="smallBold" selectable style={{ color: colors.text }}>
        {props.label}
      </ThemedText>
    </View>
  );
}
