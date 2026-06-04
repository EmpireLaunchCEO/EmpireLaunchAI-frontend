"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, Clock, AlertCircle, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CycleProps {
  name: string;
  status: 'active' | 'paused' | 'pending-approval';
  progress: number;
  nextAction: string;
}

const Cycle = ({ name, status, progress, nextAction }: CycleProps) => (
  <div className="bg-theme-surface p-6 rounded-[32px] border border-theme shadow-sm flex items-center gap-6 group">
    <div className="relative shrink-0">
      <svg className="w-16 h-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="4"
          className="text-slate-100/10"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          fill="transparent"
          stroke={status === 'pending-approval' ? '#f59e0b' : 'var(--primary)'}
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
          <Activity className="w-6 h-6 text-primary animate-pulse" />
        ) : status === 'pending-approval' ? (
          <AlertCircle className="w-6 h-6 text-cyan-400" />
        ) : (
          <Pause className="w-6 h-6 text-slate-400" />
        )}
      </div>
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-bold text-foreground truncate">{name}</h4>
        <span className={cn(
          "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
          status === 'active' ? "bg-primary/10 text-primary" :
          status === 'pending-approval' ? "bg-amber-50 text-amber-600" : "bg-theme-background text-muted-foreground"
        )}>
          {status}
        </span>
      </div>
      <p className="text-xs text-muted-foreground truncate">Next: {nextAction}</p>
    </div>

    <div className="flex items-center gap-2">
      {status === 'pending-approval' ? (
        <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors">
          Approve
        </button>
      ) : (
        <div className="text-right">
          <span className="block text-sm font-black text-foreground">{progress}%</span>
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
        <h2 className="text-xl font-bold text-foreground">Active Goals & Cycles</h2>
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
