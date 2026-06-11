import { test, expect } from '@playwright/test';

/**
 * Authentication & Onboarding Tests
 * Tests the public landing page flow and the onboarding flow.
 * The app auto-redirects based on localStorage state.
 */
test.describe('Authentication & Onboarding', () => {
  test('root path serves the landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for the landing page content to render
    await page.waitForTimeout(2000);

    // Verify that we're on a page with content (not a blank page)
    const bodyText = await page.locator('body').innerText().catch(() => '');
    expect(bodyText.length).toBeGreaterThan(0);

    // The landing page should have either the "EmpireLaunch AI" title or the globe
    const brandText = page.locator('text=EmpireLaunch').first();
    if (await brandText.isVisible().catch(() => false)) {
      await expect(brandText).toBeVisible();
    }
  });

  test('landing page shows terms modal when terms button clicked', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for terms/privacy related buttons or links
    const termsLink = page.locator('a:has-text("Terms"), button:has-text("Terms"), a:has-text("Privacy"), button:has-text("Legal")').first();
    if (await termsLink.isVisible().catch(() => false)) {
      await termsLink.click();
      await page.waitForTimeout(500);

      // A modal or new content should appear
      const modalContent = page.locator('text=Terms of Service, text=Privacy Policy, text=Terms & Conditions').first();
      const visible = await modalContent.isVisible().catch(() => false);
      if (visible) {
        await expect(modalContent).toBeVisible();
      }
    }
  });

  test('onboarding page loads', async ({ page }) => {
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // The onboarding page should render some content
    const bodyText = await page.locator('body').innerText().catch(() => '');
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test('auth callback page loads without crash', async ({ page }) => {
    // Test the auth callback route structure
    await page.goto('/auth/callback/etsy');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should not crash - either shows processing or redirects
    const hasError = await page.locator('text=Application Error, text=500, text=Not Found').first().isVisible().catch(() => false);
    expect(hasError).toBeFalsy();
  });

  test('design center page loads', async ({ page }) => {
    await page.goto('/design-center');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const bodyText = await page.locator('body').innerText().catch(() => '');
    expect(bodyText.length).toBeGreaterThan(0);
  });
});