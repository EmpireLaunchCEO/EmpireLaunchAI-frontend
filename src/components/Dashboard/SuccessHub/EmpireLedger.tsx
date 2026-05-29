"use client";

import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, FileText, Download, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_INVOICES = [
  { id: 'INV-001', customer: 'Etsy Customer', amount: 24.99, date: 'Today', status: 'Settled', type: 'Credit' },
  { id: 'INV-002', customer: 'Fiverr Client', amount: 150.00, date: 'Yesterday', status: 'Pending', type: 'Credit' },
  { id: 'INV-003', customer: 'Platform Fee', amount: 30.00, date: 'May 21', status: 'Settled', type: 'Debit' },
];

export const EmpireLedger = ({ health }: { health: any }) => {
  return (
    <div className="bg-theme-surface rounded-[40px] p-8 border border-theme shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Empire Ledger</h3>
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Financial Intelligence</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Projected ROI</p>
          <div className="flex items-center gap-2 text-emerald-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xl font-black">${(health?.revenue || 4250).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_INVOICES.map((inv, idx) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 rounded-3xl bg-theme-background border border-theme group hover:bg-theme-surface hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                inv.type === 'Credit' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-theme-surface text-muted-foreground'
              }`}>
                {inv.type === 'Credit' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{inv.customer}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium">{inv.id}</span>
                  <span className="text-[10px] text-muted-foreground/30">•</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{inv.date}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex items-center gap-6">
              <div>
                <p className={`text-sm font-black ${inv.type === 'Credit' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {inv.type === 'Credit' ? '+' : '-'}${inv.amount.toFixed(2)}
                </p>
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  inv.status === 'Settled' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {inv.status}
                </span>
              </div>
              <button className="w-8 h-8 rounded-xl bg-theme-background border border-theme flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="bg-primary/5 rounded-3xl p-5 border border-primary/20">
           <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 block mb-1 text-center">Stripe Connect</span>
           <div className="flex items-center justify-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-sm font-bold text-foreground">Synchronized</span>
           </div>
        </div>
        <div className="bg-theme-background rounded-3xl p-5 border border-theme flex flex-col items-center justify-center">
           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Success Fee</span>
           <span className="text-sm font-bold text-foreground">$30.00 / $1,000</span>
        </div>
      </div>
    </div>
  );
};
