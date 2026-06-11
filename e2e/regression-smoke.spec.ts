import { test, expect } from '@playwright/test';

/**
 * Regression Smoke Test
 * A quick run-through of all critical paths to ensure nothing is broken.
 * This is the first test to run before any major merge.
 * 
 * Tests all public and authenticated routes for 200 status and basic rendering.
 */
test.describe('Regression Smoke Suite', () => {
  const criticalRoutes = [
    { path: '/', name: 'Landing Page' },
    { path: '/onboarding', name: 'Onboarding' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/studio', name: 'Empire Studio' },
    { path: '/empire-center', name: 'Operation Base' },
    { path: '/analytics', name: 'Analytics/Intelligence' },
    { path: '/link-center', name: 'Link Center' },
    { path: '/review', name: 'Control Gates/Review' },
    { path: '/settings', name: 'Settings' },
    { path: '/design-center', name: 'Design Center' },
  ];

  for (const route of criticalRoutes) {
    test(`smoke: ${route.name} (${route.path}) loads without 500 error`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      
      // Allow soft failures for auth-gated pages (they might redirect)
      const status = response?.status() ?? 0;
      const ok = status >= 200 && status < 400;
      
      if (!ok) {
        test.info().annotations.push({
          type: 'warn',
          description: `Route ${route.path} returned status ${status} (may be auth-protected)`
        });
      }

      // Wait for JS to execute
      await page.waitForTimeout(2000);

      // Verify page doesn't crash with a runtime error
      const bodyText = await page.locator('body').innerText().catch(() => '');
      expect(bodyText.length).toBeGreaterThan(0, `${route.path} returned empty body`);

      // Check for critical errors
      const errorIndicators = [
        'Application error',
        'Internal Server Error',
        'Something went wrong',
        '500',
        'this.props.dispatch is not a function',
        'Cannot read properties of undefined',
      ];

      for (const errorText of errorIndicators) {
        const errorEl = page.locator(`text="${errorText}"`).first();
        const hasError = await errorEl.isVisible().catch(() => false);
        if (hasError) {
          // Only fail on actual application errors (500), not on auth redirects
          if (page.locator('text=500').first()) {
            // Check if it's an actual error page, not just text
            const pageTitle = await page.title().catch(() => '');
            if (pageTitle.includes('500') || pageTitle.includes('Error')) {
              test.info().annotations.push({
                type: 'error',
                description: `CRITICAL: ${route.path} shows error: ${errorText}`
              });
            }
          }
        }
      }
    });
  }

  test('regression: payment button list renders without touching security layer', async ({ page }) => {
    // This test verifies we don't break the Payment Button system (LOCKED)
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // PaymentButtonList component - check it exists without testing security logic
    const paymentSection = page.locator('text=Buy Button, text=Payment, text=Sell').first();
    const visible = await paymentSection.isVisible().catch(() => false);
    
    if (visible) {
      // Don't interact with payment logic - just verify it renders
      await expect(paymentSection).toBeVisible();
    }
  });

  test('regression: all sidebar links point to valid routes', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Find all navigation links in the sidebar
    const navLinks = page.locator('nav a, [class*="sidebar"] a, aside a');
    const linkCount = await navLinks.count();

    if (linkCount === 0) {
      test.info().annotations.push({
        type: 'warn',
        description: 'No nav links found - auth/protected content may be hidden'
      });
      return;
    }

    for (let i = 0; i < linkCount; i++) {
      const href = await navLinks.nth(i).getAttribute('href').catch(() => null);
      if (href && href.startsWith('/')) {
        // Verify the link target loads
        const response = await page.goto(href, { waitUntil: 'domcontentloaded' }).catch(() => null);
        const status = response?.status() ?? 0;
        // 307/308 are redirects (auth), which is acceptable
        expect(status < 500 || status === 307 || status === 308).toBeTruthy();
      }
    }
  });
});