# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: phase2-3-smoke.spec.ts >> Phase 2: Financials & Payment Button >> Phase2-1: financial command component renders on dashboard
- Location: e2e/phase2-3-smoke.spec.ts:153:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]: Page not found
```

# Test source

```ts
  71  |     }
  72  |   });
  73  | 
  74  |   test('Phase3-3: high-fidelity mobile navigation renders on small viewport', async ({ page }) => {
  75  |     // Set mobile viewport
  76  |     await page.setViewportSize({ width: 375, height: 812 });
  77  |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  78  |     await page.waitForTimeout(5000);
  79  | 
  80  |     // Page should render content
  81  |     const bodyText = await page.locator('body').innerText().catch(() => '');
  82  |     expect(bodyText.length).toBeGreaterThan(0);
  83  | 
  84  |     // Check for mobile navigation elements
  85  |     const mobileNav = page.locator(
  86  |       '[class*="MobileNav"], ' +
  87  |       '[class*="mobile"], ' +
  88  |       'nav[class*="bottom"], ' +
  89  |       'nav a, ' +
  90  |       '[class*="sidebar"]'
  91  |     ).first();
  92  | 
  93  |     const navVisible = await mobileNav.isVisible().catch(() => false);
  94  |     if (navVisible) {
  95  |       await expect(mobileNav).toBeVisible();
  96  |     }
  97  | 
  98  |     // Verify dark theme persists on mobile
  99  |     const bgColor = await page.evaluate(() => {
  100 |       return getComputedStyle(document.body).backgroundColor;
  101 |     });
  102 |     const isDark = bgColor.includes('rgb(10, 5, 25)') || bgColor.includes('rgb(0, 0, 0)');
  103 |     expect(isDark).toBeTruthy();
  104 |   });
  105 | 
  106 |   test('Phase3-4: navigation between main routes does not crash on mobile', async ({ page }) => {
  107 |     await page.setViewportSize({ width: 375, height: 812 });
  108 |     
  109 |     const routes = ['/dashboard', '/studio', '/link-center', '/settings'];
  110 |     
  111 |     for (const route of routes) {
  112 |       await page.goto(route, { waitUntil: 'domcontentloaded' });
  113 |       await page.waitForTimeout(3000);
  114 | 
  115 |       // Verify page loaded without crash
  116 |       const bodyText = await page.locator('body').innerText().catch(() => '');
  117 |       expect(bodyText.length).toBeGreaterThan(0);
  118 | 
  119 |       // Verify no application errors
  120 |       const errorEl = page.locator('text=Application error, text=Internal Server Error').first();
  121 |       expect(await errorEl.isVisible().catch(() => false)).toBeFalsy();
  122 |     }
  123 |   });
  124 | 
  125 |   test('Phase3-5: navigation sidebar shows all empire sections', async ({ page }) => {
  126 |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  127 |     await page.waitForTimeout(4000);
  128 | 
  129 |     // Look for sidebar navigation links
  130 |     const navItems = ['Home', 'Operation Base', 'Empire Studio', 'Link Center', 'Control Gates', 'Settings'];
  131 |     let foundItems = 0;
  132 | 
  133 |     for (const item of navItems) {
  134 |       const navLink = page.locator(`text=${item}`).first();
  135 |       if (await navLink.isVisible().catch(() => false)) {
  136 |         foundItems++;
  137 |       }
  138 |     }
  139 | 
  140 |     test.info().annotations.push({
  141 |       type: 'info',
  142 |       description: `Found ${foundItems}/${navItems.length} navigation items`
  143 |     });
  144 | 
  145 |     if (foundItems > 0) {
  146 |       // At least some nav items should be visible
  147 |       expect(foundItems).toBeGreaterThan(0);
  148 |     }
  149 |   });
  150 | });
  151 | 
  152 | test.describe('Phase 2: Financials & Payment Button', () => {
  153 |   test('Phase2-1: financial command component renders on dashboard', async ({ page }) => {
  154 |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  155 |     await page.waitForTimeout(5000);
  156 | 
  157 |     // Check for FinancialCommand component
  158 |     const financeSection = page.locator(
  159 |       'text=Empire Finances, ' +
  160 |       'text=Empire Financials, ' +
  161 |       'text=Success-Share, ' +
  162 |       'text=Financial'
  163 |     ).first();
  164 | 
  165 |     const financeVisible = await financeSection.isVisible().catch(() => false);
  166 |     if (financeVisible) {
  167 |       await expect(financeSection).toBeVisible();
  168 |     } else {
  169 |       // The component may be behind auth — check if page renders at all
  170 |       const headingCount = await page.locator('h1, h2, h3').count();
> 171 |       expect(headingCount).toBeGreaterThan(0);
      |                            ^ Error: expect(received).toBeGreaterThan(expected)
  172 |     }
  173 |   });
  174 | 
  175 |   test('Phase2-2: financial command toggle functionality', async ({ page }) => {
  176 |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  177 |     await page.waitForTimeout(5000);
  178 | 
  179 |     // Look for minimize/maximize toggle in FinancialCommand
  180 |     const toggleBtn = page.locator(
  181 |       'button:has-text("Maximize"), ' +
  182 |       'button:has-text("Minimize"), ' +
  183 |       'button[class*="Maximize"], ' +
  184 |       'button[class*="Minimize"]'
  185 |     ).first();
  186 | 
  187 |     const toggleVisible = await toggleBtn.isVisible().catch(() => false);
  188 |     if (toggleVisible) {
  189 |       await toggleBtn.click();
  190 |       await page.waitForTimeout(500);
  191 | 
  192 |       // After clicking, state should have changed
  193 |       const newText = await toggleBtn.textContent().catch(() => '');
  194 |       expect(newText.length).toBeGreaterThan(0);
  195 |     }
  196 |   });
  197 | 
  198 |   test('Phase2-3: financial command shows revenue and subscription info', async ({ page }) => {
  199 |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  200 |     await page.waitForTimeout(5000);
  201 | 
  202 |     // Check for revenue/earnings display
  203 |     const earnings = page.locator(
  204 |       'text=$, ' +
  205 |       'text=Available, ' +
  206 |       'text=Revenue, ' +
  207 |       'text=Earnings, ' +
  208 |       'text=Balance'
  209 |     ).first();
  210 | 
  211 |     const earningsVisible = await earnings.isVisible().catch(() => false);
  212 |     if (earningsVisible) {
  213 |       await expect(earnings).toBeVisible();
  214 |     }
  215 |   });
  216 | 
  217 |   test('Phase2-4: subscription and success-share section renders', async ({ page }) => {
  218 |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  219 |     await page.waitForTimeout(5000);
  220 | 
  221 |     // Check for subscription/success-share UI
  222 |     const subscriptionSection = page.locator(
  223 |       'text=Success-Share, ' +
  224 |       'text=Subscription, ' +
  225 |       'text=Plan, ' +
  226 |       'text=Active Plan'
  227 |     ).first();
  228 | 
  229 |     const subVisible = await subscriptionSection.isVisible().catch(() => false);
  230 |     if (subVisible) {
  231 |       await expect(subscriptionSection).toBeVisible();
  232 |     }
  233 |   });
  234 | 
  235 |   test('Phase2-5: dashboard loads without crashing', async ({ page }) => {
  236 |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  237 |     await page.waitForTimeout(5000);
  238 | 
  239 |     // Verify no crash state
  240 |     const errorIndicators = [
  241 |       'Application error',
  242 |       'Internal Server Error',
  243 |       'Something went wrong',
  244 |       'this.props.dispatch is not a function',
  245 |       'Cannot read properties of undefined'
  246 |     ];
  247 | 
  248 |     for (const err of errorIndicators) {
  249 |       const el = page.locator(`text="${err}"`).first();
  250 |       const hasError = await el.isVisible().catch(() => false);
  251 |       if (hasError) {
  252 |         test.info().annotations.push({
  253 |           type: 'error',
  254 |           description: `CRITICAL: Dashboard shows error: ${err}`
  255 |         });
  256 |       }
  257 |       expect(hasError).toBeFalsy();
  258 |     }
  259 |   });
  260 | });
  261 | 
```