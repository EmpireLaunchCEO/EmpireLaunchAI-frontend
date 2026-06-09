"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical,
  MoreHorizontal,
  Share,
  SquareArrowUp,
  Plus,
  Smartphone,
  X,
  Download,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandedGlobe } from '@/components/BrandedGlobe';

interface PWAInstallPromptProps {
  onDismiss?: () => void;
}

export function PWAInstallPrompt({ onDismiss }: PWAInstallPromptProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode
    const isStandalone = typeof window !== 'undefined' && (
      window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone
      || document.referrer.includes('android-app://')
    );

    // Check if user has already dismissed the prompt
    const hasSeenPrompt = typeof window !== 'undefined' && localStorage.getItem('empire_pwa_prompt_seen');

    if (!isStandalone && !hasSeenPrompt) {
      // Delay showing the prompt slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isStandalone || hasSeenPrompt) {
      // If already standalone or seen, we can still call onDismiss to let the parent know we are "done" with the prompt
      onDismiss?.();
    }
  }, [onDismiss]);

  const dismissPrompt = () => {
    setIsVisible(false);
    localStorage.setItem('empire_pwa_prompt_seen', 'true');
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="relative p-6 sm:p-8">
              <button
                onClick={dismissPrompt}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl overflow-hidden p-1">
                    <BrandedGlobe size="xl" glow={false} animate={true} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary text-slate-950 p-2 rounded-full shadow-lg z-20">
                    <Download className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">
                    Install EmpireLaunch AI
                  </h3>
                  <p className="text-slate-400 font-medium text-sm">
                    Add EmpireLaunch AI to your home screen for the full high-intelligence experience.
                  </p>
                </div>

                <div className="w-full space-y-3 bg-slate-950/50 p-6 rounded-3xl border border-slate-800 text-left">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-700">
                      1
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-slate-200 text-[10px] font-black uppercase tracking-widest">Click the 3 dots on the internet page</span>
                      <div className="flex items-center gap-1">
                        <MoreVertical className="w-4 h-4 text-primary" />
                        <span className="text-slate-600 text-[8px]">/</span>
                        <MoreHorizontal className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t border-slate-800/50 pt-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-700">
                      2
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-slate-200 text-[10px] font-black uppercase tracking-widest">Click the share button</span>
                      <SquareArrowUp className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t border-slate-800/50 pt-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-700">
                      3
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-slate-200 text-[10px] font-black uppercase tracking-widest">Click the more button</span>
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t border-slate-800/50 pt-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-700">
                      4
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-slate-200 text-[10px] font-black uppercase tracking-widest">Click add to home screen</span>
                      <Smartphone className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={dismissPrompt}
                  className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-white/10 active:scale-95"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
