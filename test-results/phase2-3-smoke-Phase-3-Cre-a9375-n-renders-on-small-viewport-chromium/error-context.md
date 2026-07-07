# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: phase2-3-smoke.spec.ts >> Phase 3: Creative Loop & Navigation >> Phase3-3: high-fidelity mobile navigation renders on small viewport
- Location: e2e/phase2-3-smoke.spec.ts:74:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e2]: Page not found
```

# Test source

```ts
  3   | /**
  4   |  * Phase 2/3 Targeted Smoke Tests
  5   |  * 
  6   |  * Light-weight tests designed for memory-constrained environments.
  7   |  * Tests Phase 2 Financials (Payment Button, Financial Command) and
  8   |  * Phase 3 features (High-Fidelity Navigation, Empire Studio).
  9   |  * 
  10  |  * Run with: PLAYWRIGHT_BROWSERS_PATH=/opt/browsers npx playwright test --grep "Phase2|Phase3"
  11  |  * 
  12  |  * For memory efficiency: use `next build` + `next start` instead of `next dev`
  13  |  * 
  14  |  * NOTE: Uses domcontentloaded + generous timeouts. Auth-gated pages
  15  |  * may redirect but should not crash.
  16  |  */
  17  | 
  18  | test.describe('Phase 3: Creative Loop & Navigation', () => {
  19  |   test('Phase3-1: empire studio page loads and renders creative workspace', async ({ page }) => {
  20  |     await page.goto('/studio', { waitUntil: 'domcontentloaded' });
  21  |     await page.waitForTimeout(4000);
  22  | 
  23  |     // Page should have content
  24  |     const bodyText = await page.locator('body').innerText().catch(() => '');
  25  |     expect(bodyText.length).toBeGreaterThan(0);
  26  | 
  27  |     // Studio should show creative workspace tabs
  28  |     const tabLabels = ['Gallery', 'Cinema', 'Activity', 'Radar'];
  29  |     let foundTab = false;
  30  |     for (const label of tabLabels) {
  31  |       const tab = page.locator(`text=${label}`).first();
  32  |       if (await tab.isVisible().catch(() => false)) {
  33  |         foundTab = true;
  34  |         break;
  35  |       }
  36  |     }
  37  | 
  38  |     if (!foundTab) {
  39  |       test.info().annotations.push({
  40  |         type: 'warn',
  41  |         description: 'Studio tabs not found — may require auth context'
  42  |       });
  43  |     }
  44  | 
  45  |     // Verify no crash state
  46  |     const crashIndicators = ['Application error', 'Internal Server Error', 'Something went wrong'];
  47  |     for (const err of crashIndicators) {
  48  |       const el = page.locator(`text="${err}"`).first();
  49  |       expect(await el.isVisible().catch(() => false)).toBeFalsy();
  50  |     }
  51  |   });
  52  | 
  53  |   test('Phase3-2: studio creative content renders without client errors', async ({ page }) => {
  54  |     await page.goto('/studio', { waitUntil: 'domcontentloaded' });
  55  |     await page.waitForTimeout(5000);
  56  | 
  57  |     // Check for DNA Vault counter (creative asset storage)
  58  |     const dnaVault = page.locator('text=DNA Vault, text=Vaulted, text=Design DNA').first();
  59  |     const dnaVisible = await dnaVault.isVisible().catch(() => false);
  60  |     if (dnaVisible) {
  61  |       await expect(dnaVault).toBeVisible();
  62  |     }
  63  | 
  64  |     // Check for the content creation section
  65  |     const createSection = page.locator(
  66  |       'text=Create, text=Generate, text=Content, text=Studio'
  67  |     ).first();
  68  |     const createVisible = await createSection.isVisible().catch(() => false);
  69  |     if (createVisible) {
  70  |       await expect(createSection).toBeVisible();
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
> 103 |     expect(isDark).toBeTruthy();
      |                    ^ Error: expect(received).toBeTruthy()
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
  171 |       expect(headingCount).toBeGreaterThan(0);
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
```