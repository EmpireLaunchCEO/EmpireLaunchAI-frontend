# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.ts >> Landing Page & Brand >> landing page loads with correct title and brand elements
- Location: e2e/landing.spec.ts:9:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /EmpireLaunch AI/
Received string:  ""
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × unexpected value ""

```

```yaml
- text: Internal Server Error
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * Landing Page & Brand Verification
  5  |  * Tests that the public-facing landing page loads with correct brand elements,
  6  |  * visual identity, and key interactive components.
  7  |  */
  8  | test.describe('Landing Page & Brand', () => {
  9  |   test('landing page loads with correct title and brand elements', async ({ page }) => {
  10 |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  11 | 
  12 |     // Verify the page title contains the brand name
> 13 |     await expect(page).toHaveTitle(/EmpireLaunch AI/);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
  14 | 
  15 |     // Wait for the page to render
  16 |     await page.waitForTimeout(3000);
  17 | 
  18 |     // Verify the brand globe component renders
  19 |     const globe = page.locator('[class*="BrandedGlobe"], svg[class*="globe"], svg[vieWbox="0 0 100 100"]').first();
  20 |     await expect(globe).toBeVisible({ timeout: 10000 }).catch(() => {/* globe might render invisibly */});
  21 | 
  22 |     // Verify heading text mentioning EmpireLaunch or AI Automation
  23 |     await expect(page.locator('body')).not.toBeEmpty();
  24 |   });
  25 | 
  26 |   test('landing page has functional language and currency selectors', async ({ page }) => {
  27 |     await page.goto('/');
  28 |     await page.waitForTimeout(3000);
  29 | 
  30 |     // Check that the language selector exists (if the TermsModal or language button renders)
  31 |     // This is a soft check - the page should at least show something interactive
  32 |     const interactiveElements = page.locator('button, a, select');
  33 |     const count = await interactiveElements.count();
  34 |     expect(count).toBeGreaterThan(0);
  35 |   });
  36 | 
  37 |   test('landing page redirects to onboarding when terms accepted', async ({ page }) => {
  38 |     await page.goto('/');
  39 |     await page.waitForTimeout(3000);
  40 | 
  41 |     // Check for call-to-action or continue navigation
  42 |     const getStartedBtn = page.getByRole('link', { name: /get started|launch|start/i }).first();
  43 |     const ctaButton = page.locator('button:has-text("Continue"), button:has-text("Start"), button:has-text("Launch")').first();
  44 | 
  45 |     if (await getStartedBtn.isVisible().catch(() => false)) {
  46 |       await getStartedBtn.click();
  47 |       // May redirect to onboarding
  48 |       await page.waitForURL(/onboarding/, { timeout: 5000 }).catch(() => {});
  49 |     } else if (await ctaButton.isVisible().catch(() => false)) {
  50 |       await ctaButton.click();
  51 |     }
  52 |   });
  53 | });
```