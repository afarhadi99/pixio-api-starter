// src/lib/config/pricing.ts
export interface PricingTier {
  id: 'free' | 'pro' | 'business';
  name: string;
  description: string;
  features: string[];
  popular: boolean;
  credits: number; // Added credits field
  // Each tier can have monthly and yearly pricing options
  pricing: {
    monthly: {
      priceId: string | null; // Stripe Price ID
      amount: number | null;  // Amount in cents
    };
    yearly: {
      priceId: string | null; // Stripe Price ID
      amount: number | null;  // Amount in cents
      discount?: number;      // Optional percentage discount compared to monthly
    };
  };
}

// Read price IDs from environment variables
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
  PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
  BUSINESS_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_MONTHLY || '',
  BUSINESS_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_YEARLY || '',
  // Credit pack price IDs
  CREDIT_PACK_1000: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDIT_PACK_1000 || '',
  CREDIT_PACK_2500: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDIT_PACK_2500 || '',
  CREDIT_PACK_5000: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDIT_PACK_5000 || '',
};

// Define credit packs for purchase
export const CREDIT_PACKS = [
  {
    id: 'credits-1000',
    name: '1000 Credits',
    description: 'Top up with a small credit pack',
    amount: 1000,
    price: 1000, // $10 in cents
    priceId: STRIPE_PRICE_IDS.CREDIT_PACK_1000,
  },
  {
    id: 'credits-2500',
    name: '2500 Credits',
    description: 'Best value for regular users',
    amount: 2500,
    price: 2500, // $25 in cents
    priceId: STRIPE_PRICE_IDS.CREDIT_PACK_2500,
  },
  {
    id: 'credits-5000',
    name: '5000 Credits',
    description: 'Best value for power users',
    amount: 5000,
    price: 5000, // $50 in cents
    priceId: STRIPE_PRICE_IDS.CREDIT_PACK_5000,
  }
];

// Check if price IDs are configured
const isPricingConfigured = () => {
  return (
    STRIPE_PRICE_IDS.PRO_MONTHLY &&
    STRIPE_PRICE_IDS.PRO_YEARLY &&
    STRIPE_PRICE_IDS.BUSINESS_MONTHLY &&
    STRIPE_PRICE_IDS.BUSINESS_YEARLY
  );
};

// Show warning if price IDs are not configured in production
if (process.env.NODE_ENV === 'production' && !isPricingConfigured()) {
  console.warn('Warning: Stripe price IDs are not configured in environment variables.');
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Essential features for individuals',
    credits: 500, // 500 credits for free tier
    features: [
      'Basic dashboard access',
      'Limited access to features',
      'Community support',
      '500 credits per month',
    ],
    popular: false,
    pricing: {
      monthly: {
        priceId: null,
        amount: null,
      },
      yearly: {
        priceId: null,
        amount: null,
      },
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Perfect for professionals',
    credits: 3000, // 3000 credits for pro tier
    features: [
      'Everything in Free',
      'Advanced features',
      'Priority support',
      'Extended usage limits',
      '3000 credits per month',
    ],
    popular: true,
    pricing: {
      monthly: {
        priceId: STRIPE_PRICE_IDS.PRO_MONTHLY || null,
        amount: 2900, // $29/month
      },
      yearly: {
        priceId: STRIPE_PRICE_IDS.PRO_YEARLY || null,
        amount: 29000, // $290/year
        discount: 16,  // 16% discount compared to monthly
      },
    },
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For teams and organizations',
    credits: 6000, // 6000 credits for business tier
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
      monthly: {
        priceId: STRIPE_PRICE_IDS.BUSINESS_MONTHLY || null,
        amount: 5900, // $59/month
      },
      yearly: {
        priceId: STRIPE_PRICE_IDS.BUSINESS_YEARLY || null,
        amount: 59000, // $590/year
        discount: 16,  // 16% discount compared to monthly
      },
    },
  },
];

// Helper function to get a tier by ID
export function getTierById(id: string): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.id === id);
}

// Build a mapping of price IDs to tier information for easy lookup
export type PriceIdInfo = {
  tierId: 'free' | 'pro' | 'business';
  interval: 'monthly' | 'yearly';
};

// Create a map of price IDs to tier info
export const PRICE_ID_MAP: Record<string, PriceIdInfo> = {};

// Populate the price ID map
PRICING_TIERS.forEach(tier => {
  // Add monthly price ID if exists
  if (tier.pricing.monthly.priceId) {
    PRICE_ID_MAP[tier.pricing.monthly.priceId] = {
      tierId: tier.id as 'free' | 'pro' | 'business',
      interval: 'monthly'
    };
  }

  // Add yearly price ID if exists
  if (tier.pricing.yearly.priceId) {
    PRICE_ID_MAP[tier.pricing.yearly.priceId] = {
      tierId: tier.id as 'free' | 'pro' | 'business',
      interval: 'yearly'
    };
  }
});

// Helper function to get tier info from a price ID
export function getTierByPriceId(priceId: string | null | undefined): { 
  tier: PricingTier | undefined, 
  interval: 'monthly' | 'yearly' | undefined 
} {
  if (!priceId) {
    // Default to free tier with no interval
    const freeTier = getTierById('free');
    return { tier: freeTier, interval: undefined };
  }

  const priceInfo = PRICE_ID_MAP[priceId];

  if (!priceInfo) {
    // Price ID not found in our configuration
    return { tier: undefined, interval: undefined };
  }

  const tier = getTierById(priceInfo.tierId);

  return { 
    tier,
    interval: priceInfo.interval
  };
}
