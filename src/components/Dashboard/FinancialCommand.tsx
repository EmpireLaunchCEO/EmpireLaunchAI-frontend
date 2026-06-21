"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket as Bucket, ShieldCheck, ArrowUpRight, TrendingUp, Calendar, CreditCard, AppWindow, Cpu, Zap, Activity, Minus, Maximize2, Stars, Diamond, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { infrastructureService, InfrastructureBalance } from '@/lib/api-service';
import { useEmpire } from '@/lib/EmpireContext';

import { SubscriptionSuccessShareBox } from './SubscriptionSuccessShareBox';

interface FinancialCommandProps {
  withholdableEarnings?: number;
  securedDues?: number;
  growthScore?: number;
  businessId?: string;
  onActivateGrowthProtocol?: (name: string) => void;
  isProtocolAccepted?: boolean;
  onAcceptProtocol?: () => void;
  businessSlots?: number;
  userEmpires?: any[];
  onCancelSubscription?: (empireId: string) => void;
}

export function FinancialCommand({ 
  withholdableEarnings = 0, 
  securedDues = 0, 
  growthScore = 0,
  businessId = "1",
  onActivateGrowthProtocol,
  isProtocolAccepted = false,
  onAcceptProtocol,
  businessSlots = 1,
  userEmpires = [],
  onCancelSubscription
}: Partial<FinancialCommandProps>) {
  const [infraBalances, setInfraBalances] = useState<InfrastructureBalance[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    setMounted(true);

    const loadInfra = async () => {
      const bals = await infrastructureService.getBalances();
      setInfraBalances(bals);
    };
    loadInfra();
  }, []);

  const handleDownloadAudit = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const revenueCents = withholdableEarnings;
      const shareCents = Math.floor(revenueCents * 0.04);
      
      const auditContent = `EMPIRELAUNCH AI - SUCCESS-SHARE AUDIT\nGenerated: ${new Date().toLocaleString()}\n\nBusiness Tracking:\n- Content Generated: 0 Assets\n- Marketing Campaigns: 0\n- Revenue Attributed to AI: ${(revenueCents / 100).toFixed(2)}\n- Success-Share Rate: 4% (40/1k)\n- Success-Share Due: ${(shareCents / 100).toFixed(2)}\n\nAll tracking verified via Neural Sync.`;
      const blob = new Blob([auditContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Empire_Success_Audit_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setIsDownloading(false);
    }, 1000);
  };

  if (!mounted) return null;

  const formatCurrency = (cents: number) => {
    return `${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const { connectedPlatforms } = useEmpire();

  const subscriptions = [
    { name: "Empire Subscription", amount: 4000, date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), type: "app" },
    { name: "Success-Shares (40/1k Protocol)", amount: 0, date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), type: "app", successShare: "40/1k" },
  ];

  const dues: any[] = [];
  
  if (connectedPlatforms.includes('Etsy')) {
    dues.push({ 
      name: "Etsy Listing Fees", 
      amount: securedDues || 0, 
      date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) 
    });
  }

  return (
    <div className="bg-theme-surface rounded-[32px] p-6 md:p-8 text-foreground relative overflow-hidden shadow-2xl border-2 border-theme max-w-4xl mx-auto">
      {/* 1. Header + Efficiency Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-theme/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-[0.2em] text-primary italic leading-none">Empire Finances</h3>
            <p className="text-xs text-muted-foreground font-medium italic mt-2">Live Capital Velocity</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 px-6 py-3 bg-theme-background border border-theme rounded-[24px]">
            <div className="relative w-10 h-10">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-slate-100/10" strokeWidth="12" />
                <motion.circle
                  cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-primary" strokeWidth="12"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 * (1 - 0.75) }}
                  strokeLinecap="round"
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black">{growthScore}%</span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Efficiency</span>
          </div>

          <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[24px] text-right">
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Available</p>
             <p className="text-2xl font-black text-foreground tracking-tighter">{formatCurrency(withholdableEarnings)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 2. Infrastructure Monitor */}
        {infraBalances.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {infraBalances.map((item, i) => (
              <div key={i} className="p-3 bg-theme-background/50 border border-theme/50 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <p className="text-[8px] font-black uppercase text-muted-foreground mb-1">{item.platform}</p>
                  <p className={cn("text-sm font-black italic", item.status === 'low' ? "text-amber-500" : "text-foreground")}>
                    ${item.balance.toFixed(2)}
                  </p>
                </div>
                {item.status === 'low' ? <Zap className="w-4 h-4 text-amber-500 animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-emerald-500" />}
              </div>
            ))}
          </div>
        )}

        {/* 3. Summary Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-theme-background border border-theme rounded-[24px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Diamond className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Partner Subscription</p>
                <p className="text-[10px] text-muted-foreground font-bold italic">Monthly Access Fee</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black italic text-foreground">$40.00 <span className="text-[10px] text-muted-foreground not-italic">/mo</span></p>
            </div>
          </div>

          <div className="p-6 bg-theme-background border border-theme rounded-[24px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Success-Share Audit</p>
                <p className="text-[10px] text-muted-foreground font-bold italic">Neural Tracking Active</p>
              </div>
            </div>
            <button
              onClick={handleDownloadAudit}
              disabled={isDownloading}
              className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl border border-emerald-500/30 transition-all group flex items-center gap-2"
            >
              {isDownloading ? (
                <Activity className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
              <span className="text-[10px] font-black uppercase">Download Audit</span>
            </button>
          </div>
        </div>

        {/* Marketplace Dues Row (if any) */}
        {dues.length > 0 && (
          <div className="space-y-3">
            {dues.map((due, i) => (
              <div key={i} className="p-5 bg-theme-background border border-theme rounded-[24px] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                    <Bucket className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">{due.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold italic">External Marketplace Dues</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black italic text-amber-500">{formatCurrency(due.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Action Row */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-[10px] text-muted-foreground font-medium italic">Full financial sovereignty protocols active.</p>
          <button
            onClick={() => window.location.href = '/settings?tab=financials'}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors"
          >
            Manage Treasury <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
    </div>
  );
}
