"use client";

import React, { useEffect, useState } from 'react';
import { MissionBriefing } from '@/components/Dashboard/MissionBriefing';
import { ApprovalQueue } from '@/components/EmpireMode/ApprovalQueue';
import { DetailedRevenue } from '@/components/Dashboard/DetailedRevenue';
import { ProfitBucket } from '@/components/Dashboard/ProfitBucket';
import { BusinessSlots } from '@/components/Dashboard/BusinessSlots';
import { SocialProofApproval } from '@/components/Dashboard/SocialProofApproval';
import { AIOptimizationHub } from '@/components/Dashboard/AIOptimizationHub';
import { AutonomousCyclesStatus } from '@/components/Dashboard/AutonomousCyclesStatus';
import { EmpireConstellation } from '@/components/Dashboard/EmpireConstellation';
import { ConversationalInput } from '@/components/Dashboard/ConversationalInput';
import { SuccessHubOverview } from '@/components/Dashboard/SuccessHub/SuccessHubOverview';
import { Stars, Loader2, Home, ArrowUpRight, Plus, X, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';
import { analyticsService } from '@/lib/api-service';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { NotificationOnboarding } from '@/components/Dashboard/NotificationOnboarding';
import { useSearchParams } from 'next/navigation';

interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function Dashboard() {
  const { activeEmpireId, isLinkingComplete } = useEmpire();
  const [empireData, setEmpireData] = useState<any>(null);
  const [pulseData, setPulseData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [partnerStatus, setPartnerStatus] = useState<'idle' | 'researching' | 'creating'>('idle');
  const [executingInsight, setExecutingInsight] = useState<string | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    if (isLinkingComplete && !isLoading) {
      const hasCelebrated = sessionStorage.getItem('hasCelebrated');
      if (!hasCelebrated) {
        setIsCelebrating(true);
        sessionStorage.setItem('hasCelebrated', 'true');
        const timer = setTimeout(() => setIsCelebrating(false), 3500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLinkingComplete, isLoading]);

  const fetchData = async () => {
    try {
      const [empireRes, pulseRes, healthRes, txRes] = await Promise.all([
        fetch(`${API_URL}/api/agent/empire/${activeEmpireId}`),
        analyticsService.getEmpirePulse(),
        analyticsService.getEmpireHealth(),
        analyticsService.getRevenueTransactions()
      ]);

      if (empireRes.ok) {
        const eData = await empireRes.json();
        setEmpireData(eData);
      }
      setPulseData(pulseRes);
      setHealthData(healthRes);
      setTransactions(txRes);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeEmpireId]);

  const handleExecute = async (goal: string) => {
    if (!isLinkingComplete && (window as any).interceptTeacher) {
      (window as any).interceptTeacher(goal);
      return;
    }

    if (partnerStatus !== 'idle') return;
    
    setPartnerStatus('creating');
    setExecutingInsight(goal);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const response = await fetch(`${API_URL}/api/agent/start`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token'
        },
        body: JSON.stringify({ 
          goal, 
          userId: '00000000-0000-0000-0000-000000000000',
          empireId: activeEmpireId 
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setTimeout(() => {
          setPartnerStatus('idle');
          setExecutingInsight(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error starting agent:', error);
      setPartnerStatus('idle');
      setExecutingInsight(null);
    }
  };

  return (
    <div className="p-4 md:p-8 pb-40 max-w-7xl mx-auto space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
              <LayoutDashboard className="w-3 h-3" />
              Success Hub <span className="ml-2 text-[8px] bg-primary/20 px-2 py-0.5 rounded-full">v4.1.7 (PROD)</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              {empireData?.name || "Success Hub"}.
            </h1>
            <p className="text-sm md:text-base text-theme-background0 font-medium">
              Monitoring your {empireData?.niche || "business"} growth and autonomous operations.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-start md:items-end">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-2xl border border-primary/20 font-bold text-sm shadow-sm">
                <Stars className="w-4 h-4" />
                AI Co-Pilot: Active
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-1 md:ml-0">
                Neural Sync: 100.0%
              </span>
            </div>
          </div>
        </header>

        <BusinessSlots currentEmpire={empireData} />

        {!isLinkingComplete ? (
          <div className="bg-theme-surface border-2 border-theme rounded-[48px] p-8">
             <GuidedLinking />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12 md:space-y-20"
          >
            {/* Thinking Status Overlay */}
            <AnimatePresence>
              {partnerStatus !== 'idle' && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 bg-slate-900 rounded-[32px] text-white shadow-2xl flex items-center gap-6 relative overflow-hidden z-50"
                >
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Autonomous Operation</span>
                      <span className="text-[10px] font-bold text-slate-400">Phase: Research & Analysis</span>
                    </div>
                    <p className="text-lg font-bold">
                      {partnerStatus === 'researching' 
                        ? 'Analyzing global market velocity...' 
                        : `Executing Strategy: "${executingInsight?.substring(0, 60)}..."`}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <SuccessHubOverview 
              empireData={empireData} 
              pulseData={pulseData}
              healthData={healthData}
              transactions={transactions}
            />

            {/* Empire Control Gates */}
            <section className="space-y-10 pt-20 border-t border-theme">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                     <LayoutDashboard className="w-5 h-5 text-slate-600" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-foreground tracking-tight">Control Gates</h2>
                     <p className="text-xs text-theme-background0 font-medium">Human-in-the-loop validation for autonomous actions.</p>
                   </div>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Content Approval</h3>
                    <ApprovalQueue />
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Social Proof Queue</h3>
                    <SocialProofApproval />
                 </div>
               </div>
            </section>

            {/* Secondary Intelligence Hubs */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <AIOptimizationHub />
              </div>
              <div className="lg:col-span-1 space-y-10">
                <AutonomousCyclesStatus />
                <EmpireConstellation />
              </div>
            </section>
          </motion.div>
        )}

        <AnimatePresence>
          {isCelebrating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-primary"
            >
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ scale: 0.5, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-32 h-32 bg-theme-surface rounded-[40px] mx-auto flex items-center justify-center shadow-2xl"
                >
                  <Stars className="w-16 h-16 text-primary" />
                </motion.div>
                <h2 className="text-5xl font-black text-white tracking-tighter">Neural Sync Established.</h2>
                <p className="text-primary/20 text-xl font-medium">Welcome to your Empire Command Center.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ConversationalInput
          onExecute={handleExecute}
          tip={isLinkingComplete ? 'Try "Research trending digital planners on Etsy"' : 'Ask me how to link your platforms!'}
        />

        {isLinkingComplete && <NotificationOnboarding />}
      </div>
    </PullToRefresh>
  );
}
