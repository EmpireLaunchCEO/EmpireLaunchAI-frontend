"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket as Bucket, ShieldCheck, ArrowUpRight, TrendingUp, Calendar, CreditCard, AppWindow, Cpu, Zap, Activity, Minus, Maximize2, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { infrastructureService, InfrastructureBalance } from '@/lib/api-service';
import { useEmpire } from '@/lib/EmpireContext';

interface FinancialCommandProps {
  withholdableEarnings?: number;
  securedDues?: number;
  growthScore?: number;
  businessId?: string;
  onActivateGrowthProtocol?: (name: string) => void;
}

export function FinancialCommand({ 
  withholdableEarnings = 0, 
  securedDues = 0, 
  growthScore = 0,
  businessId = "1",
  onActivateGrowthProtocol
}: Partial<FinancialCommandProps>) {
  const { isAdmin } = useEmpire();
  const [infraBalances, setInfraBalances] = useState<InfrastructureBalance[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-financial-command');
    if (saved === 'true') setIsMinimized(true);

    const loadInfra = async () => {
      const bals = await infrastructureService.getBalances().catch(() => []);
      setInfraBalances(bals);
    };
    loadInfra();
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-financial-command', String(newState));
  };

  if (!mounted) return null;

  const formatCurrency = (cents: number) => {
    return `${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // REALITY GROUNDING: All numbers strictly 0.00
  const subscriptions = isAdmin ? [
    { name: "Active User Subscriptions", amount: 0, date: "No active users", type: "platform" },
  ] : (withholdableEarnings > 0 ? [
    { name: "EmpireLaunch AI Platform", amount: 0, date: "Pending Activation", type: "app" },
  ] : []);

  // Infrastructure items
  const displayInfra = infraBalances.length > 0 ? infraBalances : [
    { platform: 'Railway', balance: 0.00, status: 'active', currency: 'USD' },
    { platform: 'OpenAI', balance: 0.00, status: 'active', currency: 'USD' },
    { platform: 'Gemini', balance: 0.00, status: 'active', currency: 'USD' },
    { platform: 'Stripe', balance: 0.00, status: 'active', currency: 'USD' }
  ];

  const successShareAmount = 0;
  const successShareLabel = isAdmin ? "Platform Success-Shares" : "Success-Share (Due)";
  const successShareDesc = isAdmin ? "Total commission from all user sales" : "4% platform partner fee";

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-3xl p-6 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[80px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground leading-none">Empire Finances</h2>
            <span className="text-[10px] font-black text-primary uppercase mt-1">Available: {formatCurrency(withholdableEarnings)}</span>
          </div>
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

  return (
    <div className="bg-theme-surface rounded-[40px] p-8 text-foreground relative overflow-hidden shadow-2xl border-2 !border-white/20">
      {/* Name at the Top */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
          <CreditCard className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-black uppercase tracking-[0.2em] text-primary italic">Empire Finances</h3>
      </div>

      <div className="absolute top-4 right-5 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-2 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 space-y-12">
        
        {/* Top Header: Efficiency Ring & Available Earnings */}
        <div className="flex flex-col md:flex-row gap-8 items-center border-b border-theme/30 pb-8">
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-slate-100/10" strokeWidth="12" />
              <motion.circle
                cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-primary" strokeWidth="12"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - 0) }}
                strokeLinecap="round"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Efficiency</span>
              <span className="text-xl font-black">0%</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-slate-400 text-xs font-medium italic">Monitoring capital velocity and upcoming obligations.</p>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-2xl flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-primary uppercase tracking-widest">Available to Withdraw</span>
                  <span className="text-xl font-black text-foreground">${formatCurrency(withholdableEarnings)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Monitor - Restore prominance */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
            <Cpu className="w-3 h-3" />
            Infrastructure Balance Monitors
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayInfra.map((item, i) => (
              <div key={i} className="p-5 bg-theme-background border border-theme rounded-[24px] space-y-3 group hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.platform}</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <p className="text-xl font-black tracking-tighter italic text-foreground">
                  ${item.balance.toFixed(2)}
                </p>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/20" style={{ width: '15%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REVERTED TO TWO COLUMN LAYOUT: Subscriptions | Success Share */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Empire Obligations */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
              <CreditCard className="w-3 h-3" />
              Empire Obligations
            </div>
            <div className="space-y-3">
              {subscriptions.length > 0 ? subscriptions.map((sub, i) => (
                <div key={`sub-${i}`} className="p-6 rounded-[24px] border bg-theme-background border-theme flex items-center justify-between transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary">
                      {(sub.type === 'app' || sub.type === 'platform') ? <AppWindow className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase italic">{sub.name}</p>
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold">
                        <Calendar className="w-2.5 h-2.5" /> {sub.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black italic">{formatCurrency(sub.amount)}</p>
                  </div>
                </div>
              )) : (
                <div className="p-10 border-2 border-dashed border-theme rounded-[32px] text-center bg-slate-950/50">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">No pending obligations</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Success-Shares Card */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
              <TrendingUp className="w-3 h-3" />
              Success Protocols
            </div>
            <div className="p-8 bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[40px] space-y-8 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-base font-black uppercase tracking-wider text-emerald-400 italic">{successShareLabel}</h4>
                  <p className="text-[10px] font-medium text-emerald-400/70">{successShareDesc}</p>
                </div>
              </div>

              <div className="text-left relative z-10">
                <p className="text-4xl font-black text-emerald-400 italic leading-none">
                  $0.00
                </p>
                <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest mt-2 block">
                  {isAdmin ? "Total Platform Collection" : "Current Milestone Progress"}
                </span>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-slate-500">Milestone Cycle</span>
                  <span className="text-emerald-500">0%</span>
                </div>
                <div className="h-4 bg-slate-900 border border-white/5 rounded-full overflow-hidden p-1">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '0%' }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  />
                </div>
              </div>

              <div className="pt-2 relative z-10">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  $40 per $1,000 Revenue Protocol
                </div>
                <button className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[20px] text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all shadow-xl active:scale-95 group">
                  {isAdmin ? "Audit All Empires" : "Request Success Report"}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
    </div>
  );
}
