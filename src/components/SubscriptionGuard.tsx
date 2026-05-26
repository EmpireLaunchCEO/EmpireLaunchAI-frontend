"use client";

import React, { useState } from 'react';
import { useEmpire } from '@/lib/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CreditCard, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { isPaid, setIsPaid } = useEmpire();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsPaid(true);
      setIsProcessing(false);
    }, 2000);
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
        className="relative z-10 max-w-2xl w-full bg-white rounded-[48px] p-8 md:p-16 shadow-2xl text-center space-y-10"
      >
        <div className="space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-[28px] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/40">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            Command Center Locked.
          </h2>
          <p className="text-slate-500 font-medium italic">
            "Your Empire Engine is primed for execution, but an active operational license is required to initialize the neural link."
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-8 bg-blue-50 border-4 border-blue-600 rounded-[40px] text-left relative overflow-hidden">
            <div className="absolute top-6 right-8 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
              Active Plan
            </div>
            <h3 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter mb-2">Empire Master</h3>
            <p className="text-blue-700 text-sm font-bold mb-6">Full Autonomous Control • Unlimited Slots</p>
            
            <div className="space-y-3 mb-10">
              {[
                'Autonomous Business Engineering',
                'Zero-Key Neural Handshake',
                'Hyper-Scale Trend Discovery',
                'Direct Bank Bridge (Secure)'
              ].map(f => (
                <div key={f} className="flex items-center gap-3 text-xs font-bold text-blue-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  {f}
                </div>
              ))}
            </div>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-black text-blue-900">$30</span>
              <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">/ Month</span>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-6 bg-blue-600 text-white rounded-[24px] font-black text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-blue-200 group"
            >
              {isProcessing ? (
                <>
                  Initializing...
                  <Sparkles className="w-6 h-6 animate-spin" />
                </>
              ) : (
                <>
                  Authorize Engine
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

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
