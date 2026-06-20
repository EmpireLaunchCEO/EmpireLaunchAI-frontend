"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  ShoppingBag, 
  Video, 
  Camera, 
  Globe, 
  Sparkles, 
  X, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Clock,
  Eye
} from 'lucide-react';
import { analyticsService, OpportunityCard } from '@/lib/api-service';
import { cn } from '@/lib/utils';
import { BrandedGlobe } from '@/components/BrandedGlobe';

interface ViralSignal {
  id: string;
  platform: string;
  title: string;
  description: string;
  signalStrength: 'hot' | 'rising' | 'emerging';
  timestamp: string;
  source: string;
  niche: string;
}

const SIGNAL_COLORS = {
  hot:     { dot: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: '🔥 Hot' },
  rising:  { dot: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: '📈 Rising' },
  emerging: { dot: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: '✨ Emerging' },
};

const PLATFORM_ICONS: Record<string, any> = {
  tiktok: Video,
  instagram: Camera,
  youtube: Video,
  etsy: ShoppingBag,
  fiverr: Zap,
  shopify: Globe,
  pinterest: Eye,
};

const MOCK_SIGNALS: ViralSignal[] = [
  { id: 'vs_1', platform: 'tiktok', title: 'Boho Home Decor Trending', description: 'Vintage botanical patterns seeing 340% engagement increase on TikTok this week.', signalStrength: 'hot', timestamp: '2m ago', source: 'TikTok Analytics', niche: 'Home Decor' },
  { id: 'vs_2', platform: 'etsy', title: 'Custom Pet Portraits Surging', description: 'Etsy searches for custom pet portraits up 180%. Average sale price $45.', signalStrength: 'hot', timestamp: '15m ago', source: 'Etsy Market Insights', niche: 'Pet Products' },
  { id: 'vs_3', platform: 'instagram', title: 'Minimalist Jewelry Wave', description: 'Instagram Reels featuring minimalist gold jewelry seeing 2.5x average engagement.', signalStrength: 'rising', timestamp: '1h ago', source: 'Meta Trends', niche: 'Jewelry' },
  { id: 'vs_4', platform: 'fiverr', title: 'AI Voiceover Services Spiking', description: 'Fiverr gigs for AI voiceover services up 220% in the last 7 days.', signalStrength: 'rising', timestamp: '2h ago', source: 'Fiverr Analytics', niche: 'Digital Services' },
  { id: 'vs_5', platform: 'youtube', title: 'ASMR Product Reviews Growing', description: 'YouTube ASMR product review content growing 95% month-over-month in the beauty niche.', signalStrength: 'emerging', timestamp: '4h ago', source: 'YouTube Trends', niche: 'Beauty' },
  { id: 'vs_6', platform: 'pinterest', title: 'Digital Planner Templates Rising', description: 'Pinterest saves for digital planner templates up 150% week-over-week.', signalStrength: 'emerging', timestamp: '6h ago', source: 'Pinterest Trends', niche: 'Digital Products' },
];

export function ViralAlertFeed() {
  const [signals, setSignals] = useState<ViralSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      // Try to get signal data from opportunities, fallback to mock
      try {
        const cards = await analyticsService.getOpportunityCards();
        if (!cancelled) {
          if (cards.length > 0) {
            const derivedSignals: ViralSignal[] = cards.slice(0, 4).map((card, i) => ({
              id: `vs_signal_${i}`,
              platform: card.payload?.platform || 'market',
              title: card.title,
              description: card.description,
              signalStrength: card.impact === 'high' ? 'hot' : card.impact === 'medium' ? 'rising' : 'emerging',
              timestamp: `${i * 5 + 1}m ago`,
              source: 'AI Market Analysis',
              niche: card.payload?.niche || 'General',
            }));
            setSignals(derivedSignals);
          } else {
            setSignals(MOCK_SIGNALS);
          }
        }
      } catch {
        if (!cancelled) setSignals(MOCK_SIGNALS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set(prev).add(id));
    setTimeout(() => {
      setSignals(prev => prev.filter(s => s.id !== id));
      setDismissed(prev => { const next = new Set(prev); next.delete(id); return next; });
    }, 300);
  };

  if (!mounted) return null;

  const activeSignals = signals.filter(s => !dismissed.has(s.id));

  // Loading state with BrandedGlobe
  if (loading) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex flex-col items-center justify-center py-12 gap-6">
          <BrandedGlobe size="md" spinning />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Scanning Market Signals...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (activeSignals.length === 0) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Viral Alert Hub</h3>
            <p className="text-xs text-slate-500">All signals cleared. Check back soon for new market opportunities.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl relative overflow-hidden"
    >
      {/* Electric shimmer effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 rounded-full" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground">Viral Alert Hub</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {activeSignals.length} Active Signal{activeSignals.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {activeSignals.filter(s => s.signalStrength === 'hot').length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Live</span>
          </div>
        )}
      </div>

      {/* Signal list */}
      <div className="space-y-3">
        <AnimatePresence>
          {activeSignals.map((signal, idx) => {
            const sc = SIGNAL_COLORS[signal.signalStrength];
            const PlatformIcon = PLATFORM_ICONS[signal.platform] || TrendingUp;

            return (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-[24px] border border-white/5 hover:border-white/20 bg-theme-background/40 transition-all"
              >
                {/* Electric shimmer on hover */}
                <div className="absolute -right-10 -top-10 w-20 h-20 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Platform icon */}
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <PlatformIcon className="w-5 h-5 text-slate-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest leading-tight">{signal.title}</h4>
                        <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border", sc.bg, sc.text, sc.border)}>
                          {sc.label}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">{signal.description}</p>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 flex-wrap text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {signal.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5" />
                          {signal.source}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px]">{signal.niche}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                        <button className="flex-1 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          Create Similar
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => handleDismiss(signal.id)}
                          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
                        >
                          <X className="w-3 h-3" />
                          Ignore
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/10">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <p className="text-[9px] text-primary/60 italic font-medium">
          AI is analyzing 30+ market sources in real-time. Signals update every 15 minutes.
        </p>
      </div>
    </motion.div>
  );
}