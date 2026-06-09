"use client";
import { cn } from "@/lib/utils";

import React, { useEffect, useState, useCallback } from 'react';
import { MissionBriefing } from '@/components/Dashboard/MissionBriefing';
import { DetailedRevenue } from '@/components/Dashboard/DetailedRevenue';
import { BusinessSlots } from '@/components/Dashboard/BusinessSlots';
import { SocialProofApproval } from '@/components/Dashboard/SocialProofApproval';
import { AIOptimizationHub } from '@/components/Dashboard/AIOptimizationHub';
import { AutonomousCyclesStatus } from '@/components/Dashboard/AutonomousCyclesStatus';
import { EmpireConstellation } from '@/components/Dashboard/EmpireConstellation';
import { ConversationalInput } from '@/components/Dashboard/ConversationalInput';
import { SuccessHubOverview } from '@/components/Dashboard/SuccessHub/SuccessHubOverview';
import { Stars, LayoutDashboard, Globe, Briefcase, ChevronRight } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';
import { analyticsService, empireService } from '@/lib/api-service';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { NotificationOnboarding } from '@/components/Dashboard/NotificationOnboarding';
import { IntelligenceCenter } from '@/components/Dashboard/IntelligenceCenter';
import { SocialMediaRadar } from '@/components/Dashboard/SocialMediaRadar';
import { BrandedGlobe } from '@/components/BrandedGlobe';

import { DashboardErrorBoundary } from '@/components/DashboardErrorBoundary';
import { LockedSlotView } from '@/components/Dashboard/LockedSlotView';
import { NicheCalibrationBox } from '@/components/Dashboard/SuccessHub/NicheCalibrationBox';
import { FinancialCommand } from '@/components/Dashboard/FinancialCommand';
import { NeuralNotes } from '@/components/Dashboard/SuccessHub/NeuralNotes';

export default function Dashboard() {
  const { activeEmpireId, setActiveEmpireId, isLinkingComplete, aiMode, isInitialized, isDashboardLoaded, setDashboardLoaded, setActiveEmpire, slotStatus, isAdmin } = useEmpire();
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
    const timer = setTimeout(() => {
      if (mounted && !isDashboardLoaded) {
        setDashboardLoaded(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [mounted, isDashboardLoaded, setDashboardLoaded]);

  const fetchData = useCallback(async (retryCount = 0) => {
    if (isLoading && retryCount === 0) return;
    setIsLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch timeout')), 4500));
      const fetchPromise = Promise.all([
        empireService.getEmpire(activeEmpireId).catch(() => null),
        analyticsService.getEmpirePulse().catch(() => ({ score: 85, logs: [] })),
        analyticsService.getEmpireHealth().catch(() => ({ score: 92, revenue: 0 })),
        analyticsService.getRevenueTransactions().catch(() => [])
      ]);

      const results = await Promise.race([fetchPromise, timeoutPromise]) as any[];
      const [eData, pulse, health, txs] = results;

      if (eData) {
        // ADMIN BYPASS: If we are admin and backend is default, we FORCE the hardcoded branding
        let finalData = eData;
        if (isAdmin && (activeEmpireId === '1' || !eData.title || eData.title === 'The First Empire' || eData.title === 'EMPIRELAUNCH')) {
          finalData = {
            ...eData,
            title: 'EmpireLaunch AI',
            name: 'EmpireLaunch AI',
            niche: 'AI Business Automation',
            description: 'Empire Niche: AI Business Automation.'
          };
        }

        setEmpireDataState(finalData);
        setActiveEmpire(finalData);
        setPulseData(pulse);
        setHealthData(health);
        setTransactions(txs);
      }
    } catch (error) {
      console.error('Sync Error:', error);
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

  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <BrandedGlobe size="xl" spinning={true} className="shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" />
        <h2 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse text-center">
          Initializing Neural Sync
        </h2>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <PullToRefresh onRefresh={fetchData}>
        <div className="p-4 md:p-8 pb-32 max-w-full md:max-w-7xl mx-auto space-y-12 md:space-y-20 overflow-x-hidden">
          {!isDashboardLoaded ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin" />
              <h2 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Syncing Neural Node {activeEmpireId}
              </h2>
            </div>
          ) : (
            <>
              {!slotStatus[activeBusinessIndex] && !isAdmin ? (
                <LockedSlotView slotIndex={activeBusinessIndex} />
              ) : (
                <div className="space-y-12 md:space-y-20 animate-in fade-in duration-1000">
                  
                  {/* 3. Selected Business Identity */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">Neural Link Active</span>
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
                      {empireData?.name || empireData?.title || "EmpireLaunch AI"}
                    </h1>
                  </div>

                  {/* 4. Intelligence & Operations Grid (Teacher First) */}
                  <div className="max-w-6xl mx-auto space-y-12 md:space-y-20">
                    {!isLinkingComplete && (
                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "px-4 py-1.5 rounded-full border flex items-center gap-2 shadow-sm",
                              aiMode === 'empire' 
                                ? "bg-amber-500/10 border-amber-500/30" 
                                : "bg-primary/10 border-primary/30"
                            )}
                          >
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full animate-pulse",
                              aiMode === 'empire' ? "bg-amber-500" : "bg-primary"
                            )} />
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-[0.2em]",
                              aiMode === 'empire' ? "text-amber-500" : "text-primary"
                            )}>
                              {aiMode === 'empire' ? 'Auto-Pilot Mode Active' : 'Co-Pilot Mode Active'}
                            </span>
                          </motion.div>
                        </div>
                        <GuidedLinking currentEmpire={empireData} onRefresh={fetchData} />
                      </div>
                    )}
                    
                    <SuccessHubOverview 
                      empireData={empireData}
                      pulseData={pulseData}
                      healthData={healthData}
                    />

                    <NicheCalibrationBox 
                      niche={isAdmin ? "Done For You Business" : (empireData?.niche || empireData?.description?.match(/Empire Niche:\s*(.*?)(?:\.|$)/)?.[1])} 
                      angle={isAdmin ? "High-intelligence autonomous research and trend-driven asset generation." : (empireData?.angle || empireData?.description?.match(/Angle:\s*(.*?)(?:\.|$)/)?.[1])}
                    />

                    <FinancialCommand growthScore={healthData?.score} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-0">
                      <div className="lg:col-span-8 space-y-12">
                        <MissionBriefing 
                          empireData={empireData} 
                          onExecute={handleInsightExecute} 
                          isExecuting={!!executingInsight}
                        />
                        <DetailedRevenue transactions={transactions} />
                      </div>
                      <aside className="lg:col-span-4 space-y-12">
                        <SocialProofApproval />
                        <EmpireConstellation />
                      </aside>
                    </div>
                  </div>

                  {/* 7. Neural Notes Section (The Bottom) */}
                  <div className="max-w-6xl mx-auto pb-8">
                    <NeuralNotes />
                  </div>

                  {/* AI Intelligence Center */}
                  <div className="max-w-6xl mx-auto pb-12">
                    <IntelligenceCenter />
                  </div>

                  {/* Social Media Radar */}
                  <div className="max-w-6xl mx-auto pb-12">
                    <SocialMediaRadar />
                  </div>

                  {/* Version Verification */}
                  <div className="flex justify-center pb-20">
                    <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
                      Command Center v3.0.1 (Neural Sync Active)
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <ConversationalInput />
        <NotificationOnboarding />

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
      </PullToRefresh>
    </DashboardErrorBoundary>
  );
}
