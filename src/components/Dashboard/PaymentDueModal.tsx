"use client";

import React, { useState } from 'react';
import { AlertCircle, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentDueModalProps {
  onProcessPayment: (name: string) => void;
  processing: boolean;
}

export function PaymentDueModal({ onProcessPayment, processing }: PaymentDueModalProps) {
  const [clientName, setClientName] = useState('');
  // Owner directive: full name (first + last) is required before payment.
  const hasValidFullName = clientName.trim().split(/\s+/).length >= 2;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-md w-full mx-4 bg-theme-surface border-2 border-red-500/20 rounded-[40px] p-10 text-center space-y-6 shadow-2xl"
      >
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
            Payment Past Due
          </h2>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Your monthly payment of $50.00 didn&apos;t go through. Please update your payment method to continue using EmpireLaunch AI.
          </p>
        </div>

        <div className="w-full space-y-3 text-left">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Full Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="FIRST LAST"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold placeholder:text-slate-700 focus:border-primary/60 transition-all outline-none text-white"
            />
            {!hasValidFullName && clientName.trim().length > 0 && (
              <p className="text-[9px] font-black uppercase text-red-500 px-1 mt-1">Enter your first AND last name to continue</p>
            )}
          </div>
        </div>

        <button
          onClick={() => onProcessPayment(clientName)}
          disabled={processing || !hasValidFullName}
          className="w-full py-4 bg-gradient-to-r from-red-500 to-amber-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          {processing ? 'Redirecting to Stripe...' : 'Process Payment — $50'}
        </button>

        <p className="text-[9px] text-muted-foreground/50 font-medium">
          Secure checkout powered by Stripe. Your account will be restored immediately after payment.
        </p>
      </motion.div>
    </motion.div>
  );
}