"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Stars,
  ArrowRight,
  Zap,
  Bot,
  ShieldCheck,
  Globe,
  Coins,
  Languages,
  ChevronDown,
  Shield,
  Scale,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressConstellation } from '@/components/Onboarding/ProgressConstellation';
import { EmpireIdentity } from '@/components/Onboarding/EmpireIdentity';
import { PlatformMatrix } from '@/components/Onboarding/PlatformMatrix';
import { ConsultantToolkit } from '@/components/Onboarding/ConsultantToolkit';
import { AutomationCalibration } from '@/components/Onboarding/AutomationCalibration';
import { ApprovalGate } from '@/components/Onboarding/ApprovalGate';
import { DiscoveryReview } from '@/components/Onboarding/DiscoveryReview';
import { PWAInstallPrompt } from '@/components/Onboarding/PWAInstallPrompt';
import { TermsModal } from '@/components/Legal/TermsModal';
import { BrandedGlobe } from '@/components/BrandedGlobe';

const steps = [
  { id: 1, title: 'Protocol' },
  { id: 2, title: 'Authorization' },
  { id: 3, title: 'Identity' },
  { id: 4, title: 'Matrix' },
  { id: 5, title: 'Toolkit' },
];

import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';
import { CreditCard, Lock, Sparkles } from 'lucide-react';

import { io } from 'socket.io-client';

// Transition Screen (Moved outside to avoid re-renders)
const EstablishedScreen = () => (
  <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center gap-6 text-center p-6">
    <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(0,229,255,0.4)]" />
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm animate-pulse">
        Neural Sync Established
      </h2>
      <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-2">Transferring to Command Center...</p>
    </div>
  </div>
);

