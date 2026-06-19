"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingUp, Target, Zap, ArrowRight, AlertCircle, Stars, ChevronDown, ChevronUp } from 'lucide-react';
import { analyticsService, OpportunityCard } from '@/lib/api-service';
import { cn } from '@/lib/utils';

const IMPACT_COLORS = {
  high:   { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'High Impact' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', label: 'Good Opportunity' },
  low:    { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', label: 'Nice to Have' },
};

const TYPE_ICONS: Record<string, any> = { optimization: Zap, growth: TrendingUp, expansion: Target };

export function OpportunityCards() {
  const [cards, setCards] = useState<OpportunityCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
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
          <Lightbulb className="w-6 h-6 text-primary" />
          <p className="text-sm text-slate-400">No recommendations yet. Keep creating content!</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Next Best Move</h3>
            <p className="text-xs text-slate-500">No recommendations yet.</p>
          </div>
        </div>
      </div>
    );
  }

  // Sort — high impact first
  const sorted = [...cards].sort((a, b) => 
    a.impact === 'high' ? -1 : b.impact === 'high' ? 1 : a.impact === 'medium' ? -1 : 1
  );
  const topCard = sorted[0];
  const restCards = sorted.slice(1);
  const impactCfg = IMPACT_COLORS[topCard.impact];
  const TypeIcon = TYPE_ICONS[topCard.type] || Lightbulb;

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

      {/* ── FEATURED CARD ────────────────────────────────── */}
      <div className="bg-theme-background/40 rounded-[28px] p-6 border-2 border-primary/20 shadow-lg shadow-primary/5 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <TypeIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h4 className="text-base font-black text-white">{topCard.title}</h4>
              <span className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full", impactCfg.bg, impactCfg.text, impactCfg.border)}>
                {impactCfg.label}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{topCard.description}</p>
            
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                <Stars className="w-3.5 h-3.5 text-primary" />
                <span className={cn("text-[10px] font-bold uppercase tracking-widest", impactCfg.text)}>
                  {topCard.metric}
                </span>
              </div>
            </div>

            <button className="mt-5 w-full py-4 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20">
              {topCard.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── SECONDARY CARDS (collapsible) ────────────────── */}
      {restCards.length > 0 && (
        <div className="border border-white/5 rounded-[24px] overflow-hidden">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-between px-5 py-4 bg-theme-background/20 hover:bg-theme-background/40 transition-colors"
          >
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {restCards.length} More Recommendation{restCards.length > 1 ? 's' : ''}
            </span>
            {showAll ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          <AnimatePresence>
            {showAll && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="divide-y divide-white/5"
              >
                {restCards.map((card) => {
                  const icfg = IMPACT_COLORS[card.impact];
                  const TIcon = TYPE_ICONS[card.type] || Lightbulb;
                  return (
                    <div key={card.id} className="p-4 flex items-start gap-3 hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                        <TIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h5 className="text-xs font-bold text-white">{card.title}</h5>
                          <span className={cn("text-[7px] font-black px-1.5 py-0.5 rounded-full", icfg.bg, icfg.text)}>
                            {icfg.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{card.description}</p>
                      </div>
                      <span className={cn("text-[8px] font-bold shrink-0", icfg.text)}>{card.metric}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 mt-5 px-4 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/10">
        <Stars className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-xs text-amber-300/60 italic">Based on your recent sales and trending data.</p>
      </div>
    </motion.div>
  );
}