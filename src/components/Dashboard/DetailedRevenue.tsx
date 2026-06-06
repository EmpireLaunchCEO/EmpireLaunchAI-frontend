"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService, RevenueTransaction, RevenueMilestone } from '@/lib/api-service';

import { useEmpire } from '@/lib/EmpireContext';

import { BrandedGlobe } from '@/components/BrandedGlobe';

export function DetailedRevenue() {
  const { connectedPlatforms } = useEmpire();
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
  const [milestones, setMilestones] = useState<RevenueMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [tData, mData] = await Promise.all([
        analyticsService.getRevenueTransactions(),
        analyticsService.getRevenueMilestones()
      ]);
      
      // Filter transactions based on linked platforms
      const filteredT = (tData || []).filter(t => 
        t && t.platform && (connectedPlatforms || []).some(cp => cp && cp.toLowerCase() === t.platform.toLowerCase())
      );
      
      setTransactions(filteredT || []);
      setMilestones(mData || []);
      setLoading(false);
    }
    loadData();
  }, [connectedPlatforms]);

  const totalRevenue = (transactions || []).reduce((acc, t) => acc + (t?.amount || 0), 0);
  const activeMilestone = (milestones || []).find(m => m && !m.isCompleted) || (milestones && milestones.length > 0 ? milestones[milestones.length - 1] : null);
  
  // Safe progress calculation
  const currentVal = activeMilestone?.current || 0;
  const targetVal = activeMilestone?.target || 1000;
  const rawProgress = (currentVal / (targetVal || 1)) * 100;
  const progressPercent = Math.min(100, Math.max(0, isNaN(rawProgress) ? 0 : rawProgress));

  if (loading) {
    return <div className="h-40 flex items-center justify-center">
      <BrandedGlobe size="sm" animate={true} />
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Milestone Progress */}
        <div className="bg-theme-surface rounded-[40px] p-8 text-foreground space-y-6 relative overflow-hidden shadow-2xl border-2 border-theme">
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                <Target className="w-3 h-3" />
                Active Milestone
              </div>
              <h3 className="text-2xl font-black">{activeMilestone?.label}</h3>
            </div>
            <div className="bg-primary/10 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20">
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                 {progressPercent.toFixed(1)}% Complete
               </span>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
             <div className="flex justify-between items-end">
               <div className="flex items-end gap-2">
                 <span className="text-4xl font-black text-foreground">${activeMilestone?.current?.toLocaleString() || '0'}</span>
                 <span className="text-muted-foreground font-bold mb-1">/ ${activeMilestone?.target?.toLocaleString() || '1,000'}</span>
               </div>
               <span className="text-xs font-bold text-primary">+${((activeMilestone?.target || 0) - (activeMilestone?.current || 0)).toLocaleString()} remaining</span>
             </div>

             <div className="h-3 w-full bg-theme-background rounded-full overflow-hidden border border-theme">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                />
             </div>
          </div>

          <div className="absolute right-0 bottom-0 p-8 opacity-5">
             <DollarSign className="w-48 h-48 -mr-12 -mb-12 rotate-12" />
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-theme-surface border border-theme rounded-[32px] p-6 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Velocity</p>
                 <h4 className="text-xl font-black text-foreground">+18.4%</h4>
              </div>
           </div>
           <div className="bg-theme-surface border border-theme rounded-[32px] p-6 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment Rate</p>
                 <h4 className="text-xl font-black text-foreground">99.2%</h4>
              </div>
           </div>
           <div className="bg-theme-surface border border-theme rounded-[32px] p-6 space-y-4 shadow-sm col-span-2 flex items-center justify-between">
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
          {transactions.map((t) => (
            <div key={t.id} className="p-6 hover:bg-theme-background transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                     {new Date(t.date).toLocaleDateString('en-US', { month: 'short' })}
                   </span>
                   <span className="text-lg font-black text-foreground">
                     {new Date(t.date).getDate()}
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
                    <p className="text-lg font-black text-foreground">+${t.amount.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-slate-400">Net: ${(t.amount * 0.94).toFixed(2)}</p>
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
