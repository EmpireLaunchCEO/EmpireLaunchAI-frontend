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
  const percentage = Math.max(0, Math.min(100, progress !== undefined ? progress : Math.round(((currentValue || 0) / (targetValue || 1)) * 100))) || 0;

  return (
    <div className="bg-theme-surface rounded-[40px] p-8 border border-theme shadow-sm relative overflow-hidden group">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Holographic Progress Ring */}
        <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
          <svg className="w-48 h-48 md:w-48 md:h-48 -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="currentColor"
              className="text-slate-400 opacity-20"
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
              strokeDasharray="502.6"
              initial={{ strokeDashoffset: 502.6 }}
              animate={{ strokeDashoffset: 502.6 - (502.6 * percentage) / 100 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
          <GrowthBurst active={percentage >= 100} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Status</span>
            <span className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">{percentage}%</span>
          </div>

          {/* Glowing particles effect */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
             <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping" />
             <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping delay-700" />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Success Goal</h3>
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight leading-tight">
              {goalTitle}.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-theme-background rounded-2xl p-4 border border-theme">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Current</span>
              <span className="text-2xl font-black text-foreground">{unit}{(currentValue || 0).toLocaleString()}</span>
            </div>
            <div className="bg-theme-background rounded-2xl p-4 border border-theme">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Target</span>
              <span className="text-2xl font-black text-foreground">{unit}{(targetValue || 0).toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              const newGoal = prompt("What is your Monthly Revenue Goal?");
              if (newGoal) {
                alert(`Setting new Monthly Revenue Goal to ${newGoal}. Strategy is being recalculated...`);
                // In a real app, we would call an API here
              }
            }}
            className="w-full bg-primary text-foreground rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all group/btn shadow-lg shadow-primary/20"
          >
            Strategic Expansion
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-theme flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-theme-background flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">+12.4% WoW Growth</p>
            <p className="text-[10px] text-muted-foreground">AI projection: Target hit in 9 days</p>
          </div>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-theme-surface bg-theme-background flex items-center justify-center text-[10px] font-bold text-muted-foreground">
              P{i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
