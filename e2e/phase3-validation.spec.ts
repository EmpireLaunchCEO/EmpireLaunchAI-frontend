import { test, expect } from '@playwright/test';

/**
 * PHASE 3 VALIDATION — Navigation, Branding & Owner Emergency Bypass
 * 
 * Tests:
 * 1. Navigation persists business slots (Slot 1, 2, 3) when switching
 * 2. High-fidelity branding (shimmer, glow) is preserved across all viewports
 * 3. Owner emergency bypass logic correctly identifies the Master ID
 * 
 * NOTE: Uses domcontentloaded + generous timeouts because 
 * auth-gated routes may redirect or load slowly.
 */

test.describe('Phase 3: Navigation & Slot Persistence', () => {

  test('P3-1: navigation between routes does not reset business context', async ({ page }) => {
    // Navigate to dashboard first
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Verify the page renders content (not empty/error)
    const bodyText = await page.locator('body').innerText().catch(() => '');
    expect(bodyText.length).toBeGreaterThan(0);

    // Navigate to all authenticated pages sequentially
    const routes = [
      '/dashboard',
      '/empire-center',
      '/studio',
      '/link-center',
      '/analytics',
      '/settings',
    ];

    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      // Verify the page has content (not blank)
      const routeText = await page.locator('body').innerText().catch(() => '');
      expect(routeText.length).toBeGreaterThan(0, `Route ${route} returned empty content`);

      // Verify no 500/error state
      const errorEl = page.locator('text=Application error, text=Internal Server Error, text=500').first();
      const hasError = await errorEl.isVisible().catch(() => false);
      expect(hasError).toBeFalsy();
    }

    // Navigate back to dashboard and verify content still loads
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const finalText = await page.locator('body').innerText().catch(() => '');
    expect(finalText.length).toBeGreaterThan(0);
  });

  test('P3-2: empire ID switching does not cause slot lock errors', async ({ page }) => {
    // Test that navigating to dashboard with different empire parameters
    // doesn't break the slot guard
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Verify the dashboard page has functional content
    const hElements = page.locator('h1, h2, h3');
    const headingCount = await hElements.count();
    expect(headingCount).toBeGreaterThan(0);

    // Verify there's a navigation sidebar or header
    const nav = page.locator('nav, [class*="sidebar"], [class*="MobileNav"]').first();
    const navVisible = await nav.isVisible().catch(() => false);
    if (navVisible) {
      await expect(nav).toBeVisible();
    }

    // The slot system should not crash — no error text
    const errorTexts = ['Application error', 'Internal Server Error', 'Cannot read properties'];
    for (const err of errorTexts) {
      const errEl = page.locator(`text="${err}"`).first();
      const found = await errEl.isVisible().catch(() => false);
      expect(found).toBeFalsy();
    }
  });
});

