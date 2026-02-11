import { test, expect } from '@playwright/test';

test.describe('Festivals Page', () => {
  test('renders festival page title', async ({ page }) => {
    await page.goto('/en/festivals');
    await expect(page.getByRole('heading', { name: 'Festivals' })).toBeVisible();
  });

  test('shows filter chips', async ({ page }) => {
    await page.goto('/en/festivals');
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eid' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fasting' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hajj' })).toBeVisible();
  });

  test('loads festival cards from API', async ({ page }) => {
    await page.goto('/en/festivals');
    // Wait for festival cards to appear (the festival-lens API is deployed)
    // Cards contain festival names like "Laylat al-Qadr" or "Eid al-Fitr"
    const card = page.locator('[class*="rounded-xl"][class*="shadow"]').first();
    await expect(card).toBeVisible({ timeout: 15000 });
  });

  test('filter chips change active state on click', async ({ page }) => {
    await page.goto('/en/festivals');
    // Wait for content to load
    await page.locator('[class*="rounded-xl"][class*="shadow"]').first().waitFor({ timeout: 15000 });

    const eidBtn = page.getByRole('button', { name: 'Eid' });
    await eidBtn.click();
    // After click, the Eid button should have accent bg (white text)
    await expect(eidBtn).toHaveCSS('color', /rgb\(255, 255, 255\)/);
  });
});
