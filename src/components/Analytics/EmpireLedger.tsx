"use client";

import React from 'react';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const transactions = [
  { id: '1', type: 'sale', platform: 'Etsy', amount: 45.00, date: '2h ago', status: 'completed', origin: 'empire-original' },
  { id: '2', type: 'sale', platform: 'Stripe', amount: 29.99, date: '5h ago', status: 'completed', origin: 'growth-protocol' },
  { id: '3', type: 'fee', platform: 'EmpireLaunch', amount: -40.00, name: 'Growth Share ($1,000 Milestone)', date: 'Yesterday', status: 'processed' },
  { id: '4', type: 'sale', platform: 'Etsy', amount: 15.50, date: 'Yesterday', status: 'completed', origin: 'organic' },
  ];

  export function EmpireLedger() {
  const securedDues = 120.40; // Updated for context
  const totalDues = 1000.00; // Updated for context
  const progress = (securedDues / totalDues) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Ledger */}
      <div className="lg:col-span-2 bg-theme-surface rounded-[40px] border border-theme shadow-sm overflow-hidden">
        <div className="p-8 border-b border-theme flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-foreground italic uppercase tracking-tight">Growth Ledger</h3>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">AI-Attributed Revenue Tracking</p>
          </div>
          <button className="text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 transition-all hover:bg-primary/20">
            Audit Ledger <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-theme-background">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction / Origin</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Share Due</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Revenue</th>
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
                            {tx.origin?.replace('-', ' ')}
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
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-foreground">
                        {tx.amount > 0 ? `${(tx.amount * 0.04).toFixed(2)}` : '—'}
                      </span>
                      <span className="text-[8px] font-bold text-slate-500 uppercase">4% Growth Share</span>
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

      {/* Growth Share Monitor */}
      <div className="bg-slate-900 rounded-[40px] p-8 text-white flex flex-col border border-white/5 relative overflow-hidden shadow-2xl">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <button className="text-white/40 hover:text-white transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 relative z-10">
          <h3 className="text-2xl font-black italic uppercase tracking-tight">Growth Share</h3>
          <p className="text-white/50 text-xs font-medium leading-relaxed italic">
            "Your success is my mission. I automatically monitor sales from products I design or promote, securing our 4% success-share from earnings."
          </p>
        </div>

        <div className="mt-10 space-y-8 relative z-10">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Dues Secured</p>
              <h4 className="text-4xl font-black text-primary italic">${securedDues.toFixed(2)}</h4>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Next Milestone</p>
              <p className="text-lg font-black text-white/60 tracking-tighter">$1,000.00</p>
            </div>
          </div>

          <div className="h-6 bg-white/5 rounded-full overflow-hidden relative border border-white/10 p-1">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest">Momentum Status</p>
            </div>
            <p className="text-xs text-white/60 font-medium italic leading-relaxed">
              "You have generated <span className="text-white font-bold">$1,500.00</span> in AI-attributed revenue this period. $60.00 has been set aside for the next growth cycle."
            </p>
          </div>
        </div>

        <button className="mt-10 w-full bg-primary text-slate-950 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">
          Sovereign Billing Center
        </button>
      </div>
    </div>
  );
}
