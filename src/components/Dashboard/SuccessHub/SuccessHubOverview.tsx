"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GrowthTracker } from './GrowthTracker';
import { NeuralActivityFeed } from './NeuralActivityFeed';
import { Brain, Zap, Stars, Minus, Maximize2 } from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { cn } from '@/lib/utils';

interface SuccessHubOverviewProps {
  empireData: any;
  pulseData: any;
  healthData: any;
}

export const SuccessHubOverview = ({ empireData, pulseData, healthData }: SuccessHubOverviewProps) => {
  const { connectedPlatforms } = useEmpire();
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-success-hub-overview');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-success-hub-overview', String(newState));
  };

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-6 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[80px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <Brain className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Primary Intelligence Hub</h2>
        </div>
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const hasLinks = connectedPlatforms.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-surface border-2 border-theme rounded-[48px] overflow-hidden shadow-2xl relative"
    >
      {/* Minimize Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 md:p-10 space-y-8">
        {/* Header of the unified hub */}
        <div className="flex items-center justify-between border-b border-theme/30 pb-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                 <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-foreground uppercase italic tracking-tight">Primary Intelligence</h3>
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Autonomous Control Hub</p>
              </div>
           </div>
           <div className={cn(
             "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
             hasLinks ? "bg-primary/5 border-primary/10 text-primary" : "bg-slate-500/10 border-slate-500/20 text-slate-400"
           )}>
              <Stars className={cn("w-3 h-3", hasLinks ? "text-primary animate-pulse" : "text-slate-500")} />
              <span className="text-[9px] font-black uppercase">{hasLinks ? "Neural Sync Active" : "Neural Sync Standby"}</span>
           </div>
        </div>

        {/* Side-by-Side Content: Swapped Order */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <div className="lg:col-span-1 bg-theme-background/50 rounded-[32px] p-2 border border-theme/20">
            <NeuralActivityFeed logs={pulseData?.logs} status={pulseData?.status} />
          </div>
          <div className="lg:col-span-1 bg-theme-background/50 rounded-[32px] p-2 border border-theme/20">
            <GrowthTracker
              goalTitle={empireData?.activeGoal || "$1,000 Monthly Revenue"}
              monthlyEarnings={healthData?.revenue || 0}
              targetValue={1000}
              progress={pulseData?.progress || 0}
            />
          </div>
        </div>
      </div>
      
      {/* Footer bar for the unified hub */}
      <div className="bg-primary/5 py-4 px-10 border-t border-theme/30 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Zap className={cn("w-3 h-3", hasLinks ? "text-primary" : "text-slate-500")} />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              {hasLinks ? "Processing Velocity: 98.4 TFLOPS" : "Neural Standby Mode"}
            </span>
         </div>
         <span className={cn("text-[8px] font-black uppercase tracking-widest", hasLinks ? "text-primary" : "text-slate-500")}>
           {hasLinks ? "Global Link Verified" : "Awaiting Platform Link"}
         </span>
      </div>
    </motion.div>
  );
};
