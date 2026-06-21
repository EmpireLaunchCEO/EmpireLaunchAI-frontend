"use client";
import { cn } from "@/lib/utils";

import React, { useEffect, useState, useCallback } from 'react';
import { Stars, LayoutDashboard, Globe, Briefcase, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';
import { analyticsService, empireService } from '@/lib/api-service';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { NotificationOnboarding } from '@/components/Dashboard/NotificationOnboarding';
import { BrandedGlobe } from '@/components/BrandedGlobe';

import { DashboardErrorBoundary } from '@/components/DashboardErrorBoundary';
import { LockedSlotView } from '@/components/Dashboard/LockedSlotView';
import { NicheCalibrationBox } from '@/components/Dashboard/SuccessHub/NicheCalibrationBox';
import { FinancialCommand } from '@/components/Dashboard/FinancialCommand';
import { GrowthTracker } from '@/components/Dashboard/SuccessHub/GrowthTracker';
import { NeuralNotes } from '@/components/Dashboard/SuccessHub/NeuralNotes';
import { GrowthProtocolGate } from '@/components/Dashboard/GrowthProtocolGate';
import { DisclaimerAgreementBox } from '@/components/Dashboard/DisclaimerAgreementBox';
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';
import { SubscriptionSuccessShareBox } from '@/components/Dashboard/SubscriptionSuccessShareBox';

export default function Dashboard() {
  const { activeEmpireId, setActiveEmpireId, isLinkingComplete, aiMode, isInitialized, isDashboardLoaded, setDashboardLoaded, setActiveEmpire, slotStatus, isAdmin, connectedPlatforms, registerRefreshHandler, isProtocolAccepted, acceptProtocols, userEmpires, userEmail } = useEmpire();
  const activeBusinessIndex = activeEmpireId === '1' ? 0 : (activeEmpireId === '2' ? 1 : (activeEmpireId === '3' ? 2 : 0));
  const [empireData, setEmpireDataState] = useState<any>(null);
  const [pulseData, setPulseData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isGrowthGateOpen, setIsGrowthProtocolGateOpen] = useState(false);
  const [growthGateProduct, setGrowthProtocolGateProduct] = useState('');

  const ownedSlots = Object.values(slotStatus || {}).filter(Boolean).length;

  const handleCancelSubscription = (empireId: string) => {
    console.log(`[Subscription] Cancelling subscription for empire: ${empireId}`);
  };

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
        analyticsService.getEmpirePulse().catch(() => ({ score: 0, logs: [] })),
        analyticsService.getEmpireHealth().catch(() => ({ score: 0, revenue: 0 })),
      ]);

      const results = await Promise.race([fetchPromise, timeoutPromise]) as any[];
      const [eData, pulse, health] = results;

      if (eData) {
        let finalData = eData;
        
        setEmpireDataState(finalData);
        setActiveEmpire(finalData);
        setPulseData(pulse);
        setHealthData(health);
      }
    } catch (error) {
      console.error('Sync Error:', error);
    } finally {
      setIsLoading(false);
      setDashboardLoaded(true);
    }
  }, [activeEmpireId, isLoading, setDashboardLoaded, setActiveEmpire, isAdmin]);

  useEffect(() => {
    if (mounted && isInitialized) {
      fetchData();
    }
  }, [activeEmpireId, mounted, isInitialized, fetchData]);

  useEffect(() => {
    return registerRefreshHandler(fetchData);
  }, [registerRefreshHandler, fetchData]);

  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <BrandedGlobe size="xl" spinning={true} className="shadow-[0_0_30px_rgba(255,255,255,0.15)]" />
        <h2 className="text-white font-black uppercase tracking-[0.3em] text-[10px] animate-pulse text-center">
          Initializing Neural Sync
        </h2>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
        <div className="p-4 md:p-8 pb-32 max-w-full md:max-w-7xl mx-auto space-y-12 md:space-y-16 overflow-x-hidden">
          <GrowthProtocolGate
            isOpen={isGrowthGateOpen}
            onClose={() => setIsGrowthProtocolGateOpen(false)}
            onActivate={() => {
              setIsGrowthProtocolGateOpen(false);
              setIsCelebrating(true);
              setTimeout(() => setIsCelebrating(false), 3000);
            }}
            productName={growthGateProduct}
          />
          
          {!isDashboardLoaded ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <BrandedGlobe size="lg" spinning />
              <h2 className="text-white font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Syncing Neural Node {activeEmpireId}
              </h2>
            </div>
          ) : (
            <>
              {!slotStatus[activeBusinessIndex] && !isAdmin ? (
                <LockedSlotView slotIndex={activeBusinessIndex} />
              ) : (
                <div className="space-y-12 md:space-y-16 animate-in fade-in duration-1000">
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-4"
                  >
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
                      {activeEmpireId === '1' ? "EmpireLaunch AI" : (empireData?.name || empireData?.title || `Empire ${activeEmpireId}`)}
                    </h1>
                  </motion.div>

                  {/* 2. Operations Column */}
                  <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
                    
                    {/* Primary Results Section */}
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                      <DisclaimerAgreementBox />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                      <GrowthTracker
                        allTimeEarnings={(healthData?.revenue || 0) * 100}
                        progress={healthData?.growthScore}
                      />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                      <FinancialCommand
                        withholdableEarnings={(healthData?.revenue || 0) * 100}
                        securedDues={(healthData?.pendingDues || 0) * 100}
                        growthScore={healthData?.growthScore}
                        isProtocolAccepted={isProtocolAccepted}
                        onAcceptProtocol={() => acceptProtocols()}
                        businessSlots={ownedSlots}
                        userEmpires={userEmpires}
                        onCancelSubscription={handleCancelSubscription}
                        onActivateGrowthProtocol={(name) => {
                          setGrowthProtocolGateProduct(name);
                          setIsGrowthProtocolGateOpen(true);
                        }}
                      />
                    </motion.div>

                    {/* Active Subscribers - Owner Only - Restored below Finances */}
                    {(isAdmin || userEmail?.toLowerCase() === 'stacipeabody@gmail.com' || activeEmpireId === '1') && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto bg-theme-surface border-2 border-theme rounded-[32px] p-8 space-y-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all"
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] -z-10" />
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                            <Stars className="w-8 h-8 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Active Subscribers</p>
                            <div className="flex items-baseline gap-3">
                              <p className="text-5xl font-black text-foreground bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                {(healthData?.subscribers || 0)}
                              </p>
                              <p className="text-sm font-black text-emerald-500 uppercase tracking-widest italic">Growth Optimal</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium italic">Live recurring revenue stream tracking enabled for EmpireLaunch AI.</p>
                      </motion.div>
                    )}

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                      <FeedbackBox />
                    </motion.div>
                  </div>

                  {/* Version Verification */}
                  <div className="flex justify-center pb-20">
                    <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
                      Command Center v3.0.2 (Neural Sync Active)
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <NotificationOnboarding />

        <AnimatePresence>
          {isCelebrating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl"
            >
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ scale: 0.5, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-32 h-32 bg-theme-surface border-2 border-white/20 rounded-[40px] mx-auto flex items-center justify-center shadow-2xl"
                >
                  <Stars className="w-16 h-16 text-white" />
                </motion.div>
                <h2 className="text-5xl font-black text-white tracking-tighter italic">Neural Sync Established.</h2>
                <p className="text-white/80 text-xl font-medium italic">Welcome to your Empire Command Center.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </DashboardErrorBoundary>
  );
}
