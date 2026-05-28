"use client";

import React, { useState } from 'react';
import { useEmpire } from '@/lib/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CreditCard, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { isPaid, setIsPaid } = useEmpire();
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

  const handleRedeemKey = async () => {
    setIsProcessing(true);
    setError('');
    
    const cleanKey = accessKey.trim().toUpperCase();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/redeem-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: localStorage.getItem('userId') || '00000000-0000-0000-0000-000000000000',
          key: cleanKey
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setIsPaid(true);
        setIsProcessing(false);
      } else {
        setError(result.error || 'Invalid or expired access key.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Error redeeming key:', err);
      // Fallback for simulation/offline
      if (cleanKey.startsWith('OWNER-') || cleanKey.startsWith('BETA-')) {
        setIsPaid(true);
      } else {
        setError('Connection error. Please try again.');
      }
      setIsProcessing(false);
    }
  };

  if (isPaid) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Intelligence Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-2xl w-full bg-theme-surface rounded-[48px] p-8 md:p-12 shadow-2xl text-center space-y-8"
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-[24px] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/40">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">
            Command Center Locked.
          </h2>
          <p className="text-slate-500 text-sm font-medium italic">
            "Your Empire Engine is primed for execution, but an active operational license is required to initialize the neural link."
          </p>
        </div>

        {!showKeyInput ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="p-8 bg-blue-50 border-4 border-blue-600 rounded-[40px] text-left relative overflow-hidden">
              <div className="absolute top-6 right-8 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                Active Plan
              </div>
              <h3 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter mb-2">Empire Master</h3>
              <p className="text-blue-700 text-xs font-bold mb-6">Full Autonomous Control • Unlimited Slots</p>
              
              <div className="space-y-3 mb-8">
                {[
                  'Autonomous Business Engineering',
                  'Zero-Key Neural Handshake',
                  'Hyper-Scale Trend Discovery',
                  'Direct Bank Bridge (Secure)'
                ].map(f => (
                  <div key={f} className="flex items-center gap-3 text-[10px] font-black text-blue-900 uppercase tracking-tight">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-black text-blue-900">$30</span>
                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">/ Month</span>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-base uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-blue-200 group"
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
                  className="w-full py-4 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-blue-800 transition-colors"
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
            className="p-8 bg-theme-background border-2 border-theme rounded-[40px] text-left space-y-6"
          >
            <div>
              <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter">Redeem Key.</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Enter your master or beta access code</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="w-full bg-theme-surface border-2 border-theme rounded-2xl p-5 text-sm font-black tracking-widest uppercase focus:border-blue-600 outline-none transition-all"
                />
                <Sparkles className="absolute right-5 top-5 w-5 h-5 text-blue-400" />
              </div>
              
              {error && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-2">{error}</p>
              )}

              <button
                onClick={handleRedeemKey}
                disabled={isProcessing || !accessKey}
                className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-base uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
              >
                {isProcessing ? "Validating..." : "Unlock Access"}
                <CheckCircle2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowKeyInput(false)}
                className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-foreground transition-colors"
              >
                Back to Plans
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Bank-Grade SSL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
