"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, CheckCircle2, Clock, AlertCircle, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CycleProps {
  name: string;
  status: 'active' | 'paused' | 'pending-approval';
  progress: number;
  nextAction: string;
}

const Cycle = ({ name, status, progress, nextAction }: CycleProps) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group">
    <div className="relative shrink-0">
      <svg className="w-16 h-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="4"
          className="text-slate-100"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          fill="transparent"
          stroke={status === 'pending-approval' ? '#f59e0b' : '#3b82f6'}
          strokeWidth="4"
          strokeDasharray={2 * Math.PI * 28}
          initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - progress / 100) }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {status === 'active' ? (
          <RefreshCcw className="w-6 h-6 text-blue-600 animate-spin-slow" />
        ) : status === 'pending-approval' ? (
          <AlertCircle className="w-6 h-6 text-amber-500" />
        ) : (
          <Pause className="w-6 h-6 text-slate-400" />
        )}
      </div>
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-bold text-slate-900 truncate">{name}</h4>
        <span className={cn(
          "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
          status === 'active' ? "bg-blue-50 text-blue-600" : 
          status === 'pending-approval' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
        )}>
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-500 truncate">Next: {nextAction}</p>
    </div>

    <div className="flex items-center gap-2">
      {status === 'pending-approval' ? (
        <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors">
          Approve
        </button>
      ) : (
        <div className="text-right">
          <span className="block text-sm font-black text-slate-900">{progress}%</span>
          <span className="block text-[8px] font-bold text-slate-400 uppercase">Complete</span>
        </div>
      )}
    </div>
  </div>
);

export function AutonomousCyclesStatus() {
  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Active Goals & Cycles</h2>
        <button className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
          <Play className="w-4 h-4 text-slate-600 fill-current" />
        </button>
      </div>

      <div className="space-y-4">
        <Cycle 
          name="Etsy Content Factory" 
          status="active" 
          progress={65} 
          nextAction="Generate listing keywords"
        />
        <Cycle 
          name="TikTok Growth Loop" 
          status="pending-approval" 
          progress={90} 
          nextAction="Post #MorningRoutine draft"
        />
        <Cycle 
          name="Market Trend Monitor" 
          status="active" 
          progress={32} 
          nextAction="Scraping competitor updates"
        />
      </div>
    </div>
  );
}
