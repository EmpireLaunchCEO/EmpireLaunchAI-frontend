"use client";

import React, { useEffect, useState } from 'react';
import { FinancialOverview } from '@/components/Dashboard/FinancialOverview';
import { SocialPerformance } from '@/components/Dashboard/SocialPerformance';
import { AIOptimizationHub } from '@/components/Dashboard/AIOptimizationHub';
import { AutonomousCyclesStatus } from '@/components/Dashboard/AutonomousCyclesStatus';
import { EmpireConstellation } from '@/components/Dashboard/EmpireConstellation';
import { ConversationalInput } from '@/components/Dashboard/ConversationalInput';
import { Sparkles, ShieldCheck, Loader2, Zap, LayoutDashboard, TrendingUp, Users, Calendar, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';

interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function Dashboard() {
  const { activeEmpireId } = useEmpire();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [partnerStatus, setPartnerStatus] = useState<'idle' | 'researching' | 'creating'>('idle');
  const [executingInsight, setExecutingInsight] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/agent/goals`);
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeEmpireId]);

  const handleExecute = async (goal: string) => {
    if (partnerStatus !== 'idle') return;
    
    setPartnerStatus('creating');
    setExecutingInsight(goal);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const response = await fetch(`${API_URL}/api/agent/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, userId: '00000000-0000-0000-0000-000000000000' }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setTimeout(() => {
          setPartnerStatus('idle');
          setExecutingInsight(null);
        }, 2000);

        const goalsResponse = await fetch(`${API_URL}/api/agent/goals`);
        const goalsData = await goalsResponse.json();
        setGoals(goalsData);
      }
    } catch (error) {
      console.error('Error starting agent:', error);
      setPartnerStatus('idle');
      setExecutingInsight(null);
    }
  };

  return (
    <div className="p-8 pb-40 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <LayoutDashboard className="w-3 h-3" />
            Empire Command Center
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Strategic Overview.
          </h1>
          <p className="text-slate-500 font-medium">
            Monitoring <span className="text-slate-900 font-bold">Empire #{activeEmpireId}</span> growth and autonomous operations.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl border border-blue-100 font-bold text-sm shadow-sm">
              <Sparkles className="w-4 h-4" />
              AI Co-Pilot: Active
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
              Neural Sync: 98.4%
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <Zap className="w-6 h-6 fill-current" />
          </div>
        </div>
      </header>

      {/* Partner Thinking Status Overlay */}
      <AnimatePresence>
        {partnerStatus !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-slate-900 rounded-[32px] text-white shadow-2xl flex items-center gap-6 relative overflow-hidden"
          >
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="relative z-10 flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Autonomous Operation in Progress</span>
                <span className="text-[10px] font-bold text-slate-400">Phase: Research & Analysis</span>
              </div>
              <p className="text-lg font-bold">
                {partnerStatus === 'researching' 
                  ? 'Analyzing global market velocity for your current niche...' 
                  : `Executing Strategy: "${executingInsight?.substring(0, 60)}..."`}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-10">
           <div className="space-y-6">
             <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-slate-900">Financial Growth</h2>
               <button className="text-sm font-bold text-blue-600 flex items-center gap-1">
                 Full Ledger <ArrowUpRight className="w-4 h-4" />
               </button>
             </div>
             <FinancialOverview />
           </div>
           <SocialPerformance />
        </div>
        <div className="lg:col-span-1">
           <EmpireConstellation />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <AIOptimizationHub />
        </div>
        <div className="lg:col-span-1 space-y-10">
          <AutonomousCyclesStatus />
          
          <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
             <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-black leading-tight">Expansion Alert.</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  I've detected a high-probability opportunity in the 'Eco-Friendly' segment. Should we pivot our next 3 posts?
                </p>
                <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg">
                  Discuss Strategy
                </button>
             </div>
             <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10 rotate-12" />
          </div>
        </div>
      </div>

      <ConversationalInput 
        onExecute={handleExecute} 
        tip='Try "Research trending digital planners on Etsy"'
      />
    </div>
  );
}
