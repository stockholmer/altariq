import { test, expect } from '@playwright/test';

const LONDON_SETTINGS = JSON.stringify({
  state: {
    location: { lat: 51.5074, lon: -0.1278, city: 'London', country: 'UK', timezone: 'Europe/London' },
    convention: 'mwl', asrMethod: 'shafii', criterion: 'umm_al_qura', locale: 'en', theme: 'system',
  },
  version: 0,
});

test.describe('Qibla Page', () => {
  test('shows "set location" message when no location', async ({ page }) => {
    await page.goto('/en/qibla');
    await expect(page.getByText('Set your location first')).toBeVisible();
  });

  test('shows compass and bearing when location is set', async ({ page }) => {
    await page.addInitScript((s) => { window.localStorage.setItem('altariq-settings', s); }, LONDON_SETTINGS);
    await page.goto('/en/qibla');

    await expect(page.getByText('Qibla Direction')).toBeVisible();
    await expect(page.getByText(/Bearing/)).toBeVisible();
    await expect(page.getByText(/km to Kaaba/)).toBeVisible();
    // SVG compass specifically
    await expect(page.locator('svg[viewBox="0 0 200 200"]')).toBeVisible();
  });

  test('shows enable compass button on desktop', async ({ page }) => {
    await page.addInitScript((s) => { window.localStorage.setItem('altariq-settings', s); }, LONDON_SETTINGS);
    await page.goto('/en/qibla');

    const enableBtn = page.getByRole('button', { name: 'Enable Compass' });
    const unsupported = page.getByText('Compass not available on this device');
    await expect(enableBtn.or(unsupported)).toBeVisible();
  });

  test('Qibla bearing for London is roughly 119 degrees', async ({ page }) => {
    await page.addInitScript((s) => { window.localStorage.setItem('altariq-settings', s); }, LONDON_SETTINGS);
    await page.goto('/en/qibla');

    const bearingText = await page.getByText(/Bearing/).textContent();
    const match = bearingText?.match(/([\d.]+)/);
    expect(match).toBeTruthy();
    const bearing = parseFloat(match![1]);
    expect(bearing).toBeGreaterThan(115);
    expect(bearing).toBeLessThan(125);
  });
});
