"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PerformanceIntelligence } from './PerformanceIntelligence';
import { StrategyQueue } from './StrategyQueue';
import { NeuralActivityFeed } from './NeuralActivityFeed';
import { VideoPerformance } from './VideoPerformance';
import { EmpireLedger } from './EmpireLedger';
import { InboxAssistant } from './InboxAssistant';
import { ActivityStream } from '../ActivityStream';
import { Stars, Brain, Zap, Globe, LayoutDashboard } from 'lucide-react';

interface SuccessHubOverviewProps {
  empireData: any;
  pulseData: any;
  healthData: any;
  transactions: any[];
}

export const SuccessHubOverview = ({ empireData, pulseData, healthData, transactions }: SuccessHubOverviewProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 md:space-y-24 pb-20"
    >
      {/* 1. Intelligence Dashboard Header */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
              <LayoutDashboard className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">Intelligence Dashboard</h2>
              <p className="text-xs text-theme-background0 font-bold uppercase tracking-[0.2em]">Omnichannel Performance & Strategy Synthesis</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-theme-background0 uppercase tracking-widest">Neural Sync Status</p>
                <p className="text-sm font-black text-emerald-500 uppercase tracking-widest">Active</p>
             </div>
             <div className="relative w-12 h-12 flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-500/20 rounded-full"
                />
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             </div>
          </div>
        </div>
        
        <PerformanceIntelligence health={healthData} />
      </section>

      {/* 2. Strategy Queue (Actionable Strategy Suggestions UI) */}
      <section className="pt-20 border-t border-theme">
        <StrategyQueue />
      </section>

      {/* 3. Neural Activity & Video Performance */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start pt-20 border-t border-theme">
        <div className="lg:col-span-3">
           <NeuralActivityFeed logs={pulseData?.logs} status={pulseData?.status} />
        </div>
        <div className="lg:col-span-2 space-y-10">
           <VideoPerformance />
           <InboxAssistant />
        </div>
      </section>

      {/* 4. Social & Financial Intelligence */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-20 border-t border-theme">
        <div className="lg:col-span-7 space-y-12">
          <div className="bg-slate-900 rounded-[48px] p-10 border border-white/5 shadow-2xl">
             <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
                   <img src="/branded-globe.png" alt="Globe" className="w-8 h-8 object-cover" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-white italic">Unified Activity Feed</h3>
                    <p className="text-[10px] font-black text-theme-background0 uppercase tracking-widest">Real-time Cross-Platform Stream</p>
                 </div>
               </div>
               <div className="px-4 py-2 bg-white/5 rounded-full border border-white/5">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] animate-pulse">Live Syncing</span>
               </div>
             </div>
             <ActivityStream />
          </div>
        </div>
        
        <div className="lg:col-span-5 space-y-10">
          <EmpireLedger health={healthData} />
          
          <div className="bg-amber-400 rounded-[48px] p-10 text-slate-900 relative overflow-hidden shadow-2xl shadow-amber-400/20">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-slate-900 fill-current" />
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter">Autonomous Cycle</h4>
                </div>
                <p className="text-slate-900/70 text-sm leading-relaxed font-bold italic">
                  "The Empire Engine is currently in <span className="text-slate-900 font-black">Optimization Phase</span>. Next batch of Etsy listings scheduled for 04:00 AM. 3D Asset generation pipeline is cleared."
                </p>
                <div className="flex items-center gap-6">
                   <div className="flex-1 h-3 bg-slate-900/10 rounded-full overflow-hidden border border-slate-900/5">
                      <motion.div 
                        animate={{ width: ['20%', '85%', '85%'] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="h-full bg-slate-900 rounded-full shadow-lg"
                      />
                   </div>
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">85% Complete</span>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-[80px] rounded-full -mr-16 -mt-16" />
          </div>
        </div>
      </section>

      {/* Global Success Constellation Footer */}
      <footer className="pt-20 border-t border-theme">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-black text-[10px] uppercase tracking-[0.6em]">
            <Stars className="w-3 h-3" />
            Empire Performance Sync
          </div>
          <p className="text-theme-background0 text-sm font-bold max-w-lg italic">
            Your empire is currently operating at <span className="text-foreground font-black">98.4% efficiency</span>. 
            All linked systems are synchronized and data-flows are secured under Neural Encryption v4.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};
