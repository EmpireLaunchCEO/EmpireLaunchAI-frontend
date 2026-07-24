"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';
import { EXPANSION_SLOT_LINK } from '@/lib/payment-links';

interface LockedSlotViewProps {
  slotIndex: number;
}

export function LockedSlotView({ slotIndex }: LockedSlotViewProps) {
  const { unlockSlot, activeEmpireId } = useEmpire();
  const [isPaying, setIsPaying] = useState(false);
  const [accessKey, setAccessKey] = useState('');

  const handleSecurePayment = () => {
    localStorage.setItem('pending_payment', 'true');
    window.location.href = EXPANSION_SLOT_LINK;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-12 relative overflow-hidden pt-12">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-xl"
      >
        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-foreground">
          Expand Your Empire.
        </h2>
        <p className="text-muted-foreground font-medium italic text-lg px-4">
          Initialize a new operational node in slot #{slotIndex + 1}. Run multiple businesses autonomously from one command center.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md bg-theme-surface border-2 border-theme rounded-[48px] p-8 md:p-10 shadow-2xl space-y-8"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">Slot Activation</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Priority Link Center</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-foreground">$40</span>
              <span className="text-slate-500 font-black uppercase tracking-widest text-[8px] block">One-Time Activation</span>
            </div>
          </div>

          <button
            onClick={handleSecurePayment}
            disabled={isPaying}
            className="w-full bg-primary text-slate-950 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-3 group shadow-xl active:scale-95"
          >
            <CreditCard className="w-5 h-5" />
            {isPaying ? "Processing Link Center..." : "Pay with Credit Card"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-theme"></div>
            </div>
            <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest">
              <span className="bg-theme-surface px-3 text-slate-500 font-bold italic">or use access key</span>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="ENTER SLOT KEY"
              className="w-full bg-theme-background border border-theme rounded-xl py-4 px-5 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 focus:border-primary/60 transition-all outline-none text-foreground text-center"
            />
            {accessKey.trim() && (
              <button
                onClick={async () => {
                   if (accessKey.toUpperCase() === 'UNLOCK-EMPIRE-SLOT') {
                      unlockSlot(slotIndex);
                   } else {
                      handleSecurePayment();
                   }
                }}
                className="w-full py-3 bg-theme-background text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest border border-theme hover:bg-theme-surface transition-all"
              >
                Redeem Key
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 p-5 bg-theme-background/50 rounded-3xl border border-theme">
             {[
               'Unique Style DNA',
               'Separate Analytics',
               'Multi-Store Logic',
               'Independent AI'
             ].map(f => (
               <div key={f} className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)] shrink-0" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                   {f}
                 </span>
               </div>
             ))}
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-4 opacity-50">
         <ShieldCheck className="w-4 h-4 text-primary" />
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure AES-256 Activation Gateway</span>
      </div>
    </div>
  );
}
