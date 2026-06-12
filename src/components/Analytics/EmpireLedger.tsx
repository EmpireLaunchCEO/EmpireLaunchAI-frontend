"use client";

import React from 'react';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  Info,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

const transactions = [
  { id: '1', type: 'sale', platform: 'Etsy', amount: 45.00, date: '2h ago', status: 'completed', origin: 'empire-original', name: 'Vintage Bloom Journal' },
  { id: '2', type: 'sale', platform: 'Stripe', amount: 29.99, date: '5h ago', status: 'completed', origin: 'growth-protocol', name: 'Digital Planner Pro' },
  { id: '3', type: 'fee', platform: 'EmpireLaunch', amount: -40.00, name: 'Growth Share ($1,000 Milestone)', date: 'Yesterday', status: 'processed' },
  { id: '4', type: 'sale', platform: 'Etsy', amount: 15.50, date: 'Yesterday', status: 'completed', origin: 'organic', name: 'Classic Sticker Pack' },
];

export function EmpireLedger() {
  const securedShares = 60.00;

  return (
    <div className="space-y-8">
      {/* Ledger */}
      <div className="bg-theme-surface rounded-[40px] border border-theme shadow-sm overflow-hidden">
        <div className="p-8 border-b border-theme flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="text-xl font-bold text-foreground italic uppercase tracking-tight">Success-Share Ledger</h3>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Full Transparency Audit Trail</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
             <div className="text-right px-6 border-r border-theme">
                <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Total Success-Shares (4%)</p>
                <p className="text-lg font-black text-primary">${securedShares.toFixed(2)}</p>
             </div>
            <button className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest bg-primary/10 px-4 py-2.5 rounded-xl border border-primary/20 transition-all hover:bg-primary/20">
              <FileText className="w-4 h-4" /> Download Audit Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-theme-background">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product / Audit Reason</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Math (4%)</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-theme-background/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-xl",
                        tx.type === 'sale' ? "bg-primary/10 text-primary" : "bg-theme-background text-slate-600"
                      )}>
                        {tx.type === 'sale' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground uppercase text-xs">{tx.name || 'Product Sale'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "text-[8px] font-black uppercase px-1.5 py-0.5 rounded border",
                            tx.origin === 'empire-original' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            tx.origin === 'growth-protocol' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                            "bg-slate-500/10 text-slate-500 border-slate-500/20"
                          )}>
                            {tx.origin === 'empire-original' ? 'Empire Designed' : tx.origin === 'growth-protocol' ? 'Promoted by AI' : 'Organic'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">{tx.date}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{tx.platform}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col group/math relative">
                      <span className="text-xs font-black text-foreground">
                        {tx.amount > 0 ? '$' + (tx.amount * 0.04).toFixed(2) : '—'}
                      </span>
                      <span className="text-[8px] font-bold text-green-500 uppercase italic">Success-Share</span>
                      
                      {/* Math Breakdown Tooltip */}
                      {tx.amount > 0 && (
                        <div className="absolute left-0 bottom-full mb-2 bg-slate-900 border border-white/10 p-3 rounded-xl opacity-0 group-hover/math:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl w-56">
                           <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Transparency Audit</p>
                           <p className="text-[10px] text-white/60 leading-relaxed italic">
                             "${tx.amount.toFixed(2)} [Gross] × 0.04 [Agreement] = ${(tx.amount * 0.04).toFixed(2)}"
                           </p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={cn(
                    "px-8 py-6 text-right font-black",
                    tx.amount > 0 ? "text-foreground text-lg" : "text-red-600"
                  )}>
                    {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : `-${Math.abs(tx.amount).toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
