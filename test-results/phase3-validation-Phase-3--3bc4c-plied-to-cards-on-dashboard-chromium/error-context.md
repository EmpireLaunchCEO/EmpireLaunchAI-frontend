# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: phase3-validation.spec.ts >> Phase 3: High-Fidelity Branding >> P3-5: shimmer border effect is applied to cards on dashboard
- Location: e2e/phase3-validation.spec.ts:167:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - img "EmpireLaunch AI" [ref=e7]
  - generic [ref=e8]:
    - heading "Neural Path Authorized" [level=2] [ref=e9]
    - paragraph [ref=e10]: Synchronizing Neural Path...
```

# Test source

```ts
  78  |       const errEl = page.locator(`text="${err}"`).first();
  79  |       const found = await errEl.isVisible().catch(() => false);
  80  |       expect(found).toBeFalsy();
  81  |     }
  82  |   });
  83  | });
  84  | 
  85  | test.describe('Phase 3: High-Fidelity Branding', () => {
  86  | 
  87  |   test('P3-3: branding background renders as dark violet on landing page', async ({ page }) => {
  88  |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  89  |     await page.waitForTimeout(3000);
  90  | 
  91  |     // Check background on both html and body (the CSS applies to both)
  92  |     const bgColors = await page.evaluate(() => {
  93  |       const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
  94  |       const bodyBg = getComputedStyle(document.body).backgroundColor;
  95  |       return { htmlBg, bodyBg };
  96  |     });
  97  | 
  98  |     // The background should be a dark color — either rgb(10, 5, 25) or rgba format
  99  |     const isDarkBackground = (bg: string) => {
  100 |       const rgbMatch = bg.match(/rgb\((\d+)/);
  101 |       if (!rgbMatch) return false;
  102 |       const red = parseInt(rgbMatch[1]);
  103 |       return red <= 20; // Very dark red component = dark background
  104 |     };
  105 | 
  106 |     const htmlIsDark = isDarkBackground(bgColors.htmlBg);
  107 |     const bodyIsDark = isDarkBackground(bgColors.bodyBg);
  108 |     
  109 |     if (!htmlIsDark && !bodyIsDark) {
  110 |       // Log actual values for debugging
  111 |       test.info().annotations.push({
  112 |         type: 'warn',
  113 |         description: `Background colors - html: ${bgColors.htmlBg}, body: ${bgColors.bodyBg}`
  114 |       });
  115 |     }
  116 |     
  117 |     expect(htmlIsDark || bodyIsDark).toBeTruthy();
  118 | 
  119 |     // Also check for theme-gradient text on the page
  120 |     const gradientElements = await page.evaluate(() => {
  121 |       const els = document.querySelectorAll('h1, h2, h3');
  122 |       const results: string[] = [];
  123 |       els.forEach(el => {
  124 |         const bgImage = getComputedStyle(el).backgroundImage || '';
  125 |         if (bgImage.includes('linear-gradient')) {
  126 |           results.push(bgImage.substring(0, 80));
  127 |         }
  128 |       });
  129 |       return results;
  130 |     });
  131 | 
  132 |     // There should be at least some gradient-styled headings
  133 |     expect(gradientElements.length).toBeGreaterThan(0);
  134 |   });
  135 | 
  136 |   test('P3-4: branding persists on mobile viewport', async ({ page }) => {
  137 |     // Set mobile viewport
  138 |     await page.setViewportSize({ width: 375, height: 812 });
  139 |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  140 |     await page.waitForTimeout(3000);
  141 | 
  142 |     // Background should still be dark
  143 |     const bgColors = await page.evaluate(() => {
  144 |       const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
  145 |       const bodyBg = getComputedStyle(document.body).backgroundColor;
  146 |       return { htmlBg, bodyBg };
  147 |     });
  148 |     
  149 |     const isDark = (bg: string) => {
  150 |       const m = bg.match(/rgb\((\d+)/);
  151 |       return m && parseInt(m[1]) <= 20;
  152 |     };
  153 |     expect(isDark(bgColors.htmlBg) || isDark(bgColors.bodyBg)).toBeTruthy();
  154 | 
  155 |     // Gradient headings should exist
  156 |     const hasGradient = await page.evaluate(() => {
  157 |       const els = document.querySelectorAll('h1, h2, h3');
  158 |       for (const el of els) {
  159 |         const bg = getComputedStyle(el).backgroundImage || '';
  160 |         if (bg.includes('linear-gradient')) return true;
  161 |       }
  162 |       return false;
  163 |     });
  164 |     expect(hasGradient).toBeTruthy();
  165 |   });
  166 | 
  167 |   test('P3-5: shimmer border effect is applied to cards on dashboard', async ({ page }) => {
  168 |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  169 |     await page.waitForTimeout(4000);
  170 | 
  171 |     // Check for elements with theme-based borders
  172 |     const borderElements = await page.evaluate(() => {
  173 |       const themed = document.querySelectorAll('.border-theme, .bg-theme-surface, [class*="shimmer"]');
  174 |       return themed.length;
  175 |     });
  176 | 
  177 |     // Themed borders should exist on the page
> 178 |     expect(borderElements).toBeGreaterThan(0);
      |                            ^ Error: expect(received).toBeGreaterThan(expected)
  179 |   });
  180 | 
  181 |   test('P3-6: BrandedGlobe component renders on loading states', async ({ page }) => {
  182 |     await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  183 |     await page.waitForTimeout(2000);
  184 | 
  185 |     // Check for globe component in the page
  186 |     const globe = page.locator('[class*="BrandedGlobe"], img[alt*="globe"], img[alt*="Globe"]').first();
  187 |     const globeVisible = await globe.isVisible().catch(() => false);
  188 | 
  189 |     // Globe might not be visible if auth/protected content is hidden, 
  190 |     // but it should exist in the DOM
  191 |     if (!globeVisible) {
  192 |       // Check DOM at least once
  193 |       const globeCount = await page.locator('[class*="globe"], [class*="Globe"]').count().catch(() => 0);
  194 |       // Globe may not be present without auth context - that's acceptable
  195 |       test.info().annotations.push({
  196 |         type: 'info',
  197 |         description: `BrandedGlobe count: ${globeCount} (may require auth)`
  198 |       });
  199 |     }
  200 |   });
  201 | });
  202 | 
  203 | test.describe('Phase 3: Owner Emergency Bypass', () => {
  204 | 
  205 |   test('P3-7: landing page shows ownership options for returning owners', async ({ page }) => {
  206 |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  207 |     await page.waitForTimeout(3000);
  208 | 
  209 |     // The landing page should have a "Neural Log In" or equivalent for returning owners
  210 |     const ownerLogin = page.locator('text=Neural Log In, text=Returning Owner, text=Access Command Center').first();
  211 |     const ownerVisible = await ownerLogin.isVisible().catch(() => false);
  212 | 
  213 |     // At minimum, the landing page should show content
  214 |     const bodyText = await page.locator('body').innerText().catch(() => '');
  215 |     expect(bodyText.length).toBeGreaterThan(0);
  216 | 
  217 |     if (ownerVisible) {
  218 |       await expect(ownerLogin).toBeVisible();
  219 |     }
  220 |   });
  221 | 
  222 |   test('P3-8: owner bypass does not break protected routes', async ({ page }) => {
  223 |     // The Master ID bypass should not cause crashes when accessing 
  224 |     // authenticated routes without actual auth
  225 |     for (const route of ['/dashboard', '/analytics', '/studio', '/settings']) {
  226 |       await page.goto(route, { waitUntil: 'domcontentloaded' });
  227 |       await page.waitForTimeout(2000);
  228 | 
  229 |       // Should not show crash/error page
  230 |       const crashText = page.locator('text=Application error, text=Internal Server Error, text=500').first();
  231 |       const hasCrash = await crashText.isVisible().catch(() => false);
  232 |       expect(hasCrash).toBeFalsy();
  233 | 
  234 |       // Should have some content
  235 |       const text = await page.locator('body').innerText().catch(() => '');
  236 |       expect(text.length).toBeGreaterThan(0, `Route ${route} returned empty`);
  237 | 
  238 |       // Verify middleware redirect didn't cause an error
  239 |       const currentUrl = page.url();
  240 |       // Should be at a valid page (either the route or redirected)
  241 |       expect(currentUrl.length).toBeGreaterThan(0);
  242 |     }
  243 |   });
  244 | });
```