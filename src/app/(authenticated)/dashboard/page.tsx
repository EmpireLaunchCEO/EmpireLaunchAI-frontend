"use client";

import React, { useEffect, useState, useCallback } from 'react';
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
import { Stars, Home, ArrowUpRight, Plus, X, LayoutDashboard, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';
import { analyticsService } from '@/lib/api-service';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { NotificationOnboarding } from '@/components/Dashboard/NotificationOnboarding';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const { activeEmpireId, isLinkingComplete, aiMode, isInitialized, setDashboardLoaded } = useEmpire();
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    if (!mounted) return;
    setIsLoading(true);
    
    // 5-second timeout safety net — prevents infinite hang on "Neural Syncing"
    const timeout = new Promise<null>((resolve) => setTimeout(() => {
      console.warn('[Dashboard] Data fetch timed out — showing fallback');
      resolve(null);
    }, 5000));

    try {
      // Artificially delay to show the refresh globe and clear cache
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = await Promise.race([
        Promise.all([
          fetch(`${API_URL}/api/agent/empire/${activeEmpireId}`, { cache: 'no-store' }).catch(() => null),
          analyticsService.getEmpirePulse().catch(() => null),
          analyticsService.getEmpireHealth().catch(() => null),
          analyticsService.getRevenueTransactions().catch(() => [])
        ]),
        timeout
      ]);

      if (result) {
        const [empireRes, pulseRes, healthRes, txRes] = result;
        if (empireRes && empireRes.ok) {
          const eData = await empireRes.json();
          setEmpireData(eData);
        }
        setPulseData(pulseRes);
        setHealthData(healthRes);
        setTransactions(txRes);
        
        // Data is ready
        setDashboardLoaded(true);
      } else {
        // Timeout case
        setDashboardLoaded(true); // Still set to true to allow UI fallbacks/tour to show
      }
      
      // Force a soft version check (non-blocking)
      fetch('/version.json', { cache: 'no-store' }).catch(() => {});
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeEmpireId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <BrandedGlobe size="xl" animate={true} className="shadow-[0_0_60px_rgba(0,229,255,0.4)]" />
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm animate-pulse">
            Neural Sync Established
          </h2>
        </div>
      </div>
    );
  }

  // Safe Guard: If not initialized, wait for context
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <BrandedGlobe size="xl" animate={true} className="shadow-[0_0_60px_rgba(0,229,255,0.4)]" />
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm animate-pulse">
            Initializing Session
          </h2>
        </div>
      </div>
    );
  }

  if (isLoading && !empireData) {
    return (
      <div className="p-3 md:p-8 pb-24 max-w-full md:max-w-7xl mx-auto space-y-6 md:space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 bg-theme-surface/30 p-5 md:p-0 rounded-[24px] md:rounded-none border border-theme md:border-none animate-pulse">
          <div className="space-y-2">
            <div className="w-24 h-3 bg-primary/20 rounded-full" />
            <div className="w-48 h-8 bg-foreground/10 rounded-xl" />
            <div className="w-64 h-4 bg-muted-foreground/10 rounded-lg" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme flex items-center justify-center">
              <BrandedGlobe size="md" animate={true} />
            </div>
            <div className="space-y-2">
              <div className="w-32 h-8 bg-primary/10 rounded-2xl" />
              <div className="w-24 h-3 bg-slate-400/10 rounded-full" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="h-32 bg-theme-surface rounded-[32px] border border-theme" />
          <div className="h-32 bg-theme-surface rounded-[32px] border border-theme" />
          <div className="h-32 bg-theme-surface rounded-[32px] border border-theme" />
        </div>

        <div className="h-96 bg-theme-surface rounded-[48px] border-2 border-theme flex flex-col items-center justify-center gap-6 animate-pulse">
          <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(176,38,255,0.2)]" />
          <h2 className="text-blue-200 font-black uppercase tracking-[0.3em] text-sm">
            Neural Syncing
          </h2>
        </div>
      </div>
    );
  }

  // Fallback for null data after loading (prevents crash)
  if (!empireData && !isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 p-8 text-center">
        <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(255,0,0,0.2)]" />
        <h2 className="text-xl font-black text-white uppercase italic">Connection Interrupted.</h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">I'm having trouble retrieving your empire data. Pull down to retry or check your network.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10"
        >
          Reboot System
        </button>
      </div>
    );
  }

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
    <PullToRefresh onRefresh={fetchData}>
      <div className="p-3 md:p-8 pb-24 max-w-full md:max-w-7xl mx-auto space-y-6 md:space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 bg-theme-surface/30 p-5 md:p-0 rounded-[24px] md:rounded-none border border-theme md:border-none">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
              <LayoutDashboard className="w-3 h-3" />
              Success Hub
            </div>
            <h1 className="text-xl md:text-4xl font-black tracking-tight leading-tight italic">
              {empireData?.name || "Success Hub"}.
            </h1>
            <p className="text-[10px] md:text-base text-muted-foreground font-medium italic">
              Monitoring your {empireData?.niche || "business"} growth and autonomous operations.
            </p>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button 
              onClick={() => fetchData()}
              disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-theme-surface border border-theme flex items-center justify-center text-slate-400 hover:text-primary transition-all group relative"
              title="Manual Neural Sync"
            >
              <BrandedGlobe 
                size="md" 
                animate={isLoading} 
                className={cn(isLoading ? "opacity-100" : "opacity-40 group-hover:opacity-100")} 
              />
            </button>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-2xl border border-primary/20 font-bold text-[10px] md:text-sm shadow-sm">
                <Stars className="w-3 h-3 md:w-4 md:h-4" />
                {aiMode === 'empire' ? 'Auto-Pilot' : 'Co-Pilot'}
              </div>
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 md:mt-2">
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
                  className="p-6 bg-theme-surface rounded-[32px] text-foreground shadow-2xl border-2 border-theme flex items-center gap-6 relative overflow-hidden z-50"
                >
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                    <BrandedGlobe size="lg" animate={true} className="ring-2 ring-white/20" />
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
                   <div className="w-10 h-10 rounded-xl bg-theme-surface flex items-center justify-center">
                     <LayoutDashboard className="w-5 h-5 text-slate-600" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-foreground tracking-tight">Control Gates</h2>
                     <p className="text-xs text-muted-foreground font-medium">Human-in-the-loop validation for autonomous actions.</p>
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
                <p className="text-white/80 text-xl font-medium">Welcome to your Empire Command Center.</p>
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
