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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const fetchData = useCallback(async () => {
    if (!mounted) return;
    
    // Use a local check to avoid dependency loop
    setEmpireData((current: any) => {
      if (!current) setIsLoading(true);
      return current;
    });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('[Dashboard] Sync Timeout — Force-Loading Page');
      setIsLoading(false);
      controller.abort();
    }, 6000);

    try {
      console.log(`[Dashboard] Connecting to API: ${API_URL}`);
      
      // Small artificial delay for visual feedback if we already had data
      const hasExistingData = await new Promise<boolean>(resolve => {
        setEmpireData((current: any) => {
          resolve(!!current);
          return current;
        });
      });
      
      if (hasExistingData) await new Promise(resolve => setTimeout(resolve, 800));
      
      const fetchOptions = { 
        cache: 'no-store' as const,
        signal: controller.signal
      };

      const [empireRes, pulseRes, healthRes, txRes] = await Promise.all([
        fetch(`${API_URL}/api/agent/empire/${activeEmpireId}`, fetchOptions).catch(() => null),
        analyticsService.getEmpirePulse().catch(() => null),
        analyticsService.getEmpireHealth().catch(() => null),
        analyticsService.getRevenueTransactions().catch(() => [])
      ]);

      if (empireRes && empireRes.ok) {
        const eData = await empireRes.json();
        setEmpireData(eData);
        // ONLY mark as loaded if we actually got data
        setDashboardLoaded(true);
      } else {
        console.error('[Dashboard] API response failed');
      }
      
      // Soft version check
      fetch('/version.json', { cache: 'no-store' }).catch(() => {});
      
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [activeEmpireId, mounted, setDashboardLoaded]);

  useEffect(() => {
    if (mounted && isInitialized) {
      fetchData();
    }
  }, [fetchData, mounted, isInitialized]);

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
      console.error('Execution error:', error);
      setPartnerStatus('idle');
      setExecutingInsight(null);
    }
  };

  // 1. Initial Neural Sync Overlay (Session Init)
  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <BrandedGlobe size="xl" animate={true} className="shadow-[0_0_60px_rgba(0,229,255,0.4)]" />
        <h2 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
          Initializing Neural Sync
        </h2>
      </div>
    );
  }

  // 2. Main Dashboard Render
  return (
    <PullToRefresh onRefresh={fetchData}>
      <div className="p-3 md:p-8 pb-24 max-w-full md:max-w-7xl mx-auto space-y-6 md:space-y-12">
        {/* Persistent Header */}
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
                Neural Sync: {isLoading ? 'SYNCING...' : '100.0%'}
              </span>
            </div>
          </div>
        </header>

        {isLoading && !empireData ? (
          /* Inline Loading State (No longer full page blocking) */
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              <div className="h-32 bg-theme-surface rounded-[32px] border border-theme" />
              <div className="h-32 bg-theme-surface rounded-[32px] border border-theme" />
              <div className="h-32 bg-theme-surface rounded-[32px] border border-theme" />
            </div>

            <div className="h-96 bg-theme-surface rounded-[48px] border-2 border-theme flex flex-col items-center justify-center gap-6 animate-pulse">
              <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(176,38,255,0.2)]" />
              <h2 className="text-blue-200 font-black uppercase tracking-[0.3em] text-sm italic">
                Neural Syncing...
              </h2>
            </div>
          </div>
        ) : !empireData ? (
          /* Error/Empty State */
          <div className="bg-theme-surface rounded-[48px] border-2 border-theme p-12 text-center space-y-6">
            <BrandedGlobe size="xl" className="mx-auto shadow-[0_0_60px_rgba(255,0,0,0.1)]" />
            <h2 className="text-2xl font-black italic uppercase text-red-400">Connection Interrupted.</h2>
            <div className="max-w-md mx-auto space-y-4">
              <p className="text-slate-400">I'm having trouble reaching the command center at <code className="text-primary break-all">{API_URL}</code>.</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Verification Required: Ensure your backend is deployed and NEXT_PUBLIC_API_URL is set in Vercel.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => fetchData()}
                className="w-full md:w-auto px-8 py-4 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
              >
                Retry Connection
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/onboarding';
                }}
                className="w-full md:w-auto px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-transform border border-white/10"
              >
                Reset System Memory
              </button>
              <button 
                onClick={() => window.location.href = '/settings'}
                className="w-full md:w-auto px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-transform border border-white/10"
              >
                System Settings
              </button>
            </div>
          </div>
        ) : (
          /* Full Content Area */
          <>
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
                {/* Autonomous Action Status */}
                <AnimatePresence>
                  {partnerStatus !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-6 bg-theme-surface rounded-[32px] text-foreground shadow-2xl border-2 border-theme flex items-center gap-6 relative overflow-hidden z-50"
                    >
                      <div className="relative z-10 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                        <BrandedGlobe size="lg" animate={true} />
                      </div>
                      <div className="relative z-10 flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Autonomous Operation</span>
                          <span className="text-[10px] font-bold text-slate-400">Phase: Analysis</span>
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
                         <h2 className="text-2xl font-black text-foreground tracking-tight italic">Control Gates</h2>
                         <p className="text-xs text-muted-foreground font-medium italic">Human-in-the-loop validation for autonomous actions.</p>
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

                {/* Intelligence Hubs */}
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
          </>
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
                <h2 className="text-5xl font-black text-white tracking-tighter italic">Neural Sync Established.</h2>
                <p className="text-white/80 text-xl font-medium italic">Welcome to your Empire Command Center.</p>
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
