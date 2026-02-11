import { test, expect } from '@playwright/test';

const MECCA_SETTINGS = JSON.stringify({
  state: {
    location: { lat: 21.4225, lon: 39.8262, city: 'Mecca', country: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
    convention: 'mwl', asrMethod: 'shafii', criterion: 'umm_al_qura', locale: 'en', theme: 'system',
  },
  version: 0,
});

test.describe('Today Page', () => {
  test('shows location prompt when no location is set', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByText('Set your location to see prayer times')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Detect my location' })).toBeVisible();
  });

  test('shows prayer data or loading state after setting location', async ({ page }) => {
    // Pre-seed Zustand store before navigation
    await page.addInitScript((settings) => {
      window.localStorage.setItem('altariq-settings', settings);
    }, MECCA_SETTINGS);
    await page.goto('/en');

    // With location set, the location prompt should NOT appear
    await expect(page.getByText('Set your location to see prayer times')).not.toBeVisible({ timeout: 5000 });

    // We should see either loading skeletons or prayer names
    // (islamic-calendar API may not be deployed, so we may see loading state)
    const fajr = page.getByText('Fajr');
    const loading = page.locator('.animate-pulse');
    await expect(fajr.or(loading.first())).toBeVisible({ timeout: 10000 });
  });

  test('top bar shows city name when location set', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('altariq-settings', JSON.stringify({
        state: {
          location: { lat: 51.5074, lon: -0.1278, city: 'London', country: 'UK', timezone: 'Europe/London' },
          convention: 'mwl', asrMethod: 'shafii', criterion: 'umm_al_qura', locale: 'en', theme: 'system',
        },
        version: 0,
      }));
    });
    await page.goto('/en');

    await expect(page.getByText('London', { exact: true })).toBeVisible({ timeout: 5000 });
  });
});
