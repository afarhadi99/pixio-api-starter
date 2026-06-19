// @pixio/config - pricing tiers, credit packs, and price-id helpers.
// Pure, platform-agnostic data shared by web + mobile + billing/credits packages.

export interface PricingTier {
  id: 'free' | 'pro' | 'business';
  name: string;
  description: string;
  features: string[];
  popular: boolean;
  credits: number;
  pricing: {
    monthly: {
      priceId: string | null;
      amount: number | null;
    };
    yearly: {
      priceId: string | null;
      amount: number | null;
      discount?: number;
    };
  };
}

// Read price IDs from environment variables (NEXT_PUBLIC_* on web, undefined on
// native — mobile receives pricing from the server, so this is safe).
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
  PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
  BUSINESS_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_MONTHLY || '',
  BUSINESS_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_YEARLY || '',
  CREDIT_PACK_1000: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDIT_PACK_1000 || '',
  CREDIT_PACK_2500: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDIT_PACK_2500 || '',
  CREDIT_PACK_5000: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDIT_PACK_5000 || '',
};

export interface CreditPack {
  id: string;
  name: string;
  description: string;
  amount: number;
  price: number;
  priceId: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'credits-1000',
    name: '1000 Credits',
    description: 'Top up with a small credit pack',
    amount: 1000,
    price: 1000,
    priceId: STRIPE_PRICE_IDS.CREDIT_PACK_1000,
  },
  {
    id: 'credits-2500',
    name: '2500 Credits',
    description: 'Best value for regular users',
    amount: 2500,
    price: 2500,
    priceId: STRIPE_PRICE_IDS.CREDIT_PACK_2500,
  },
  {
    id: 'credits-5000',
    name: '5000 Credits',
    description: 'Best value for power users',
    amount: 5000,
    price: 5000,
    priceId: STRIPE_PRICE_IDS.CREDIT_PACK_5000,
  },
];

const isPricingConfigured = () => {
  return (
    STRIPE_PRICE_IDS.PRO_MONTHLY &&
    STRIPE_PRICE_IDS.PRO_YEARLY &&
    STRIPE_PRICE_IDS.BUSINESS_MONTHLY &&
    STRIPE_PRICE_IDS.BUSINESS_YEARLY
  );
};

if (process.env.NODE_ENV === 'production' && !isPricingConfigured()) {
  console.warn('Warning: Stripe price IDs are not configured in environment variables.');
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Essential features for individuals',
    credits: 500,
    features: [
      'Basic dashboard access',
      'Limited access to features',
      'Community support',
      '500 credits per month',
    ],
    popular: false,
    pricing: {
      monthly: { priceId: null, amount: null },
      yearly: { priceId: null, amount: null },
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Perfect for professionals',
    credits: 3000,
    features: [
      'Everything in Free',
      'Advanced features',
      'Priority support',
      'Extended usage limits',
      '3000 credits per month',
    ],
    popular: true,
    pricing: {
      monthly: { priceId: STRIPE_PRICE_IDS.PRO_MONTHLY || null, amount: 2900 },
      yearly: { priceId: STRIPE_PRICE_IDS.PRO_YEARLY || null, amount: 29000, discount: 16 },
    },
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For teams and organizations',
    credits: 6000,
    features: [
      'Everything in Pro',
      'Enterprise features',
      'Dedicated support',
      'Custom integrations',
      'Team management',
      '6000 credits per month',
    ],
    popular: false,
    pricing: {
      monthly: { priceId: STRIPE_PRICE_IDS.BUSINESS_MONTHLY || null, amount: 5900 },
      yearly: { priceId: STRIPE_PRICE_IDS.BUSINESS_YEARLY || null, amount: 59000, discount: 16 },
    },
  },
];

export function getTierById(id: string): PricingTier | undefined {
  return PRICING_TIERS.find((tier) => tier.id === id);
}

export type PriceIdInfo = {
  tierId: 'free' | 'pro' | 'business';
  interval: 'monthly' | 'yearly';
};

export const PRICE_ID_MAP: Record<string, PriceIdInfo> = {};

PRICING_TIERS.forEach((tier) => {
  if (tier.pricing.monthly.priceId) {
    PRICE_ID_MAP[tier.pricing.monthly.priceId] = { tierId: tier.id, interval: 'monthly' };
  }
  if (tier.pricing.yearly.priceId) {
    PRICE_ID_MAP[tier.pricing.yearly.priceId] = { tierId: tier.id, interval: 'yearly' };
  }
});

export function getTierByPriceId(priceId: string | null | undefined): {
  tier: PricingTier | undefined;
  interval: 'monthly' | 'yearly' | undefined;
} {
  if (!priceId) {
    return { tier: getTierById('free'), interval: undefined };
  }

  const priceInfo = PRICE_ID_MAP[priceId];
  if (!priceInfo) {
    return { tier: undefined, interval: undefined };
  }

  return { tier: getTierById(priceInfo.tierId), interval: priceInfo.interval };
}

/** Credits granted by a subscription tier. */
export function getCreditsByTier(tier: 'free' | 'pro' | 'business'): number {
  return getTierById(tier)?.credits ?? 0;
}