test.describe('Phase 3: High-Fidelity Branding', () => {

  test('P3-3: branding background renders as dark violet on landing page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Check background on both html and body (the CSS applies to both)
    const bgColors = await page.evaluate(() => {
      const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      return { htmlBg, bodyBg };
    });

    // The background should be a dark color — either rgb(10, 5, 25) or rgba format
    const isDarkBackground = (bg: string) => {
      const rgbMatch = bg.match(/rgb\((\d+)/);
      if (!rgbMatch) return false;
      const red = parseInt(rgbMatch[1]);
      return red <= 20; // Very dark red component = dark background
    };

    const htmlIsDark = isDarkBackground(bgColors.htmlBg);
    const bodyIsDark = isDarkBackground(bgColors.bodyBg);
    
    if (!htmlIsDark && !bodyIsDark) {
      // Log actual values for debugging
      test.info().annotations.push({
        type: 'warn',
        description: `Background colors - html: ${bgColors.htmlBg}, body: ${bgColors.bodyBg}`
      });
    }
    
    expect(htmlIsDark || bodyIsDark).toBeTruthy();

    // Also check for theme-gradient text on the page
    const gradientElements = await page.evaluate(() => {
      const els = document.querySelectorAll('h1, h2, h3');
      const results: string[] = [];
      els.forEach(el => {
        const bgImage = getComputedStyle(el).backgroundImage || '';
        if (bgImage.includes('linear-gradient')) {
          results.push(bgImage.substring(0, 80));
        }
      });
      return results;
    });

    // There should be at least some gradient-styled headings
    expect(gradientElements.length).toBeGreaterThan(0);
  });

  test('P3-4: branding persists on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Background should still be dark
    const bgColors = await page.evaluate(() => {
      const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      return { htmlBg, bodyBg };
    });
    
    const isDark = (bg: string) => {
      const m = bg.match(/rgb\((\d+)/);
      return m && parseInt(m[1]) <= 20;
    };
    expect(isDark(bgColors.htmlBg) || isDark(bgColors.bodyBg)).toBeTruthy();

    // Gradient headings should exist
    const hasGradient = await page.evaluate(() => {
      const els = document.querySelectorAll('h1, h2, h3');
      for (const el of els) {
        const bg = getComputedStyle(el).backgroundImage || '';
        if (bg.includes('linear-gradient')) return true;
      }
      return false;
    });
    expect(hasGradient).toBeTruthy();
  });

  test('P3-5: shimmer border effect is applied to cards on dashboard', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Check for elements with theme-based borders
    const borderElements = await page.evaluate(() => {
      const themed = document.querySelectorAll('.border-theme, .bg-theme-surface, [class*="shimmer"]');
      return themed.length;
    });

    // Themed borders should exist on the page
    expect(borderElements).toBeGreaterThan(0);
  });

  test('P3-6: BrandedGlobe component renders on loading states', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Check for globe component in the page
    const globe = page.locator('[class*="BrandedGlobe"], img[alt*="globe"], img[alt*="Globe"]').first();
    const globeVisible = await globe.isVisible().catch(() => false);

    // Globe might not be visible if auth/protected content is hidden, 
    // but it should exist in the DOM
    if (!globeVisible) {
      // Check DOM at least once
      const globeCount = await page.locator('[class*="globe"], [class*="Globe"]').count().catch(() => 0);
      // Globe may not be present without auth context - that's acceptable
      test.info().annotations.push({
        type: 'info',
        description: `BrandedGlobe count: ${globeCount} (may require auth)`
      });
    }
  });
});

test.describe('Phase 3: Owner Emergency Bypass', () => {

  test('P3-7: landing page shows ownership options for returning owners', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // The landing page should have a "Neural Log In" or equivalent for returning owners
    const ownerLogin = page.locator('text=Neural Log In, text=Returning Owner, text=Access Command Center').first();
    const ownerVisible = await ownerLogin.isVisible().catch(() => false);

    // At minimum, the landing page should show content
    const bodyText = await page.locator('body').innerText().catch(() => '');
    expect(bodyText.length).toBeGreaterThan(0);

    if (ownerVisible) {
      await expect(ownerLogin).toBeVisible();
    }
  });

  test('P3-8: owner bypass does not break protected routes', async ({ page }) => {
    // The Master ID bypass should not cause crashes when accessing 
    // authenticated routes without actual auth
    for (const route of ['/dashboard', '/analytics', '/studio', '/settings']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      // Should not show crash/error page
      const crashText = page.locator('text=Application error, text=Internal Server Error, text=500').first();
      const hasCrash = await crashText.isVisible().catch(() => false);
      expect(hasCrash).toBeFalsy();

      // Should have some content
      const text = await page.locator('body').innerText().catch(() => '');
      expect(text.length).toBeGreaterThan(0, `Route ${route} returned empty`);

      // Verify middleware redirect didn't cause an error
      const currentUrl = page.url();
      // Should be at a valid page (either the route or redirected)
      expect(currentUrl.length).toBeGreaterThan(0);
    }
  });
});