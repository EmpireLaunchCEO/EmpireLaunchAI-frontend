"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Globe, Stars } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmpireIdentityHeader({ empireData }: { empireData: any }) {
  if (!empireData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-surface border border-theme rounded-[32px] p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden"
    >
      <div className="flex items-center gap-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Empire ID: {empireData.id || '1'}</span>
            <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground italic uppercase tracking-tighter">
            {empireData.name || empireData.title || "The First Empire"}
          </h2>
          <div className="flex items-center gap-3">
            <Target className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground italic">
              Niche: <span className="text-foreground">{empireData.niche || "Calibration Pending..."}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-theme-background/50 p-4 rounded-2xl border border-theme relative z-10">
        <div className="text-right">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Neural Calibration</p>
          <p className="text-sm font-black text-foreground">{empireData.niche ? "OPTIMIZED" : "PENDING"}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Stars className={cn("w-5 h-5 text-primary", !empireData.niche && "animate-pulse")} />
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32" />
    </motion.div>
  );
}
