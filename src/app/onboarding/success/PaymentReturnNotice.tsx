'use client';

import { useSearchParams } from 'next/navigation';

/**
 * Shows the Stripe checkout reference the client came back with, if any. It is a
 * reference for support, not a claim that anything was verified here — the payment
 * is confirmed by Stripe's webhook, server-side.
 */
export function PaymentReturnNotice() {
  const sessionId = useSearchParams()?.get('session_id');
  if (!sessionId) return null;
  return (
    <p className="mt-4 break-all text-xs text-slate-500">
      Stripe reference: {sessionId}
    </p>
  );
}
