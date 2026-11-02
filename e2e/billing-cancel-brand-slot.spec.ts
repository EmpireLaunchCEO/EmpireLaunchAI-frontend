/**
 * POST /api/billing/cancel is PER BRAND (backend PR #140).
 *
 * The server refuses to guess: with no `brandSlot` it answers
 * 400 BRAND_SLOT_REQUIRED and cancels nothing. The Settings card therefore has
 * to send the slot of the plan it is showing — the same slot it used to find
 * that plan in GET /api/billing/me.
 *
 * These tests run against a real `next build` output (.next/standalone) with
 * the billing endpoints stubbed at the network layer, so what is asserted is
 * the *real request body the browser sends*, not a type signature.
 *
 * Run against a live build:
 *   VERIFY_BASE_URL=http://127.0.0.1:3100 npx playwright test \
 *     -c <config with executablePath set> e2e/billing-cancel-brand-slot.spec.ts
 */
import { test, expect, Page } from '@playwright/test';

const BASE = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:3100';
const PERIOD_END = '2026-11-30T12:00:00.000Z';

type Captured = { body: any; rawBody: string | null; contentType: string | null };

/**
 * Everything the (authenticated) shell asks for, minus billing. Billing calls
 * fall through to the per-test handlers registered afterwards (Playwright runs
 * the most recently registered matching handler first).
 */
async function stubShell(page: Page) {
  await page.route('**/api/**', async (route) => {
    if (route.request().url().includes('/api/billing/')) return route.fallback();
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}

/** GET /api/billing/me — three live brands, none cancelling yet. */
async function stubBillingMe(page: Page) {
  const sub = (brandSlot: 'subscription' | 'brand2' | 'brand3', brandLabel: string) => ({
    subscriptionId: `sub_${brandSlot}`,
    brandSlot,
    brandLabel,
    status: 'active',
    currentPeriodEnd: PERIOD_END,
    cancelAtPeriodEnd: false,
    amount: 50,
    currency: 'usd',
    interval: 'month',
    productName: `EmpireLaunch AI — ${brandLabel}`,
  });

  await page.route('**/api/billing/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        linked: true,
        status: 'active',
        currentPeriodEnd: PERIOD_END,
        activeUntil: PERIOD_END,
        cancelAtPeriodEnd: false,
        stillActive: true,
        brands: ['subscription', 'brand2', 'brand3'],
        subscriptions: [
          sub('subscription', 'Subscription'),
          sub('brand2', 'Brand 2'),
          sub('brand3', 'Brand 3'),
        ],
        readAt: new Date().toISOString(),
      }),
    });
  });
}

async function openSettings(page: Page) {
  await page.addInitScript(() => {
    // A normal (non-owner) client: real UUID, so Settings opens on the
    // Subscription tab, and all three brand slots are owned.
    localStorage.setItem('empire_userId', '11111111-2222-3333-4444-555555555555');
    localStorage.setItem('empire_auth_token', '66666666-7777-8888-9999-000000000000');
    localStorage.setItem('slotStatus', JSON.stringify({ 0: true, 1: true, 2: true }));
  });
  await stubShell(page);
  await stubBillingMe(page);
  // The card asks for confirmation with window.confirm(); always accept.
  page.on('dialog', (dialog) => void dialog.accept());
  await page.goto(`${BASE}/settings?tab=subscription`, { waitUntil: 'domcontentloaded' });
}

/**
 * The three plan cards render in slot order (Subscription, Brand 2, Brand 3),
 * so the Nth "Cancel Subscription" button belongs to brand slot N. Returns the
 * button for a given slot index (0 = Subscription, 1 = Brand 2).
 */
async function cancelButtonForSlot(page: Page, slotIndex: number) {
  const buttons = page.getByRole('button', { name: /^Cancel Subscription$/i });
  await expect(buttons).toHaveCount(3, { timeout: 20000 });
  const button = buttons.nth(slotIndex);
  await expect(button).toBeVisible();
  // The heading of the card we are about to act on, for the record.
  const heading = button.locator(
    'xpath=ancestor::div[contains(@class,"rounded-2xl")][1]//h4',
  );
  const label = (await heading.first().innerText()).trim();
  return { button, label };
}

function captureCancel(route: any, captured: Captured[]) {
  const req = route.request();
  const raw = req.postData();
  let body: any = null;
  try { body = raw ? JSON.parse(raw) : null; } catch { body = null; }
  captured.push({ body, rawBody: raw, contentType: req.headers()['content-type'] ?? null });
  return { body, raw };
}

