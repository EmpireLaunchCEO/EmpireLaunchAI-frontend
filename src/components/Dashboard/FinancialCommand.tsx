"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, CreditCard, Activity, Minus, Maximize2, FileText, Loader2, Landmark, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';

interface FinancialCommandProps {
  withholdableEarnings?: number;
  securedDues?: number;
  growthScore?: number;
  businessId?: string;
  onActivateGrowthProtocol?: (productName: string) => void;
}

export function FinancialCommand({ 
  withholdableEarnings = 0, 
  growthScore = 0,
  onActivateGrowthProtocol
}: Partial<FinancialCommandProps>) {
  const { isLinkingComplete } = useEmpire();
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-financial-tracker');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-financial-tracker', String(newState));
  };

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDownloading(false);
    alert("Audit Report generation started. You will receive a notification and a download link shortly.");
  };

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-3xl p-6 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[80px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Finance Tracker</h2>
        </div>
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const successShareAmount = Math.floor(withholdableEarnings / 100000) * 4000;
  const appSubscription = isLinkingComplete ? 4900 : 0; // App Monthly Sub
  const intelligenceCost = isLinkingComplete ? 1790 : 0; // Neural/Infrastructure

  const SUBSCRIPTIONS = [
    { name: 'Etsy Seller Tool', cost: 1500, active: isLinkingComplete },
    { name: 'TikTok Shop Plus', cost: 1200, active: isLinkingComplete },
    { name: 'Meta Business Suite', cost: 900, active: isLinkingComplete },
    { name: 'Intelligence Infrastructure', cost: intelligenceCost, active: isLinkingComplete }
  ];

  return (
    <div className="bg-theme-surface rounded-[40px] p-8 text-foreground relative overflow-hidden shadow-2xl border-2 border-theme">
      {/* Minimize Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
      
      <div className="relative z-10 space-y-10">
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row gap-8 items-center border-b border-theme/30 pb-8">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-slate-100/10" strokeWidth="12" />
              <motion.circle
                cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-primary" strokeWidth="12"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - (growthScore / 100)) }}
                strokeLinecap="round"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[14px] font-black">{growthScore}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-black uppercase tracking-[0.2em] text-primary italic">Finance Tracker</h3>
            <p className="text-slate-400 text-xs font-medium italic">Integrated platform dues and automated success-share monitoring.</p>
            <div className="flex gap-4 pt-1">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-[9px] font-black text-primary uppercase">Empire Revenue: {formatCurrency(withholdableEarnings)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section 1: Platform Subscriptions */}
          <div className="bg-theme-background/30 border border-theme rounded-[32px] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Platform Subscriptions</h4>
              </div>
              <span className="text-xs font-black italic">{formatCurrency(SUBSCRIPTIONS.reduce((acc, s) => acc + (s.active ? s.cost : 0), 0))} / mo</span>
            </div>

            <div className="space-y-3">
              {SUBSCRIPTIONS.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-theme-surface/50 border border-theme/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={cn("w-3 h-3", sub.active ? "text-emerald-500" : "text-slate-600")} />
                    <span className="text-[10px] font-bold text-slate-300">{sub.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-foreground">{formatCurrency(sub.cost)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Empire Success Model */}
          <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-6 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Empire Success Model</h4>
              </div>
              <Landmark className="w-4 h-4 text-primary opacity-20" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-400">Monthly App Subscription</span>
                <span className="text-sm font-black text-foreground">{formatCurrency(appSubscription)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-3xl bg-primary/10 border border-primary/20">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary block mb-1">Success-Shares (4%)</span>
                  <p className="text-2xl font-black italic text-primary">{formatCurrency(successShareAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase text-primary/60">Milestone Due</p>
                  <p className="text-xs font-bold">$1,000 Revenue</p>
                </div>
              </div>
            </div>

            <div className="pt-2 relative z-10">
              <button 
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className="w-full py-4 bg-primary text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isDownloading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <FileText className="w-3 h-3" />
                )}
                Download Audit report for Success-Shares
              </button>
            </div>

            {/* Faint Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-theme/30 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="flex items-center gap-3">
              <span className="text-[8px] font-black text-emerald-500 uppercase animate-pulse flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                Neural Sync Verified
              </span>
              <p className="text-[10px] text-muted-foreground font-medium italic">Transparency protocols active across all linked nodes.</p>
           </div>
           
           <button
              onClick={() => onActivateGrowthProtocol?.('System Expansion')}
              className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-6 py-2.5 rounded-xl border border-primary/20 hover:bg-primary/10 transition-all flex items-center gap-2"
            >
              <Activity className="w-3 h-3" />
              Activate Growth Protocol
            </button>
        </div>
      </div>
    </div>
  );
}
