"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight, MessageSquare, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';

const pageGuidance: Record<string, string[]> = {
  '/dashboard': [
    "Welcome back! I'm currently monitoring your 'Boho Luxe' niche.",
    "Our primary objective today is establishing the 'Platform Bridge'.",
    "Once you connect Etsy or TikTok, I can begin the Deep Research phase."
  ],
  '/settings': [
    "This is the command center for your integrations.",
    "Use the search bar at the top if you want to link a specific app.",
    "Once you launch a setup, I'll provide the exact URLs you need to paste into the platform's developer portal."
  ],
  '/review': [
    "This is your Approval Queue. Nothing goes live without your 'OK'.",
    "I'll post suggestions here as soon as our platform bridge is live.",
    "You can edit my drafts before they are published to your socials."
  ],
  '/analytics': [
    "Here we track our ROI and Viral Velocity.",
    "I'm waiting for data from your connected apps to generate our first report.",
    "Once synced, I'll show you exactly which products are making the most profit."
  ]
};

export function GlobalAIGuide() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const guidance = pageGuidance[pathname as keyof typeof pageGuidance] || [];

  useEffect(() => {
    if (guidance.length > 0) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const nextTip = () => {
    if (currentTip < guidance.length - 1) {
      setCurrentTip(currentTip + 1);
    } else {
      setIsVisible(false);
      setCurrentTip(0);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && guidance.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm w-full"
        >
          <div className="bg-white rounded-[32px] shadow-2xl border-2 border-blue-600 overflow-hidden">
            <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest">Empire Guide</span>
              </div>
              <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-slate-900 font-bold text-base leading-relaxed italic">
                    “{guidance[currentTip]}”
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {guidance.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all ${i === currentTip ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-100'}`} 
                    />
                  ))}
                </div>
                <button 
                  onClick={nextTip}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all group"
                >
                  {currentTip === guidance.length - 1 ? 'Got it' : 'Next Step'}
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setIsVisible(true);
            setCurrentTip(0);
          }}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 group"
        >
          <Sparkles className="w-6 h-6 fill-current group-hover:animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
