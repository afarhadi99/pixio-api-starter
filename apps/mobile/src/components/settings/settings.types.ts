export type CreditsBalanceSummary = {
  total: number;
  /** Current month's recurring (subscription) credits remaining. */
  recurringCurrent: number;
  /** Monthly cap for the active tier. */
  recurringQuota: number;
  /** Permanent (purchased) credits. */
  permanent: number;
  resetText?: string;
};

export type SubscriptionSummary = {
  productName: string;
  productDescription?: string;
  statusText?: string;
  intervalText?: string;
  renewalText?: string;
};
