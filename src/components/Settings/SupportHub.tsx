"use client";

import React from 'react';
import { HelpCircle, FileText, ChevronRight, X, Info, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RateApp } from './RateApp';

const faqContent: Record<string, string> = {
  "Understanding Pricing": "EmpireLaunch AI charges a flat $50/month subscription for full platform access. Additional brand expansion slots are $50/month each. No extra or hidden fees — you keep 100% of your revenue.",
  "How AI Content Creation Works": "Describe your business, niche, and goals in the Empire Identity card. Use the AI Studio to generate designs, videos, and content tailored to your brand. Review and approve everything on the Operations Page before anything goes live.",
  "Managing Your Account": "Brand identity can be changed once every 90 days. We understand that as a business grows some things change, but each slot is designed to manage one brand. If you change all your brand information, previous info will be erased. To add an additional brand, purchase an expansion slot for $50/month. Connected platforms are managed through the Link Center.",
  "Scaling with Expansion Slots": "Expansion slots allow you to run multiple brands from one account. Each slot gets its own brand workspace with separate analytics, style DNA, and AI configuration. Unlock additional slots for $50/month each."
};

export function SupportHub() {
  const [activeFAQ, setActiveFAQ] = React.useState<string | null>(null);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Rate the App */}
      <RateApp />

      {/* 2. Email Support */}
      <div className="p-8 rounded-[40px] bg-theme-surface border-2 border-theme space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-theme-background flex items-center justify-center text-primary">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tight">Email Support</h3>
            <p className="text-sm font-medium text-muted-foreground">Contact our team directly for help.</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-theme-background border-2 border-theme space-y-2">
          <span className="text-lg font-black text-foreground">Email support at: EmpireLaunchAI@gmail.com</span>
          <p className="text-xs font-medium text-muted-foreground">Response time is typically within 48 hours.</p>
        </div>
      </div>

      {/* 3. FAQ */}
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
