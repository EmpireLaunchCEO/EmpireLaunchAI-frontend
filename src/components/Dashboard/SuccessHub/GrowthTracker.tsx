"use client";

import React from 'react';
import { Target, TrendingUp, ChevronRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { GrowthBurst } from './GrowthBurst';

interface GrowthTrackerProps {
  goalTitle?: string;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
  progress?: number;
}

export const GrowthTracker = ({ 
  goalTitle = "$1,000 Monthly Revenue",
  currentValue = 742,
  targetValue = 1000,
  unit = "$",
  progress
}: GrowthTrackerProps) => {
  const percentage = progress !== undefined ? progress : Math.min(Math.round((currentValue / targetValue) * 100), 100);
  
  return (
    <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-slate-50 shadow-sm relative overflow-hidden group">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Holographic Progress Ring */}
        <div className="relative w-48 h-48 shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="12"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="url(#growthGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={502.6}
              initial={{ strokeDashoffset: 502.6 }}
              animate={{ strokeDashoffset: 502.6 - (502.6 * percentage) / 100 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          <GrowthBurst active={percentage >= 100} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</span>
            <span className="text-4xl font-black text-foreground tracking-tighter">{percentage}%</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-2 tracking-wide">
              Level 04
            </span>
          </div>
          
          {/* Glowing particles effect */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
             <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
             <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping delay-700" />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Success Goal</h3>
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight leading-tight">
              {goalTitle}.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-theme-background rounded-2xl p-4 border border-theme">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Current</span>
              <span className="text-2xl font-black text-foreground">{unit}{currentValue.toLocaleString()}</span>
            </div>
            <div className="bg-theme-background rounded-2xl p-4 border border-theme">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Target</span>
              <span className="text-2xl font-black text-foreground">{unit}{targetValue.toLocaleString()}</span>
            </div>
          </div>

          <button className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all group/btn shadow-lg shadow-slate-200">
            Strategic Expansion
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-theme flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">+12.4% WoW Growth</p>
            <p className="text-[10px] text-slate-500">AI projection: Target hit in 9 days</p>
          </div>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
              P{i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
