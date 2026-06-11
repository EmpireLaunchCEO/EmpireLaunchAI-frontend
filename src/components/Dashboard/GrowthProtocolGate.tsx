"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, TrendingUp, X, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandedGlobe } from '@/components/BrandedGlobe';

interface GrowthProtocolGateProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
  productName: string;
  platform?: string;
}

export function GrowthProtocolGate({ isOpen, onClose, onActivate, productName, platform }: GrowthProtocolGateProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-theme-surface border-2 border-theme rounded-[48px] shadow-2xl overflow-hidden"
        >
          {/* Header Image/Pattern */}
          <div className="h-32 bg-gradient-to-br from-primary/20 to-blue-600/20 relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             <BrandedGlobe size="lg" animate={true} className="z-10" />
             <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary blur-3xl opacity-20" />
          </div>

          <div className="p-8 md:p-12 space-y-8">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                <Zap className="w-3 h-3 fill-current" />
                Neural Handshake Required
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight italic uppercase">
                Activate Growth Protocol?
              </h2>
            </div>

            <div className="bg-theme-background/50 border border-theme rounded-[32px] p-6 space-y-4 text-center">
              <p className="text-sm md:text-base text-slate-300 font-medium italic leading-relaxed">
                "By activating this protocol, all revenue for this product will be subject to a <span className="text-primary font-bold">4% Success-Share</span>."
              </p>
              <div className="flex items-center gap-3 px-4 py-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 text-left">
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-tight">
                  I will automatically track sales and reach while our Link Center remains active. You keep 96% of the revenue; 4% is calculated as our Success-Share.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={onActivate}
                className="w-full py-5 bg-primary text-slate-950 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Yes, Start Scaling
              </button>
              <button
                onClick={onClose}
                className="w-full py-5 bg-theme-background border border-theme text-slate-400 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-theme-surface transition-all"
              >
                Not Yet
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-50">
              <ShieldCheck className="w-3 h-3" />
              Sovereign Partnership Agreement v1.0
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
