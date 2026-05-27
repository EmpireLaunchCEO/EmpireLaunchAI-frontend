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
    <div className="bg-white rounded-[40px] p-8 border-2 border-slate-50 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Empire Ledger</h3>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial Intelligence</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Projected ROI</p>
          <div className="flex items-center gap-2 text-emerald-600">
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
            className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                inv.type === 'Credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'
              }`}>
                {inv.type === 'Credit' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{inv.customer}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-500 font-medium">{inv.id}</span>
                  <span className="text-[10px] text-slate-300">•</span>
                  <span className="text-[10px] text-slate-500 font-medium">{inv.date}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex items-center gap-6">
              <div>
                <p className={`text-sm font-black ${inv.type === 'Credit' ? 'text-slate-900' : 'text-slate-500'}`}>
                  {inv.type === 'Credit' ? '+' : '-'}${inv.amount.toFixed(2)}
                </p>
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  inv.status === 'Settled' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {inv.status}
                </span>
              </div>
              <button className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100/50">
           <span className="text-[10px] font-black uppercase tracking-widest text-blue-600/60 block mb-1 text-center">Stripe Connect</span>
           <div className="flex items-center justify-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-sm font-bold text-blue-900">Synchronized</span>
           </div>
        </div>
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 flex flex-col items-center justify-center">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Success Fee</span>
           <span className="text-sm font-bold text-white">$30.00 / $1,000</span>
        </div>
      </div>
    </div>
  );
};
