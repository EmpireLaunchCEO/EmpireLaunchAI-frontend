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
        setEmpireDataState(eData);
        setActiveEmpire(eData);
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

  if (!mounted || !isInitialized || !isDashboardLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <BrandedGlobe size="sm" spinning={true} className="shadow-[0_0_30px_rgba(0,229,255,0.4)]" />
        <h2 className="text-primary font-black uppercase tracking-[0.3em] text-[8px] animate-pulse text-center">
          Initializing Neural Sync
        </h2>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <PullToRefresh onRefresh={fetchData}>
        <div className="p-4 md:p-8 pb-32 max-w-full md:max-w-7xl mx-auto space-y-12 md:space-y-20 overflow-x-hidden">
          
          {/* 1. Centered Visuals (Absolute Top) */}
          <div className="flex flex-col items-center pt-8 pointer-events-none">
            <BrandedGlobe 
              size="xl" 
              animate={isLoading || partnerStatus !== 'idle'} 
              spinning={isLoading || partnerStatus !== 'idle'}
              className="shadow-[0_0_60px_rgba(0,229,255,0.2)]"
            />
            <h2 className="mt-8 text-2xl md:text-5xl font-black tracking-[0.2em] uppercase italic text-theme-gradient leading-none">
              Success Hub
            </h2>
          </div>

          {/* 2. Centered Business Navigation */}
          <div className="flex bg-theme-background p-1.5 rounded-[24px] border border-theme w-fit gap-1.5 mx-auto shadow-xl backdrop-blur-md">
            {[0, 1, 2].map((idx) => {
              const empireId = idx === 0 ? '1' : (idx === 1 ? '2' : '3');
              const isActive = activeBusinessIndex === idx;
              const displayName = empireData?.name || empireData?.title || "Empire Launch";
              const label = idx === 0 ? displayName : `Business ${idx + 1}`;
              
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
                  {isActive ? <Globe className="w-3 h-3 text-primary" /> : <Briefcase className="w-3 h-3 opacity-50" />}
                  {isActive ? label : `Business ${idx + 1}`}
                </button>
              );
            })}
          </div>

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
                  {empireData?.name || empireData?.title || "Empire Launch"}.
                </h1>
              </div>

              {/* 4. Intelligence & Operations Grid (Teacher First) */}
              <div className="max-w-6xl mx-auto space-y-12 md:space-y-20">
                {!isLinkingComplete && <GuidedLinking currentEmpire={empireData} onRefresh={fetchData} />}
                
                <SuccessHubOverview 
                  empireData={empireData}
                  pulseData={pulseData}
                  healthData={healthData}
                />

                <NicheCalibrationBox 
                  niche={empireData?.niche || empireData?.description?.match(/Empire Niche: (.*?)\./)?.[1]} 
                  angle={empireData?.description?.match(/Angle: (.*?)\./)?.[1]}
                />

                <FinancialCommand growthScore={healthData?.score} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 relative z-0">
                  <div className="lg:col-span-8 space-y-12">
                    <MissionBriefing 
                      empireData={empireData} 
                      onExecute={handleInsightExecute} 
                      isExecuting={!!executingInsight}
                    />
                    <DetailedRevenue transactions={transactions} />
                  </div>
                  <aside className="lg:col-span-4 space-y-12">
                    <AIOptimizationHub />
                    <AutonomousCyclesStatus />
                    <SocialProofApproval />
                    <EmpireConstellation />
                  </aside>
                </div>
              </div>

              {/* 7. Neural Notes Section (The Bottom) */}
              <div className="max-w-6xl mx-auto pb-8">
                <NeuralNotes />
              </div>

              {/* Version Verification */}
              <div className="flex justify-center pb-20">
                <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
                  Command Center v3.0.1 (Neural Sync Active)
                </span>
              </div>
            </div>
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
