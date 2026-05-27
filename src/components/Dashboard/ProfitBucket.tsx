"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBucket as Bucket, ShieldCheck, ArrowUpRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfitBucketProps {
  withholdableEarnings: number; // in cents
  securedDues: number; // in cents
  growthScore: number;
}

export function ProfitBucket({ withholdableEarnings = 125050, securedDues = 18000, growthScore = 92 }: Partial<ProfitBucketProps>) {
  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const total = withholdableEarnings + securedDues;
  const duesPercentage = (securedDues / total) * 100;

  return (
    <div className="bg-secondary rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        {/* The Visual "Bucket" */}
        <div className="relative w-48 h-48 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="12"
            />
            {/* Progress Circle (Earnings) */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="currentColor" 
              className="text-primary"
              strokeWidth="12"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 * (1 - (withholdableEarnings / total)) }}
              strokeLinecap="round"
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            {/* Secured Dues Segment */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#fbbf24" // amber-400
              strokeWidth="12"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 * (1 - (securedDues / total)) }}
              style={{ rotate: 360 * (withholdableEarnings / total) }}
              strokeLinecap="round"
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Bucket className="w-8 h-8 text-primary mb-1 opacity-60" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Growth</span>
            <span className="text-2xl font-black">{growthScore}</span>
          </div>
        </div>

        {/* Legend & Stats */}
        <div className="flex-1 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Profit Bucket</h3>
            <p className="text-slate-400 text-xs font-medium">Real-time withholding for secured operating growth.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Withholdable</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black">{formatCurrency(withholdableEarnings)}</span>
                <div className="text-green-400 flex items-center gap-0.5 text-[10px] font-bold pb-1">
                  <TrendingUp className="w-3 h-3" /> +12%
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secured Dues</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-amber-400">{formatCurrency(securedDues)}</span>
                <ShieldCheck className="w-4 h-4 text-amber-400/50 pb-1" />
              </div>
            </div>
          </div>

          <button className="w-full py-4 bg-primary hover:opacity-90 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20">
            Request Withdrawal <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-10 -mr-32 -mt-32" />
    </div>
  );
}
