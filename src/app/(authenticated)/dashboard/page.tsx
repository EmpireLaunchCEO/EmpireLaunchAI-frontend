"use client";
import { cn } from "@/lib/utils";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Stars, LayoutDashboard, Globe, Briefcase, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';
import { analyticsService, empireService, getEmpireUserId } from '@/lib/api-service';
import { API_URL } from '@/lib/config';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { BrandedGlobe } from '@/components/BrandedGlobe';

import { DashboardErrorBoundary } from '@/components/DashboardErrorBoundary';
import { LockedSlotView } from '@/components/Dashboard/LockedSlotView';
import { GrowthProtocolGate } from '@/components/Dashboard/GrowthProtocolGate';
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';
import { FeedbackInbox } from '@/components/Dashboard/FeedbackInbox';
import { EmpireTabs } from '@/components/Dashboard/EmpireTabs';


export default function Dashboard() {
  const { activeEmpireId, setActiveEmpireId, isLinkingComplete, aiMode, isInitialized, isDashboardLoaded, setDashboardLoaded, setActiveEmpire, slotStatus, isAdmin, connectedPlatforms, registerRefreshHandler, userEmail, unlockSlot } = useEmpire();
  const activeBusinessIndex = activeEmpireId === '1' ? 0 : (activeEmpireId === '2' ? 1 : (activeEmpireId === '3' ? 2 : 0));
  const [empireData, setEmpireDataState] = useState<any>(null);
  const [pulseData, setPulseData] = useState<any>(null);
  const isLoadingRef = useRef(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isGrowthGateOpen, setIsGrowthProtocolGateOpen] = useState(false);
  const [growthGateProduct, setGrowthProtocolGateProduct] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'loading' | 'active' | 'none'>('loading');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async (retryCount = 0) => {
    if (isLoadingRef.current && retryCount === 0) return;
    isLoadingRef.current = true;
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch timeout')), 12000));
      const fetchPromise = Promise.all([
        empireService.getEmpire(activeEmpireId).catch(() => null),
        analyticsService.getEmpirePulse().catch(() => ({ score: 0, logs: [] })),
      ]);

      const results = await Promise.race([fetchPromise, timeoutPromise]) as any[];
      const [eData, pulse] = results;

      // Always try to load from cache first for instant display
      if (!eData && typeof window !== 'undefined') {
        const cached = localStorage.getItem('empire_data_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setEmpireDataState(parsed);
            setActiveEmpire(parsed);
          } catch (e) { /* ignore corrupt cache */ }
        }
      }

      if (eData) {
        let finalData = eData;
        
        // Persist empire ID to localStorage so saves never depend on component state
        if (finalData?.id && typeof window !== 'undefined') {
          localStorage.setItem('empire_active_id', finalData.id);
          // Cache full empire data for instant reload
          localStorage.setItem('empire_data_cache', JSON.stringify(finalData));
        }

        // Check for pending payment verification (user returning from Stripe checkout)
        if (typeof window !== 'undefined') {
          const pendingType = localStorage.getItem('pending_payment');
          if (pendingType === 'subscription' || pendingType === 'expansion') {
            try {
              await fetch(`${API_URL || 'https://backend-production-56123.up.railway.app'}/api/stripe/verify-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('empire_auth_token') || ''}` },
                body: JSON.stringify({ type: pendingType }),
              });
              localStorage.removeItem('pending_payment');
              // Auto-unlock next slot for expansion payments
              if (pendingType === 'expansion') {
                const activeSlots = Object.values(slotStatus || {}).filter(Boolean).length;
                // Slot indices: 0=brand1, 1=brand2, 2=brand3 — find next locked slot
                for (let i = 0; i < 3; i++) {
                  if (!slotStatus?.[i]) {
                    unlockSlot(i);
                    break;
                  }
                }
              }
            } catch (e) { /* non-critical */ }
          }
        }
        
        setEmpireDataState(finalData);
        setActiveEmpire(finalData);
        setPulseData(pulse);
      }
    } catch (error) {
      console.error('Sync Error:', error);
    } finally {
      isLoadingRef.current = false;
      setDashboardLoaded(true);
    }
  }, [activeEmpireId, setDashboardLoaded, setActiveEmpire]);

  useEffect(() => {
    if (mounted && isInitialized) {
      fetchData();
    }
  }, [activeEmpireId, mounted, isInitialized, fetchData]);

  useEffect(() => {
    return registerRefreshHandler(fetchData);
  }, [registerRefreshHandler, fetchData]);

  // Check subscription status after data loads
  useEffect(() => {
    if (!isDashboardLoaded || !mounted) return;
    const checkSubscription = async () => {
      try {
        const userId = getEmpireUserId();
        const res = await fetch(`${API_URL}/api/subscriptions/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.count > 0) {
            setSubscriptionStatus('active');
            return;
          }
        }
      } catch (e) {
        console.error('Subscription check failed', e);
      }
      setSubscriptionStatus('none');
    };
    checkSubscription();
  }, [isDashboardLoaded, mounted]);

  // Subscribe handler — creates Stripe checkout session
  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const res = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('empire_auth_token') || ''}`,
        },
        body: JSON.stringify({ type: 'subscription' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          localStorage.setItem('pending_payment', 'true');
          window.location.href = data.url;
          return;
        }
      }
    } catch (e) {
      console.error('Subscribe error', e);
    }
    setSubscribing(false);
  };

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
          
          {!empireData && !isDashboardLoaded ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <BrandedGlobe size="lg" spinning />
              <h2 className="text-white font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Syncing Neural Node {activeEmpireId}
              </h2>
            </div>
          ) : !empireData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <h2 className="text-red-400 font-black uppercase tracking-[0.3em] text-[10px]">
                Failed to load empire data
              </h2>
              <button onClick={() => fetchData()} className="px-6 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary/80 transition-colors">
                Retry
              </button>
            </div>
          ) : subscriptionStatus === 'loading' ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <BrandedGlobe size="lg" spinning />
              <h2 className="text-white font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                Verifying Subscription...
              </h2>
            </div>
          ) : subscriptionStatus === 'none' && !isAdmin ? (
            /* Payment Gate — block dashboard until subscription verified */
            <div className="flex flex-col items-center justify-center py-16 gap-8 max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <Stars className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Subscribe to Continue</h2>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Your EmpireLaunch AI subscription is required to access the command center.
                  Unlock full autonomous business automation for $50/month.
                </p>
              </div>
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="px-10 py-4 bg-gradient-to-r from-primary to-amber-600 text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl shadow-primary/40 disabled:opacity-50"
              >
                {subscribing ? 'Redirecting to Stripe...' : 'Subscribe Now — $50/mo'}
              </button>
              <p className="text-[9px] text-muted-foreground/50 font-medium">
                Secure checkout powered by Stripe. Cancel anytime.
              </p>
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
                    className="text-center space-y-4 relative"
                  >
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
                      {empireData?.name || empireData?.title || "EmpireLaunch AI"}
                    </h1>
                  </motion.div>

                  {/* 2. Operations Column */}
                  <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
                    
                    {/* Primary Results Section */}
                    {/* GrowthTracker removed per owner direction */}

                    {/* Empire Finances removed per owner direction */}

                    {/* Empire Identity + Intel Tabs */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <EmpireTabs
                        empireData={empireData}
                        onDataUpdate={() => fetchData()}
                      />
                    </motion.div>

                    {/* Feedback Inbox - Owner Only */}
                    {(isAdmin || userEmail?.toLowerCase() === 'stacipeabody@gmail.com') && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <FeedbackInbox />
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
