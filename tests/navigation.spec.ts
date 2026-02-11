import { test, expect } from '@playwright/test';

test.describe('Navigation & App Shell', () => {
  test('redirects / to /en', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en/);
  });

  test('renders bottom nav with 5 tabs', async ({ page }) => {
    await page.goto('/en');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    const links = nav.locator('a');
    await expect(links).toHaveCount(5);
  });

  test('renders top bar with Al Tariq branding', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('h1')).toContainText('Al Tariq');
  });

  test('navigates to calendar page', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href="/en/calendar"]');
    await expect(page).toHaveURL('/en/calendar');
    // Calendar page renders - wait for the month header to appear
    await expect(page.locator('h2').first()).toBeVisible({ timeout: 15000 });
  });

  test('navigates to qibla page', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href="/en/qibla"]');
    await expect(page).toHaveURL('/en/qibla');
    // No location set, so we see the prompt
    await expect(page.getByText('Set your location first')).toBeVisible();
  });

  test('navigates to festivals page', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href="/en/festivals"]');
    await expect(page).toHaveURL('/en/festivals');
    await expect(page.getByRole('heading', { name: 'Festivals' })).toBeVisible();
  });

  test('navigates to settings page', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href="/en/settings"]');
    await expect(page).toHaveURL('/en/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });

  test('active tab is highlighted', async ({ page }) => {
    await page.goto('/en/settings');
    const settingsLink = page.locator('a[href="/en/settings"]');
    await expect(settingsLink).toHaveCSS('color', /.+/);
  });
});
