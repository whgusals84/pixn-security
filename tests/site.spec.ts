import { expect, test } from '@playwright/test';

const primaryRoutes = ['/learn/', '/writing/', '/labs/', '/projects/', '/reference/', '/about/', '/privacy/'];

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

test('analytics only loads after the visitor opts in', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  const notice = page.locator('[data-analytics-consent]');
  await expect(notice).toBeVisible();
  await expect(page.locator('script[data-pixn-analytics]')).toHaveCount(0);

  await notice.getByRole('button', { name: 'Accept analytics' }).click();
  await expect(notice).toBeHidden();
  await expect(page.locator('script[data-pixn-analytics]')).toHaveCount(1);
  await expect(page.locator('script[data-pixn-analytics]')).toHaveAttribute('src', /G-V2QQ024NEN/);
});
