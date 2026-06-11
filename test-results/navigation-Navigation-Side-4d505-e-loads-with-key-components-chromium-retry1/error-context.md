# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation & Sidebar >> dashboard page loads with key components
- Location: e2e/navigation.spec.ts:42:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]: Internal Server Error
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * Navigation & Sidebar Tests
  5  |  * Verifies the sidebar navigation renders correctly and all main routes
  6  |  * are accessible. Since these routes require auth/onboarding context,
  7  |  * we test by direct navigation and verify content rendering.
  8  |  * 
  9  |  * NOTE: Uses domcontentloaded + timeout instead of networkidle because
  10 |  * the dev server may return 500 on some routes, causing networkidle to hang.
  11 |  */
  12 | test.describe('Navigation & Sidebar', () => {
  13 |   test('sidebar contains all main navigation links', async ({ page }) => {
  14 |     await page.goto('/dashboard');
  15 |     await page.waitForTimeout(3000);
  16 | 
  17 |     // Wait for sidebar to render
  18 |     const sidebar = page.locator('nav').or(page.locator('[class*="sidebar"]')).first();
  19 |     await expect(sidebar).toBeVisible({ timeout: 15000 }).catch(() => {
  20 |       // Sidebar may not render without auth context
  21 |     });
  22 | 
  23 |     // Check for brand name in the sidebar area
  24 |     const brandName = page.locator('text=EmpireLaunch AI').or(page.locator('[class*="BrandedGlobe"]')).first();
  25 |     await expect(brandName).toBeVisible({ timeout: 10000 }).catch(() => {
  26 |       // Brand globe might use lazy rendering
  27 |     });
  28 | 
  29 |     // Verify expected nav items exist in the DOM
  30 |     const navLabels = ['Home', 'Operation Base', 'Empire Studio', 'Link Center', 'Control Gates', 'Empire Ledger', 'Settings'];
  31 |     for (const label of navLabels) {
  32 |       const navItem = page.locator(`text=${label}`).first();
  33 |       const visible = await navItem.isVisible().catch(() => false);
  34 |       if (!visible) {
  35 |         // Nav items might be hidden without auth, skip
  36 |         continue;
  37 |       }
  38 |       await expect(navItem).toBeVisible();
  39 |     }
  40 |   });
  41 | 
  42 |   test('dashboard page loads with key components', async ({ page }) => {
  43 |     await page.goto('/dashboard');
  44 |     await page.waitForTimeout(4000); // Allow async components to hydrate
  45 | 
  46 |     // The page should render at least some content
  47 |     const bodyContent = page.locator('body');
  48 |     const text = await bodyContent.innerText().catch(() => '');
  49 |     expect(text.length).toBeGreaterThan(0);
  50 | 
  51 |     // Look for key dashboard headings or indicators
  52 |     const headings = page.locator('h1, h2, h3');
  53 |     const headingCount = await headings.count();
> 54 |     expect(headingCount).toBeGreaterThan(0);
     |                          ^ Error: expect(received).toBeGreaterThan(expected)
  55 |   });
  56 | 
  57 |   test('navigation to each authenticated page loads content', async ({ page }) => {
  58 |     const routes = [
  59 |       { path: '/dashboard', label: 'Dashboard' },
  60 |       { path: '/empire-center', label: 'Operation Base' },
  61 |       { path: '/studio', label: 'Studio' },
  62 |       { path: '/link-center', label: 'Link Center' },
  63 |       { path: '/review', label: 'Review/Control Gates' },
  64 |       { path: '/analytics', label: 'Analytics' },
  65 |       { path: '/settings', label: 'Settings' },
  66 |     ];
  67 | 
  68 |     for (const route of routes) {
  69 |       await page.goto(route.path, { waitUntil: 'domcontentloaded' });
  70 |       await page.waitForTimeout(3000);
  71 | 
  72 |       // Verify page loaded - should have content
  73 |       const bodyText = await page.locator('body').innerText().catch(() => '');
  74 |       expect(bodyText.length).toBeGreaterThan(0, `Route ${route.path} returned empty content`);
  75 | 
  76 |       // Verify no crash/error state
  77 |       const errorElement = page.locator('text=Application error, text=Internal Server Error, text=500').first();
  78 |       const hasError = await errorElement.isVisible().catch(() => false);
  79 |       expect(hasError).toBeFalsy();
  80 |     }
  81 |   });
  82 | 
  83 |   test('responsive mobile nav renders on small viewport', async ({ page }) => {
  84 |     // Set mobile viewport
  85 |     await page.setViewportSize({ width: 375, height: 812 });
  86 |     await page.goto('/dashboard');
  87 |     await page.waitForTimeout(4000);
  88 | 
  89 |     // Check for mobile navigation elements
  90 |     const mobileNav = page.locator('[class*="MobileNav"], [class*="mobile"], nav[class*="bottom"]').first();
  91 |     const visible = await mobileNav.isVisible().catch(() => false);
  92 |     if (visible) {
  93 |       await expect(mobileNav).toBeVisible();
  94 |     }
  95 |   });
  96 | });
```