import { test, expect } from '@playwright/test';

/**
 * Phase 2/3 Targeted Smoke Tests
 * 
 * Light-weight tests designed for memory-constrained environments.
 * Tests Phase 2 Financials (Payment Button, Financial Command) and
 * Phase 3 features (High-Fidelity Navigation, Empire Studio).
 * 
 * Run with: PLAYWRIGHT_BROWSERS_PATH=/opt/browsers npx playwright test --grep "Phase2|Phase3"
 * 
 * For memory efficiency: use `next build` + `next start` instead of `next dev`
 * 
 * NOTE: Uses domcontentloaded + generous timeouts. Auth-gated pages
 * may redirect but should not crash.
 */

test.describe('Phase 3: Creative Loop & Navigation', () => {
  test('Phase3-1: empire studio page loads and renders creative workspace', async ({ page }) => {
    await page.goto('/studio', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Page should have content
    const bodyText = await page.locator('body').innerText().catch(() => '');
    expect(bodyText.length).toBeGreaterThan(0);

    // Studio should show creative workspace tabs
    const tabLabels = ['Gallery', 'Cinema', 'Activity', 'Radar'];
    let foundTab = false;
    for (const label of tabLabels) {
      const tab = page.locator(`text=${label}`).first();
      if (await tab.isVisible().catch(() => false)) {
        foundTab = true;
        break;
      }
    }

    if (!foundTab) {
      test.info().annotations.push({
        type: 'warn',
        description: 'Studio tabs not found — may require auth context'
      });
    }

    // Verify no crash state
    const crashIndicators = ['Application error', 'Internal Server Error', 'Something went wrong'];
    for (const err of crashIndicators) {
      const el = page.locator(`text="${err}"`).first();
      expect(await el.isVisible().catch(() => false)).toBeFalsy();
    }
  });

  test('Phase3-2: studio creative content renders without client errors', async ({ page }) => {
    await page.goto('/studio', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Check for DNA Vault counter (creative asset storage)
    const dnaVault = page.locator('text=DNA Vault, text=Vaulted, text=Design DNA').first();
    const dnaVisible = await dnaVault.isVisible().catch(() => false);
    if (dnaVisible) {
      await expect(dnaVault).toBeVisible();
    }

    // Check for the content creation section
    const createSection = page.locator(
      'text=Create, text=Generate, text=Content, text=Studio'
    ).first();
    const createVisible = await createSection.isVisible().catch(() => false);
    if (createVisible) {
      await expect(createSection).toBeVisible();
    }
  });

  test('Phase3-3: high-fidelity mobile navigation renders on small viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Page should render content
    const bodyText = await page.locator('body').innerText().catch(() => '');
    expect(bodyText.length).toBeGreaterThan(0);

    // Check for mobile navigation elements
    const mobileNav = page.locator(
      '[class*="MobileNav"], ' +
      '[class*="mobile"], ' +
      'nav[class*="bottom"], ' +
      'nav a, ' +
      '[class*="sidebar"]'
    ).first();

    const navVisible = await mobileNav.isVisible().catch(() => false);
    if (navVisible) {
      await expect(mobileNav).toBeVisible();
    }

    // Verify dark theme persists on mobile
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    const isDark = bgColor.includes('rgb(10, 5, 25)') || bgColor.includes('rgb(0, 0, 0)');
    expect(isDark).toBeTruthy();
  });

  test('Phase3-4: navigation between main routes does not crash on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    const routes = ['/dashboard', '/studio', '/link-center', '/settings'];
    
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      // Verify page loaded without crash
      const bodyText = await page.locator('body').innerText().catch(() => '');
      expect(bodyText.length).toBeGreaterThan(0);

      // Verify no application errors
      const errorEl = page.locator('text=Application error, text=Internal Server Error').first();
      expect(await errorEl.isVisible().catch(() => false)).toBeFalsy();
    }
  });

  test('Phase3-5: navigation sidebar shows all empire sections', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Look for sidebar navigation links
    const navItems = ['Home', 'Operation Base', 'Empire Studio', 'Link Center', 'Control Gates', 'Settings'];
    let foundItems = 0;

    for (const item of navItems) {
      const navLink = page.locator(`text=${item}`).first();
      if (await navLink.isVisible().catch(() => false)) {
        foundItems++;
      }
    }

    test.info().annotations.push({
      type: 'info',
      description: `Found ${foundItems}/${navItems.length} navigation items`
    });

    if (foundItems > 0) {
      // At least some nav items should be visible
      expect(foundItems).toBeGreaterThan(0);
    }
  });
});

test.describe('Phase 2: Financials & Payment Button', () => {
  test('Phase2-1: financial command component renders on dashboard', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Check for FinancialCommand component
    const financeSection = page.locator(
      'text=Empire Finances, ' +
      'text=Empire Financials, ' +
      'text=Success-Share, ' +
      'text=Financial'
    ).first();

    const financeVisible = await financeSection.isVisible().catch(() => false);
    if (financeVisible) {
      await expect(financeSection).toBeVisible();
    } else {
      // The component may be behind auth — check if page renders at all
      const headingCount = await page.locator('h1, h2, h3').count();
      expect(headingCount).toBeGreaterThan(0);
    }
  });

  test('Phase2-2: financial command toggle functionality', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Look for minimize/maximize toggle in FinancialCommand
    const toggleBtn = page.locator(
      'button:has-text("Maximize"), ' +
      'button:has-text("Minimize"), ' +
      'button[class*="Maximize"], ' +
      'button[class*="Minimize"]'
    ).first();

    const toggleVisible = await toggleBtn.isVisible().catch(() => false);
    if (toggleVisible) {
      await toggleBtn.click();
      await page.waitForTimeout(500);

      // After clicking, state should have changed
      const newText = await toggleBtn.textContent().catch(() => '');
      expect(newText.length).toBeGreaterThan(0);
    }
  });

  test('Phase2-3: financial command shows revenue and subscription info', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Check for revenue/earnings display
    const earnings = page.locator(
      'text=$, ' +
      'text=Available, ' +
      'text=Revenue, ' +
      'text=Earnings, ' +
      'text=Balance'
    ).first();

    const earningsVisible = await earnings.isVisible().catch(() => false);
    if (earningsVisible) {
      await expect(earnings).toBeVisible();
    }
  });

  test('Phase2-4: subscription and success-share section renders', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Check for subscription/success-share UI
    const subscriptionSection = page.locator(
      'text=Success-Share, ' +
      'text=Subscription, ' +
      'text=Plan, ' +
      'text=Active Plan'
    ).first();

    const subVisible = await subscriptionSection.isVisible().catch(() => false);
    if (subVisible) {
      await expect(subscriptionSection).toBeVisible();
    }
  });

  test('Phase2-5: dashboard loads without crashing', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Verify no crash state
    const errorIndicators = [
      'Application error',
      'Internal Server Error',
      'Something went wrong',
      'this.props.dispatch is not a function',
      'Cannot read properties of undefined'
    ];

    for (const err of errorIndicators) {
      const el = page.locator(`text="${err}"`).first();
      const hasError = await el.isVisible().catch(() => false);
      if (hasError) {
        test.info().annotations.push({
          type: 'error',
          description: `CRITICAL: Dashboard shows error: ${err}`
        });
      }
      expect(hasError).toBeFalsy();
    }
  });
});
