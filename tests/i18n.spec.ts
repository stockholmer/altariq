import { test, expect } from '@playwright/test';

test.describe('i18n & RTL', () => {
  test('Arabic locale sets RTL direction', async ({ page }) => {
    await page.goto('/ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  });

  test('Arabic locale shows Arabic nav text', async ({ page }) => {
    await page.goto('/ar');
    await expect(page.locator('nav')).toContainText('\u0627\u0644\u064A\u0648\u0645');
  });

  test('Urdu locale sets RTL direction', async ({ page }) => {
    await page.goto('/ur');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('Persian locale sets RTL direction', async ({ page }) => {
    await page.goto('/fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('Turkish locale is LTR', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  });

  test('Malay locale renders settings page', async ({ page }) => {
    await page.goto('/ms/settings');
    await expect(page.getByRole('heading', { name: 'Tetapan' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Lokasi' })).toBeVisible();
  });

  test('Indonesian locale renders festivals page', async ({ page }) => {
    await page.goto('/id/festivals');
    await expect(page.getByRole('heading', { name: 'Perayaan' })).toBeVisible();
  });

  test('Hindi locale renders today page', async ({ page }) => {
    await page.goto('/hi');
    await expect(page.locator('nav')).toContainText('\u0906\u091C');
  });

  test('Bengali locale renders correctly', async ({ page }) => {
    await page.goto('/bn');
    await expect(page.locator('html')).toHaveAttribute('lang', 'bn');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });
});
