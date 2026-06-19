import { describe, it, expect } from 'vitest';
import {
  PRICING_TIERS,
  CREDIT_PACKS,
  getTierById,
  getTierByPriceId,
  getCreditsByTier,
  PRICE_ID_MAP,
} from './pricing';

describe('pricing tiers', () => {
  it('exposes free, pro and business tiers', () => {
    expect(PRICING_TIERS.map((t) => t.id)).toEqual(['free', 'pro', 'business']);
  });

  it('maps tier credits correctly', () => {
    expect(getCreditsByTier('free')).toBe(500);
    expect(getCreditsByTier('pro')).toBe(3000);
    expect(getCreditsByTier('business')).toBe(6000);
  });

  it('getTierById returns the matching tier or undefined', () => {
    expect(getTierById('pro')?.name).toBe('Pro');
    expect(getTierById('nope')).toBeUndefined();
  });
});

describe('getTierByPriceId', () => {
  it('falls back to the free tier when no price id is given', () => {
    const { tier, interval } = getTierByPriceId(null);
    expect(tier?.id).toBe('free');
    expect(interval).toBeUndefined();
  });

  it('returns undefined for an unknown price id', () => {
    const { tier } = getTierByPriceId('price_does_not_exist');
    expect(tier).toBeUndefined();
  });

  it('resolves a configured price id via PRICE_ID_MAP', () => {
    const entries = Object.entries(PRICE_ID_MAP);
    // Only assert when price ids are configured via env (CI may not set them).
    if (entries.length > 0) {
      const [priceId, info] = entries[0];
      const { tier, interval } = getTierByPriceId(priceId);
      expect(tier?.id).toBe(info.tierId);
      expect(interval).toBe(info.interval);
    }
  });
});

describe('credit packs', () => {
  it('defines three packs with positive amounts', () => {
    expect(CREDIT_PACKS).toHaveLength(3);
    for (const pack of CREDIT_PACKS) {
      expect(pack.amount).toBeGreaterThan(0);
      expect(pack.price).toBeGreaterThan(0);
    }
  });
});
