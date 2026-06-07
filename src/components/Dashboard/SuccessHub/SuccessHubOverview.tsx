"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GrowthTracker } from './GrowthTracker';
import { NeuralActivityFeed } from './NeuralActivityFeed';
import { Brain, Zap, Stars } from 'lucide-react';

interface SuccessHubOverviewProps {
  empireData: any;
  pulseData: any;
  healthData: any;
}

export const SuccessHubOverview = ({ empireData, pulseData, healthData }: SuccessHubOverviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-surface border-2 border-theme rounded-[48px] overflow-hidden shadow-2xl"
    >
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
           <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
              <Stars className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase">Neural Sync Active</span>
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
              currentValue={healthData?.revenue || 0}
              targetValue={1000}
              progress={pulseData?.progress || 0}
            />
          </div>
        </div>
      </div>
      
      {/* Footer bar for the unified hub */}
      <div className="bg-primary/5 py-4 px-10 border-t border-theme/30 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Processing Velocity: 98.4 TFLOPS</span>
         </div>
         <span className="text-[8px] font-black text-primary uppercase tracking-widest">Global Link Verified</span>
      </div>
    </motion.div>
  );
};
