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

export function DetailedRevenue() {
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
  const [milestones, setMilestones] = useState<RevenueMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [tData, mData] = await Promise.all([
        analyticsService.getRevenueTransactions(),
        analyticsService.getRevenueMilestones()
      ]);
      setTransactions(tData);
      setMilestones(mData);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);
  const activeMilestone = milestones.find(m => !m.isCompleted) || milestones[milestones.length - 1];
  const progressPercent = activeMilestone ? (activeMilestone.current / activeMilestone.target) * 100 : 0;

  if (loading) {
    return <div className="h-40 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Milestone Progress */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6 relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                <Target className="w-3 h-3" />
                Active Milestone
              </div>
              <h3 className="text-2xl font-black">{activeMilestone?.label}</h3>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
               <span className="text-[10px] font-black text-white uppercase tracking-widest">
                 {progressPercent.toFixed(1)}% Complete
               </span>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
             <div className="flex justify-between items-end">
               <div className="flex items-end gap-2">
                 <span className="text-4xl font-black text-white">${activeMilestone?.current.toLocaleString()}</span>
                 <span className="text-white/40 font-bold mb-1">/ ${activeMilestone?.target.toLocaleString()}</span>
               </div>
               <span className="text-xs font-bold text-blue-400">+${(activeMilestone?.target - activeMilestone?.current).toLocaleString()} remaining</span>
             </div>
             
             <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                />
             </div>
          </div>

          <div className="absolute right-0 bottom-0 p-8 opacity-10">
             <DollarSign className="w-48 h-48 -mr-12 -mb-12 rotate-12" />
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white border border-slate-100 rounded-[32px] p-6 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Velocity</p>
                 <h4 className="text-xl font-black text-slate-900">+18.4%</h4>
              </div>
           </div>
           <div className="bg-white border border-slate-100 rounded-[32px] p-6 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                 <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment Rate</p>
                 <h4 className="text-xl font-black text-slate-900">99.2%</h4>
              </div>
           </div>
           <div className="bg-white border border-slate-100 rounded-[32px] p-6 space-y-4 shadow-sm col-span-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                   <DollarSign className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue (All Time)</p>
                   <h4 className="text-2xl font-black text-slate-900">${totalRevenue.toLocaleString()}</h4>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300" />
           </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Clock className="w-5 h-5" />
             </div>
             <h3 className="text-xl font-black text-slate-900">Recent Transactions</h3>
          </div>
          <button className="text-xs font-bold text-blue-600 uppercase tracking-widest">Download CSV</button>
        </div>
        
        <div className="divide-y divide-slate-50">
          {transactions.map((t) => (
            <div key={t.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                     {new Date(t.date).toLocaleDateString('en-US', { month: 'short' })}
                   </span>
                   <span className="text-lg font-black text-slate-900">
                     {new Date(t.date).getDate()}
                   </span>
                </div>
                <div className="space-y-1">
                   <h4 className="font-bold text-slate-900">{t.customer}</h4>
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
                    <p className="text-lg font-black text-slate-900">+${t.amount.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-slate-400">Net: ${(t.amount * 0.94).toFixed(2)}</p>
                 </div>
                 <button className="p-3 bg-white border border-slate-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                 </button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full py-6 bg-slate-50 text-slate-500 font-bold text-sm hover:bg-slate-100 transition-colors">
          View All Transactions
        </button>
      </div>
    </div>
  );
}
