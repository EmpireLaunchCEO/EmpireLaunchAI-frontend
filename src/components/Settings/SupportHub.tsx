"use client";

import React from 'react';
import { HelpCircle, FileText, ChevronRight, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RateApp } from './RateApp';

const faqContent: Record<string, string> = {
  "Understanding Pricing": "EmpireLaunch AI charges a flat $50/month subscription for full platform access. Additional brand expansion slots are $50 one-time each. There are no hidden fees or success-share charges — you keep 100% of your revenue.",
  "How AI Content Creation Works": "Describe your business, niche, and goals in the Empire Identity card. Our AI pipeline automatically generates designs, videos, and content tailored to your brand. You review and approve everything in the Neural Dispatch Center before anything goes live.",
  "Managing Your Account": "Your empire identity, brand details, and business goals can be edited anytime from the dashboard. All changes save instantly and are encrypted at rest with AES-256-GCM encryption. Connected platforms are managed through the Link Center.",
  "Scaling with Expansion Slots": "Expansion slots allow you to run multiple brands from one account. Each slot gets its own brand workspace with separate analytics, style DNA, and AI configuration. Unlock additional slots for $50 each."
};

export function SupportHub() {
  const [activeFAQ, setActiveFAQ] = React.useState<string | null>(null);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Rate the App */}
      <RateApp />

      {/* 2. FAQ */}
      <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-theme-background flex items-center justify-center text-primary">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tight">FAQ & Documents</h3>
            <p className="text-sm font-medium text-muted-foreground">Master the Empire Engine.</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            "Understanding Pricing",
            "How AI Content Creation Works",
            "Managing Your Account",
            "Scaling with Expansion Slots"
          ].map((item) => (
            <button 
              key={item} 
              onClick={() => setActiveFAQ(item)}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-theme-background border-2 border-theme hover:border-primary/20 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                <span className="text-sm font-bold text-foreground/80 group-hover:text-primary">{item}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-primary/30 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        <AnimatePresence>
          {activeFAQ && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setActiveFAQ(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-theme-surface border-4 border-theme p-8 rounded-[40px] shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setActiveFAQ(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white/40" />
                </button>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Info className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-black text-foreground italic uppercase tracking-tight">{activeFAQ}</h4>
                  </div>
                  
                  <p className="text-base font-medium text-muted-foreground leading-relaxed">
                    {faqContent[activeFAQ]}
                  </p>

                  <button 
                    onClick={() => setActiveFAQ(null)}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all"
                  >
                    Understood
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors">
          View Knowledge Base
        </button>
      </div>
    </div>
  );
}
