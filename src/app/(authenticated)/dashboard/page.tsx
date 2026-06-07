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
import { EmpireIdentityHeader } from '@/components/Dashboard/SuccessHub/EmpireIdentityHeader';
import { NicheCalibrationBox } from '@/components/Dashboard/SuccessHub/NicheCalibrationBox';
import { Stars, Home, ArrowUpRight, Plus, X, LayoutDashboard, Globe, Sparkles, Briefcase } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';
import { analyticsService, empireService } from '@/lib/api-service';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { NotificationOnboarding } from '@/components/Dashboard/NotificationOnboarding';

import { DashboardErrorBoundary } from '@/components/DashboardErrorBoundary';

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
  }, [activeEmpireId, mounted, isInitialized, fetchData]);

  const handleInsightExecute = async (id: string) => {
    setExecutingInsight(id);
    setPartnerStatus('creating');
    await new Promise(resolve => setTimeout(resolve, 3000));
    setExecutingInsight(null);
    setPartnerStatus('idle');
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 5000);
  };

  if (!mounted) return null;

  return (
    <DashboardErrorBoundary>
      <PullToRefresh onRefresh={fetchData}>
        <div className="min-h-screen bg-theme-background text-foreground selection:bg-primary/30">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-20">
              
              <header className="mb-12 md:mb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-theme-background">
                          <Stars className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Neural Link Active</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] italic">
                      Your Empire <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary/50 animate-shimmer">Awaits.</span>
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                     <div className="px-6 py-3 rounded-2xl bg-theme-surface border border-theme shadow-xl backdrop-blur-md">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Empire Status</p>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-sm font-black uppercase italic">Fully Operational</span>
                        </div>
                     </div>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                <div className="lg:col-span-8 space-y-8 md:space-y-12">
                  {!isLinkingComplete ? (
                    <GuidedLinking />
                  ) : (
                    <>
                      {/* 1. SUCCESS HUB HEADER */}
                      <EmpireIdentityHeader empireData={empireData} />

                      {/* 2. SUCCESS HUB MAIN CONTENT (Intelligence Grid) */}
                      <SuccessHubOverview 
                        empireData={empireData}
                        pulseData={pulseData}
                        healthData={healthData}
                        transactions={transactions}
                      />

                      {/* 3. BUSINESS SLOTS (Right below SUCCESS HUB BOX) */}
                      <div className="space-y-6">
                        <div className="flex bg-theme-background p-1.5 rounded-[24px] border border-theme w-fit gap-1.5 mx-auto shadow-xl backdrop-blur-md">
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

                        <BusinessSlots currentEmpire={empireData} />
                      </div>

                      {/* 4. NICHE CALIBRATION BOX */}
                      <NicheCalibrationBox niche={empireData?.niche} />
                      
                      {/* 5. EMPIRE TEACHER (Mission Briefing) */}
                      <MissionBriefing 
                        empireData={empireData}
                        onExecute={handleInsightExecute} 
                        isExecuting={!!executingInsight}
                      />
                      
                      <ApprovalQueue aiMode={aiMode} />
                      <DetailedRevenue transactions={transactions} />
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
