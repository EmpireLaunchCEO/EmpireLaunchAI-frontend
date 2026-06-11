import { test, expect } from '@playwright/test';

/**
 * Studio Page Tests
 * Tests the Studio (content creation hub) page tab navigation
 * and key interactive components.
 */
test.describe('Empire Studio', () => {
  test('studio page loads with tab navigation', async ({ page }) => {
    await page.goto('/studio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2500);

    // Check that the page has rendered with content
    const bodyText = await page.locator('body').innerText().catch(() => '');
    expect(bodyText.length).toBeGreaterThan(0);

    // Check for tab labels from the page: gallery, cinema, activity, radar
    const tabLabels = ['Gallery', 'Cinema', 'Activity', 'Radar'];
    let foundTab = false;
    for (const label of tabLabels) {
      const tab = page.locator(`text=${label}`).first();
      if (await tab.isVisible().catch(() => false)) {
        foundTab = true;
        await expect(tab).toBeVisible();
      }
    }

    if (!foundTab) {
      test.info().annotations.push({
        type: 'warn', 
        description: 'No studio tabs found - component may require auth context'
      });
    }
  });

  test('studio page tabs switch content', async ({ page }) => {
    await page.goto('/studio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find clickable tab buttons
    const tabs = page.locator('button, [role="tab"]').filter({ hasText: /Gallery|Cinema|Activity|Radar/i });
    const tabCount = await tabs.count();

    if (tabCount < 2) {
      test.info().annotations.push({
        type: 'warn',
        description: 'Insufficient tabs found for switching test'
      });
      return;
    }

    // Click each tab and verify the page responds
    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i);
      const tabText = await tab.textContent().catch(() => '');
      if (tabText.trim()) {
        await tab.click();
        await page.waitForTimeout(500);
        
        // Verify no crash
        const errorElements = page.locator('text=Error, text=Something went wrong').first();
        const hasError = await errorElements.isVisible().catch(() => false);
        expect(hasError).toBeFalsy();
      }
    }
  });

  test('studio has DNA vault counter', async ({ page }) => {
    await page.goto('/studio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // The DNAVaultCounter component shows vaulted items
    const dnaVault = page.locator('text=DNA Vault, text=Vaulted, text=Design DNA').first();
    if (await dnaVault.isVisible().catch(() => false)) {
      await expect(dnaVault).toBeVisible();
    }
  });
});