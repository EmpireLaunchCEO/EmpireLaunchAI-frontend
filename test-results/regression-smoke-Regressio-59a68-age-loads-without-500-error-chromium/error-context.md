# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression-smoke.spec.ts >> Regression Smoke Suite >> smoke: Landing Page (/) loads without 500 error
- Location: e2e/regression-smoke.spec.ts:25:9

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - img "EmpireLaunch AI" [ref=e6]
      - generic [ref=e7]:
        - heading "Neural Path Authorized" [level=2] [ref=e8]
        - paragraph [ref=e9]: Transferring to Command Center...
    - navigation [ref=e14]:
      - generic [ref=e15]:
        - img [ref=e17]
        - generic [ref=e19]: EmpireLaunch AI
      - generic [ref=e22]: "System Live: v4.7.0-HYPE (Empire Studio)"
    - main [ref=e23]:
      - generic [ref=e24]:
        - generic [ref=e25]:
          - img [ref=e26]
          - generic [ref=e28]: Autonomous Business Engineering
        - heading "YOUR EMPIRE AWAITS" [level=1] [ref=e29]
        - paragraph [ref=e30]: The high-intelligence AI partner that builds, markets, and scales your business while you sleep.
        - generic [ref=e31]:
          - button "Access Command Center" [ref=e32] [cursor=pointer]:
            - text: Access Command Center
            - img [ref=e33]
          - button "Returning Owner? Neural Log In" [ref=e35] [cursor=pointer]
        - generic: "System Build: v4.7.0 (Shimmer)"
      - generic [ref=e36]:
        - generic [ref=e37]:
          - img [ref=e39]
          - heading "Secure Protocol" [level=3] [ref=e41]
          - paragraph [ref=e42]: Your financial data and personal credentials are protected via encrypted sandboxes.
        - generic [ref=e43]:
          - img [ref=e45]
          - heading "Hyper Scaling" [level=3] [ref=e50]
          - paragraph [ref=e51]: AI intelligence monitors global trends 24/7 to adjust your strategy instantly.
  - generic [ref=e56] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e57]:
      - img [ref=e58]
    - generic [ref=e61]:
      - button "Open issues overlay" [ref=e62]:
        - generic [ref=e63]:
          - generic [ref=e64]: "0"
          - generic [ref=e65]: "1"
        - generic [ref=e66]: Issue
      - button "Collapse issues badge" [ref=e67]:
        - img [ref=e68]
  - alert [ref=e70]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Regression Smoke Test
  5   |  * A quick run-through of all critical paths to ensure nothing is broken.
  6   |  * This is the first test to run before any major merge.
  7   |  * 
  8   |  * Tests all public and authenticated routes for 200 status and basic rendering.
  9   |  */
  10  | test.describe('Regression Smoke Suite', () => {
  11  |   const criticalRoutes = [
  12  |     { path: '/', name: 'Landing Page' },
  13  |     { path: '/onboarding', name: 'Onboarding' },
  14  |     { path: '/dashboard', name: 'Dashboard' },
  15  |     { path: '/studio', name: 'Empire Studio' },
  16  |     { path: '/empire-center', name: 'Operation Base' },
  17  |     { path: '/analytics', name: 'Analytics/Intelligence' },
  18  |     { path: '/link-center', name: 'Link Center' },
  19  |     { path: '/review', name: 'Control Gates/Review' },
  20  |     { path: '/settings', name: 'Settings' },
  21  |     { path: '/design-center', name: 'Design Center' },
  22  |   ];
  23  | 
  24  |   for (const route of criticalRoutes) {
  25  |     test(`smoke: ${route.name} (${route.path}) loads without 500 error`, async ({ page }) => {
  26  |       const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
  27  |       
  28  |       // Allow soft failures for auth-gated pages (they might redirect)
  29  |       const status = response?.status() ?? 0;
  30  |       const ok = status >= 200 && status < 400;
  31  |       
  32  |       if (!ok) {
  33  |         test.info().annotations.push({
  34  |           type: 'warn',
  35  |           description: `Route ${route.path} returned status ${status} (may be auth-protected)`
  36  |         });
  37  |       }
  38  | 
  39  |       // Wait for JS to execute
  40  |       await page.waitForTimeout(2000);
  41  | 
  42  |       // Verify page doesn't crash with a runtime error
  43  |       const bodyText = await page.locator('body').innerText().catch(() => '');
> 44  |       expect(bodyText.length).toBeGreaterThan(0, `${route.path} returned empty body`);
      |                               ^ Error: expect(received).toBeGreaterThan(expected)
  45  | 
  46  |       // Check for critical errors
  47  |       const errorIndicators = [
  48  |         'Application error',
  49  |         'Internal Server Error',
  50  |         'Something went wrong',
  51  |         '500',
  52  |         'this.props.dispatch is not a function',
  53  |         'Cannot read properties of undefined',
  54  |       ];
  55  | 
  56  |       for (const errorText of errorIndicators) {
  57  |         const errorEl = page.locator(`text="${errorText}"`).first();
  58  |         const hasError = await errorEl.isVisible().catch(() => false);
  59  |         if (hasError) {
  60  |           // Only fail on actual application errors (500), not on auth redirects
  61  |           if (page.locator('text=500').first()) {
  62  |             // Check if it's an actual error page, not just text
  63  |             const pageTitle = await page.title().catch(() => '');
  64  |             if (pageTitle.includes('500') || pageTitle.includes('Error')) {
  65  |               test.info().annotations.push({
  66  |                 type: 'error',
  67  |                 description: `CRITICAL: ${route.path} shows error: ${errorText}`
  68  |               });
  69  |             }
  70  |           }
  71  |         }
  72  |       }
  73  |     });
  74  |   }
  75  | 
  76  |   test('regression: payment button list renders without touching security layer', async ({ page }) => {
  77  |     // This test verifies we don't break the Payment Button system (LOCKED)
  78  |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  79  |     await page.waitForTimeout(4000);
  80  | 
  81  |     // PaymentButtonList component - check it exists without testing security logic
  82  |     const paymentSection = page.locator('text=Buy Button, text=Payment, text=Sell').first();
  83  |     const visible = await paymentSection.isVisible().catch(() => false);
  84  |     
  85  |     if (visible) {
  86  |       // Don't interact with payment logic - just verify it renders
  87  |       await expect(paymentSection).toBeVisible();
  88  |     }
  89  |   });
  90  | 
  91  |   test('regression: all sidebar links point to valid routes', async ({ page }) => {
  92  |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  93  |     await page.waitForTimeout(4000);
  94  | 
  95  |     // Find all navigation links in the sidebar
  96  |     const navLinks = page.locator('nav a, [class*="sidebar"] a, aside a');
  97  |     const linkCount = await navLinks.count();
  98  | 
  99  |     if (linkCount === 0) {
  100 |       test.info().annotations.push({
  101 |         type: 'warn',
  102 |         description: 'No nav links found - auth/protected content may be hidden'
  103 |       });
  104 |       return;
  105 |     }
  106 | 
  107 |     for (let i = 0; i < linkCount; i++) {
  108 |       const href = await navLinks.nth(i).getAttribute('href').catch(() => null);
  109 |       if (href && href.startsWith('/')) {
  110 |         // Verify the link target loads
  111 |         const response = await page.goto(href, { waitUntil: 'domcontentloaded' }).catch(() => null);
  112 |         const status = response?.status() ?? 0;
  113 |         // 307/308 are redirects (auth), which is acceptable
  114 |         expect(status < 500 || status === 307 || status === 308).toBeTruthy();
  115 |       }
  116 |     }
  117 |   });
  118 | });
```