"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Target, Zap, ArrowRight, AlertCircle, Stars } from 'lucide-react';
import { analyticsService, OpportunityCard } from '@/lib/api-service';
import { cn } from '@/lib/utils';

const IMPACT_COLORS = {
  high:   { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'High Impact' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', label: 'Good Opportunity' },
  low:    { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', label: 'Nice to Have' },
};

export function OpportunityCards() {
  const [cards, setCards] = useState<OpportunityCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsService.getOpportunityCards();
        if (!cancelled) setCards(data);
      } catch (e) {
        if (!cancelled) setError('Could not load recommendations');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCards();
    return () => { cancelled = true; };
  }, []);

  if (!mounted) return null;

  // Loading
  if (loading) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="h-5 w-36 bg-slate-700 rounded animate-pulse mb-4" />
        <div className="h-24 bg-slate-800/50 rounded-[24px] animate-pulse" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Next Best Move</h3>
            <p className="text-xs text-slate-500">Connect platforms for AI recommendations.</p>
          </div>
        </div>
      </div>
    );
  }

  // Pick the best card (first/highest impact), or show empty state
  const bestCard = cards
    .sort((a, b) => a.impact === 'high' ? -1 : b.impact === 'high' ? 1 : a.impact === 'medium' ? -1 : 1)[0];

  if (!bestCard) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
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

  const impactCfg = IMPACT_COLORS[bestCard.impact];
  const TypeIcon = bestCard.type === 'optimization' ? Zap : bestCard.type === 'growth' ? TrendingUp : Target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-black text-foreground">Next Best Move</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI-powered recommendation</p>
        </div>
      </div>

      {/* Single Card — Big & Clear */}
      <div className="bg-theme-background/40 rounded-[28px] p-6 border-2 border-white/5 hover:border-primary/30 transition-all group">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <TypeIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h4 className="text-base font-black text-white">{bestCard.title}</h4>
              <span className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full", impactCfg.bg, impactCfg.text, impactCfg.border)}>
                {impactCfg.label}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{bestCard.description}</p>
            
            {/* Metric callout */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                <Stars className="w-3.5 h-3.5 text-primary" />
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  bestCard.impact === 'high' ? 'text-emerald-400' : 'text-amber-400'
                )}>
                  {bestCard.metric}
                </span>
              </div>
            </div>

            {/* CTA button */}
            <button className="mt-5 w-full py-4 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20">
              {bestCard.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Simple footer */}
      <div className="flex items-center gap-2 mt-5 px-4 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/10">
        <Stars className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-xs text-amber-300/60 italic">
          Based on your recent sales and trending data.
        </p>
      </div>
    </motion.div>
  );
}