"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, TrendingUp, X, CheckCircle2, DollarSign, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandedGlobe } from '@/components/BrandedGlobe';

interface AutoPilotAgreementGateProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AutoPilotAgreementGate({ isOpen, onClose, onConfirm }: AutoPilotAgreementGateProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/30 rounded-[48px] shadow-[0_0_100px_rgba(245,158,11,0.1)] overflow-hidden text-white"
        >
          {/* Header */}
          <div className="h-40 bg-gradient-to-br from-amber-500/20 to-orange-600/20 relative flex items-center justify-center overflow-hidden border-b border-amber-500/10">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             <div className="relative z-10 flex flex-col items-center gap-4">
                <BrandedGlobe size="lg" animate={true} />
                <div className="px-4 py-1 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                   Agreement Required
                </div>
             </div>
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500 blur-[80px] opacity-20" />
          </div>

          <div className="p-8 md:p-12 space-y-10">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase text-white leading-none">
                Enable Auto-Pilot Mode?
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Autonomous Growth & Revenue Protocol</p>
            </div>

            <div className="space-y-6">
               <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/20 space-y-4">
                  <div className="flex items-center gap-3 text-amber-500">
                     <DollarSign className="w-6 h-6" />
                     <h4 className="font-black uppercase tracking-widest text-sm">Revenue Tracking Agreement</h4>
                  </div>
                  <p className="text-sm md:text-base text-slate-200 font-medium italic leading-relaxed">
                    "I agree that in Auto-Pilot mode, any product or post that generates income is subject to a <span className="text-amber-500 font-black">$40 Success-Share for every $1,000</span> in traced earnings."
                  </p>
               </div>

               <div className="flex items-start gap-4 p-6 bg-slate-950/50 rounded-3xl border border-white/5">
                  <AlertTriangle className="w-5 h-5 text-slate-500 shrink-0 mt-1" />
                  <div className="space-y-2">
                     <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Autonomous Execution</h5>
                     <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        By confirming, you authorize me to post marketing content, update prices, and sync inventory autonomously. I will monitor your linked bank and shop activity to calculate growth.
                     </p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
              <button
                onClick={onConfirm}
                className="w-full py-6 bg-amber-500 text-slate-950 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-amber-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Zap className="w-5 h-5 fill-current" />
                I Agree. Start
              </button>
              <button
                onClick={onClose}
                className="w-full py-6 bg-slate-800 text-slate-400 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-700 transition-all"
              >
                Not Yet
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/5 opacity-50">
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Empire Protocol v3.1 (Secured)
               </div>
               <p className="text-[8px] text-center text-slate-600 max-w-xs font-bold uppercase tracking-tighter">
                  Earnings are traced via linked API keys and Bank Statement Correlation.
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
