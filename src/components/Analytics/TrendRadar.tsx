"use client";

import React from 'react';
import { Stars, Zap, Eye, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const trendingKeywords = [
  "Boho Aesthetic", "Digital Productivity", "Sage Green Decor", 
  "Minimalist Planning", "Passive Income Tips", "Creative Journaling"
];

const opportunityCards = [
  {
    id: '1',
    title: "TikTok 'Day in the Life' Trend",
    description: "TikTok users are loving 'Day in the Life' videos for planners. Should I draft a script for your 'Zen Journal'?",
    impact: "High",
    metric: "34% niche lift",
    type: "content"
  },
  {
    id: '2',
    title: "Sage Green Color Palette",
    description: "Search volume for 'Sage Green Office' is peaking on Pinterest. I suggest updating your Etsy thumbnails.",
    impact: "Medium",
    metric: "12% search lift",
    type: "optimization"
  }
];

export function TrendRadar() {
  return (
    <div className="space-y-8">
      <div className="bg-slate-900 rounded-[40px] p-8 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Stars className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">AI Trend Radar</h3>
          </div>

          <div className="space-y-4">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Current Pulse</p>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {trendingKeywords.map((keyword) => (
                <div 
                  key={keyword}
                  className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold hover:bg-slate-700 transition-colors cursor-default"
                >
                  #{keyword}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunityCards.map((card) => (
          <div key={card.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 flex flex-col">
            <div className="flex justify-between items-start">
              <div className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                card.impact === 'High' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
              )}>
                {card.impact} Impact
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                <TrendingUp className="w-3 h-3" />
                {card.metric}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-slate-900">{card.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{card.description}</p>
            </div>

            <div className="pt-4 mt-auto flex gap-3">
              <button className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all">
                Generate Draft
              </button>
              <button className="px-6 py-3 rounded-2xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
