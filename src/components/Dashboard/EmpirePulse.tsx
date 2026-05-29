"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Search,
  Cpu,
  Zap,
  TrendingUp,
  Brain,
  Pause,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService, EmpirePulseState, approvalService } from '@/lib/api-service';
import { BrandedGlobe } from '@/components/BrandedGlobe';

export function EmpirePulse() {
  const [pulse, setPulse] = useState<EmpirePulseState | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPendingApprovals, setHasPendingApprovals] = useState(false);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      const [pulseData, approvals] = await Promise.all([
        analyticsService.getEmpirePulse(),
        approvalService.getPendingRequests()
      ]);
      setPulse(pulseData);
      setHasPendingApprovals(approvals.length > 0);
      setLoading(false);
    }
    loadData();

    // Mock polling
    const interval = setInterval(async () => {
      const [data, approvals] = await Promise.all([
        analyticsService.getEmpirePulse(),
        approvalService.getPendingRequests()
      ]);
      // Randomize progress a bit for the demo effect
      data.progress = Math.min(100, data.progress + Math.floor(Math.random() * 5));
      setPulse({ ...data });
      setHasPendingApprovals(approvals.length > 0);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Cycle through logs for animation effect
  useEffect(() => {
    if (!pulse?.logs?.length) return;
    const interval = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % pulse.logs!.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pulse?.logs]);

  if (loading || !pulse) {
    return (
      <div className="h-40 flex items-center justify-center bg-slate-900 rounded-[40px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusIcon = (status: EmpirePulseState['status']) => {
    switch (status) {
      case 'researching': return <Search className="w-6 h-6 text-blue-400" />;
      case 'producing': return <Cpu className="w-6 h-6 text-indigo-400" />;
      case 'deploying': return <BrandedGlobe size="md" animate={false} />;
      case 'optimizing': return <TrendingUp className="w-6 h-6 text-amber-400" />;
      default: return <Activity className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className={cn(
      "bg-slate-950 rounded-[40px] p-8 border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-700",
      hasPendingApprovals && "ring-2 ring-amber-500/50"
    )}>
      {/* Background Brain Waves Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <motion.div
           animate={{
             scale: [1, 1.2, 1],
             opacity: [0.3, 0.5, 0.3],
             backgroundColor: hasPendingApprovals ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'
           }}
           transition={{ duration: 4, repeat: Infinity }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]"
         />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        {/* The "Brain" Pulse / Pause */}
        <div className="relative">
           <div className={cn(
             "w-24 h-24 rounded-[32px] bg-slate-900 border border-white/10 flex items-center justify-center shadow-inner relative overflow-hidden transition-colors duration-500",
             hasPendingApprovals && "border-amber-500/30"
           )}>
              <motion.div
                animate={{
                  boxShadow: hasPendingApprovals ? [
                    '0 0 0px rgba(245, 158, 11, 0)',
                    '0 0 20px rgba(245, 158, 11, 0.5)',
                    '0 0 0px rgba(245, 158, 11, 0)'
                  ] : [
                    '0 0 0px rgba(59, 130, 246, 0)',
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                    '0 0 0px rgba(59, 130, 246, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn(
                  "absolute inset-2 rounded-2xl flex items-center justify-center transition-colors duration-500",
                  hasPendingApprovals ? "bg-amber-500/10" : "bg-blue-600/10"
                )}
              >
                <AnimatePresence mode="wait">
                  {hasPendingApprovals ? (
                    <motion.div
                      key="pause"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Pause className="w-10 h-10 text-amber-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="relative flex items-center justify-center"
                    >
                      <BrandedGlobe size="lg" className="opacity-20 absolute inset-0 m-auto border-none bg-transparent shadow-none" />
                      <Brain className="w-10 h-10 text-blue-500 relative z-10" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
           </div>

           {/* Pulsing Dots / Static Dots */}
           {!hasPendingApprovals && (
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-4"
             >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
             </motion.div>
           )}
        </div>

        <div className="flex-1 space-y-4">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-2 w-2">
                       <span className={cn(
                         "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                         hasPendingApprovals ? "bg-amber-400" : "bg-blue-400"
                       )}></span>
                       <span className={cn(
                         "relative inline-flex rounded-full h-2 w-2",
                         hasPendingApprovals ? "bg-amber-500" : "bg-blue-500"
                       )}></span>
                    </span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
                      hasPendingApprovals ? "text-amber-400" : "text-blue-400"
                    )}>
                      {hasPendingApprovals ? 'Orchestrator Paused' : 'Empire Intelligence Pulse'}
                    </span>
                 </div>
                 <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">
                    {hasPendingApprovals ? 'Approval Required' : (
                      <>
                        {pulse?.status === 'researching' && 'Market Discovery Active'}
                        {pulse?.status === 'producing' && 'Autonomous Production'}
                        {pulse?.status === 'deploying' && 'Empire Expansion'}
                        {pulse?.status === 'optimizing' && 'Strategic Optimization'}
                        {pulse?.status === 'idle' && 'Cognitive Rest'}
                      </>
                    )}
                 </h2>
              </div>
              <div className="bg-theme-surface/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                 {hasPendingApprovals ? <Pause className="w-6 h-6 text-amber-500" /> : getStatusIcon(pulse?.status ?? 'idle')}
                 <div className="text-right">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Active Neural Path</p>
                    <p className="text-xs font-bold text-white capitalize">{hasPendingApprovals ? 'Awaiting CEO' : (pulse?.status ?? 'idle')}</p>
                 </div>
              </div>
           </div>

           <p className="text-slate-400 text-sm font-medium italic">
             {hasPendingApprovals ? '"I have reached a strategic junction. Your approval is required to proceed with the next phase of deployment."' : `"${pulse?.description ?? 'Analyzing global market velocity...'}"`}
           </p>

           <div className="space-y-4">
              <div className="space-y-2">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phase Progression</span>
                    <span className={cn(
                      "text-xs font-black transition-colors duration-500",
                      hasPendingApprovals ? "text-amber-400" : "text-blue-400"
                    )}>{pulse.progress}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-theme-surface/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${pulse.progress}%`,
                        background: hasPendingApprovals
                          ? "linear-gradient(90deg, #F59E0B, #D97706)"
                          : "linear-gradient(90deg, #2563EB, #4F46E5)"
                      }}
                      className="h-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                 </div>
              </div>

              {/* Thought Stream / Live Log */}
              {!hasPendingApprovals && pulse.logs && pulse.logs.length > 0 && (
                <div className="bg-black/40 rounded-xl p-3 border border-white/5 font-mono text-[10px] h-12 overflow-hidden relative">
                   <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/40 to-transparent z-10" />
                   <AnimatePresence mode="wait">
                     <motion.div
                       key={activeLogIndex}
                       initial={{ y: 10, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       exit={{ y: -10, opacity: 0 }}
                       className="text-blue-400/80"
                     >
                       <span className="text-blue-500 font-bold mr-2">{'>'}</span>
                       {pulse.logs[activeLogIndex]}
                     </motion.div>
                   </AnimatePresence>
                   <div className="absolute top-2 right-3 flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                      <div className="w-1 h-1 rounded-full bg-blue-500/50 animate-pulse delay-75" />
                      <div className="w-1 h-1 rounded-full bg-blue-500/20 animate-pulse delay-150" />
                   </div>
                </div>
              )}
           </div>
        </div>

        <div className="hidden lg:block w-[1px] h-20 bg-theme-surface/10" />

        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 shrink-0">
           <div className="text-center md:text-left">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">CPU Load</p>
              <div className="flex items-center gap-2">
                 <Zap className={cn("w-3 h-3 transition-colors duration-500", hasPendingApprovals ? "text-muted-foreground" : "text-amber-500")} />
                 <span className="text-sm font-black text-white">{hasPendingApprovals ? '2%' : '42%'}</span>
              </div>
           </div>
           <div className="text-center md:text-left">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Sync Velocity</p>
              <div className="flex items-center gap-2">
                 <TrendingUp className={cn("w-3 h-3 transition-colors duration-500", hasPendingApprovals ? "text-muted-foreground" : "text-emerald-500")} />
                 <span className="text-sm font-black text-white">{hasPendingApprovals ? '0.1 GB/s' : '1.2 GB/s'}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
