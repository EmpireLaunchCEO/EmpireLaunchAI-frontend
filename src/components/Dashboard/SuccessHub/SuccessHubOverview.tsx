"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GrowthTracker } from './GrowthTracker';
import { NeuralActivityFeed } from './NeuralActivityFeed';
import { VideoPerformance } from './VideoPerformance';
import { EmpireLedger } from './EmpireLedger';
import { ActivityStream } from '../ActivityStream';
import { Stars, Brain, Zap, Globe } from 'lucide-react';

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
      className="space-y-12 md:space-y-20 pb-20"
    >
      {/* Primary Intelligence Row */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
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

      {/* Insight Banner */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-1 shadow-xl shadow-blue-200"
      >
        <div className="bg-white/5 backdrop-blur-md rounded-[30px] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg leading-tight">Intelligent Scaling Opportunity Identified</h4>
              <p className="text-white/70 text-sm font-medium">Your TikTok engagement velocity suggests a 15% higher conversion for 'Digital Planners'.</p>
            </div>
          </div>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
            Execute Pivot
          </button>
        </div>
      </motion.div>

      {/* Mid Section: Social & Financial */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-12">
          <VideoPerformance />
          <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-100">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                   <Globe className="w-5 h-5 text-white" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900">Unified Activity Feed</h3>
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time Sync</span>
             </div>
             <ActivityStream />
          </div>
        </div>
        
        <div className="lg:col-span-5 sticky top-8">
          <EmpireLedger health={healthData} />
          
          <div className="mt-10 bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-amber-400 fill-current" />
                  <h4 className="text-xl font-bold">Autonomous Cycle</h4>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  The AI is currently in <span className="text-white font-bold">Optimization Phase</span>. Next batch of Etsy listings scheduled for 04:00 AM.
                </p>
                <div className="flex items-center gap-4">
                   <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ width: ['20%', '85%', '85%'] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                   </div>
                   <span className="text-[10px] font-mono text-slate-500 italic">85% Complete</span>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Global Success Constellation Footer */}
      <footer className="pt-20 border-t border-slate-100">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
            <Stars className="w-3 h-3" />
            Empire Performance Sync
          </div>
          <p className="text-slate-400 text-sm font-medium max-w-lg">
            Your empire is currently operating at <span className="text-slate-900 font-bold">98.4% efficiency</span>. 
            All linked systems are synchronized and data-flows are secured.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};
