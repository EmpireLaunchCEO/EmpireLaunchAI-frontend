"use client";

import React, { useState } from 'react';
import { useEmpire } from '@/lib/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CreditCard, Sparkles, CheckCircle2, ArrowRight, Languages, Coins, ChevronDown } from 'lucide-react';

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { isPaid, setIsPaid, language, setLanguage, currency, setCurrency } = useEmpire();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');

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

  if (isPaid) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Intelligence Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-slate-900 border border-primary/20 rounded-[40px] p-6 sm:p-10 shadow-2xl text-center space-y-8 overflow-y-auto max-h-[90vh] no-scrollbar"
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-[24px] mx-auto flex items-center justify-center border border-primary/20 shadow-xl shadow-amber-900/20">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase italic">
            Command Center Locked.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium italic">
            "Your Empire Engine is primed for execution, but an active operational license is required to initialize the neural link."
          </p>
        </div>

        {!showKeyInput ? (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 bg-slate-950 border-2 border-primary rounded-[32px] text-left relative overflow-hidden">
              <div className="absolute top-4 right-6 bg-primary text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                Active Plan
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">Empire Master</h3>
              {/* License text removed per owner request */}

              <div className="space-y-3 mb-8">
                {[
                  'Full Autonomous Execution',
                  'Priority Neural Discovery',
                  'Secure Bank Bridge',
                  '24/7 Intelligence Pulse'
                ].map(f => (
                  <div key={f} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                    <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-black text-white">$40</span>
                <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">/ Month</span>
              </div>

              <div className="space-y-4">
                {/* Language & Currency Selectors */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                      <Languages className="w-3 h-3 text-primary" />
                      Language
                    </label>
                    <div className="relative group">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-3 pr-8 text-[9px] font-black uppercase appearance-none hover:border-primary/40 transition-all cursor-pointer outline-none text-white"
                      >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Español</option>
                        <option value="fr-FR">Français</option>
                        <option value="de-DE">Deutsch</option>
                      </select>
                      <ChevronDown className="absolute inset-y-0 right-2 my-auto w-3 h-3 text-slate-600 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                      <Coins className="w-3 h-3 text-primary" />
                      Currency
                    </label>
                    <div className="relative group">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-3 pr-8 text-[9px] font-black uppercase appearance-none hover:border-primary/40 transition-all cursor-pointer outline-none text-white"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                      <ChevronDown className="absolute inset-y-0 right-2 my-auto w-3 h-3 text-slate-600 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="w-full py-5 bg-primary text-slate-900 rounded-[24px] font-black text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-amber-900/20 group"
                >
                  {isProcessing ? (
                    <>
                      Initializing...
                      <Sparkles className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      Authorize Engine
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowKeyInput(true)}
                  className="w-full py-2 text-slate-500 font-black text-[9px] uppercase tracking-widest hover:text-primary transition-colors"
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
            className="p-8 bg-slate-950 border border-slate-800 rounded-[40px] text-left space-y-6"
          >
            <div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Redeem Key.</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Enter your admin access code</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="OWNER-ADMIN-..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-sm font-black tracking-widest uppercase focus:border-primary/60 outline-none transition-all text-white placeholder:text-slate-700"
                />
                <Sparkles className="absolute right-5 top-5 w-5 h-5 text-primary/40" />
              </div>

              {error && (
                <p className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-2">{error}</p>
              )}

              <button
                onClick={handleRedeemKey}
                disabled={isProcessing || !accessKey}
                className="w-full py-5 bg-primary text-slate-900 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-amber-900/20 disabled:opacity-50"
              >
                {isProcessing ? "Validating..." : "Unlock Access"}
                <CheckCircle2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowKeyInput(false)}
                className="w-full py-4 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
              >
                Back to Plans
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-center gap-6 opacity-30 grayscale">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white">PCI-DSS Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-white" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Bank-Grade SSL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
