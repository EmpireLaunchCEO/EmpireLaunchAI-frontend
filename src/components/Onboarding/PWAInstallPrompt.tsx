"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Share, 
  Plus, 
  PlusSquare, 
  X,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

interface PWAInstallPromptProps {
  onDismiss?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Logic to show prompt only if not in standalone and not dismissed
    const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
    const isDismissed = typeof localStorage !== 'undefined' && localStorage.getItem('pwa_prompt_dismissed') === 'true';

    if (!isStandalone && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    if (onDismiss) onDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl border-4 border-amber-400"
          >
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                    <Smartphone className="w-8 h-8 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic leading-none">Install App</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Native Operational Sync</p>
                  </div>
                </div>
                <button 
                  onClick={handleDismiss}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-300" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-sm font-bold text-slate-500 italic leading-relaxed">
                  "To access full autonomous capabilities and real-time push notifications, install EmpireLaunch to your home screen."
                </p>

                <div className="grid gap-3">
                  {[
                    { text: "Click the 3 dots on the internet page", icon: <MoreVertical className="w-4 h-4" /> },
                    { text: "Click the share button", icon: <Share className="w-4 h-4" /> },
                    { text: "Click the more button", icon: <Plus className="w-4 h-4" /> },
                    { text: "Click add to home screen", icon: <PlusSquare className="w-4 h-4" /> },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-[24px] border-2 border-slate-100 group hover:border-amber-200 transition-colors">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        {step.icon}
                      </div>
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-500 hover:text-slate-900 transition-all shadow-xl shadow-slate-200"
              >
                I Understand
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
