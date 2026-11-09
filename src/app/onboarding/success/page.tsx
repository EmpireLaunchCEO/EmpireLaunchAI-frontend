import React, { Suspense } from 'react';
import Link from 'next/link';
import { PaymentReturnNotice } from './PaymentReturnNotice';

/**
 * Where the owner's Stripe Payment Links can send a client after checkout
 * (`?session_id={CHECKOUT_SESSION_ID}`).
 *
 * It deliberately does NOT say "payment confirmed": the app confirms the payment
 * from Stripe's webhook, not from this page, and this page has nothing real to
 * show about it. It says what is true — the payment is being confirmed and access
 * is coming shortly.
 */
export default function OnboardingSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-2xl shadow-indigo-500/10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Thanks — we have your payment
        </h1>
        <p className="mt-4 text-slate-300 leading-relaxed">
          Stripe has taken your payment. We are confirming it now, and your access
          is coming shortly — usually within a minute or two. You do not need to pay
          again.
        </p>
        <Suspense fallback={null}>
          <PaymentReturnNotice />
        </Suspense>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
          >
            Go to my dashboard
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500"
          >
            Back to onboarding
          </Link>
        </div>
      </div>
    </div>
  );
}
