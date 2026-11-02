"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Clock, Loader2, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { getEmpireUserId, getAuthToken } from '@/lib/api-service';
import { API_URL } from '@/lib/config';
import {
  ClientBillingSubscription,
  ClientBillingView,
  DASH,
  billingDayOfMonth,
  formatBillingDate,
  ordinal,
} from '@/lib/billing';

const authHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'x-user-id': getEmpireUserId(),
  'Content-Type': 'application/json',
});

interface SubscriptionCardProps {
  brandName: string;
  price: string;
  /** Kept for the existing call sites; the real date now comes from /api/billing/me. */
  renewsIn?: string;
  /** Which of the three brand slots this card speaks for. Defaults to the base plan. */
  brandSlot?: 'subscription' | 'brand2' | 'brand3';
}

type Notice = { tone: 'success' | 'error' | 'info'; text: string };

const NOTICE_STYLES: Record<Notice['tone'], string> = {
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
  error: 'bg-red-500/10 border-red-500/20 text-red-300',
  info: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
};

const UNREACHABLE_MESSAGE =
  'We could not reach the billing system, so your subscription was NOT cancelled. Please try again in a moment.';

export function SubscriptionCard({ brandName, price, brandSlot = 'subscription' }: SubscriptionCardProps) {
  // Everything on this card comes from GET /api/billing/me. There is no
  // fallback date: an unknown renewal date renders "—", never "+30 days".
  const [view, setView] = useState<ClientBillingView | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/billing/me`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`billing/me ${res.status}`);
      const data: ClientBillingView = await res.json();
      setView(data);
      setLoadError(false);
    } catch {
      // A failure is not a plan — say nothing about a date and show "—".
      setView(null);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const subscription: ClientBillingSubscription | null =
    view?.linked && Array.isArray(view.subscriptions)
      ? view.subscriptions.find((sub) => sub.brandSlot === brandSlot) ?? null
      : null;

  const isBaseSlot = brandSlot === 'subscription';
  const periodEnd =
    subscription?.currentPeriodEnd ?? (isBaseSlot ? view?.currentPeriodEnd ?? null : null);
  const cancelAtPeriodEnd =
    subscription?.cancelAtPeriodEnd ?? (isBaseSlot ? view?.cancelAtPeriodEnd === true : false);

  // Cancel is per brand (backend PR #140): it touches ONLY the slot this card
  // shows. So the old "this also cancels your other plans" wording is gone —
  // after that change it was simply false. We say the true thing instead, and
  // only when there is actually another plan to reassure them about.
  const otherPlanCount = (view?.subscriptions ?? []).filter(
    (sub) => sub.brandSlot !== brandSlot,
  ).length;

  const renewalDate = formatBillingDate(periodEnd);
  const billingDay = ordinal(billingDayOfMonth(periodEnd));
  const linked = view?.linked === true && subscription !== null;

  // ── the cancel ────────────────────────────────────────────────────────────
  const handleCancel = async () => {
    const until = renewalDate || 'the end of the period you already paid for';
    const otherPlans =
      otherPlanCount > 0 ? ' Your other brands are not affected.' : '';
    const confirmed = window.confirm(
      `Your access continues until ${until} — the day before your renewal date. ` +
      `You keep using the platform until then, and nothing will be charged again.${otherPlans}`,
    );
    if (!confirmed) return;

    setCanceling(true);
    setNotice(null);
    try {
      let res: Response;
      try {
        res = await fetch(`${API_URL}/api/billing/cancel`, {
          method: 'POST',
          headers: authHeaders(),
          // Cancel is PER BRAND: the server refuses to guess and answers
          // 400 BRAND_SLOT_REQUIRED without this. The slot we send is the same
          // one this card used to find its own subscription in /api/billing/me,
          // so the plan shown is always the plan cancelled.
          body: JSON.stringify({ brandSlot }),
        });
      } catch {
        setNotice({ tone: 'error', text: UNREACHABLE_MESSAGE });
        return;
      }

      let body: any = null;
      try { body = await res.json(); } catch { /* non-JSON body — handled by status below */ }

      if (res.ok && body?.cancelled === true) {
        const activeUntil = formatBillingDate(body.activeUntil) || renewalDate;
        if (body.alreadyCancelled) {
          setNotice({
            tone: 'success',
            text: activeUntil
              ? `Your plan was already set to cancel — nothing has changed. You keep full access until ${activeUntil}.`
              : 'Your plan was already set to cancel — nothing has changed. You keep full access until the end of the period you paid for.',
          });
        } else {
          setNotice({
            tone: 'success',
            text: activeUntil
              ? `Cancelled. You keep full access until ${activeUntil} — nothing will be charged again.`
              : 'Cancelled. You keep full access until the end of the period you already paid for — nothing will be charged again.',
          });
        }
        await load();
      } else if (res.status === 409) {
        // Nothing to cancel. The server's own words, not a generic failure.
        setNotice({
          tone: 'error',
          text: body?.message || 'We could not find a subscription on your account, so there was nothing to cancel.',
        });
      } else if (res.status === 503) {
        // Billing unreachable — the subscription is untouched.
        setNotice({ tone: 'error', text: body?.message || UNREACHABLE_MESSAGE });
      } else {
        setNotice({
          tone: 'error',
          text: body?.message || `Billing did not confirm the cancellation (status ${res.status}), so your plan has not changed.`,
        });
      }
    } finally {
      setCanceling(false);
    }
  };

  // ── turn the renewal back on ──────────────────────────────────────────────
  const handleReactivate = async () => {
    setReactivating(true);
    setNotice(null);
    try {
      let res: Response;
      try {
        res = await fetch(`${API_URL}/api/subscriptions/reactivate`, {
          method: 'POST',
          headers: authHeaders(),
        });
      } catch {
        setNotice({ tone: 'error', text: 'We could not reach the billing system, so your plan is still set to cancel. Please try again in a moment.' });
        return;
      }

      let body: any = null;
      try { body = await res.json(); } catch { /* handled below */ }

      if (!res.ok) {
        setNotice({
          tone: 'error',
          text: body?.message || body?.error || `We could not turn the renewal back on (status ${res.status}). Your plan is still set to cancel.`,
        });
        return;
      }

      if (body?.status === 'reactivated') {
        setNotice({
          tone: 'success',
          text: formatBillingDate(body.renewsAt)
            ? `Your plan is back on and will renew on ${formatBillingDate(body.renewsAt)}.`
            : 'Your plan is back on and will renew at the end of the current period.',
        });
        await load();
        return;
      }

      if (body?.status === 'requires_payment') {
        // Deliberately NOT a checkout redirect: the client may still be inside a
        // paid period, and sending them to pay again would charge them twice.
        setNotice({
          tone: 'info',
          text: 'Your paid period has already ended, so there is nothing to switch back on. Start a new plan from your Dashboard when you are ready.',
        });
        return;
      }

      setNotice({
        tone: 'info',
        text: body?.message || 'We could not turn the renewal back on. Tell us in chat and we will check it.',
      });
    } finally {
      setReactivating(false);
    }
  };

  // ── badge ─────────────────────────────────────────────────────────────────
  const statusBadge = loading ? (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full shrink-0">
      <RefreshCw className="w-2.5 h-2.5 text-amber-400 animate-spin" />
      <span className="text-[8px] font-black uppercase tracking-wider text-amber-400">Checking</span>
    </span>
  ) : !linked ? (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full shrink-0">
      <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
      <span className="text-[8px] font-black uppercase tracking-wider text-amber-400">Not linked</span>
    </span>
  ) : cancelAtPeriodEnd ? (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full shrink-0">
      <XCircle className="w-2.5 h-2.5 text-red-400" />
      <span className="text-[8px] font-black uppercase tracking-wider text-red-400">Cancelling</span>
    </span>
  ) : (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shrink-0">
      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
      <span className="text-[8px] font-black uppercase tracking-wider text-emerald-400">Active</span>
    </span>
  );

  const renewalLine = cancelAtPeriodEnd ? `Access until ${renewalDate || DASH}` : `Renews ${renewalDate || DASH}`;

  return (
    <div className="p-5 bg-theme-background border-2 border-theme rounded-2xl space-y-3">
      <div className="flex items-center gap-3">
        <h4 className="font-black text-foreground uppercase tracking-tight text-sm whitespace-nowrap overflow-visible">{brandName}</h4>
        <div className="shrink-0 ml-auto">{statusBadge}</div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-foreground">{price}</span>
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {renewalLine}
        </span>
      </div>

      {/* The owner's own wording, with the real day-of-month from Stripe. */}
      {!loading && linked && !cancelAtPeriodEnd && (
        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
          {billingDay
            ? `If not canceled, you will be billed on the ${billingDay} of the following month.`
            : 'If not canceled, you will be billed at the end of the following month.'}
        </p>
      )}

      {/* Cancel = end of period: the plan stays on until the period ends. */}
      {!loading && linked && cancelAtPeriodEnd && (
        <p className="text-[10px] text-amber-300/90 font-medium leading-relaxed">
          {renewalDate
            ? `Your plan stays active until ${renewalDate}. It will not renew, and you will not be billed again.`
            : 'Your plan stays active until the end of the period you already paid for. It will not renew.'}
        </p>
      )}

      {!loading && !linked && (
        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
          {loadError
            ? 'Billing is temporarily unavailable, so we cannot show this plan\'s renewal date right now. Your plan has not changed.'
            : view?.message || 'No plan is linked to this account yet.'}
        </p>
      )}

      {notice && (
        <div className={`p-3 rounded-xl border text-[10px] font-bold leading-relaxed ${NOTICE_STYLES[notice.tone]}`}>
          {notice.text}
        </div>
      )}

      {!loading && linked && !cancelAtPeriodEnd && (
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            disabled={canceling}
            className="text-[10px] font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
          >
            {canceling ? 'Canceling...' : 'Cancel Subscription'}
          </button>
        </div>
      )}
      {!loading && linked && cancelAtPeriodEnd && (
        <div className="flex justify-end">
          <button
            onClick={handleReactivate}
            disabled={reactivating}
            className="text-[10px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
          >
            {reactivating ? 'Reactivating...' : 'Reactivate Subscription'}
          </button>
        </div>
      )}
    </div>
  );
}
