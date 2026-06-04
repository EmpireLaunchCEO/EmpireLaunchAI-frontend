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
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-slate-900 border border-amber-400/20 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 shrink-0 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
               <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-900/20">
                   <Scale className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-white tracking-tight">Neural Agreement.</h2>
                   <p className="text-xs font-black uppercase tracking-widest text-primary">Terms & Conditions v1.1</p>
                 </div>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3>1. Military-Grade Protection</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your payment and personal information are secured using <strong>Military-grade Envelope Encryption (AES-256-GCM)</strong>.
                  EmpireLaunchAI operates under a "Zero-Knowledge" policy; we do not have access to your raw banking credentials or marketplace tokens.
                  <strong>We will NEVER sell your personal, business, or empire-critical data to any third party.</strong>
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <h3>2. Scam Detection & Account Suspension</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  EmpireLaunchAI reserves the absolute right to suspend or cancel any account that our AI intelligence systems detect as engaging in scamming,
                  fraudulent activity, or unethical business practices. Suspension is at the sole discretion of the system's security protocols.
                  <strong> In the event of suspension or cancellation due to detected fraudulent activity, NO REFUNDS will be issued.</strong>
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Scale className="w-5 h-5 text-primary" />
                  <h3>3. Legal Waiver & Jury Trial</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  By accepting this agreement, you waive all rights to pursue legal action or sue EmpireLaunchAI or its creator for any reason.
                  You explicitly waive the right to a trial by jury and agree to binding arbitration for any disputes arising from the use of this software.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3>4. AI Autonomy & Approval</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The AI will NEVER initiate a transaction, subscription, or financial commitment without your explicit, one-time approval.
                  You maintain full authority over all empire-building actions.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 shrink-0 bg-slate-950/50 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 md:flex-none px-8 py-4 rounded-2xl border-2 border-white/10 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  Decline
                </button>
                <button
                  onClick={onAccept}
                  className="flex-1 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl bg-primary text-slate-900 hover:bg-white shadow-cyan-900/20"
                >
                  ACCEPT AND SYNCHRONIZE
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
