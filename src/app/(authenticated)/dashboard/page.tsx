"use client";
import { cn } from "@/lib/utils";

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
import { Stars, Home, ArrowUpRight, Plus, X, LayoutDashboard, Globe, Sparkles, RefreshCcw, Briefcase } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';
import { analyticsService, empireService } from '@/lib/api-service';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { NotificationOnboarding } from '@/components/Dashboard/NotificationOnboarding';
import { BrandedGlobe } from '@/components/BrandedGlobe';

import { DashboardErrorBoundary } from '@/components/DashboardErrorBoundary';
import { LockedSlotView } from '@/components/Dashboard/LockedSlotView';

export default function Dashboard() {
  const { activeEmpireId, setActiveEmpireId, isLinkingComplete, aiMode, isInitialized, isDashboardLoaded, setDashboardLoaded, setActiveEmpire, slotStatus, isAdmin, unlockSlot } = useEmpire();
  const activeBusinessIndex = activeEmpireId === '1' ? 0 : (activeEmpireId === '2' ? 1 : (activeEmpireId === '3' ? 2 : 0));
  const [empireData, setEmpireDataState] = useState<any>(null);
  const [pulseData, setPulseData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<'idle' | 'researching' | 'creating'>('idle');
  const [executingInsight, setExecutingInsight] = useState<string | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Safety Valve: Force show dashboard after 4 seconds even if loading hangs
    const timer = setTimeout(() => {
      if (mounted && !isDashboardLoaded) {
        console.warn("Neural Sync took too long. Forcing dashboard visibility.");
        setDashboardLoaded(true);
      }
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [mounted, isDashboardLoaded, setDashboardLoaded]);

  const fetchData = useCallback(async (retryCount = 0) => {
    if (isLoading && retryCount === 0) return;
    setIsLoading(true);
    
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Fetch timeout')), 3500)
      );

      const fetchPromise = Promise.all([
        empireService.getEmpire(activeEmpireId).catch(err => { console.error('Empire Fetch:', err); return null; }),
        analyticsService.getEmpirePulse().catch(() => ({ score: 85, trend: 'stable' })),
        analyticsService.getEmpireHealth().catch(() => ({ score: 92, status: 'Optimal' })),
        analyticsService.getRevenueTransactions().catch(() => [])
      ]);

      // Race the fetch against a timeout to prevent hanging UI
      const results = await Promise.race([fetchPromise, timeoutPromise]) as any[];
      const [eData, pulse, health, txs] = results;

      if (eData) {
        setEmpireDataState(eData);
        setActiveEmpire(eData);
        setPulseData(pulse);
        setHealthData(health);
        setTransactions(txs);
      }
    } catch (error) {
      console.error('Error fetching dashboard data or timeout reached:', error);
    } finally {
      setIsLoading(false);
      setDashboardLoaded(true);
    }
  }, [activeEmpireId, isLoading, setDashboardLoaded, setActiveEmpire]);

  useEffect(() => {
    if (mounted && isInitialized) {
      fetchData();
    }
  }, [activeEmpireId, mounted, isInitialized]);

  const handleInsightExecute = async (id: string) => {
    setExecutingInsight(id);
    setPartnerStatus('creating');
    await new Promise(resolve => setTimeout(resolve, 3000));
    setPartnerStatus('idle');
    setExecutingInsight(null);
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 5000);
  };

  // If after initialization it's still "loading", only show loading if it's been very brief
  if (!mounted || !isInitialized || !isDashboardLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <BrandedGlobe size="sm" spinning={true} className="shadow-[0_0_30px_rgba(0,229,255,0.4)]" />
        <h2 className="text-primary font-black uppercase tracking-[0.3em] text-[8px] animate-pulse text-center px-6">
          Initializing Neural Sync<br/>
          <span className="opacity-40 text-[6px]">Connecting to Global Brain...</span>
        </h2>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <PullToRefresh onRefresh={fetchData}>
        <div className="p-3 md:p-8 pb-24 max-w-full md:max-w-7xl mx-auto space-y-6 md:space-y-12 overflow-x-hidden">
          
          <div className="flex bg-theme-background p-1.5 rounded-[24px] border border-theme w-fit gap-1.5 mb-8 md:mb-12 mx-auto sticky top-4 z-[50] shadow-xl backdrop-blur-md">
            {[0, 1, 2].map((idx) => {
              const empireId = idx === 0 ? '1' : (idx === 1 ? '2' : '3');
              const isActive = activeBusinessIndex === idx;
              const label = idx === 0 ? (empireData?.name || "Empire 1") : `Empire ${idx + 1}`;
              
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (activeBusinessIndex === idx) return;
                    setActiveEmpireId(empireId);
                  }}
                  className={cn(
                    "px-4 md:px-8 py-2.5 md:py-3.5 rounded-[18px] font-black text-[9px] md:text-xs uppercase tracking-tighter transition-all flex items-center gap-2",
                    isActive
                      ? "bg-theme-surface text-foreground shadow-sm border border-theme"
                      : "text-slate-500 hover:text-foreground"
                  )}
                >
                  {isActive ? <Globe className="w-3 h-3 text-primary animate-pulse" /> : <Briefcase className="w-3 h-3 opacity-50" />}
                  {isActive && activeEmpireId === empireId ? (empireData?.name || label) : `Slot ${idx + 1}`}
                </button>
              );
            })}
          </div>

          <div className="space-y-8 md:space-y-16 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-theme/30 pb-8 md:pb-12">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BrandedGlobe size="sm" animate={partnerStatus !== 'idle'} spinning={partnerStatus !== 'idle'} />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary drop-shadow-sm">
                      {partnerStatus === 'idle' ? 'Neural Link Active' : 'AI Processing...'}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-6xl font-black tracking-tighter leading-none italic uppercase text-foreground drop-shadow-sm">
                    {empireData?.name || "Success Hub"}.
                  </h1>
                  <p className="text-sm md:text-xl font-medium text-muted-foreground italic max-w-xl">
                    {activeBusinessIndex === 0 
                      ? "Consolidating market intelligence across all connected nodes."
                      : `Initializing Command Center for Empire Slot ${activeBusinessIndex + 1}.`
                    }
                  </p>
                </div>
                
                <div className="flex items-center gap-3 md:gap-4 bg-theme-surface p-2 md:p-3 rounded-[24px] md:rounded-[32px] border border-theme shadow-lg">
                  <div className="text-right">
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Pulse</p>
                    <p className="text-sm md:text-2xl font-black italic">{pulseData?.score || 85}%</p>
                  </div>
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full md:rounded-2xl bg-slate-900 flex items-center justify-center">
                    <Stars className="w-5 h-5 md:w-8 md:h-8 text-primary animate-pulse" />
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                <div className="lg:col-span-8 space-y-8 md:space-y-12">
                  {!isLinkingComplete ? (
                    <GuidedLinking />
                  ) : (
                    <>
                      <SuccessHubOverview 
                        empireData={empireData}
                        pulseData={pulseData}
                        healthData={healthData}
                        transactions={transactions}
                      />
                      <MissionBriefing 
                        empireData={empireData}
                        onExecute={handleInsightExecute} 
                        isExecuting={!!executingInsight}
                      />
                      <ApprovalQueue aiMode={aiMode} />
                      <DetailedRevenue transactions={transactions} />
                      <BusinessSlots currentEmpire={empireData} />
                    </>
                  )}
                </div>

                <aside className="lg:col-span-4 space-y-8 md:space-y-12">
                  <ProfitBucket />
                  <AIOptimizationHub />
                  <AutonomousCyclesStatus />
                  <SocialProofApproval />
                  <EmpireConstellation />
                </aside>
              </div>
          </div>
        </div>

        <ConversationalInput />
        <NotificationOnboarding />
      </PullToRefresh>
    </DashboardErrorBoundary>
  );
}
