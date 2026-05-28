"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CheckCircle2, X, AlertCircle, Scale, Bot, ShoppingBag, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose?: () => void;
}

export function TermsModal({ isOpen, onAccept, onClose }: TermsModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-theme-surface rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-theme shrink-0 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16" />
               <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200">
                   <Scale className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-foreground tracking-tight">Neural Agreement.</h2>
                   <p className="text-xs font-black uppercase tracking-widest text-blue-600">Terms & Conditions v1.1</p>
                 </div>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3>1. Military-Grade Protection</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your payment and personal information are secured using <strong>Military-grade Envelope Encryption (AES-256-GCM)</strong>. 
                  EmpireLaunchAI operates under a "Zero-Knowledge" policy; we do not have access to your raw banking credentials or marketplace tokens. 
                  <strong>We will NEVER sell your personal, business, or empire-critical data to any third party.</strong>
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h3>2. Scam Detection & Account Suspension</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  EmpireLaunchAI reserves the absolute right to suspend or cancel any account that our AI intelligence systems detect as engaging in scamming, 
                  fraudulent activity, or unethical business practices. Suspension is at the sole discretion of the system's security protocols. 
                  <strong> In the event of suspension or cancellation due to detected fraudulent activity, NO REFUNDS will be issued.</strong>
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <Scale className="w-5 h-5 text-blue-600" />
                  <h3>3. Legal Waiver & Jury Trial</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  By accepting this agreement, you waive all rights to pursue legal action or sue EmpireLaunchAI or its creator for any reason. 
                  You explicitly waive the right to a trial by jury and agree to binding arbitration for any disputes arising from the use of this software.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <h3>4. AI Autonomy & Approval</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The AI will NEVER initiate a purchase, subscription, or financial commitment without your explicit, one-time approval. 
                  You maintain full authority over all empire-building actions.
                </p>
              </section>

              <div className="p-6 bg-theme-background rounded-3xl space-y-4 border border-theme">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="mt-1">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <div className={cn(
                      "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
                      agreed ? "bg-blue-600 border-blue-600" : "bg-theme-surface border-theme group-hover:border-blue-400"
                    )}>
                      {agreed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 leading-normal">
                    I agree to the terms, including the scam-detection protocols and the full legal waiver of rights to sue.
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-theme shrink-0 bg-theme-background/50 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 w-full">
                <button 
                  onClick={onClose}
                  className="flex-1 md:flex-none px-8 py-4 rounded-2xl border-2 border-theme font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-theme-surface transition-all"
                >
                  Decline
                </button>
                <button 
                  disabled={!agreed}
                  onClick={onAccept}
                  className={cn(
                    "flex-1 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl",
                    agreed 
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  )}
                >
                  Synchronize & Accept
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
