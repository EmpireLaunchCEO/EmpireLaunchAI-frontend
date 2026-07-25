"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Loader2, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { getEmpireUserId, getAuthToken } from '@/lib/api-service';
import { API_URL } from '@/lib/config';

const authHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'x-user-id': getEmpireUserId(),
  'Content-Type': 'application/json',
});

interface SubscriptionCardProps {
  brandName: string;
  price: string;
  renewsIn: string;
}

export function SubscriptionCard({ brandName, price, renewsIn }: SubscriptionCardProps) {
  const [renewalDate, setRenewalDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isGracePeriod, setIsGracePeriod] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userId = getEmpireUserId();
        // Try renewal check first
        const renewalRes = await fetch(`${API_URL}/api/subscriptions/check-renewal`, {
          headers: authHeaders(),
        }).catch(() => null);
        
        if (renewalRes?.ok) {
          const renewalData = await renewalRes.json();
          if (renewalData.status === 'grace_period') {
            setIsGracePeriod(true);
            setIsActive(false);
          } else if (renewalData.status === 'active') {
            setIsActive(true);
            setIsGracePeriod(false);
          } else {
            setIsActive(false);
          }
        }
        
        // Fetch real subscription for date
        const res = await fetch(`${API_URL}/api/subscriptions/${userId}`, { headers: authHeaders() });
        if (res.ok) {
          const data = await res.json();
          const subs = data.subscriptions || [];
          if (subs.length > 0) {
            const latest = subs[0];
            const paidDate = new Date(latest.paidAt);
            paidDate.setDate(paidDate.getDate() + 30);
            setRenewalDate(paidDate);
            if (paidDate > new Date() && !isGracePeriod) setIsActive(true);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to fetch subscription', e);
      }
      setLoading(false);
      setIsActive(false);
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 30);
      setRenewalDate(fallback);
    };
    fetchSubscription();
  }, []);

  const formattedDate = renewalDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || '...';

  const handleCancel = async () => {
    const confirmed = confirm(
      `Are you sure? Your access will continue until ${formattedDate}, then your subscription will be canceled.`
    );
    if (!confirmed) return;
    
    setCanceling(true);
    try {
      const res = await fetch(`${API_URL}/api/subscriptions/cancel`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (res.ok) {
        setIsCanceled(true);
        setIsActive(false);
      }
    } catch (e) {
      console.error('Cancel failed', e);
    } finally {
      setCanceling(false);
    }
  };

  const handleReactivate = async () => {
    setCanceling(true);
    try {
      const res = await fetch(`${API_URL}/api/subscriptions/reactivate`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (res.ok) {
        setIsCanceled(false);
        setIsActive(true);
      }
    } catch (e) {
      console.error('Reactivate failed', e);
    } finally {
      setCanceling(false);
    }
  };

  const statusBadge = isCanceled ? (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full shrink-0">
      <XCircle className="w-2.5 h-2.5 text-red-400" />
      <span className="text-[8px] font-black uppercase tracking-wider text-red-400">Canceled</span>
    </span>
  ) : isGracePeriod ? (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full shrink-0">
      <RefreshCw className="w-2.5 h-2.5 text-amber-400 animate-spin" />
      <span className="text-[8px] font-black uppercase tracking-wider text-amber-400">Processing</span>
    </span>
  ) : isActive ? (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shrink-0">
      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
      <span className="text-[8px] font-black uppercase tracking-wider text-emerald-400">Active</span>
    </span>
  ) : (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full shrink-0">
      <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
      <span className="text-[8px] font-black uppercase tracking-wider text-amber-400">Inactive</span>
    </span>
  );

  return (
    <div className="p-5 bg-theme-background border-2 border-theme rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-foreground uppercase tracking-tight text-sm">{brandName}</h4>
        <div className="shrink-0">{statusBadge}</div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-foreground">{price}</span>
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          Renews {formattedDate}
        </span>
      </div>
      {isActive && !isCanceled && !isGracePeriod && (
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
      {isCanceled && (
        <div className="flex justify-end">
          <button
            onClick={handleReactivate}
            disabled={canceling}
            className="text-[10px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
          >
            {canceling ? 'Reactivating...' : 'Reactivate Subscription'}
          </button>
        </div>
      )}
    </div>
  );
}
