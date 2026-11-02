"use client";

import React, { useEffect, useState } from 'react';
import { Building2, TrendingUp, Layout, Stars, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmpireIdentityCard } from '@/components/Dashboard/EmpireIdentityCard';
import { IntelTab } from '@/components/Dashboard/IntelTab';
import { LibraryTab } from '@/components/Dashboard/LibraryTab';
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';
import { getAuthToken, getEmpireUserId } from '@/lib/api-service';
import { BRAND_SLOTS, BRAND_SLOT_LABELS, countOrDash, isKnownCount } from '@/lib/billing';
import { motion } from 'framer-motion';

interface EmpireTabsProps {
  empireData: any;
  onDataUpdate: () => void;
}

/** Per-brand counts from Stripe. `null` on a slot = we do not have that number. */
interface PayingClients {
  total: number | null;
  subscription: number | null;
  brand2: number | null;
  brand3: number | null;
}

interface ClientStats {
  activeSubscribers: number;
  totalClients: number;
  /** `null` when Stripe could not be read — rendered "—", never a fake 0. */
  payingClients: PayingClients | null;
  /** Clients cancelling but still inside a paid period. `null` = unknown. */
  cancellingClients: number | null;
}

const numberOrNull = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

export function EmpireTabs({ empireData, onDataUpdate }: EmpireTabsProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'intel' | 'library'>('business');
  const { isAdmin, userEmail } = useEmpire();
  const isOwner = isAdmin || userEmail?.toLowerCase() === 'stacipeabody@gmail.com';

  // Owner-only business numbers. `null` = not loaded yet, `error` = the call failed.
  // The card renders "—" in BOTH cases and never a fabricated 0, so the owner can
  // always tell a real zero from a number we do not actually have.
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    if (!isOwner) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/client-stats`, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'x-user-id': getEmpireUserId(),
          },
        });
        if (!res.ok) throw new Error(`client-stats ${res.status}`);
        const data = await res.json();
        // Trust only real integers — anything else stays "unknown" rather than 0.
        if (
          typeof data?.activeSubscribers === 'number' &&
          typeof data?.totalClients === 'number'
        ) {
          if (!cancelled) {
            // payingClients is `null` when Stripe is unreachable; each slot inside
            // it is still checked, so a partial answer degrades to "—" per brand.
            const raw = data?.payingClients;
            const payingClients: PayingClients | null =
              raw && typeof raw === 'object'
                ? {
                    total: numberOrNull(raw.total),
                    subscription: numberOrNull(raw.subscription),
                    brand2: numberOrNull(raw.brand2),
                    brand3: numberOrNull(raw.brand3),
                  }
                : null;
            setClientStats({
              activeSubscribers: data.activeSubscribers,
              totalClients: data.totalClients,
              payingClients,
              cancellingClients: numberOrNull(data?.cancellingClients),
            });
            setStatsError(false);
          }
        } else {
          throw new Error('client-stats malformed');
        }
      } catch {
        if (!cancelled) {
          setClientStats(null);
          setStatsError(true);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [isOwner]);

  const subscriberDisplay = clientStats ? String(clientStats.activeSubscribers) : '—';
  const showGrowthLabel = !!clientStats && clientStats.activeSubscribers > 0;

  const payingClients = clientStats?.payingClients ?? null;
  const payingTotal = payingClients?.total ?? null;
  const payingCaption = !isKnownCount(payingTotal)
    ? 'Live recurring revenue stream tracking enabled for EmpireLaunch AI.'
    : payingTotal === 0
      ? 'No paying clients yet.'
      : 'Live recurring revenue stream tracking enabled for EmpireLaunch AI.';

  const cancellingDisplay = countOrDash(clientStats?.cancellingClients);

  const tabs = [
    { id: 'business' as const, label: 'Business Info', icon: Building2 },
    { id: 'intel' as const, label: 'Intel', icon: TrendingUp },
    { id: 'library' as const, label: 'Library', icon: Layout },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex bg-theme-background p-1.5 rounded-[24px] border-2 border-theme w-full max-w-md mx-auto gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[18px] font-black text-[9px] uppercase tracking-tighter transition-all",
                isActive
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] border-white/20"
                  : "text-foreground/40 hover:text-foreground hover:bg-theme-surface/50"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-foreground/40")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'business' && (
          <>
            <EmpireIdentityCard
              empireData={empireData}
              onUpdate={onDataUpdate}
            />
            {isOwner && (
            <>
            <div className="max-w-4xl mx-auto mt-6 bg-theme-surface border-2 border-theme rounded-[32px] p-8 space-y-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] -z-10" />
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                  <Stars className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Active Subscribers</p>
                  <div className="flex items-baseline gap-3">
                    <p
                      className="text-5xl font-black text-foreground bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
                      title={statsError ? 'Subscriber count unavailable right now' : undefined}
                    >{subscriberDisplay}</p>
                    {showGrowthLabel && (
                      <p className="text-sm font-black text-emerald-500 uppercase tracking-widest italic">Growing</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Paying clients per brand. A client on two brands counts in both,
                  so these are not required to add up to the total. */}
              <div className="grid grid-cols-3 gap-3">
                {BRAND_SLOTS.map((slot) => (
                  <div
                    key={slot}
                    className="bg-theme-background border-2 border-theme rounded-2xl px-3 py-4 text-center"
                  >
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                      {BRAND_SLOT_LABELS[slot]}
                    </p>
                    <p className="text-2xl font-black text-foreground">
                      {countOrDash(payingClients?.[slot])}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground font-medium italic">{payingCaption}</p>
            </div>

            {/* Cancellations — its own box, and deliberately no dates on it. */}
            <div className="max-w-4xl mx-auto mt-6 bg-theme-surface border-2 border-theme rounded-[32px] p-8 space-y-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-[80px] -z-10" />
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10">
                  <UserMinus className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Cancellations</p>
                  <p
                    className="text-5xl font-black text-foreground bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"
                    title={statsError ? 'Cancellation count unavailable right now' : undefined}
                  >{cancellingDisplay}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium italic">
                Clients who have cancelled and are finishing the period they already paid for. They keep full access until it ends.
              </p>
            </div>
            </>
            )}
          </>
        )}
        {activeTab === 'intel' && (
          <IntelTab empireData={empireData} />
        )}
        {activeTab === 'library' && (
          <LibraryTab />
        )}
      </motion.div>
    </div>
  );
}
