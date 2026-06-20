"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stars, TrendingUp, Search, Zap, ArrowRight, Lightbulb, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightProps {
  type: 'trend' | 'research' | 'suggestion';
  title: string;
  description: string;
  impact: string;
  color: string;
}

const Insight = ({ type, title, description, impact, color }: InsightProps) => (
  <div className="bg-theme-surface p-6 rounded-[32px] border border-theme shadow-sm relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        {type === 'trend' ? <TrendingUp className="w-5 h-5 text-white" /> :
         type === 'research' ? <Search className="w-5 h-5 text-white" /> :
         <Lightbulb className="w-5 h-5 text-white" />}
      </div>
      <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-widest">
        Impact: {impact}
      </span>
    </div>

    <div className="space-y-2">
      <h4 className="font-bold text-foreground leading-tight">{title}</h4>
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
    </div>

    <button className="mt-6 w-full py-3 bg-theme-background hover:bg-white hover:text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
      Execute Optimization
      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
    </button>
  </div>
);

export function AIOptimizationHub() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-ai-optimization-hub');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-ai-optimization-hub', String(newState));
  };

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-3xl p-6 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[80px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Stars className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">AI Optimization Hub</h2>
        </div>
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="absolute top-0 right-0 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Stars className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">AI Optimization Hub</h2>
        </div>
        <button className="text-sm font-bold text-primary hover:underline pr-12">
          View Research Database
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Insight
          type="trend"
          title="Viral Hook: 'Boho Minimalist'"
          description="Etsy search volume for 'minimalist boho wall art' is up 114%. I suggest creating 3 new variants today."
          impact="High"
          color="bg-purple-600"
        />
        <Insight
          type="research"
          title="Competitor Gap Analysis"
          description="Top 3 competitors in your niche are currently low on stock for 'Digital Wedding Planners'. Perfect time to boost ads."
          impact="Medium"
          color="bg-slate-600"
        />
        <Insight
          type="suggestion"
          title="Price Optimization: +$2.50"
          description="Based on market velocity, your 'Luxe Bundle' is underpriced. Increasing by $2.50 will boost profit by 12% without affecting volume."
          impact="Very High"
          color="bg-emerald-600"
        />
      </div>
    </div>
  );
}
