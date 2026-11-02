/**
 * The billing contract, mirrored from the live backend (PR #137,
 * `services/stripeSubscriptions.ts` + `controllers/billingController.ts` +
 * `controllers/adminController.ts`). Shapes here are the ones the server
 * actually sends — no invented fields.
 *
 * House rule that this file exists to enforce: a figure we do not have is
 * "—", never a 0. A zero only ever means "the server counted zero".
 */

export type BrandSlot = 'subscription' | 'brand2' | 'brand3';

export const BRAND_SLOTS: readonly BrandSlot[] = ['subscription', 'brand2', 'brand3'] as const;

/** The owner's own names for the three brand slots. */
export const BRAND_SLOT_LABELS: Record<BrandSlot, string> = {
  subscription: 'Subscription',
  brand2: 'Brand 2',
  brand3: 'Brand 3',
};

/** Anything unknown renders as this, never as a number we do not have. */
export const DASH = '—';

// ───────────────────────────── GET /api/billing/me ──────────────────────────

export interface ClientBillingSubscription {
  subscriptionId: string;
  brandSlot: BrandSlot;
  brandLabel: string;
  status: string;
  /** Real Stripe period end (ISO), never a computed "paidAt + 30 days". */
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  amount: number | null;
  currency: string | null;
  interval: string | null;
  productName: string | null;
}

export interface ClientBillingPlan {
  subscriptionId: string;
  brandSlot: BrandSlot;
  brandLabel: string;
  productName: string | null;
  amount: number | null;
  currency: string | null;
  interval: string | null;
}

export interface ClientBillingView {
  linked: boolean;
  /** Present when `linked: false` — why we cannot see a subscription. */
  reason?: 'no_subscription' | 'stripe_unavailable';
  message?: string;
  plan?: ClientBillingPlan;
  status?: string;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  /** Same instant as `currentPeriodEnd` — what "access until …" means. */
  activeUntil?: string | null;
  stillActive?: boolean;
  matchedBy?: 'client_reference_id' | 'email';
  brands?: BrandSlot[];
  subscriptions?: ClientBillingSubscription[];
  readAt?: string;
}

// ───────────────────────── POST /api/billing/cancel ─────────────────────────

export interface CancelSuccessBody {
  status: 'canceled';
  cancelled: true;
  alreadyCancelled: boolean;
  cancelAtPeriodEnd: boolean;
  /** End of the paid period — the day access stops, never today. */
  activeUntil: string | null;
  message: string;
  subscriptions?: Array<{
    subscriptionId: string;
    brandSlot: BrandSlot;
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    alreadyCancelled: boolean;
  }>;
}

export interface CancelFailureBody {
  status: 'not_cancelled';
  cancelled: false;
  /** 409 NO_SUBSCRIPTION, or 503 STRIPE_UNAVAILABLE. */
  code: 'NO_SUBSCRIPTION' | 'STRIPE_UNAVAILABLE';
  message: string;
  error?: string;
}

export type CancelResponseBody = CancelSuccessBody | CancelFailureBody;

// ─────────────────────── GET /api/admin/client-stats ────────────────────────

export interface PayingClients {
  total: number;
  subscription: number;
  brand2: number;
  brand3: number;
}

export interface AdminClientStats {
  activeSubscribers: number | null;
  totalClients: number | null;
  activeSubscribersSource?: 'stripe' | 'db';
  /** `null` when Stripe could not be read — render "—", never 0. */
  payingClients: PayingClients | null;
  /** Clients cancelling but still inside a paid period. `null` = unknown. */
  cancellingClients: number | null;
  billingReadAt?: string | null;
  billingError?: string | null;
}

// ─────────────────────────────── formatting ─────────────────────────────────

/**
 * Split an ISO instant into its calendar parts WITHOUT going through a Date in
 * local time. Stripe sends "2026-11-30T12:00:00.000Z"; converting that to a
 * local Date can shift the day by one in negative-offset timezones, which is
 * exactly the kind of off-by-one that makes a renewal date a lie.
 */
function calendarParts(iso: string | null | undefined): { year: number; month: number; day: number } | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "2026-11-30T…" → "November 30, 2026". `null` in → `null` out (renders "—"). */
export function formatBillingDate(iso: string | null | undefined): string | null {
  const parts = calendarParts(iso);
  if (!parts) return null;
  return `${MONTH_NAMES[parts.month - 1]} ${parts.day}, ${parts.year}`;
}

/** The real day-of-month of the period end, for "billed on the 30th …". */
export function billingDayOfMonth(iso: string | null | undefined): number | null {
  const parts = calendarParts(iso);
  return parts ? parts.day : null;
}

/** 1 → "1st", 2 → "2nd", 3 → "3rd", 11 → "11th", 21 → "21st", 30 → "30th". */
export function ordinal(value: number | null | undefined): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return null;
  const remainder100 = value % 100;
  const suffix =
    remainder100 >= 11 && remainder100 <= 13
      ? 'th'
      : value % 10 === 1
        ? 'st'
        : value % 10 === 2
          ? 'nd'
          : value % 10 === 3
            ? 'rd'
            : 'th';
  return `${value}${suffix}`;
}

/** A count we actually have, or "—". Never fabricates a 0. */
export function countOrDash(value: number | null | undefined): string {
  return typeof value === 'number' && Number.isFinite(value) ? String(value) : DASH;
}

/** True only when the number is real (so a 0 can be worded differently from "—"). */
export function isKnownCount(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
