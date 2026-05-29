"use client";

import React, { useState, useEffect } from 'react';
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
  Loader2,
  Globe,
  Coins,
  Languages,
  ChevronDown
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

const steps = [
  { id: 1, title: 'Identity' },
  { id: 2, title: 'Matrix' },
  { id: 3, title: 'Toolkit' },
  { id: 4, title: 'Calibration' },
  { id: 5, title: 'Authorization' },
];

import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';
import { CreditCard, Lock, Sparkles } from 'lucide-react';

export default function Onboarding() {
  const { 
    completeOnboarding, 
    setActiveEmpireId, 
    isOnboarded, 
    isInitialized, 
    setIsPaid,
    language,
    setLanguage,
    currency,
    setCurrency
  } = useEmpire();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [accessKey, setAccessKey] = useState('');
  const [data, setData] = useState({
    name: '',
    niche: '',
    angle: '',
    connectedPlatforms: [] as string[],
    automationMode: 'co-pilot' as 'co-pilot' | 'empire',
  });

  const [isActivating, setIsActivating] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [showApprovalGate, setShowApprovalGate] = useState(false);
  const [showDiscoveryReview, setShowDiscoveryReview] = useState(false);
  const [gatePlatform, setGatePlatform] = useState('Etsy');
  const [discoveryLogIndex, setDiscoveryLogIndex] = useState(0);

  const discoveryLogs = [
    "Scanning linked email accounts...",
    "Searching for marketplace API keys...",
    "Decrypting secure social tokens...",
    "Mapping automated growth paths...",
    "Neural Discovery Complete."
  ];

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
  }, [isActivating, data.automationMode, showDiscoveryReview]);

  useEffect(() => {
    if (isInitialized && isOnboarded) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isOnboarded, router]);

  if (isOnboarded) return null;
  if (!isInitialized) return null;

  const updateData = (updates: any) => setData(prev => ({ ...prev, ...updates }));

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleActivate = async () => {
    setIsActivating(true);
    
    // In co-pilot mode, we just finish. In empire mode, we do the discovery review.
    if (data.automationMode === 'co-pilot') {
       await finalizeActivation();
    }
  };

  const finalizeActivation = async () => {
    try {
      const response = await fetch(`${API_URL}/api/agent/initialize`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token'
        },
        body: JSON.stringify({
          userId: '00000000-0000-0000-0000-000000000000',
          name: data.name,
          niche: data.niche,
          angle: data.angle,
          automationMode: data.automationMode
        }),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setActiveEmpireId(result.empire.id);
        completeOnboarding();
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error) {
      console.error('Error during activation:', error);
      completeOnboarding();
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }
  };

  if (isActivating) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
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
              <div className="relative inline-block">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-[40px] border-4 border-primary/30 flex items-center justify-center"
                >
                  <div className="w-24 h-24 rounded-[32px] border-4 border-primary/50 flex items-center justify-center">
                    <Zap className="w-12 h-12 text-primary fill-current" />
                  </div>
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary blur-[60px] -z-10"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tight uppercase italic">
                  Establishing Neural Sync.
                </h2>
                <div className="flex items-center justify-center gap-3 h-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={discoveryLogIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <p className="text-primary font-black tracking-widest text-xs uppercase">
                        {discoveryLogs[discoveryLogIndex]}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
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

  const handleConnect = (id: string) => {
    if (!data.connectedPlatforms.includes(id)) {
      updateData({ connectedPlatforms: [...data.connectedPlatforms, id] });
    }
  };

  const handleAcceptTerms = async () => {
    setIsTermsOpen(false);
    setIsPaying(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsPaid(true);
    setIsPaying(false);
    handleActivate();
  };

  return (
    <div className="h-screen bg-theme-surface flex flex-col items-center overflow-y-auto no-scrollbar">
      <PWAInstallPrompt />
      <TermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
        onAccept={handleAcceptTerms} 
      />
      <div className="fixed left-0 top-0 bottom-0 w-1 bg-slate-100 hidden lg:block z-[70]" />
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left hidden lg:flex items-center gap-4 z-[70]">
        <Stars className="w-4 h-4 text-primary rotate-90" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 whitespace-nowrap">
          Orchestrator: <span className="text-foreground">{currentStep === 1 ? "Analyzing Identity" : currentStep === 2 ? "Mapping Matrix" : "Calibrating Growth"}</span>
        </span>
      </div>

      <div className="w-full max-w-md px-6 py-8 md:py-16 flex flex-col mx-auto flex-grow justify-center">
        <ProgressConstellation currentStep={currentStep} totalSteps={steps.length} />

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <EmpireIdentity data={data} updateData={updateData} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
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

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ConsultantToolkit businessAngle={data.angle} />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AutomationCalibration 
                  mode={data.automationMode} 
                  onModeChange={(mode) => updateData({ automationMode: mode })} 
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center border border-primary/20 shadow-xl shadow-amber-900/20">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight uppercase italic">Authorize Engine.</h2>
                  <p className="text-muted-foreground text-xs md:text-sm font-medium italic">
                    "To begin autonomous operations, I need you to authorize the operational license. This secures your business slots and neural processing priority."
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 relative overflow-hidden">
                   {/* Language & Currency Merged */}
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
                           className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-10 text-[10px] font-black uppercase appearance-none hover:border-primary/40 transition-all cursor-pointer outline-none"
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
                           className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-10 text-[10px] font-black uppercase appearance-none hover:border-primary/40 transition-all cursor-pointer outline-none"
                         >
                           <option value="USD">USD ($)</option>
                           <option value="EUR">EUR (€)</option>
                           <option value="GBP">GBP (£)</option>
                         </select>
                         <ChevronDown className="absolute inset-y-0 right-3 my-auto w-4 h-4 text-slate-600 pointer-events-none" />
                       </div>
                     </div>
                   </div>

                   <div className="pt-4 border-t border-slate-800">
                     <div className="space-y-4">
                       <div className="flex justify-between items-start">
                         <div>
                           <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Empire Master</h3>
                           <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">Unlimited Autonomy License</p>
                         </div>
                         <div className="text-right">
                           <span className="text-2xl font-black text-white">$30</span>
                           <span className="text-slate-500 font-black uppercase tracking-widest text-[8px] block">/Month</span>
                         </div>
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Access Key</label>
                         <div className="relative group">
                            <input 
                              type="text" 
                              value={accessKey}
                              onChange={(e) => setAccessKey(e.target.value)}
                              placeholder="ENTER YOUR LICENSE KEY"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 focus:border-primary/60 transition-all outline-none shadow-inner"
                            />
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                         {[
                           'Full Autonomous Execution',
                           'Priority Neural Discovery',
                           'Secure Bank Bridge',
                           '24/7 Intelligence Pulse'
                         ].map(f => (
                           <div key={f} className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-tight">
                             <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                             {f}
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>

                   <div className="pt-4 border-t border-slate-800">
                     <div className="flex items-center gap-4 opacity-30 grayscale">
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Secure Pay</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Encrypted</span>
                        </div>
                     </div>
                   </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  <p className="text-[10px] text-primary/80 font-bold leading-relaxed italic uppercase tracking-tight">
                    "Verification: This is a secure operational gateway. Your data remains protected via hardware-level encryption."
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 md:mt-20 flex flex-col-reverse md:flex-row justify-between items-center max-w-md mx-auto w-full gap-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || isActivating || isPaying}
            className={cn(
              "flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-500 hover:text-foreground transition-colors disabled:opacity-0",
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-primary hover:text-slate-900 transition-all shadow-2xl shadow-slate-950 group w-full md:w-auto justify-center"
            >
              Next Phase
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={async () => {
                if (!accessKey || accessKey.length < 5) {
                   alert("Please enter a valid Access Key to authorize.");
                   return;
                }
                setIsTermsOpen(true);
              }}
              disabled={isActivating || isPaying}
              className="bg-primary text-slate-900 px-10 py-5 rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white transition-all shadow-2xl shadow-amber-900/20 group disabled:opacity-50 w-full md:w-auto justify-center"
            >
              {isPaying ? "Verifying Key..." : isActivating ? "Establishing Sync..." : "Authorize Engine"}
              <CheckCircle2 className="w-4 h-4" />
            </button>
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
