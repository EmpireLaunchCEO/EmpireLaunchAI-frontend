"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Stars, MessageSquareQuote, ShoppingBag, Zap as ZapIcon, Video, Camera, Globe, Share2, Mail } from 'lucide-react';
import wisdomData from '@/data/business_wisdom.json';

interface EmpireIdentityProps {
  data: {
    name: string;
    niche: string;
    angle: string;
    archetype: 'CREATOR' | 'CATALYST';
    platform?: string;
  };
  updateData: (updates: any) => void;
}

const platformOptions = [
  { id: 'tiktok', name: 'TikTok', icon: Video },
  { id: 'instagram', name: 'Instagram', icon: Camera },
  { id: 'youtube', name: 'YouTube', icon: Video },
  { id: 'facebook', name: 'Facebook', icon: Share2 },
  { id: 'pinterest', name: 'Pinterest', icon: Camera },
  { id: 'shopify', name: 'Shopify', icon: Globe },
  { id: 'etsy', name: 'Etsy', icon: ShoppingBag },
  { id: 'amazon', name: 'Amazon', icon: ShoppingBag },
  { id: 'fiverr', name: 'Fiverr', icon: ZapIcon },
  { id: 'gmail', name: 'Email (Gmail)', icon: Mail },
];

export function EmpireIdentity({ data, updateData }: EmpireIdentityProps) {
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    if (data.niche.length > 3) {
      // Simulate AI insight based on niche
      const timer = setTimeout(() => {
        const etsyFee = (wisdomData.platform_fees as any).Etsy.listing_fee;
        if (data.archetype === 'CREATOR') {
          setAiInsight(`I love that angle. Based on current trends, '${data.niche}' is seeing a 15% increase in Etsy searches this month. Plus, at just ${etsyFee} per listing, we can scale fast.`);
        } else {
          setAiInsight(`A Catalyst approach for '${data.niche}' is high-leverage. I'll focus on viral hooks and objection handling to maximize your Daily Pay conversions.`);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setAiInsight("");
    }
  }, [data.niche, data.archetype]);

  return (
    <div className="space-y-10 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-black text-theme-gradient tracking-tight uppercase italic">Define the Core.</h2>
        <p className="text-muted-foreground text-sm md:text-lg font-medium italic">"How will this Empire generate wealth?"</p>
      </div>

      {/* Archetype Selection */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => updateData({ archetype: 'CREATOR' })}
          className={cn(
            "p-5 rounded-3xl border-2 transition-all text-left flex flex-col gap-3 group relative overflow-hidden",
            data.archetype === 'CREATOR' 
              ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(0,229,255,0.2)]" 
              : "bg-slate-900 border-slate-800 hover:border-slate-700"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            data.archetype === 'CREATOR' ? "bg-primary text-slate-900" : "bg-slate-800 text-slate-400 group-hover:text-primary"
          )}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className={cn("font-black text-xs uppercase tracking-widest", data.archetype === 'CREATOR' ? "text-primary" : "text-slate-400")}>The Creator</h3>
            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 leading-tight">Product-Led. Etsy, Shopify, Prototyping.</p>
          </div>
        </button>

        <button
          onClick={() => updateData({ archetype: 'CATALYST' })}
          className={cn(
            "p-5 rounded-3xl border-2 transition-all text-left flex flex-col gap-3 group relative overflow-hidden",
            data.archetype === 'CATALYST' 
              ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(0,229,255,0.2)]" 
              : "bg-slate-900 border-slate-800 hover:border-slate-700"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            data.archetype === 'CATALYST' ? "bg-primary text-slate-900" : "bg-slate-800 text-slate-400 group-hover:text-primary"
          )}>
            <ZapIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={cn("font-black text-xs uppercase tracking-widest", data.archetype === 'CATALYST' ? "text-primary" : "text-slate-400")}>The Catalyst</h3>
            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 leading-tight">Link-Led. Daily Pay, Lead Gen, Viral Hooks.</p>
          </div>
        </button>
      </div>

      <div className="space-y-4 md:space-y-6 pt-4 border-t border-slate-800/50">
        <div className="space-y-2">
          <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">Empire Name</label>
          <input
            id="empire-name"
            type="text"
            placeholder={data.archetype === 'CREATOR' ? "e.g. Boho Luxe Prints" : "e.g. Daily Pay Mastery"}
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            className="w-full p-4 md:p-5 rounded-2xl md:rounded-3xl bg-slate-900 border-2 border-slate-800 focus:border-primary focus:bg-slate-950 outline-none transition-all text-lg md:text-xl font-bold text-white shadow-sm placeholder:text-slate-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">Niche</label>
          <input
            id="empire-niche"
            type="text"
            placeholder={data.archetype === 'CREATOR' ? "e.g. Digital Planners" : "e.g. Digital Marketing Education"}
            value={data.niche}
            onChange={(e) => updateData({ niche: e.target.value })}
            className="w-full p-4 md:p-5 rounded-2xl md:rounded-3xl bg-slate-900 border-2 border-slate-800 focus:border-primary focus:bg-slate-950 outline-none transition-all text-lg md:text-xl font-bold text-white shadow-sm placeholder:text-slate-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">Business Angle</label>
          <textarea
            id="empire-angle"
            placeholder={data.archetype === 'CREATOR' ? "What makes your brand unique?" : "What is the primary link or offer?"}
            rows={3}
            value={data.angle}
            onChange={(e) => updateData({ angle: e.target.value })}
            className="w-full p-4 md:p-5 rounded-2xl md:rounded-3xl bg-slate-900 border-2 border-slate-800 focus:border-primary focus:bg-slate-950 outline-none transition-all text-base md:text-lg font-medium text-white shadow-sm resize-none placeholder:text-slate-700"
          />
        </div>

        {/* Platform Selector */}
        <div className="space-y-2 pt-2">
          <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">What platform do you use?</label>
          <div className="grid grid-cols-2 gap-2">
            {platformOptions.map((p) => {
              const Icon = p.icon;
              const isSelected = data.platform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => updateData({ platform: p.id })}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left",
                    isSelected
                      ? "bg-primary/10 border-primary shadow-[0_0_10px_rgba(0,229,255,0.15)]"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                    isSelected ? "bg-primary text-slate-900" : "bg-slate-800 text-slate-400"
                  )}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tight",
                    isSelected ? "text-primary" : "text-slate-300"
                  )}>
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {aiInsight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex gap-3 items-start mt-6"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquareQuote className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[11px] font-medium text-slate-300 italic leading-relaxed">
              {aiInsight}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
