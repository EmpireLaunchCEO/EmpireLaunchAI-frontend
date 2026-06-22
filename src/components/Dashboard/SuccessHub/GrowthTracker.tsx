"use client";

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, ChevronRight, Award, Minus, Maximize2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { GrowthBurst } from './GrowthBurst';

interface GrowthTrackerProps {
  goalTitle?: string;
  monthlyEarnings?: number;
  allTimeEarnings?: number;
  targetValue?: number;
  unit?: string;
  progress?: number;
}

export const GrowthTracker = ({
  goalTitle = "Monthly Revenue Goal",
  monthlyEarnings = 0,
  allTimeEarnings = 0,
  targetValue = 0,
  unit = "$",
  progress
}: GrowthTrackerProps) => {
  const [mounted, setMounted] = useState(false);
  const [localTarget, setLocalTarget] = useState(targetValue || 1000);

  useEffect(() => {
    setMounted(true);
    const savedGoal = localStorage.getItem('monthly-revenue-goal');
    if (savedGoal) {
      setLocalTarget(parseInt(savedGoal));
    } else if (targetValue > 0) {
      setLocalTarget(targetValue);
    }
  }, [targetValue]);

  const handleSetGoal = () => {
    const newGoal = prompt("What is your Monthly Revenue Goal?", localTarget.toString());
    if (newGoal && !isNaN(parseInt(newGoal))) {
      const val = parseInt(newGoal);
      setLocalTarget(val);
      localStorage.setItem('monthly-revenue-goal', val.toString());
      alert(`Setting new Monthly Revenue Goal to ${val.toLocaleString()}. Strategy is being recalculated...`);
    }
  };

  if (!mounted) return null;

  const percentage = Math.max(0, Math.min(100, progress !== undefined ? progress : Math.round(((monthlyEarnings || 0) / (localTarget || 1)) * 100))) || 0;

  return (
    <div className="bg-theme-surface rounded-[24px] p-5 border-2 border-theme shadow-2xl relative overflow-hidden group max-w-4xl mx-auto">
      {/* Name at the Top */}
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-500 italic">Growth Tracker</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Holographic Progress Ring */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center branded-exception">
          <svg className="w-36 h-36 md:w-36 md:h-36 -rotate-90 branded-exception">
            <circle
              cx="72"
              cy="72"
              r="60"
              fill="none"
              stroke="currentColor"
              className="text-slate-400 opacity-10 branded-exception"
              strokeWidth="10"
            />
            <motion.circle
              cx="72"
              cy="72"
              r="60"
              fill="none"
              stroke="url(#growthGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="377"
              initial={{ strokeDashoffset: 377 }}
              animate={{ strokeDashoffset: 377 - (377 * percentage) / 100 }}
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
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Monthly Progress</span>
            <span className="text-2xl md:text-3xl font-black text-foreground tracking-tighter">{percentage}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <p className="text-slate-400 text-[10px] font-medium italic">Monitor your path to financial dominance and strategic milestones.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-theme-background/30 rounded-2xl p-4 border border-theme">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Monthly Empire Earnings</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-xl font-black text-foreground">{unit}{(monthlyEarnings || 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-theme-background/30 rounded-2xl p-4 border border-theme">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Monthly Revenue Target</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-xl font-black text-foreground">{unit}{(localTarget || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/20">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60 block mb-1">TOTAL ALL TIME EARNINGS</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-foreground tracking-tighter">{unit}{(allTimeEarnings || 0).toLocaleString()}</span>
              <div className="px-2 py-0.5 bg-emerald-500/10 rounded-full">
                <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Lifetime Yield</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSetGoal}
            className="w-full bg-amber-500 text-slate-950 rounded-xl py-3 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all group-empire shadow-lg shadow-amber-500/20"
          >
            Set Monthly Revenue Goal
            <ChevronRight className="w-4 h-4 group-hover-empire:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
