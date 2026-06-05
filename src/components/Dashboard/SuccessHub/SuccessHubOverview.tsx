"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GrowthTracker } from './GrowthTracker';
import { NeuralActivityFeed } from './NeuralActivityFeed';
import { VideoPerformance } from './VideoPerformance';
import { EmpireLedger } from './EmpireLedger';
import { EmpireGrowthBreakdown } from './EmpireGrowthBreakdown';
import { TrustPulse } from './TrustPulse';
import { InboxAssistant } from './InboxAssistant';
import { SocialProofApproval } from '../SocialProofApproval';
import { ActivityStream } from '../ActivityStream';
import { Stars, Brain, Zap, Globe } from 'lucide-react';
import { BrandedGlobe } from '@/components/BrandedGlobe';

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
      className="space-y-8 md:space-y-16 pb-12"
    >
      {/* Primary Intelligence Row */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8 items-start">
        <div className="lg:col-span-3">
          <GrowthTracker
            goalTitle={empireData?.activeGoal || "$1,000 Monthly Revenue"}
            currentValue={healthData?.revenue || 0}
            targetValue={1000}
            progress={pulseData?.progress}
          />
        </div>
        <div className="lg:col-span-2">
          <NeuralActivityFeed logs={pulseData?.logs} status={pulseData?.status} />
        </div>
      </section>

      {/* Growth & Trust Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <EmpireGrowthBreakdown growthScore={healthData?.growthScore || 84} healthData={healthData} />
        <TrustPulse />
      </section>

      <section className="space-y-4 md:space-y-8">
         <VideoPerformance />
      </section>

      {/* Insight Banner */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-r from-primary to-amber-600 rounded-[24px] md:rounded-[32px] p-0.5 md:p-1 shadow-xl shadow-primary/20"
      >
        <div className="bg-theme-background/10 backdrop-blur-md rounded-[23px] md:rounded-[30px] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4 text-white">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-theme-surface/20 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm md:text-lg leading-tight uppercase italic">Scaling Opportunity Identified</h4>
              <p className="text-white/70 text-[9px] md:text-sm font-medium">TikTok engagement velocity suggests a 15% higher conversion for 'Digital Planners'.</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-theme-surface text-foreground px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[9px] md:text-sm uppercase tracking-widest hover:bg-theme-surface/90 transition-colors shadow-lg shadow-black/20">
            Execute Pivot
          </button>
        </div>
      </motion.div>

      {/* Mid Section: Social & Financial */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        <div className="lg:col-span-7 space-y-6 lg:space-y-12">
          <div className="bg-theme-surface rounded-[24px] md:rounded-[40px] p-4 md:p-8 border border-theme">
             <div className="flex items-center justify-between mb-4 md:mb-8">
               <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-theme-background flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                   <BrandedGlobe size="sm" />
                 </div>
                 <h3 className="text-base md:text-xl font-black text-foreground uppercase italic tracking-tight">Unified Activity Feed</h3>
               </div>
               <span className="hidden md:block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Real-time Sync</span>
             </div>
             <ActivityStream />
          </div>
        </div>

        <div className="lg:col-span-5 sticky top-8 space-y-6 lg:space-y-10">
          <EmpireLedger health={healthData} />
          <InboxAssistant />

          <div className="bg-theme-surface rounded-[24px] md:rounded-[40px] p-4 md:p-8 text-foreground border border-theme relative overflow-hidden">
             <div className="relative z-10 space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary fill-current" />
                  <h4 className="text-lg md:text-xl font-bold">Autonomous Cycle</h4>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-medium">
                  The AI is currently in <span className="text-primary font-bold">Optimization Phase</span>. Next batch of Etsy listings scheduled for 04:00 AM.
                </p>
                <div className="flex items-center gap-3 md:gap-4">
                   <div className="flex-1 h-1.5 md:h-2 bg-theme-background rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: ['20%', '85%', '85%'] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="h-full bg-primary rounded-full"
                      />
                   </div>
                   <span className="text-[8px] md:text-[10px] font-mono text-muted-foreground italic">85% Complete</span>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/10 blur-[60px] md:blur-[80px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Global Success Constellation Footer */}
      <footer className="pt-20 border-t border-theme">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
            <Stars className="w-3 h-3" />
            Empire Performance Sync
          </div>
          <p className="text-muted-foreground text-sm font-medium max-w-lg">
            Your empire is currently operating at <span className="text-foreground font-bold">98.4% efficiency</span>.
            All linked systems are synchronized and data-flows are secured.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};
