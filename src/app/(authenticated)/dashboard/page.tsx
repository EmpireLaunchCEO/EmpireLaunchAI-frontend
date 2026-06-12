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

export default function Dashboard() {
  const { activeEmpireId, setActiveEmpireId, isLinkingComplete, aiMode, isInitialized, isDashboardLoaded, setDashboardLoaded, setActiveEmpire, slotStatus, isAdmin, connectedPlatforms, registerRefreshHandler } = useEmpire();
  const activeBusinessIndex = activeEmpireId === '1' ? 0 : (activeEmpireId === '2' ? 1 : (activeEmpireId === '3' ? 2 : 0));
  const [empireData, setEmpireDataState] = useState<any>(null);
  const [pulseData, setPulseData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isGrowthGateOpen, setIsGrowthProtocolGateOpen] = useState(false);
  const [growthGateProduct, setGrowthProtocolGateProduct] = useState('');

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
      ]);

      const results = await Promise.race([fetchPromise, timeoutPromise]) as any[];
      const [eData, pulse, health] = results;

      if (eData) {
        let finalData = eData;
        if (isAdmin && (activeEmpireId === '1' || !eData.title || eData.title === 'The First Empire' || eData.title === 'EMPIRELAUNCH' || eData.title === 'HOME BASE' || eData.name === 'HOME BASE')) {
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
        <BrandedGlobe size="xl" spinning={true} className="shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" />
        <h2 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse text-center">
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
              <h2 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Syncing Neural Node {activeEmpireId}
              </h2>
            </div>
          ) : (
            <>
              {!slotStatus[activeBusinessIndex] && !isAdmin ? (
                <LockedSlotView slotIndex={activeBusinessIndex} />
              ) : (
                <div className="space-y-12 md:space-y-16 animate-in fade-in duration-1000">
                  
                  {/* 1. Identity Header */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                       <div className={cn(
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
                      </div>
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
                      {(empireData?.name === 'HOME BASE' || empireData?.title === 'HOME BASE') ? "EmpireLaunch AI" : (empireData?.name || empireData?.title || "EmpireLaunch AI")}
                    </h1>
                  </motion.div>

                  {/* 2. Operations Column */}
                  <div className="max-w-6xl mx-auto space-y-12 md:space-y-16" style={{ contentVisibility: 'auto' }}>
                    
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
                        growthScore={healthData?.growthScore}
                        onActivateGrowthProtocol={(name) => {
                          setGrowthProtocolGateProduct(name);
                          setIsGrowthProtocolGateOpen(true);
                        }}
                      />
                    </motion.div>

                    {/* Active Subscribers - Moved here for Admin/Owner per request */}
                    {isAdmin && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        whileInView={{ opacity: 1, scale: 1 }} 
                        viewport={{ once: true }}
                        className="bg-theme-surface border-2 border-theme rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(var(--surface-border-rgb),0.15)] transition-all"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] -z-10" />
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Stars className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Subscribers</p>
                            <p className="text-2xl sm:text-3xl font-black text-foreground bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                              {connectedPlatforms.length > 0 ? (healthData?.subscribers || 0) : "—"}
                            </p>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">Recurring revenue subscribers</p>
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
    </DashboardErrorBoundary>
  );
}
