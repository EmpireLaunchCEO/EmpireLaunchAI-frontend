"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket as Bucket, ShieldCheck, ArrowUpRight, TrendingUp, Calendar, CreditCard, AppWindow, Cpu, Zap, Activity, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { infrastructureService, InfrastructureBalance } from '@/lib/api-service';

interface FinancialCommandProps {
  withholdableEarnings?: number;
  securedDues?: number;
  growthScore?: number;
  businessId?: string;
  onActivateGrowthProtocol?: (name: string) => void;
}

export function FinancialCommand({ 
  withholdableEarnings = 125050, 
  securedDues = 18000, 
  growthScore = 92,
  businessId = "1",
  onActivateGrowthProtocol
}: Partial<FinancialCommandProps>) {
  const [infraBalances, setInfraBalances] = useState<InfrastructureBalance[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-financial-command');
    if (saved === 'true') setIsMinimized(true);

    const loadInfra = async () => {
      const bals = await infrastructureService.getBalances();
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

  const subscriptions = [
    { name: "Canva Pro", amount: 1299, date: "June 12, 2024", type: "business" },
    { name: "ChatGPT Plus", amount: 2000, date: "June 15, 2024", type: "business" },
    { name: "EmpireLaunch AI Platform", amount: 4000, date: "June 20, 2024", type: "app" },
  ];

  const dues = [
    { name: "Etsy Listing Fees", amount: 420, date: "June 30, 2024" },
    { name: "Fiverr Commission", amount: 1250, date: "June 30, 2024" },
  ];

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
    <div className="bg-theme-surface rounded-[40px] p-8 text-foreground relative overflow-hidden shadow-2xl border-2 border-theme">
      <div className="absolute top-8 right-8 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative z-10 space-y-10">
        
        {/* Top Header: Bucket Visuals */}
        <div className="flex flex-col md:flex-row gap-8 items-center border-b border-theme/30 pb-8">
          <div className="relative w-32 h-32 shrink-0">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Efficiency</span>
              <span className="text-xl font-black">{growthScore}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 pr-12">
            <h3 className="text-xl font-black uppercase tracking-[0.2em] text-primary italic">Empire Finances</h3>
            <p className="text-slate-400 text-xs font-medium italic">Monitoring capital velocity and upcoming obligations.</p>
            <div className="flex gap-4 pt-2">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-[10px] font-black text-primary uppercase">Available: {formatCurrency(withholdableEarnings)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Monitor */}
        {infraBalances.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
              <Cpu className="w-3 h-3" />
              System Infrastructure Balances
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {infraBalances.map((item, i) => (
                <div key={i} className="p-4 bg-theme-background border border-theme rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase text-muted-foreground">{item.platform}</span>
                    {item.status === 'low' && <Zap className="w-3 h-3 text-amber-500 animate-pulse" />}
                  </div>
                  <p className={cn(
                    "text-lg font-black tracking-tighter italic",
                    item.status === 'low' ? "text-amber-500" : "text-foreground"
                  )}>
                    ${item.balance.toFixed(2)}
                  </p>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full", item.status === 'low' ? "bg-amber-500" : "bg-primary")} 
                      style={{ width: `${Math.min(100, (item.balance / 50) * 100)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Breakdown Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Subscriptions Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
              <CreditCard className="w-3 h-3" />
              Active Subscriptions
            </div>
            <div className="space-y-3">
              {subscriptions.map((sub, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-2xl border flex items-center justify-between transition-all",
                  sub.type === 'app' ? "bg-primary/5 border-primary/30" : "bg-theme-background border-theme"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", sub.type === 'app' ? "bg-primary text-slate-950" : "bg-slate-800 text-slate-400")}>
                      {sub.type === 'app' ? <AppWindow className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
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
                    {sub.type === 'app' && <span className="text-[8px] font-black text-primary uppercase">Platform Due</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dues Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              Marketplace Dues
            </div>
            <div className="space-y-3">
              {dues.map((due, i) => (
                <div key={i} className="p-4 bg-theme-background border border-theme rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-500">
                      <Bucket className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase italic">{due.name}</p>
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold">
                        <Calendar className="w-2.5 h-2.5" /> {due.date}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-black italic text-amber-500">{formatCurrency(due.amount)}</p>
                </div>
              ))}
              
              <div className="mt-8 pt-4 border-t border-theme/30">
                <button className="w-full py-4 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Settle All Dues
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
