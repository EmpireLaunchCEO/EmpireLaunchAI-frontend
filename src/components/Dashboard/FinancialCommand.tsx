"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, CreditCard, Activity, Minus, Maximize2, FileText, Loader2 } from 'lucide-react';
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

  // High-level calculations for the summary view
  const successShareAmount = Math.floor(withholdableEarnings / 100000) * 4000;
  const totalSubAmount = isLinkingComplete ? 7299 : 0; // Total of subs in cents

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
          <div className="relative w-32 h-32 shrink-0">
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
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Efficiency</span>
              <span className="text-xl font-black">{growthScore}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-black uppercase tracking-[0.2em] text-primary italic">Finance Tracker</h3>
            <p className="text-slate-400 text-xs font-medium italic">High-level financial overview and neural performance monitoring.</p>
            <div className="flex gap-4 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-[10px] font-black text-primary uppercase">Available: {formatCurrency(withholdableEarnings)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Streamlined Totals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-theme-background/40 border border-theme rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest opacity-60">
              <CreditCard className="w-3 h-3" />
              Active Subscriptions
            </div>
            <p className="text-2xl font-black italic">{formatCurrency(totalSubAmount)}</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter italic">Total Monthly Obligations</p>
          </div>

          <div className="p-6 bg-theme-background/40 border border-theme rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-500 font-black text-[10px] uppercase tracking-widest opacity-60">
              <Activity className="w-3 h-3" />
              Infrastructure
            </div>
            <p className="text-2xl font-black italic">{formatCurrency(isLinkingComplete ? 1790 : 0)}</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter italic">Intelligence Usage Cost</p>
          </div>

          <div className="p-6 bg-theme-background/40 border border-theme rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              Success-Shares (4%)
            </div>
            <p className="text-2xl font-black italic text-primary">{formatCurrency(successShareAmount)}</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter italic">Current Milestone Balance</p>
          </div>
        </div>

        {/* Action Center */}
        <div className="pt-6 border-t border-theme/30 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="flex items-center gap-3">
              <span className="text-[8px] font-black text-green-500 uppercase animate-pulse flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
                Neural Sync Active
              </span>
              <p className="text-[10px] text-muted-foreground font-medium italic">Itemized transparency is available in the audit.</p>
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto">
             <button
                onClick={() => onActivateGrowthProtocol?.('Existing Product Stack')}
                className="hidden md:block text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-xl border border-primary/20 hover:bg-primary/10 transition-all"
              >
                + Activate Protocol
              </button>
              
              <button 
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className="flex-1 md:flex-none py-4 px-8 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Syncing Audit...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Download Audit Report
                  </>
                )}
              </button>
           </div>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
    </div>
  );
}
