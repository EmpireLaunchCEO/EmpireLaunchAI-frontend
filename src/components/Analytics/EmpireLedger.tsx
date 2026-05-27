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
  { id: '1', type: 'sale', platform: 'Etsy', amount: 45.00, date: '2h ago', status: 'completed' },
  { id: '2', type: 'sale', platform: 'Stripe', amount: 29.99, date: '5h ago', status: 'completed' },
  { id: '3', type: 'fee', platform: 'EmpireLaunch', amount: -30.00, name: 'Success Fee ($1,000 Milestone)', date: 'Yesterday', status: 'processed' },
  { id: '4', type: 'sale', platform: 'Etsy', amount: 15.50, date: 'Yesterday', status: 'completed' },
];

export function EmpireLedger() {
  const securedDues = 45; // $45 secured
  const totalDues = 60; // $60 total (Sub + Success Fee)
  const progress = (securedDues / totalDues) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Ledger */}
      <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900">Live Empire Ledger</h3>
          <button className="text-sm font-bold text-blue-600 flex items-center gap-1">
            Export CSV <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-xl",
                        tx.type === 'sale' ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-600"
                      )}>
                        {tx.type === 'sale' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{tx.name || 'Digital Product Sale'}</p>
                        <p className="text-xs text-slate-400">{tx.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-600">{tx.platform}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-xs font-bold text-slate-600 capitalize">{tx.status}</span>
                    </div>
                  </td>
                  <td className={cn(
                    "px-8 py-6 text-right font-black",
                    tx.amount > 0 ? "text-slate-900" : "text-red-600"
                  )}>
                    {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secured Dues Meter */}
      <div className="bg-slate-900 rounded-[40px] p-8 text-white flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div className="bg-white/10 p-3 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <button className="text-white/40 hover:text-white transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold">Secured Dues</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            We automatically set aside your platform fees from earnings so you never have to pay out of pocket.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Set Aside</p>
              <h4 className="text-3xl font-black">${securedDues.toFixed(2)}</h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Target</p>
              <p className="text-lg font-bold text-white/60">${totalDues.toFixed(2)}</p>
            </div>
          </div>

          <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-start gap-4">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold">On Track</p>
              <p className="text-[10px] text-white/40 leading-relaxed">
                You've reached 75% of your $1,000 revenue milestone. $30 success fee will be secured shortly.
              </p>
            </div>
          </div>
        </div>

        <button className="mt-auto w-full bg-white text-slate-900 py-4 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all">
          Manage Billing
        </button>
      </div>
    </div>
  );
}
