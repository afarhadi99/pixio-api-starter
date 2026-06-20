import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { SettingsActionButton } from './settings-action-button';
import { SettingsCard } from './settings-card';
import { SETTINGS_SYMBOLS, type SettingsSymbolName } from './settings.constants';
import { useSettingsColors } from './settings-colors';
import { SettingsSymbolBadge } from './settings-symbol-badge';
import { creditsBalanceCardStyles } from './credits-balance-card.styles';
import type { CreditsBalanceSummary } from './settings.types';
import { formatCreditsValue, getCreditsResetText, toErrorMessage } from './settings.utils';

type CreditsBalanceCardProps = {
  balance?: CreditsBalanceSummary;
  isLoading: boolean;
  error?: unknown;
  onBuyMore: () => void;
  onShowLedger: () => void;
};

export function CreditsBalanceCard(props: CreditsBalanceCardProps) {
  const { balance, isLoading, error, onBuyMore, onShowLedger } = props;
  const colors = useSettingsColors();
  const helperText = getCreditsResetText(balance);

  return (
    <SettingsCard
      eyebrow="Billing"
      title="Credits"
      symbol={SETTINGS_SYMBOLS.billing}
      tone="primary"
      description="See what you have left, buy more credits, or open your full credits history."
    >
      {isLoading ? (
        <View style={creditsBalanceCardStyles.loadingState}>
          <ActivityIndicator color={colors.text} />
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            Loading credits...
          </ThemedText>
        </View>
      ) : (
        <View style={creditsBalanceCardStyles.content}>
          <View style={creditsBalanceCardStyles.balanceBlock}>
            <View style={creditsBalanceCardStyles.balanceLabelRow}>
              <SettingsSymbolBadge
                name={SETTINGS_SYMBOLS.billing}
                size={14}
                tintColor={colors.primary}
                backgroundColor={colors.chip}
              />
              <ThemedText type="small" style={{ color: colors.textSecondary }}>
                Available now
              </ThemedText>
            </View>
            <ThemedText selectable style={[creditsBalanceCardStyles.value, { color: colors.text }]}>
              {formatCreditsValue(balance?.total ?? 0)}
            </ThemedText>
            {error ? (
              <ThemedText type="small" selectable style={{ color: colors.textSecondary }}>
                {toErrorMessage(error)}
              </ThemedText>
            ) : helperText ? (
              <ThemedText type="small" selectable style={{ color: colors.textSecondary }}>
                {helperText}
              </ThemedText>
            ) : null}
          </View>

          <View style={creditsBalanceCardStyles.statsRow}>
            <StatChip label="Monthly" value={formatCreditsValue(balance?.recurringCurrent ?? 0)} symbol={SETTINGS_SYMBOLS.monthly} />
            <StatChip label="Monthly cap" value={formatCreditsValue(balance?.recurringQuota ?? 0)} symbol={SETTINGS_SYMBOLS.cap} />
            <StatChip label="Permanent" value={formatCreditsValue(balance?.permanent ?? 0)} symbol={SETTINGS_SYMBOLS.permanent} />
          </View>

          <View style={creditsBalanceCardStyles.buttonRow}>
            <View style={creditsBalanceCardStyles.buttonItem}>
              <SettingsActionButton label="Buy More" onPress={onBuyMore} variant="primary" symbol={SETTINGS_SYMBOLS.buyMore} />
            </View>
            <View style={creditsBalanceCardStyles.buttonItem}>
              <SettingsActionButton label="View Ledger" onPress={onShowLedger} symbol={SETTINGS_SYMBOLS.ledger} />
            </View>
          </View>
        </View>
      )}
    </SettingsCard>
  );
}

function StatChip(props: { label: string; value: string; symbol: SettingsSymbolName }) {
  const colors = useSettingsColors();

  return (
    <View style={[creditsBalanceCardStyles.statChip, { backgroundColor: colors.chip, borderColor: colors.border }]}>
      <View style={creditsBalanceCardStyles.statHeader}>
        <SettingsSymbolBadge name={props.symbol} size={13} tintColor={colors.text} backgroundColor={colors.surface} />
        <ThemedText type="small" style={{ color: colors.textSecondary }}>
          {props.label}
        </ThemedText>
      </View>
      <ThemedText type="smallBold" selectable style={{ color: colors.text, textAlign: 'center' }}>
        {props.value}
      </ThemedText>
    </View>
  );
}
