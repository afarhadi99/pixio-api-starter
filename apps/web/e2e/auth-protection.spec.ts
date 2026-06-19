import { test, expect } from '@playwright/test';

test.describe('auth protection', () => {
  test('unauthenticated users are redirected away from the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('the login page renders a sign-in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /sign in|log in/i })).toBeVisible();
  });
});
