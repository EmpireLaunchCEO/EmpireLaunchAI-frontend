"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Info, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import wisdomData from '@/data/business_wisdom.json';

// Mapping from our platform IDs to wisdomData keys
const platformToWisdomKey: Record<string, string> = {
  'tiktok': 'TikTok Shop',
  'etsy': 'Etsy',
  'shopify': 'Shopify',
  'amazon': 'Amazon Seller Central'
};

const getWisdomForPlatform = (platformId: string) => {
  const key = platformToWisdomKey[platformId];
  if (!key) return null;

  // Use type assertions to navigate the JSON safely
  const checklists = (wisdomData as any).onboarding_checklists;
  const fees = (wisdomData as any).platform_fees;
  
  const checklist = checklists[key] || [];
  const platformFees = fees[key];
  
  let tip = "I'll guide you through every step of this platform's setup.";
  
  // Extract specific strings directly from the JSON data to ensure single source of truth
  if (platformFees) {
    if (key === 'Etsy') {
      tip = `Listing fees are ${platformFees.listing_fee}. Transaction fees are ${platformFees.transaction_fee}. I'll help you optimize your first 10 for maximum traction.`;
    } else if (key === 'TikTok Shop') {
      const promo = platformFees.new_seller_promotion;
      tip = `New sellers get a promotional ${promo} referral fee. Let's scale fast during this window.`;
    } else if (key === 'Amazon Seller Central') {
      const prof = platformFees.subscription_plans.Professional;
      const ind = platformFees.subscription_plans.Individual;
      tip = `The Professional plan is ${prof}, but the Individual plan is only ${ind}. I recommend starting with Individual until we hit 40 sales/month.`;
    } else if (key === 'Shopify') {
      const basic = platformFees.monthly_plans.Basic;
      tip = `Starting with the 'Basic' plan (${basic}) is enough for most new Empires. I recommend using Shopify Payments.`;
    }
  }

  return {
    name: key,
    checklist,
    tips: [tip]
  };
};

interface AIConsultantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  platformId: string | null;
}

export function AIConsultantOverlay({ isOpen, onClose, platformId }: AIConsultantOverlayProps) {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const data = platformId ? getWisdomForPlatform(platformId) : null;

  useEffect(() => {
    if (isOpen) setCheckedItems([]);
  }, [isOpen, platformId]);

  const toggleItem = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(i => i !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-[101] overflow-y-auto"
          >
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">AI Consultant</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform Strategy</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-[32px] bg-slate-900 text-white relative overflow-hidden">
                  <div className="relative z-10 space-y-2">
                    <h4 className="text-2xl font-bold italic">“Let's build your {data.name} presence.”</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      I've mapped out the exact requirements to get you approved and selling in record time.
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600 rounded-full blur-[40px] opacity-30" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-black uppercase tracking-widest text-slate-900">Required Checklist</h5>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {checkedItems.length} / {data.checklist.length} Ready
                  </span>
                </div>
                <div className="space-y-3">
                  {data.checklist.map((item: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => toggleItem(i)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 group",
                        checkedItems.includes(i) 
                          ? "border-blue-600 bg-blue-50/30" 
                          : "border-slate-100 bg-white hover:border-slate-200"
                      )}
                    >
                      {checkedItems.includes(i) ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5 group-hover:text-blue-400" />
                      )}
                      <span className={cn(
                        "font-bold text-sm leading-tight transition-colors",
                        checkedItems.includes(i) ? "text-slate-900" : "text-slate-500"
                      )}>
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h5 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 fill-current" />
                  Platform Wisdom
                </h5>
                <div className="space-y-4">
                  {data.tips.map((tip: string, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                      <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center justify-between">
                  Research Progress
                  <span className="text-blue-600">75%</span>
                </h5>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-50 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-200"
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center italic">
                  AI is analyzing {data.name} entry barriers...
                </p>
              </div>

              <div className="pt-8">
                <button className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group">
                  Start Application
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure External Connection
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
