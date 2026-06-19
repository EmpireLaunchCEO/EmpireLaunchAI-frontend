"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Target, Zap, ChevronRight, Stars, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { analyticsService, OpportunityCard } from '@/lib/api-service';
import { cn } from '@/lib/utils';

const IMPACT_CONFIG = {
  high: { label: 'High Impact', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  medium: { label: 'Medium Impact', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  low: { label: 'Low Impact', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
};

const TYPE_ICONS: Record<string, any> = {
  optimization: Zap,
  growth: TrendingUp,
  expansion: Target,
};

export function OpportunityCards() {
  const [cards, setCards] = useState<OpportunityCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsService.getOpportunityCards();
        if (!cancelled) setCards(data);
      } catch (e) {
        if (!cancelled) setError('Failed to load recommendations');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCards();
    return () => { cancelled = true; };
  }, []);

  if (!mounted) return null;

  // Loading state
  if (loading) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 animate-pulse" />
          <div>
            <div className="h-5 w-44 bg-slate-700 rounded animate-pulse" />
            <div className="h-3 w-32 bg-slate-700 rounded mt-1 animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-800/50 rounded-[24px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Opportunity Engine</h3>
            <p className="text-[10px] text-slate-500 mt-1">AI recommendations unavailable</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
          <p className="text-[10px] font-bold text-slate-600 italic">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (cards.length === 0) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Opportunity Engine</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">AI-Driven Recommendations</p>
          </div>
        </div>
        <div className="p-10 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 text-center space-y-3">
          <Lightbulb className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-[10px] font-bold text-slate-500 italic">No opportunities currently identified.</p>
          <p className="text-[8px] text-slate-600 font-medium">Continue generating content and linking platforms to unlock AI-powered growth recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Opportunity Engine</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
              {cards.length} AI-Driven Recommendation{cards.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[9px] font-black text-primary uppercase tracking-widest">AI Generated</span>
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {cards.map((card, idx) => {
          const impactCfg = IMPACT_CONFIG[card.impact];
          const TypeIcon = TYPE_ICONS[card.type] || Lightbulb;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group rounded-[24px] p-6 bg-theme-background/40 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => {
                // In real implementation, this would navigate or open a modal
                console.log('Opportunity clicked:', card.title, card.payload);
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                    card.type === 'optimization' ? 'bg-primary/10 text-primary' : 
                    card.type === 'growth' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                  )}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest leading-tight">{card.title}</h4>
                      <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", impactCfg.bg, impactCfg.color, impactCfg.border)}>
                        {impactCfg.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{card.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      card.impact === 'high' ? 'text-emerald-400' : 'text-amber-400'
                    )}>
                      {card.metric}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors group-hover:scale-110 active:scale-95">
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-950 transition-colors" />
                  </div>
                </div>
              </div>

              {/* CTA footer on hover */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{card.cta}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-6 px-4 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/10">
        <Stars className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <p className="text-[8px] font-medium text-amber-300/60 italic">
          Opportunities are generated from your ROI data, trending niches, and platform engagement signals. Updated every sync cycle.
        </p>
      </div>
    </motion.div>
  );
}