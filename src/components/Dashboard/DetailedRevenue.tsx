"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  Minus,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService, RevenueTransaction, RevenueMilestone } from '@/lib/api-service';

import { useEmpire } from '@/lib/EmpireContext';

import { BrandedGlobe } from '@/components/BrandedGlobe';

export function DetailedRevenue() {
  const { connectedPlatforms } = useEmpire();
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-detailed-revenue');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-detailed-revenue', String(newState));
  };

  useEffect(() => {
    async function loadData() {
      const tData = await analyticsService.getRevenueTransactions();
      
      // Filter transactions based on linked platforms
      const filteredT = (tData || []).filter(t => 
        t && t.platform && (connectedPlatforms || []).some(cp => cp && cp.toLowerCase() === t.platform.toLowerCase())
      );
      
      setTransactions(filteredT || []);
      setLoading(false);
    }
    loadData();
  }, [connectedPlatforms]);

  const totalRevenue = (transactions || []).reduce((acc, t) => acc + (t?.amount || 0), 0);
  
  if (!mounted) return null;

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <BrandedGlobe size="md" animate={true} />
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-3xl p-6 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[80px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Revenue Command</h2>
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
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-0 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="bg-theme-surface border border-theme rounded-[32px] p-6 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Velocity</p>
                 <h4 className="text-xl font-black text-foreground">0%</h4>
              </div>
           </div>
           <div className="bg-theme-surface border border-theme rounded-[32px] p-6 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment Rate</p>
                 <h4 className="text-xl font-black text-foreground">0%</h4>
              </div>
           </div>
           <div className="bg-theme-surface border border-theme rounded-[32px] p-6 space-y-4 shadow-sm lg:col-span-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                   <DollarSign className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue (All Time)</p>
                   <h4 className="text-2xl font-black text-foreground">${totalRevenue.toLocaleString()}</h4>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300" />
           </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-theme-surface border border-theme rounded-[40px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-theme flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Clock className="w-5 h-5" />
             </div>
             <h3 className="text-xl font-black text-foreground">Recent Transactions</h3>
          </div>
          <button className="text-xs font-bold text-primary uppercase tracking-widest">Download CSV</button>
        </div>

        <div className="divide-y divide-theme">
          {(transactions || []).map((t) => (
            <div key={t.id} className="p-6 hover:bg-theme-background transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                     {mounted && t?.date ? new Date(t.date).toLocaleDateString('en-US', { month: 'short' }) : '---'}
                   </span>
                   <span className="text-lg font-black text-foreground">
                     {mounted && t?.date ? new Date(t.date).getDate() : '--'}
                   </span>
                </div>

                <div className="space-y-1">
                   <h4 className="font-bold text-foreground">{t.customer}</h4>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.platform}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        t.status === 'completed' ? "text-green-500" : "text-amber-500"
                      )}>{t.status}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="text-right">
                    <p className="text-lg font-black text-foreground">+${(t?.amount || 0).toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-slate-400">Net: ${((t?.amount || 0) * 0.96).toFixed(2)}</p>
                 </div>
                 <button className="p-3 bg-theme-surface border border-theme rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                 </button>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-6 bg-theme-background text-muted-foreground font-bold text-sm hover:bg-theme-surface transition-colors border-t border-theme">
          View All Transactions
        </button>
      </div>
    </div>
  );
}
