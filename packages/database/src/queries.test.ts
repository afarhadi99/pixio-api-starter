import { describe, it, expect } from 'vitest';
import { deriveTierFromSubscription } from './queries';
import type { Subscription } from './types';

const sub = (productName: string | null): Subscription =>
  ({ prices: { products: { name: productName } } }) as unknown as Subscription;

describe('deriveTierFromSubscription', () => {
  it('returns free when there is no subscription', () => {
    expect(deriveTierFromSubscription(null)).toBe('free');
  });

  it('detects the business tier from the product name', () => {
    expect(deriveTierFromSubscription(sub('Business Plan'))).toBe('business');
  });

  it('detects the pro tier from the product name', () => {
    expect(deriveTierFromSubscription(sub('Pro Monthly'))).toBe('pro');
  });

  it('defaults to free for unrecognised product names', () => {
    expect(deriveTierFromSubscription(sub('Starter'))).toBe('free');
  });
});
