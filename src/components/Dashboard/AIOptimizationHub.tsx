"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Stars, TrendingUp, Search, Zap, ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightProps {
  type: 'trend' | 'research' | 'suggestion';
  title: string;
  description: string;
  impact: string;
  color: string;
}

const Insight = ({ type, title, description, impact, color }: InsightProps) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        {type === 'trend' ? <TrendingUp className="w-5 h-5 text-white" /> : 
         type === 'research' ? <Search className="w-5 h-5 text-white" /> : 
         <Lightbulb className="w-5 h-5 text-white" />}
      </div>
      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest">
        Impact: {impact}
      </span>
    </div>
    
    <div className="space-y-2">
      <h4 className="font-bold text-slate-900 leading-tight">{title}</h4>
      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{description}</p>
    </div>

    <button className="mt-6 w-full py-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
      Execute Optimization
      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
    </button>
  </div>
);

export function AIOptimizationHub() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <Stars className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">AI Optimization Hub</h2>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:underline">
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
          color="bg-blue-600"
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
