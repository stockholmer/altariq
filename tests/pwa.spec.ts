import { test, expect } from '@playwright/test';

test.describe('PWA', () => {
  test('manifest.json is served', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);
    const json = await response?.json();
    expect(json.name).toBe('Al Tariq - Prayer Times & Islamic Calendar');
    expect(json.short_name).toBe('Al Tariq');
    expect(json.display).toBe('standalone');
    expect(json.icons).toHaveLength(2);
  });

  test('service worker file is served', async ({ page }) => {
    const response = await page.goto('/sw.js');
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain('altariq-v1');
    expect(text).toContain('supabase.co');
  });

  test('html has manifest link', async ({ page }) => {
    await page.goto('/en');
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.json');
  });

  test('html has apple-touch-icon', async ({ page }) => {
    await page.goto('/en');
    const icon = page.locator('link[rel="apple-touch-icon"]');
    await expect(icon).toHaveAttribute('href', '/icons/icon-192.png');
  });

  test('html has theme-color meta tags', async ({ page }) => {
    await page.goto('/en');
    const lightTheme = page.locator('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
    await expect(lightTheme).toHaveAttribute('content', '#faf6f1');
    const darkTheme = page.locator('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
    await expect(darkTheme).toHaveAttribute('content', '#1a1412');
  });

  test('viewport meta has viewport-fit=cover', async ({ page }) => {
    await page.goto('/en');
    const viewport = page.locator('meta[name="viewport"]').first();
    const content = await viewport.getAttribute('content');
    expect(content).toContain('viewport-fit=cover');
  });
});
