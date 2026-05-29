"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  Search,
  ArrowRight,
  CheckCircle2,
  X,
  Brain,
  Target,
  Sparkles,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService } from '@/lib/api-service';

export function StrategyQueue() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await analyticsService.getStrategySuggestions();
      setSuggestions(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleApprove = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleDismiss = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  if (loading) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
            <Brain className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight italic">Revenue Oracle</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Strategic Intervention Queue</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-white/10">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Synthesis Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {suggestions.map((strat, idx) => (
            <motion.div
              key={strat.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -20 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-900 rounded-[40px] border border-white/5 p-8 relative overflow-hidden group hover:border-amber-400/30 transition-colors"
            >
              {/* Type Badge */}
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                  strat.type === 'TREND_PIVOT' ? "bg-purple-500/20 text-purple-400" :
                  strat.type === 'SEO_OPTIMIZATION' ? "bg-primary/20 text-primary" :
                  "bg-emerald-500/20 text-emerald-400"
                )}>
                  {strat.type.replace('_', ' ')}
                </div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Est. ROI: +${(strat.roiImpact / 100).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-black text-white leading-tight">{strat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  {strat.suggestion}
                </p>
                <div className="pt-4 border-t border-white/5">
                   <p className="text-[10px] text-theme-background0 font-bold leading-relaxed italic">
                     <Brain className="w-3 h-3 inline mr-1 text-amber-400/50" />
                     "{strat.reasoning}"
                   </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleApprove(strat.id)}
                  className="flex-1 py-4 bg-amber-400 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/10 flex items-center justify-center gap-2 group/btn"
                >
                  Apply Strategy <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleDismiss(strat.id)}
                  className="p-4 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Background Decoration */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-400/5 blur-2xl rounded-full group-hover:bg-amber-400/10 transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {suggestions.length === 0 && (
        <div className="p-20 text-center bg-slate-900/50 border border-white/5 rounded-[48px]">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500/50" />
           </div>
           <h3 className="text-xl font-black text-white">Queue Clear</h3>
           <p className="text-theme-background0 text-sm font-medium mt-2">All strategic interventions have been processed.</p>
        </div>
      )}
    </div>
  );
}