test.describe('Settings cancel is per brand (backend PR #140 contract)', () => {
  test('Brand 2 card sends brandSlot: "brand2"', async ({ page }) => {
    const captured: Captured[] = [];
    await openSettings(page);
    await page.route('**/api/billing/cancel', async (route) => {
      const { body } = captureCancel(route, captured);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'canceled',
          cancelled: true,
          brandSlot: body?.brandSlot ?? null,
          brandLabel: 'Brand 2',
          alreadyCancelled: false,
          cancelAtPeriodEnd: true,
          activeUntil: PERIOD_END,
          subscriptions: [],
          message: 'Your Brand 2 plan is cancelled and will not renew.',
        }),
      });
    });

    const { button, label } = await cancelButtonForSlot(page, 1);
    await button.click();

    await expect(page.getByText(/Cancelled\. You keep full access until November 30, 2026/i))
      .toBeVisible({ timeout: 15000 });

    expect(captured, 'exactly one cancel request').toHaveLength(1);
    expect(captured[0].contentType).toContain('application/json');
    expect(captured[0].rawBody, 'the POST must carry a JSON body').toBeTruthy();
    expect(captured[0].body?.brandSlot, 'the POST body must name the brand slot').toBe('brand2');
    console.log(`[VERIFY] clicked card "${label}" → POST /api/billing/cancel body: ${captured[0].rawBody}`);
  });

  test('Brand 1 (Subscription) card sends brandSlot: "subscription"', async ({ page }) => {
    const captured: Captured[] = [];
    await openSettings(page);
    await page.route('**/api/billing/cancel', async (route) => {
      const { body } = captureCancel(route, captured);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'canceled',
          cancelled: true,
          brandSlot: body?.brandSlot ?? null,
          brandLabel: 'Subscription',
          alreadyCancelled: false,
          cancelAtPeriodEnd: true,
          activeUntil: PERIOD_END,
          subscriptions: [],
          message: 'Your plan is cancelled and will not renew.',
        }),
      });
    });

    const { button, label } = await cancelButtonForSlot(page, 0);
    await button.click();

    await expect(page.getByText(/Cancelled\. You keep full access until November 30, 2026/i))
      .toBeVisible({ timeout: 15000 });

    expect(captured, 'exactly one cancel request').toHaveLength(1);
    expect(captured[0].contentType).toContain('application/json');
    expect(captured[0].rawBody, 'the POST must carry a JSON body').toBeTruthy();
    expect(captured[0].body?.brandSlot, 'the POST body must name the brand slot').toBe('subscription');
    console.log(`[VERIFY] clicked card "${label}" → POST /api/billing/cancel body: ${captured[0].rawBody}`);
  });

  test('Brand 3 card sends brandSlot: "brand3"', async ({ page }) => {
    const captured: Captured[] = [];
    await openSettings(page);
    await page.route('**/api/billing/cancel', async (route) => {
      const { body } = captureCancel(route, captured);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'canceled',
          cancelled: true,
          brandSlot: body?.brandSlot ?? null,
          brandLabel: 'Brand 3',
          alreadyCancelled: false,
          cancelAtPeriodEnd: true,
          activeUntil: PERIOD_END,
          subscriptions: [],
          message: 'Your Brand 3 plan is cancelled and will not renew.',
        }),
      });
    });

    const { button, label } = await cancelButtonForSlot(page, 2);
    await button.click();

    await expect(page.getByText(/Cancelled\. You keep full access until November 30, 2026/i))
      .toBeVisible({ timeout: 15000 });

    expect(captured, 'exactly one cancel request').toHaveLength(1);
    expect(captured[0].body?.brandSlot, 'the POST body must name the brand slot').toBe('brand3');
    console.log(`[VERIFY] clicked card "${label}" → POST /api/billing/cancel body: ${captured[0].rawBody}`);
  });

  test('400 BRAND_SLOT_REQUIRED shows the server\'s message, never a success state', async ({ page }) => {
    const captured: Captured[] = [];
    const serverMessage =
      'Which brand do you want to cancel? Send brandSlot: subscription, brand2 or brand3.';
    await openSettings(page);
    await page.route('**/api/billing/cancel', async (route) => {
      captureCancel(route, captured);
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'not_cancelled',
          cancelled: false,
          code: 'BRAND_SLOT_REQUIRED',
          error: serverMessage,
          message: serverMessage,
          accepted: ['subscription', 'brand2', 'brand3'],
          received: null,
        }),
      });
    });

    const { button, label } = await cancelButtonForSlot(page, 1);
    await button.click();

    // The server's own words, verbatim.
    await expect(page.getByText(serverMessage)).toBeVisible({ timeout: 15000 });
    // And nothing that reads as a cancellation.
    await expect(page.getByText(/^Cancelled\. You keep full access until/)).toHaveCount(0);
    await expect(page.getByText(/nothing will be charged again/i)).toHaveCount(0);
    // The plan is untouched: all three Cancel buttons are still offered.
    await expect(page.getByRole('button', { name: /^Cancel Subscription$/i })).toHaveCount(3);
    console.log(`[VERIFY] 400 path on card "${label}" — server message shown, no success state`);
  });
});
