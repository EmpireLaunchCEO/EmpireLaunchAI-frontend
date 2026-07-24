"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { getEmpireUserId } from '@/lib/api-service';
import { API_URL } from '@/lib/config';

interface SubscriptionCardProps {
  brandName: string;
  price: string;
  renewsIn: string;
  isActive: boolean;
}

export function SubscriptionCard({ brandName, price, renewsIn, isActive }: SubscriptionCardProps) {
  const [renewalDate, setRenewalDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userId = getEmpireUserId();
        const res = await fetch(`${API_URL}/api/subscriptions/${userId}`);
        if (res.ok) {
          const data = await res.json();
          const subs = data.subscriptions || [];
          if (subs.length > 0) {
            const latest = subs[0]; // ordered by createdAt desc
            const paidDate = new Date(latest.paidAt);
            paidDate.setDate(paidDate.getDate() + 30);
            setRenewalDate(paidDate);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to fetch subscription', e);
      } finally {
        setLoading(false);
      }
      // Fallback: 30 days from now
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 30);
      setRenewalDate(fallback);
    };
    fetchSubscription();
  }, []);

  const formattedDate = renewalDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || '...';

  return (
    <div className="p-5 bg-theme-background border-2 border-theme rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-foreground uppercase tracking-tight text-sm">{brandName}</h4>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Active</span>
        </span>
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
    </div>
  );
}
