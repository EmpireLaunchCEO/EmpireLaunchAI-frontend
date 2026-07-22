"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  CheckCircle2,
  Stars,
  ArrowRight,
  CreditCard,
  Languages,
  Shield,
  AlertCircle,
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressConstellation } from '@/components/Onboarding/ProgressConstellation';
import { EmpireIdentity } from '@/components/Onboarding/EmpireIdentity';
import { PlatformMatrix } from '@/components/Onboarding/PlatformMatrix';
import { ConsultantToolkit } from '@/components/Onboarding/ConsultantToolkit';
import { DiscoveryReview } from '@/components/Onboarding/DiscoveryReview';
import { PWAInstallPrompt } from '@/components/Onboarding/PWAInstallPrompt';
import { TermsModal } from '@/components/Legal/TermsModal';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { SignUpForm } from '@/components/Onboarding/SignUpForm';
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';
import { Suspense } from 'react';
import { detectLocale, setLocale, t, formatPrice, getCurrencyInfo, getAmountInCents, SUPPORTED_LOCALES, type LocaleCode } from '@/lib/i18n';
import { SUBSCRIPTION_LINK } from '@/lib/payment-links';

const steps = [
  { id: 1, title: 'Protocol' },
  { id: 2, title: 'Authorization' },
  { id: 3, title: 'Neural Identity' },
  { id: 4, title: 'Business Identity' },
  { id: 5, title: 'Matrix' },
  { id: 6, title: 'Toolkit' },
];

