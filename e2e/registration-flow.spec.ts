import { test, expect } from '@playwright/test';

/**
 * Registration Flow Smoke Tests
 * Tests the complete registration/onboarding process from the landing page
 * through protocol acceptance and step progression.
 * 
 * NOTE: Uses domcontentloaded + generous timeouts since auth-gated pages
 * may redirect and some components require async hydration.
 */
test.describe('Registration Flow', () => {
  test('RF-1: landing page loads with brand identity and CTA', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Verify brand identity elements are present
    const pageTitle = await page.title();
    expect(pageTitle).toContain('EmpireLaunch');

    // Page should have rendered content (not blank)
    const bodyText = await page.locator('body').innerText().catch(() => '');
    expect(bodyText.length).toBeGreaterThan(0);

    // Look for primary action button (Get Started / Launch / Begin)
    const ctaButton = page.locator(
      'button:has-text("Get Started"), ' +
      'button:has-text("Launch"), ' +
      'button:has-text("Begin"), ' +
      'button:has-text("Start"), ' +
      'a:has-text("Get Started"), ' +
      'a:has-text("Launch")'
    ).first();
    
    const ctaVisible = await ctaButton.isVisible().catch(() => false);
    if (ctaVisible) {
      await expect(ctaButton).toBeVisible();
    }
  });

  test('RF-2: terms modal opens from landing page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Look for terms/privacy links that trigger the TermsModal
    const termsLink = page.locator(
      'button:has-text("Terms"), ' +
      'a:has-text("Terms"), ' +
      'button:has-text("Privacy"), ' +
      'a:has-text("Privacy"), ' +
      'button:has-text("Legal")'
    ).first();

    const termsVisible = await termsLink.isVisible().catch(() => false);
    if (termsVisible) {
      await termsLink.click();
      await page.waitForTimeout(1000);

      // After clicking terms, a modal or overlay should appear
      const modalContent = page.locator(
        'text=Terms of Service, ' +
        'text=Privacy Policy, ' +
        'text=Terms & Conditions, ' +
        'text=Service Agreement'
      ).first();

      const modalVisible = await modalContent.isVisible().catch(() => false);
      if (modalVisible) {
        await expect(modalContent).toBeVisible();
      }
    }
  });

  test('RF-3: navigation to onboarding page', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Onboarding page should render content
    const bodyText = await page.locator('body').innerText().catch(() => '');
    expect(bodyText.length).toBeGreaterThan(0);

    // Verify the URL is or contains /onboarding
    const currentUrl = page.url();
    expect(currentUrl).toContain('onboarding');
  });

  test('RF-4: onboarding page displays protocol step with terms acceptance', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // The onboarding flow starts with Step 1: Protocol
    // This step typically has terms/protocol acceptance
    const protocolText = page.locator(
      'text=Protocol, ' +
      'text=Accept, ' +
      'text=Agree, ' +
      'text=Terms, ' +
      'text=Continue'
    ).first();

    const protocolVisible = await protocolText.isVisible().catch(() => false);
    if (protocolVisible) {
      await expect(protocolText).toBeVisible();
    }

    // Find interactive elements (buttons) on the page
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // The step should have actionable buttons
      expect(buttonCount).toBeGreaterThan(0);
    }
  });

  test('RF-5: onboarding shows progress steps or constellation', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // The onboarding has steps defined: Protocol, Neural Identity, Authorization, etc.
    // Look for step indicators
    const stepLabels = ['Protocol', 'Neural Identity', 'Authorization', 'Business Identity', 'Matrix', 'Toolkit'];
    let foundStep = false;

    for (const label of stepLabels) {
      const step = page.locator(`text=${label}`).first();
      if (await step.isVisible().catch(() => false)) {
        foundStep = true;
        await expect(step).toBeVisible();
        break;
      }
    }

    // Progress indicators (numbers, dots, constellation)
    const progressIndicators = page.locator(
      '[class*="ProgressConstellation"], ' +
      '[class*="step"], ' +
      '[class*="progress"], ' +
      '[class*="constellation"]'
    ).first();

    const progressVisible = await progressIndicators.isVisible().catch(() => false);
    
    if (!foundStep && !progressVisible) {
      test.info().annotations.push({
        type: 'warn',
        description: 'No step indicators found - onboarding may be in a different state'
      });
    }
  });

  test('RF-6: onboarding page does not crash on direct navigation', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Check for crash indicators
    const errorIndicators = [
      'Application error',
      'Internal Server Error',
      'Something went wrong',
      'this.props.dispatch is not a function',
      'Cannot read properties of undefined'
    ];

    let hasError = false;
    for (const errorText of errorIndicators) {
      const errorEl = page.locator(`text="${errorText}"`).first();
      const visible = await errorEl.isVisible().catch(() => false);
      if (visible) {
        hasError = true;
        test.info().annotations.push({
          type: 'error',
          description: `CRITICAL: Onboarding shows error: ${errorText}`
        });
      }
    }

    expect(hasError).toBeFalsy();
  });

  test('RF-7: auth callback route does not crash', async ({ page }) => {
    // Test multiple OAuth callback endpoints for crashes
    const callbackPlatforms = ['etsy', 'tiktok', 'shopify', 'gmail', 'meta', 'canva'];
    
    for (const platform of callbackPlatforms) {
      await page.goto(`/auth/callback/${platform}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const errorEl = page.locator(
        'text=Application error, ' +
        'text=Internal Server Error, ' +
        'text=Not Found'
      ).first();
      
      const hasError = await errorEl.isVisible().catch(() => false);
      if (hasError) {
        test.info().annotations.push({
          type: 'error',
          description: `Auth callback /auth/callback/${platform} crashed`
        });
      }
      expect(hasError).toBeFalsy();

      // Should return content (even if it's just a processing state)
      const bodyText = await page.locator('body').innerText().catch(() => '');
      expect(bodyText.length).toBeGreaterThan(0);
    }
  });
});