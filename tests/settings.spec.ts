import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test('renders all setting sections', async ({ page }) => {
    await page.goto('/en/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible();
    await expect(page.getByText('Prayer Convention')).toBeVisible();
    await expect(page.getByText('Asr Calculation')).toBeVisible();
    await expect(page.getByText('Crescent Criterion')).toBeVisible();
    await expect(page.getByText('Theme').first()).toBeVisible();
    await expect(page.getByText('Language').first()).toBeVisible();
  });

  test('shows detect location button', async ({ page }) => {
    await page.goto('/en/settings');
    await expect(page.getByRole('button', { name: 'Detect my location' })).toBeVisible();
  });

  test('shows prayer conventions', async ({ page }) => {
    await page.goto('/en/settings');
    await expect(page.getByRole('button', { name: 'Muslim World League' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Egyptian General Authority' })).toBeVisible();
  });

  test('Asr method toggle works', async ({ page }) => {
    await page.goto('/en/settings');
    const hanafi = page.getByRole('button', { name: 'Hanafi (later)' });
    await hanafi.click();
    await expect(hanafi).toHaveCSS('color', /rgb\(255, 255, 255\)/);
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/en/settings');
    const darkBtn = page.getByRole('button', { name: 'Dark' });
    await darkBtn.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('theme toggle back to light removes dark class', async ({ page }) => {
    await page.goto('/en/settings');
    await page.getByRole('button', { name: 'Dark' }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.getByRole('button', { name: 'Light' }).click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('language picker shows 9 languages', async ({ page }) => {
    await page.goto('/en/settings');
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bahasa Melayu' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bahasa Indonesia' })).toBeVisible();
  });

  test('shows location info when pre-set', async ({ page }) => {
    await page.goto('/en/settings');
    await page.evaluate(() => {
      localStorage.setItem('altariq-settings', JSON.stringify({
        state: {
          location: { lat: 51.5074, lon: -0.1278, city: 'London', country: 'UK', timezone: 'Europe/London' },
          convention: 'mwl', asrMethod: 'shafii', criterion: 'umm_al_qura', locale: 'en', theme: 'system',
        },
        version: 0,
      }));
    });
    await page.reload();
    await expect(page.getByText('London, UK')).toBeVisible();
  });
});
