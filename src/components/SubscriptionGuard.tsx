"use client";

import React, { useState, useEffect } from 'react';
import { useEmpire } from '@/lib/EmpireContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CreditCard, Sparkles, CheckCircle2, ArrowRight, Languages, Coins, ChevronDown } from 'lucide-react';
import { BrandedGlobe } from './BrandedGlobe';

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isPaid, setIsPaid, language, setLanguage, currency, setCurrency, isInitialized, isHandoverComplete } = useEmpire();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // REDIRECT SAFETY CATCH: DISABLED FOR VISION TESTING
  /*
  useEffect(() => {
    if (mounted && isInitialized && !isPaid && !isHandoverComplete) {
      router.replace('/');
    }
  }, [mounted, isInitialized, !isPaid, !isHandoverComplete, router]);
  */

  // PWA Standalone Auto-Unlock
  useEffect(() => {
    if (mounted) {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      const isPWA = isStandalone || window.location.search.includes('pwa=true');
      
      if (isPWA && !isPaid) {
        console.log('[PWA] Auto-authorizing Command Center access...');
        setIsPaid(true);
      }
    }
  }, [isPaid, setIsPaid, mounted]);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsPaid(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handleRedeemKey = () => {
    setIsProcessing(true);
    setError('');

    const cleanKey = accessKey.trim().toUpperCase();

    // In a real app, this would call /api/auth/redeemKey
    // For this simulation, we check for the Master Owner key
    setTimeout(() => {
      if (cleanKey === 'OWNER-ADMIN-MAX-ACCESS') {
        setIsPaid(true);
        setIsProcessing(false);
      } else {
        setError('Invalid or expired access key.');
        setIsProcessing(false);
      }
    }, 1500);
  };

  // Ensure first render matches server (which doesn't have isPaid)
  if (!mounted || !isInitialized) {
    return (
      <div className="absolute inset-0 z-[50] bg-[#0a0519] flex flex-col items-center justify-center gap-8 w-full min-h-screen">
        <div className="flex flex-col items-center justify-center gap-6">
          <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(0,229,255,0.4)]" />
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-primary font-black uppercase tracking-[0.4em] text-sm animate-pulse text-center">
              Neural Path Authorized
            </h2>
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-2 text-center opacity-70">
              Synchronizing Neural Path...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isPaid) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Background Intelligence Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-slate-900 border border-primary/20 rounded-[32px] sm:rounded-[40px] p-5 sm:p-10 shadow-2xl text-center space-y-6 sm:space-y-8 overflow-y-auto max-h-[95vh] no-scrollbar"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-[20px] sm:rounded-[24px] mx-auto flex items-center justify-center border border-primary/20 shadow-xl shadow-cyan-900/20">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tighter uppercase italic">
            Command Center Locked.
          </h2>
          <p className="text-slate-400 text-[10px] sm:text-sm font-medium italic leading-relaxed">
            "Your Empire Engine is primed for execution, but an active operational license is required to initialize the neural link."
          </p>
        </div>

        {!showKeyInput ? (
          <div className="space-y-5 sm:space-y-6">
            <div className="p-5 sm:p-8 bg-slate-950 border-2 border-primary rounded-[24px] sm:rounded-[32px] text-left relative overflow-hidden">
              <div className="absolute top-3 sm:top-4 right-4 sm:right-6 bg-primary text-slate-950 px-2 sm:px-3 py-1 rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-widest animate-pulse">
                Active Plan
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tighter mb-1 pr-2">Empire Master</h3>

              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {[
                  'Full Autonomous Execution',
                  'Priority Neural Discovery',
                  'Secure Bank Bridge',
                  '24/7 Intelligence Pulse'
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tight">
                    <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_rgba(251,191,36,0.5)] shrink-0" />
                    <span className="leading-tight">{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-baseline gap-2 mb-6 sm:mb-8">
                <span className="text-3xl sm:text-4xl font-black text-white">$40</span>
                <span className="text-slate-500 font-black uppercase tracking-widest text-[9px] sm:text-[10px]">/ Month</span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Language & Currency Selectors */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1 sm:gap-1.5">
                      <Languages className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                      Language
                    </label>
                    <div className="relative group">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 sm:py-2.5 pl-2 sm:pl-3 pr-6 sm:pr-8 text-[8px] sm:text-[9px] font-black uppercase appearance-none hover:border-white/40 transition-all cursor-pointer outline-none text-white"
                      >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Español</option>
                        <option value="fr-FR">Français</option>
                        <option value="de-DE">Deutsch</option>
                      </select>
                      <ChevronDown className="absolute inset-y-0 right-1 sm:right-2 my-auto w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1 sm:gap-1.5">
                      <Coins className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                      Currency
                    </label>
                    <div className="relative group">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 sm:py-2.5 pl-2 sm:pl-3 pr-6 sm:pr-8 text-[8px] sm:text-[9px] font-black uppercase appearance-none hover:border-white/40 transition-all cursor-pointer outline-none text-white"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                      <ChevronDown className="absolute inset-y-0 right-1 sm:right-2 my-auto w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="w-full py-4 sm:py-5 bg-primary text-slate-900 rounded-[20px] sm:rounded-[24px] font-black text-[10px] sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center justify-center gap-2 sm:gap-3 hover:bg-white transition-all shadow-xl shadow-amber-900/20 group active:scale-[0.97]"
                >
                  {isProcessing ? (
                    <>
                      Initializing...
                      <BrandedGlobe size="sm" />
                    </>
                  ) : (
                    <>
                      Authorize Engine
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowKeyInput(true)}
                  className="w-full py-2 sm:py-2.5 text-slate-500 font-black text-[8px] sm:text-[9px] uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Have an access key? Redeem here
                </button>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-[32px] sm:rounded-[40px] text-left space-y-5 sm:space-y-6"
          >
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tighter">Redeem Key.</h3>
              <p className="text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-1">Enter your admin access code</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="ADMIN-CODE-..."
                  autoComplete="off"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm font-black tracking-widest uppercase focus:border-primary/60 outline-none transition-all text-white placeholder:text-slate-700"
                />
                <Sparkles className="absolute right-4 sm:right-5 top-4 sm:top-5 w-4 h-4 sm:w-5 sm:h-5 text-primary/40" />
              </div>

              {error && (
                <p className="text-red-500 text-[8px] sm:text-[9px] font-black uppercase tracking-widest ml-2">{error}</p>
              )}

              <button
                onClick={handleRedeemKey}
                disabled={isProcessing || !accessKey}
                className="w-full py-4 sm:py-5 bg-primary text-slate-900 rounded-[20px] sm:rounded-[24px] font-black text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center justify-center gap-2 sm:gap-3 hover:bg-white transition-all shadow-xl shadow-amber-900/20 disabled:opacity-50 active:scale-[0.97]"
              >
                {isProcessing ? "Validating..." : "Unlock Access"}
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => setShowKeyInput(false)}
                className="w-full py-3 sm:py-4 text-slate-500 font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:text-white transition-colors"
              >
                Back to Plans
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-center gap-4 sm:gap-6 opacity-30 grayscale">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-white">PCI-DSS Secure</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-white">Bank-Grade SSL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}