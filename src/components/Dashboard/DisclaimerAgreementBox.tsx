"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Stars, Zap, ChevronRight, CheckCircle2, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';

export function DisclaimerAgreementBox() {
  const { isProtocolAccepted, acceptProtocols } = useEmpire();
  const [isProcessing, setIsProcessing] = useState(false);

  if (isProtocolAccepted) return null;

  const handleAccept = () => {
    setIsProcessing(true);
    // Simulate neural sync for effect
    setTimeout(() => {
      acceptProtocols();
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto mb-12"
    >
      <div className="relative p-8 md:p-12 bg-slate-900 border-2 border-primary/30 rounded-[48px] overflow-hidden shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] -ml-32 -mb-32 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center">
          {/* Visual Icon */}
          <div className="shrink-0 flex flex-col items-center gap-4">
             <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center border border-primary/20 shadow-inner">
                <ShieldCheck className="w-12 h-12 text-primary" />
             </div>
             <div className="px-3 py-1 bg-primary text-slate-950 rounded-full text-[9px] font-black uppercase tracking-widest">
                Partner Protocol
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 text-left">
            <div className="space-y-2">
               <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">Disclaimer Agreement.</h2>
               <div className="flex items-center gap-2 text-primary">
                  <Stars className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Growth Commitment</span>
               </div>
            </div>

            <div className="space-y-4 max-w-2xl">
               <p className="text-lg text-slate-200 font-medium italic leading-relaxed">
                 "We wanted to make the Empire AI accessible to everyone from day one. To keep it affordable upfront, we decided to handle our partnership through a <span className="text-primary font-bold">Success-Share model</span> on the backend."
               </p>
               <p className="text-sm text-slate-400 leading-relaxed font-medium">
                 Instead of high monthly fees, we only succeed when you do. A simple <span className="text-white font-bold">$40 Success-Share</span> is applied for every <span className="text-white font-bold">$1,000</span> you earn solely from the videos, posts, and designs created through this app. Additionally, if you choose Auto-Pilot, you authorize the Empire AI to sync with your existing store and social accounts to create and deploy content on your behalf, acting as your autonomous growth agent to ensure 24/7 expansion and accurate sales tracking for AI-optimized products.
               </p>
               <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">
                 Action: Click "I Accept These Terms" to continue. (Once accepted, this agreement is stored in your Settings under Subscriptions for your reference.)
               </p>
            </div>
          </div>

          {/* Action */}
          <div className="shrink-0 w-full md:w-auto">
             <button
               onClick={handleAccept}
               disabled={isProcessing}
               className={cn(
                 "group relative w-full md:w-64 py-8 bg-primary text-slate-950 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale disabled:opacity-50",
                 isProcessing && "animate-pulse"
               )}
             >
               <div className="relative z-10 flex items-center justify-center gap-3">
                 {isProcessing ? "Syncing..." : "I Accept These Terms"}
                 {!isProcessing && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
               </div>
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-25deg]" />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
