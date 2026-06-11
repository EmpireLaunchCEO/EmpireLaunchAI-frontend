"use client";

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, ChevronRight, Award, Minus, Maximize2, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { GrowthBurst } from './GrowthBurst';
import { useEmpire } from '@/lib/EmpireContext';

interface GrowthTrackerProps {
  goalTitle?: string;
  monthlyEarnings?: number;
  allTimeEarnings?: number;
  targetValue?: number;
  unit?: string;
  progress?: number;
  subscribers?: number;
}

export const GrowthTracker = ({
  goalTitle = "Monthly Revenue Goal",
  monthlyEarnings = 0,
  allTimeEarnings = 0,
  targetValue = 1000,
  unit = "$",
  progress,
  subscribers = 0
}: GrowthTrackerProps) => {
  const { isAdmin } = useEmpire();
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [localTarget, setLocalTarget] = useState(targetValue);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-growth-tracker');
    if (saved === 'true') setIsMinimized(true);
    
    const savedGoal = localStorage.getItem('monthly-revenue-goal');
    if (savedGoal) setLocalTarget(parseInt(savedGoal));
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-growth-tracker', String(newState));
  };

  const handleSetGoal = () => {
    const newGoal = prompt("What is your Monthly Revenue Goal?", localTarget.toString());
    if (newGoal && !isNaN(parseInt(newGoal))) {
      const val = parseInt(newGoal);
      setLocalTarget(val);
      localStorage.setItem('monthly-revenue-goal', val.toString());
      alert(`Setting new Monthly Revenue Goal to $${val.toLocaleString()}. Strategy is being recalculated...`);
    }
  };

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-3xl p-4 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[64px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-foreground">Growth Tracker</h2>
        </div>
        <button 
          onClick={toggleMinimize}
          className="p-2 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // REALITY GROUNDING: Percentage is 0 until real earnings exist
  const percentage = progress !== undefined ? progress : (monthlyEarnings > 0 ? Math.round(((monthlyEarnings || 0) / (localTarget || 1)) * 100) : 0);

  return (
    <div className="bg-theme-surface rounded-[40px] p-8 border-2 !border-white/20 shadow-2xl relative overflow-hidden group">
      {/* Name at the Top */}
      <div className="flex items-center gap-2 mb-8">
        <Award className="w-5 h-5 text-amber-500" />
        <h3 className="text-xl font-black uppercase tracking-[0.2em] text-amber-500 italic">Growth Tracker</h3>
      </div>

      {/* Minimize Toggle */}
      <div className="absolute top-4 right-5 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-2 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

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
              className="text-slate-400 opacity-10"
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
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Monthly Progress</span>
            <span className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">{percentage}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <p className="text-slate-400 text-xs font-medium italic">
            {isAdmin 
              ? "Platform dominance and global user acquisition metrics." 
              : "Monitor your path to financial dominance and strategic milestones."
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-theme-background/30 rounded-3xl p-6 border border-theme">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                {isAdmin ? "Platform Monthly Yield" : "Monthly Empire Earnings"}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-2xl font-black text-foreground">
                  {unit}{isAdmin 
                    ? (subscribers * 40 + (allTimeEarnings * 0.04)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                    : (monthlyEarnings || 0).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="bg-theme-background/30 rounded-3xl p-6 border border-theme">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                {isAdmin ? "Active Global Users" : "Monthly Revenue Target"}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  {isAdmin ? <Users className="w-5 h-5 text-amber-500" /> : <Target className="w-5 h-5 text-amber-500" />}
                </div>
                <span className="text-2xl font-black text-foreground">
                  {isAdmin ? (subscribers > 0 ? subscribers.toLocaleString() : "—") : `${unit}${(localTarget || 0).toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/5 rounded-3xl p-6 border border-emerald-500/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 block mb-2">
              {isAdmin ? "TOTAL PLATFORM VOLUME" : "TOTAL ALL TIME EARNINGS"}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-foreground tracking-tighter">
                {unit}{(allTimeEarnings || 0).toLocaleString()}
              </span>
              <div className="px-3 py-1 bg-emerald-500/10 rounded-full">
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                  {isAdmin ? "Global GMV" : "Lifetime Yield"}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSetGoal}
            className="w-full bg-amber-500 text-slate-950 rounded-2xl py-4 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all group/btn shadow-lg shadow-amber-500/20"
          >
            Set Monthly Revenue Goal
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