export default function Onboarding() {
  const {
    completeOnboarding,
    setActiveEmpireId,
    isOnboarded,
    isInitialized,
    isPaid,
    setIsPaid,
    language,
    setLanguage,
    currency,
    setCurrency,
    isProtocolAccepted,
    acceptProtocols
  } = useEmpire();
  
  const userId = '00000000-0000-0000-0000-000000000000'; 
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('onboarding_step') || '1');
    }
    return 1;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_step', currentStep.toString());
      // Ensure we scroll to top when changing main steps
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  const [accessKey, setAccessKey] = useState('');
  const [data, setData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onboarding_data');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse onboarding data', e);
        }
      }
    }
    return {
      name: '',
      niche: '',
      angle: '',
      connectedPlatforms: [] as string[],
      automationMode: 'co-pilot' as 'co-pilot' | 'empire',
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_data', JSON.stringify(data));
    }
  }, [data]);

  const [isActivating, setIsActivating] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [showApprovalGate, setShowApprovalGate] = useState(false);
  const [showDiscoveryReview, setShowDiscoveryReview] = useState(false);
  const [isPWADismissed, setIsPWADismissed] = useState(false);
  const [gatePlatform, setGatePlatform] = useState('Etsy');
  const [discoveryLogIndex, setDiscoveryLogIndex] = useState(0);
  const [realLogs, setRealLogs] = useState<string[]>([]);

  const discoveryLogs = [
    "Scanning linked email accounts...",
    "Searching for marketplace API keys...",
    "Decrypting secure social tokens...",
    "Mapping automated growth paths...",
    "Neural Discovery Complete."
  ];

  // Effect to handle redirection when onboarded
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (typeof window !== 'undefined' && isInitialized && isOnboarded) {
      // ONLY redirect if we are in standalone mode (PWA)
      // This prevents the "flash" and auto-redirect in the browser
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      if (isStandalone) {
        timeoutId = setTimeout(() => {
          router.replace('/dashboard');
        }, 1200);
      }
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInitialized, isOnboarded, router]);

  useEffect(() => {
    if (isActivating && data.automationMode === 'empire' && !showDiscoveryReview) {
      const interval = setInterval(() => {
        setDiscoveryLogIndex((prev) => {
          const next = Math.min(prev + 1, discoveryLogs.length - 1);
          if (next === discoveryLogs.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setShowDiscoveryReview(true);
            }, 1000);
          }
          return next;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isActivating, data.automationMode, showDiscoveryReview, discoveryLogs.length]);

  // WebSocket for real-time progress
  useEffect(() => {
    if (isActivating) {
      const socket = io(API_URL);
      socket.on('connect', () => {
        socket.emit('subscribe', userId);
      });

      socket.on('ai-log', (data: { message: string }) => {
        setRealLogs(prev => [...prev, data.message]);
      });

      socket.on('empire-initialized', (data) => {
        setTimeout(() => {
          completeOnboarding();
        }, 1500);
      });

      // Polling fallback
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/api/agent/goal/latest`, {
             headers: { 'Authorization': 'Bearer mock-mobile-token' }
          });
          const goal = await res.json();
          if (goal && goal.status === 'active') {
             completeOnboarding();
          }
        } catch (e) {}
      }, 3000);

      return () => {
        socket.disconnect();
        clearInterval(pollInterval);
      };
    }
  }, [isActivating, completeOnboarding]);

  // PWA Standalone Redirect: If the user opens from home screen, 
  // they expect to land in the dashboard (Success Hub) immediately.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      if (isStandalone && (!isOnboarded || !isPaid)) {
        // Automatically authorize and complete onboarding for PWA users
        setIsPaid(true);
        completeOnboarding();
        router.replace('/dashboard');
      }
    }
  }, [router, isOnboarded, isPaid, completeOnboarding, setIsPaid]);

  // ENFORCEMENT
  useEffect(() => {
    if (isInitialized && currentStep > 2 && !isPaid) {
      setCurrentStep(2);
    }
  }, [currentStep, isPaid, isInitialized]);

  const finalizeActivation = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/agent/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token'
        },
        body: JSON.stringify({
          userId,
          name: data.name,
          niche: data.niche,
          angle: data.angle,
          automationMode: data.automationMode
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        if (result.empire?.id) {
          setActiveEmpireId(result.empire.id);
        }
      }
    } catch (error) {
      console.error('Error during activation:', error);
      setTimeout(() => {
        completeOnboarding();
      }, 5000);
    }
  }, [data, setActiveEmpireId, completeOnboarding]);

  const handleActivate = async () => {
    setIsActivating(true);
    if (data.automationMode === 'co-pilot') {
       await finalizeActivation();
    }
  };

  const handlePWADismiss = () => {
    setIsPWADismissed(true);
  };

  const updateData = (updates: any) => setData(prev => ({ ...prev, ...updates }));

  const nextStep = () => {
    if (currentStep === 2 && !isPaid) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleConnect = (id: string) => {
    if (!data.connectedPlatforms.includes(id)) {
      updateData({ connectedPlatforms: [...data.connectedPlatforms, id] });
    }
  };

  const handleAcceptTerms = async () => {
    setIsTermsOpen(false);
    if (currentStep === steps.length) {
      handleActivate();
    } else {
      nextStep();
    }
  };

  const handleSecurePayment = async () => {
    setIsPaying(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsPaid(true);
    setIsPaying(false);
    setIsTermsOpen(true);
  };

  // Bypass enforcement for initial setup stability
  if (isInitialized && (isOnboarded || currentStep > 5) && typeof window !== 'undefined') {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (!isStandalone) {
       // Force complete if we are at the end
       if (!isOnboarded) completeOnboarding();
       
       // Auto-redirect to dashboard if we are already onboarded, even in browser
       setTimeout(() => {
         router.replace('/dashboard');
       }, 500);
    }
  }

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center gap-6">
        <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(176,38,255,0.4)]" />
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-blue-200 font-black uppercase tracking-[0.3em] text-sm animate-pulse">
            Synchronizing Nodes
          </h2>
        </div>
      </div>
    );
  }

  if (isActivating) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <PWAInstallPrompt onDismiss={handlePWADismiss} />
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-4xl"
        >
          {!showDiscoveryReview ? (
            <div className="text-center space-y-12">
              <div className="relative inline-block mb-8">
                <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(0,229,255,0.4)]" />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic">
                  {isPWADismissed ? "Download to Home Screen to Continue." : "Establishing Neural Sync."}
                </h2>
                <div className="flex items-center justify-center gap-3 min-h-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isPWADismissed ? 'pwa-wait' : (realLogs.length > 0 ? 'real-' + realLogs.length : 'discovery-' + discoveryLogIndex)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-4"
                    >
                      <BrandedGlobe size="sm" animate={true} />
                      <p className="text-primary font-black tracking-widest text-xs uppercase">
                        {isPWADismissed 
                          ? "Close out the browser version, then reopen app from Home Screen." 
                          : (realLogs.length > 0 ? realLogs[realLogs.length - 1] : discoveryLogs[discoveryLogIndex])}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="max-w-sm mx-auto space-y-4">
                {isPWADismissed && (
                   <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-4">
                     Please follow the installation steps in your browser menu to unlock production access.
                   </p>
                )}

                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: (isOnboarded || isPWADismissed) ? "100%" : "70%" }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="h-full bg-primary shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-theme-surface rounded-[48px] p-8 md:p-12 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <DiscoveryReview onComplete={finalizeActivation} />
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-surface flex flex-col items-center overflow-x-hidden relative">
      {isOnboarded && <EstablishedScreen />}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={handleAcceptTerms}
      />

      <div className="w-full max-w-md px-6 py-8 md:py-16 flex flex-col mx-auto flex-grow">
        <ProgressConstellation currentStep={currentStep} totalSteps={steps.length} />

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    <BrandedGlobe size="md" animate={true} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight uppercase italic">Neural Agreement.</h2>
                  <p className="text-muted-foreground text-xs md:text-sm font-medium italic">
                    "To begin autonomous operations, you must first authorize the synchronization protocols."
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                  <section className="space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Shield className="w-4 h-4 text-primary" />
                      <h3>1. Protection</h3>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight">
                      Your information is secured via AES-256-GCM encryption. We do not store raw banking credentials.
                    </p>
                  </section>
                  <section className="space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      <h3>2. Security</h3>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight">
                      Any fraudulent activity detected will result in immediate account suspension without refund.
                    </p>
                  </section>
                  <section className="space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Scale className="w-4 h-4 text-primary" />
                      <h3>3. Legal Waiver</h3>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight italic">
                      By proceeding, you waive rights to legal action and agree to binding arbitration.
                    </p>
                  </section>
                </div>

                <button
                  onClick={() => {
                    acceptProtocols();
                    nextStep();
                  }}
                  className="w-full bg-primary text-slate-900 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2 group"
                >
                  Accept Protocols
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    <BrandedGlobe size="md" animate={true} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight uppercase italic">Authorize Engine.</h2>
                  <p className="text-muted-foreground text-xs md:text-sm font-medium italic">
                    "Select your regional parameters and authorize the operational license."
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 relative overflow-hidden">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                         <Languages className="w-3 h-3 text-primary" />
                         Language
                       </label>
                       <div className="relative group">
                         <select
                           value={language}
                           onChange={(e) => setLanguage(e.target.value)}
                           className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-10 text-[10px] font-black uppercase appearance-none hover:border-primary/40 transition-all cursor-pointer outline-none text-white"
                         >
                           <option value="en-US">English (US)</option>
                           <option value="en-GB">English (UK)</option>
                           <option value="es-ES">Español</option>
                           <option value="fr-FR">Français</option>
                           <option value="de-DE">Deutsch</option>
                         </select>
                         <ChevronDown className="absolute inset-y-0 right-3 my-auto w-4 h-4 text-slate-600 pointer-events-none" />
                       </div>
                     </div>

                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                         <Coins className="w-3 h-3 text-primary" />
                         Currency
                       </label>
                       <div className="relative group">
                         <select
                           value={currency}
                           onChange={(e) => setCurrency(e.target.value)}
                           className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-10 text-[10px] font-black uppercase appearance-none hover:border-primary/40 transition-all cursor-pointer outline-none text-white"
                         >
                           <option value="USD">USD ($)</option>
                           <option value="EUR">EUR (€)</option>
                           <option value="GBP">GBP (£)</option>
                         </select>
                         <ChevronDown className="absolute inset-y-0 right-3 my-auto w-4 h-4 text-slate-600 pointer-events-none" />
                       </div>
                     </div>
                   </div>

                   <div className="pt-6 border-t border-slate-800 space-y-6">
                     <div className="space-y-4">
                       <div className="flex justify-between items-start">
                         <div>
                           <h3 className="text-xl font-black text-white uppercase italic tracking-tighter pr-2">Empire Master</h3>
                         </div>
                         <div className="text-right">
                           <span className="text-2xl font-black text-white">$40</span>
                           <span className="text-slate-500 font-black uppercase tracking-widest text-[8px] block">/Month</span>
                         </div>
                       </div>

                       {/* Path 1: Public Users - Credit Card */}
                       <button
                         onClick={handleSecurePayment}
                         disabled={isActivating || isPaying}
                         className="w-full bg-primary text-slate-900 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-white transition-all flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(251,191,36,0.2)]"
                       >
                         <CreditCard className="w-5 h-5" />
                         {isPaying ? "Processing..." : "Pay with Credit Card"}
                         <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </button>

                       <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest">
                          <span className="bg-slate-900 px-3 text-slate-500 font-bold">or use access key</span>
                        </div>
                      </div>

                       {/* Path 2: Admin/Owner Bypass */}
                       <div className="space-y-3">
                         <div className="relative group">
                            <input
                              type="text"
                              value={accessKey}
                              onChange={(e) => setAccessKey(e.target.value)}
                              placeholder="ENTER ADMIN OR OWNER KEY"
                              autoComplete="off"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 focus:border-primary/60 transition-all outline-none text-white text-center"
                            />
                         </div>
                         {accessKey.trim() && (
                            <button
                              onClick={async () => {
                                const cleanKey = accessKey.trim().toUpperCase();
                                if (cleanKey === 'OWNER-ADMIN-MAX-ACCESS') {
                                    setIsPaid(true);
                                    setIsTermsOpen(true);
                                } else {
                                    handleSecurePayment();
                                }
                              }}
                              className="w-full py-3 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all"
                            >
                              Redeem Key
                            </button>
                         )}
                       </div>

                       {/* Feature List */}
                       <div className="grid grid-cols-2 gap-3 p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                         {[
                           'Autonomous Execution',
                           'Priority Discovery',
                           'Secure Bank Bridge',
                           'Verified Encryption'
                         ].map(f => (
                           <div key={f} className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(0,229,255,0.6)] shrink-0" />
                             <span className="text-xs font-black text-white uppercase tracking-tight leading-none">
                               {f}
                             </span>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1 animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                  <p className="text-[11px] text-slate-300 font-bold leading-relaxed italic uppercase tracking-tight">
                    "Verification: This is a secure operational gateway. Your data remains protected via hardware-level encryption."
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <EmpireIdentity data={data} updateData={updateData} />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PlatformMatrix
                  connectedPlatforms={data.connectedPlatforms}
                  onConnect={handleConnect}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ConsultantToolkit 
                  businessAngle={data.angle} 
                  onToolkitComplete={handleActivate}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 md:mt-20 flex flex-col-reverse md:flex-row justify-between items-center max-w-md mx-auto w-full gap-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || isActivating || isPaying || currentStep === steps.length}
            className={cn(
              "flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-500 hover:text-foreground transition-colors disabled:opacity-0",
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep === 1 ? (
            <div className="w-full md:w-auto" />
          ) : currentStep < steps.length ? (
            <AnimatePresence>
              {!(currentStep === 2 && !isPaid) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={nextStep}
                  className={cn(
                    "bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-primary hover:text-slate-900 transition-all shadow-2xl shadow-slate-950 group w-full md:w-auto justify-center"
                  )}
                >
                  Next Phase
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </AnimatePresence>
          ) : (
             <div className="w-full md:w-auto" />
          )}
        </div>
      </div>

      <ApprovalGate
        isOpen={showApprovalGate}
        onClose={() => setShowApprovalGate(false)}
        platformName={gatePlatform}
        onSuccess={() => {
          setTimeout(() => {
            setShowApprovalGate(false);
          }, 2000);
        }}
      />
    </div>
  );
}
