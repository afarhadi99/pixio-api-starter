import { test, expect } from '@playwright/test';

test.describe('marketing', () => {
  test('landing page renders', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('pricing page lists subscription tiers', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/pro/i).first()).toBeVisible();
    await expect(page.getByText(/business/i).first()).toBeVisible();
  });
});
