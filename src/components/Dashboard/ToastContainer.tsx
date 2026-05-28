"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap, X, ShieldCheck, CreditCard, Info, AlertCircle } from 'lucide-react';
import { useEmpire, Toast } from '@/lib/EmpireContext';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useEmpire();

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="pointer-events-auto"
          >
            <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: () => void }) {
  const icons = {
    sale: <CreditCard className="w-5 h-5 text-emerald-500" />,
    approval: <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20" />,
    system: <Info className="w-5 h-5 text-primary" />,
    success: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
  };

  const colors = {
    sale: "border-emerald-500/20 bg-emerald-50/90",
    approval: "border-amber-500/20 bg-amber-50/90",
    system: "border-primary/20 bg-primary/10/90",
    success: "border-emerald-500/20 bg-emerald-50/90",
    error: "border-red-500/20 bg-red-50/90",
  };

  // Special "Empire Gold" theme for Sales/Approvals if specified, but let's stick to consistent logic
  const isPremium = toast.type === 'sale' || toast.type === 'approval';

  return (
    <div className={cn(
      "p-4 rounded-2xl border-2 shadow-xl backdrop-blur-md flex items-start gap-4 relative overflow-hidden",
      isPremium ? "bg-slate-900 border-white/10 text-white" : cn(colors[toast.type], "text-foreground")
    )}>
      <div className={cn(
        "p-2 rounded-xl shrink-0",
        isPremium ? "bg-theme-surface/5" : "bg-theme-surface"
      )}>
        {icons[toast.type]}
      </div>
      
      <div className="flex-1 min-w-0 py-0.5">
        <h4 className={cn(
          "text-xs font-black uppercase tracking-widest",
          isPremium ? "text-amber-400" : "text-slate-400"
        )}>
          {toast.title}
        </h4>
        <p className={cn(
          "text-sm font-bold mt-1 leading-snug",
          isPremium ? "text-slate-100" : "text-slate-700"
        )}>
          {toast.message}
        </p>
      </div>

      <button 
        onClick={onRemove}
        className={cn(
          "p-1 rounded-lg transition-colors",
          isPremium ? "hover:bg-theme-surface/10 text-white/40" : "hover:bg-black/5 text-slate-400"
        )}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Decorative pulse for premium toasts */}
      {isPremium && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/5 rounded-full blur-2xl -mr-8 -mt-8" />
      )}
    </div>
  );
}
