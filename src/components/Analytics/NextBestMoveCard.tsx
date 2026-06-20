"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Target, Zap, ArrowRight, Stars, Sparkles } from 'lucide-react';
import { analyticsService, OpportunityCard } from '@/lib/api-service';
import { cn } from '@/lib/utils';
import { BrandedGlobe } from '@/components/BrandedGlobe';

const IMPACT_COLORS = {
  high:   { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'High Impact' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', label: 'Good Opportunity' },
  low:    { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', label: 'Nice to Have' },
};

const TYPE_ICONS: Record<string, any> = { optimization: Zap, growth: TrendingUp, expansion: Target };

export function NextBestMoveCard() {
  const [topCard, setTopCard] = useState<OpportunityCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const cards = await analyticsService.getOpportunityCards();
        if (!cancelled) {
          const sorted = [...cards].sort((a, b) => 
            a.impact === 'high' ? -1 : b.impact === 'high' ? 1 : a.impact === 'medium' ? -1 : 1
          );
          setTopCard(sorted[0] || null);
        }
      } catch {
        if (!cancelled) setTopCard(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (!mounted) return null;

  // Loading with BrandedGlobe
  if (loading) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex flex-col items-center justify-center py-10 gap-5">
          <BrandedGlobe size="sm" spinning />
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Analyzing your data...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!topCard) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Next Best Move</h3>
            <p className="text-xs text-slate-500">No recommendations yet. Keep creating content!</p>
          </div>
        </div>
      </div>
    );
  }

  const icfg = IMPACT_COLORS[topCard.impact];
  const TypeIcon = TYPE_ICONS[topCard.type] || Lightbulb;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-theme-surface rounded-[40px] p-8 border-2 border-primary/20 shadow-2xl relative overflow-hidden"
    >
      {/* Electric shimmer background */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 blur-[80px] -z-10" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-foreground">Next Best Move</h3>
            <Stars className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI-powered recommendation</p>
        </div>
      </div>

      {/* Featured card */}
      <div className="bg-theme-background/40 rounded-[28px] p-6 border border-primary/20 hover:border-white/40 transition-all group">
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
            topCard.type === 'optimization' ? 'bg-primary/10 border-primary/20 text-primary' :
            topCard.type === 'growth' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            'bg-blue-500/10 border-blue-500/20 text-blue-400'
          )}>
            <TypeIcon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h4 className="text-base font-black text-white">{topCard.title}</h4>
              <span className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border", icfg.bg, icfg.text, icfg.border)}>
                {icfg.label}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{topCard.description}</p>

            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className={cn("text-[10px] font-bold uppercase tracking-widest", icfg.text)}>
                  {topCard.metric}
                </span>
              </div>
            </div>

            <button className="mt-5 w-full py-4 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(var(--primary-rgb),0.3)]">
              {topCard.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-5 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/10">
        <Stars className="w-4 h-4 text-primary shrink-0 animate-pulse" />
        <p className="text-xs text-primary/60 italic">Based on your recent sales and trending data.</p>
      </div>
    </motion.div>
  );
}