const EstablishedScreen = () => (
  <div className="fixed inset-0 z-[200] bg-[#0a0519] flex flex-col items-center justify-center gap-6 text-center p-6">
    <BrandedGlobe size="lg" glow={false} animate={true} />
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm animate-pulse">
        Neural Sync Established
      </h2>
      <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-2">Transferring to Command Center...</p>
    </div>
  </div>
);

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const empire = useEmpire();
  
  const {
    completeOnboarding = () => {},
    setActiveEmpireId = () => {},
    isOnboarded = false,
    isInitialized = false,
    isPaid = false,
    setIsPaid = () => {},
    language = 'en-US',
    setLanguage = () => {},
    currency = 'USD',
    setCurrency = () => {},
    acceptProtocols = () => {},
    isHandoverComplete: handoverStatus = false
  } = empire || {};
  
  const [userId, setUserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState({
    name: '',
    niche: '',
    angle: '',
    targetCustomers: '',
    businessGoals: '',
    platforms: [] as string[],
    archetype: 'CREATOR' as 'CREATOR' | 'CATALYST',
    connectedPlatforms: [] as string[],
    automationMode: 'co-pilot' as 'co-pilot' | 'empire',
  });

  const [showDownloadScreen, setShowDownloadScreen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionError, setRedemptionError] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [showDiscoveryReview, setShowDiscoveryReview] = useState(false);
  const [discoveryLogIndex, setDiscoveryLogIndex] = useState(0);
  const [selectedLocale, setSelectedLocale] = useState<LocaleCode>(detectLocale());

  const currentT = (key: string) => t(key as any, selectedLocale);
  const currencyInfo = getCurrencyInfo(selectedLocale);

  const discoveryLogs = useMemo(() => [
    "Scanning linked email accounts...",
    "Searching for marketplace API keys...",
    "Decrypting secure social tokens...",
    "Mapping automated growth paths...",
    "Neural Discovery Complete."
  ], []);

  const verifyPayment = useCallback(async (sessionId: string) => {
    setIsPaying(true);
    try {
      const res = await fetch(`${API_URL}/api/stripe/verify/platform?sessionId=${sessionId}`, {
        headers: {
            'x-user-id': userId || ''
        }
      });
      const result = await res.json();
      if (result.status === 'paid') {
        setIsPaid(true);
        setCurrentStep(4);
      }
    } catch (err) {
      console.error('Payment verification failed');
    } finally {
      setIsPaying(false);
    }
  }, [userId, setIsPaid]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const stepParam = searchParams.get('step');
      const savedStep = localStorage.getItem('onboarding_step');
      
      if (stepParam) {
        setCurrentStep(parseInt(stepParam));
      } else if (savedStep) {
        setCurrentStep(parseInt(savedStep));
      }
      
      const savedUserId = localStorage.getItem('empire_userId');
      if (savedUserId) setUserId(savedUserId);

      // Restore onboarding data from localStorage
      const savedData = localStorage.getItem('onboarding_data');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setData(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.warn('Failed to restore onboarding data');
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionId = searchParams.get('session_id');
      if (sessionId && !isPaid && userId) {
        verifyPayment(sessionId);
      }
    }
  }, [searchParams, isPaid, userId, verifyPayment]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('onboarding_step', currentStep.toString());
      if (userId) localStorage.setItem('empire_userId', userId);
      localStorage.setItem('onboarding_data', JSON.stringify(data));
      
      // Update URL silently without adding history entries if possible, or just keep it sync'd
      const url = new URL(window.location.href);
      if (url.searchParams.get('step') !== currentStep.toString()) {
        const step = currentStep.toString();
        const mode = url.searchParams.get('mode');
        const newUrl = `${window.location.pathname}?step=${step}${mode ? `&mode=${mode}` : ''}`;
        window.history.replaceState({}, '', newUrl);
      }
      
      window.scrollTo(0, 0);
    }
  }, [currentStep, isMounted, userId, data]);

  const isPreview = searchParams.get('preview') === 'true';
  const [isLoginMode, setIsLoginMode] = useState(searchParams.get('mode') === 'login');

  const finalizeActivation = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/agent/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId || ''
        },
        body: JSON.stringify({
          userId,
          name: data.name,
          niche: data.niche,
          angle: data.angle,
          targetCustomers: data.targetCustomers,
          businessGoals: data.businessGoals,
          platform: data.platforms[0] || '',
          platforms: data.platforms,
          archetype: data.archetype,
          automationMode: data.automationMode
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        if (result.empire?.id) {
          setActiveEmpireId(result.empire.id);
        }
        completeOnboarding();
      } else {
        completeOnboarding();
      }
    } catch (error) {
      completeOnboarding();
    }
  }, [data, userId, setActiveEmpireId, completeOnboarding]);

  const handleActivate = async () => {
    setIsActivating(true);
    await finalizeActivation();
  };

  const updateData = (updates: any) => setData(prev => ({ ...prev, ...updates }));

  const nextStep = () => {
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
    window.location.href = SUBSCRIPTION_LINK;
  };

  const handleRedeemKey = async () => {
    if (!accessKey.trim()) return;
    setIsRedeeming(true);
    setRedemptionError(null);
    try {
      const response = await fetch(`${API_URL}/api/auth/redeem-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: accessKey.trim() })
      });
      const result = await response.json();
      if (result.status === 'success') {
        // Key is valid, proceed to identity creation
        nextStep();
      } else {
        setRedemptionError(result.error || 'Invalid access key.');
      }
    } catch (err) {
      setRedemptionError('Network error. Try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  // Discovery Log Sequence
  useEffect(() => {
    if (isActivating && data.automationMode === 'empire' && !showDiscoveryReview && isMounted) {
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
  }, [isActivating, data.automationMode, showDiscoveryReview, isMounted, discoveryLogs]);

  if (!isMounted || !isInitialized) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0a0519] flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white animate-pulse">
           <Stars className="w-8 h-8" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm animate-pulse">
            Synchronizing Nodes
          </h2>
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-2">Connecting to Command Center...</p>
        </div>
      </div>
    );
  }

  if (!isPreview && (isOnboarded || handoverStatus)) {
    return <EstablishedScreen />;
  }

  if (showDownloadScreen) {
    return (
      <div className="min-h-screen w-full bg-[#0a0519] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <PWAInstallPrompt onDismiss={() => {
          handleActivate();
        }} />
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-4xl">
          <div className="text-center space-y-12">
            <BrandedGlobe size="xl" glow={false} animate={true} className="mx-auto" />
            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic">Download the App to Finish</h2>
              <p className="text-primary font-black tracking-widest text-xs uppercase">Add "EmpireLaunch AI" to your Home Screen to unlock the Command Center</p>
            </div>
            <div className="max-w-sm mx-auto space-y-6">
              <button onClick={() => { handleActivate(); }} className="w-full py-5 bg-white text-slate-950 border-2 border-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-primary hover:border-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95">Already Installed / Skip</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isActivating) {
    return (
      <div className="min-h-screen w-full bg-[#0a0519] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-4xl text-center">
          {!showDiscoveryReview ? (
             <div className="space-y-12">
               <Stars className="w-20 h-20 text-primary animate-spin mx-auto" />
               <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic">Establishing Neural Sync.</h2>
               <p className="text-primary font-black tracking-widest text-xs uppercase">{discoveryLogs[discoveryLogIndex]}</p>
             </div>
          ) : (
            <DiscoveryReview onComplete={finalizeActivation} />
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-surface flex flex-col items-center overflow-x-hidden relative">
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} onAccept={handleAcceptTerms} />
      <div className="w-full max-w-md px-6 py-8 md:py-16 flex flex-col mx-auto flex-grow">
        {!isLoginMode && <ProgressConstellation currentStep={currentStep} totalSteps={steps.length} />}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    <Stars className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-theme-gradient tracking-tight uppercase italic">Neural Agreement.</h2>
                  <p className="text-muted-foreground text-xs md:text-sm font-medium italic">"To begin autonomous operations, you must first authorize the synchronization protocols."</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6 max-h-[400px] overflow-y-auto">
                   <section className="space-y-2">
                     <h3 className="text-white font-bold text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> 1. Protection</h3>
                     <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight">Your information is secured via AES-256-GCM encryption. We do not store raw banking credentials.</p>
                   </section>
                   <section className="space-y-2">
                     <h3 className="text-white font-bold text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 text-primary" /> 2. Security</h3>
                     <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight">Any fraudulent activity detected will result in immediate account suspension without refund.</p>
                   </section>
                </div>
                <button onClick={() => { acceptProtocols(); nextStep(); }} className="w-full bg-theme-gradient text-slate-900 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2 group border-none">Accept Protocols <CheckCircle2 className="w-4 h-4" /></button>
                <button onClick={() => { setIsLoginMode(true); setCurrentStep(3); }} className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors py-2">
                  Already have an account? Log In
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="text-center space-y-4">
                  <Stars className="w-16 h-16 text-primary mx-auto" />
                  <h2 className="text-2xl md:text-3xl font-black text-theme-gradient tracking-tight uppercase italic">Authorize Engine.</h2>
                  <p className="text-muted-foreground text-xs md:text-sm font-medium italic">"Authorize the operational license to activate the AI Core."</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Languages className="w-3 h-3 text-primary" /> Language</label>
                       <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-[10px] font-black uppercase text-white appearance-none outline-none">
                         <option value="en-US">English (US)</option>
                         <option value="es-ES">Español</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Coins className="w-3 h-3 text-primary" /> Currency</label>
                       <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-[10px] font-black uppercase text-white appearance-none outline-none">
                         <option value="USD">USD ($)</option>
                         <option value="EUR">EUR (€)</option>
                       </select>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-800 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-black text-white uppercase italic">{currentT('empirePlan')}</h3>
                      <div className="text-right">
                        <span className="text-2xl font-black text-white">{formatPrice(50, selectedLocale)}</span>
                        <span className="text-slate-500 font-black uppercase tracking-widest text-[8px] block">{currentT('perMonth')}</span>
                      </div>
                    </div>

                    {/* Language Selector */}
                    <div className="flex items-center justify-end gap-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-500">{currentT('languageLabel')}:</label>
                      <select
                        value={selectedLocale}
                        onChange={(e) => {
                          const newLocale = e.target.value as LocaleCode;
                          setSelectedLocale(newLocale);
                          setLocale(newLocale);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-[9px] font-bold uppercase text-white appearance-none outline-none"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                        <option value="pt">Português</option>
                        <option value="ja">日本語</option>
                        <option value="zh">中文</option>
                        <option value="ko">한국어</option>
                      </select>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800/50">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Shield className="w-3 h-3 text-primary" />
                          Access Key (Optional)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={accessKey}
                            onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                            placeholder="EMPIRE-XXXX-XXXX"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-[10px] font-black uppercase text-white outline-none focus:border-primary transition-all"
                          />
                          <button 
                            onClick={handleRedeemKey}
                            disabled={isRedeeming || !accessKey.trim()}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all disabled:opacity-50"
                          >
                            {isRedeeming ? "..." : "Apply"}
                          </button>
                        </div>
                        {redemptionError && (
                          <p className="text-[8px] font-black uppercase text-red-500 ml-1">{redemptionError}</p>
                        )}
                      </div>

                      <button onClick={handleSecurePayment} disabled={isPaying} className="w-full bg-theme-gradient text-slate-900 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-xl border-none">
                        <CreditCard className="w-5 h-5" />
                        {isPaying ? "Processing..." : currentT('securePayment')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <SignUpForm
                  initialMode={isLoginMode ? 'login' : 'signup'}
                  masterKey={accessKey.trim()}
                  onSuccess={async (uid) => {
                    setUserId(uid);
                    if (isLoginMode) {
                      window.location.href = '/dashboard';
                      return;
                    }
                    if (accessKey.trim()) {
                      try {
                        await fetch(`${API_URL}/api/auth/redeem-key`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ userId: uid, key: accessKey.trim() })
                        });
                        setIsPaid(true);
                      } catch (err) {
                        console.error('Failed to auto-redeem key');
                      }
                    }
                    nextStep(); 
                  }} 
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <EmpireIdentity data={data} updateData={updateData} />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <PlatformMatrix selectedPlatforms={data.platforms} />
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ConsultantToolkit businessAngle={data.angle} onToolkitComplete={() => { localStorage.setItem('onboarding_show_popup', 'true'); setShowDownloadScreen(true); }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center max-w-md mx-auto w-full gap-8">
          <button onClick={prevStep} disabled={currentStep === 1 || isActivating || isPaying || currentStep === steps.length} className={cn("flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-foreground transition-colors disabled:opacity-0")}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          {currentStep !== 2 && currentStep !== 3 && currentStep < steps.length && (
            <button onClick={nextStep} disabled={currentStep === 4 && (!data.platforms || data.platforms.length === 0)} className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-primary hover:text-slate-900 transition-all shadow-2xl group w-full md:w-auto justify-center disabled:opacity-30 disabled:cursor-not-allowed">
              Next Phase <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[200] bg-[#0a0519] flex items-center justify-center"><Stars className="w-8 h-8 text-primary animate-pulse" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
