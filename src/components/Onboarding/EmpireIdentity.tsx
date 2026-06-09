"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stars, MessageSquareQuote } from 'lucide-react';
import wisdomData from '@/data/business_wisdom.json';

interface EmpireIdentityProps {
  data: {
    name: string;
    niche: string;
    angle: string;
  };
  updateData: (updates: any) => void;
}

export function EmpireIdentity({ data, updateData }: EmpireIdentityProps) {
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    if (data.niche.length > 3) {
      // Simulate AI insight based on niche
      const timer = setTimeout(() => {
        const etsyFee = (wisdomData.platform_fees as any).Etsy.listing_fee;
        setAiInsight(`I love that angle. Based on current trends, '${data.niche}' is seeing a 15% increase in Etsy searches this month. Plus, at just ${etsyFee} per listing, we can scale fast.`);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setAiInsight("");
    }
  }, [data.niche]);

  return (
    <div className="space-y-10 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-black text-theme-gradient tracking-tight uppercase italic">Name your Empire.</h2>
        <p className="text-muted-foreground text-sm md:text-lg font-medium italic">"Define the soul of your business. This is how the market will perceive your intelligence."</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">Empire Name</label>
          <input
            id="empire-name"
            type="text"
            placeholder="e.g. Boho Luxe Prints"
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
            placeholder="e.g. Digital Planners"
            value={data.niche}
            onChange={(e) => updateData({ niche: e.target.value })}
            className="w-full p-4 md:p-5 rounded-2xl md:rounded-3xl bg-slate-900 border-2 border-slate-800 focus:border-primary focus:bg-slate-950 outline-none transition-all text-lg md:text-xl font-bold text-white shadow-sm placeholder:text-slate-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">Business Angle</label>
          <textarea
            id="empire-angle"
            placeholder="What makes your brand unique?"
            rows={3}
            value={data.angle}
            onChange={(e) => updateData({ angle: e.target.value })}
            className="w-full p-4 md:p-5 rounded-2xl md:rounded-3xl bg-slate-900 border-2 border-slate-800 focus:border-primary focus:bg-slate-950 outline-none transition-all text-base md:text-lg font-medium text-white shadow-sm resize-none placeholder:text-slate-700"
          />
        </div>
      </div>

    </div>
  );
}
