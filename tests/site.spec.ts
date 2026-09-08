import { expect, test } from '@playwright/test';

const primaryRoutes = ['/learn/', '/writing/', '/labs/', '/projects/', '/reference/', '/about/'];

test('primary routes render successfully', async ({ page }) => {
  for (const route of primaryRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), `${route} response`).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page).toHaveTitle(/PIXN/);
  }
});

test('header controls never overlap', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  const brand = page.locator('.brand');
  const navigation = page.locator('.site-nav');
  const toggle = page.locator('.nav-toggle');
  await expect(brand).toBeVisible();

  const brandBox = await brand.boundingBox();
  expect(brandBox).not.toBeNull();
  if (!brandBox) throw new Error('Brand has no layout box');

  if (await toggle.isVisible()) {
    const toggleBox = await toggle.boundingBox();
    expect(toggleBox).not.toBeNull();
    if (!toggleBox) throw new Error('Navigation toggle has no layout box');
    expect(brandBox.x + brandBox.width).toBeLessThanOrEqual(toggleBox.x);
    await toggle.click();
    await expect(navigation).toBeVisible();
    const navBox = await navigation.boundingBox();
    expect(navBox).not.toBeNull();
    const viewport = page.viewportSize();
    if (!navBox || !viewport) throw new Error('Mobile navigation has no layout box');
    expect(navBox.x).toBeGreaterThanOrEqual(0);
    expect(navBox.x + navBox.width).toBeLessThanOrEqual(viewport.width);
  } else {
    await expect(navigation).toBeVisible();
    const navBox = await navigation.boundingBox();
    expect(navBox).not.toBeNull();
    if (!navBox) throw new Error('Desktop navigation has no layout box');
    expect(brandBox.x + brandBox.width).toBeLessThanOrEqual(navBox.x);
  }
});
