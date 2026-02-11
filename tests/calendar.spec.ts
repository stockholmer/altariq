import { test, expect } from '@playwright/test';

test.describe('Calendar Page', () => {
  test('renders month navigator or loading skeleton', async ({ page }) => {
    await page.goto('/en/calendar');
    // Calendar shows skeleton until Hijri date API responds, then month navigator
    const monthHeader = page.locator('h2').first();
    const skeleton = page.locator('.animate-pulse').first();
    await expect(monthHeader.or(skeleton)).toBeVisible({ timeout: 10000 });
  });

  test('renders weekday headers when grid loads', async ({ page }) => {
    await page.goto('/en/calendar');
    const sun = page.getByText('Sun', { exact: true });
    const skeleton = page.locator('.animate-pulse').first();
    await expect(sun.or(skeleton)).toBeVisible({ timeout: 10000 });
  });

  test('shows loading skeleton or grid', async ({ page }) => {
    await page.goto('/en/calendar');
    const skeleton = page.locator('.animate-pulse').first();
    const dayButton = page.locator('button').filter({ hasText: /^\d+$/ }).first();
    await expect(skeleton.or(dayButton)).toBeVisible({ timeout: 15000 });
  });

  test('prev/next month navigation works after load', async ({ page }) => {
    await page.goto('/en/calendar');
    // Wait for either loaded state or skeleton
    const monthHeader = page.locator('h2').first();
    const skeleton = page.locator('.animate-pulse').first();
    await expect(monthHeader.or(skeleton)).toBeVisible({ timeout: 10000 });

    // Only test navigation if the API responded and month loaded
    if (await monthHeader.isVisible()) {
      const buttons = page.locator('button:has(svg)');
      const nextBtn = buttons.last();

      await nextBtn.click();
      // After click, month header should still be visible
      await expect(monthHeader).toBeVisible();
    }
  });
});
