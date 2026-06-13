"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShoppingBag, TrendingUp, Flame, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MarketSignal {
  /** Platform source: 'etsy' | 'fiverr' */
  platform: 'etsy' | 'fiverr';
  /** Signal type label */
  signalType: 'baskets' | 'orders';
  /** Current raw count */
  count: number;
  /** Display label e.g. "In 20+ people's baskets" */
  displayLabel: string;
  /** Niche/category being tracked */
  niche?: string;
  /** Timestamp of last update */
  lastUpdated?: string;
}

type HeatLevel = 'low' | 'moderate' | 'high' | 'viral';

const HEAT_THRESHOLDS: Record<string, { etsy: number[]; fiverr: number[] }> = {
  baskets: {
    etsy: [0, 3, 10, 20],    // low: <3, moderate: 3-9, high: 10-19, viral: 20+
    fiverr: [0, 2, 6, 13],   // low: <2, moderate: 2-5, high: 6-12, viral: 13+
  },
  orders: {
    etsy: [0, 3, 10, 20],
    fiverr: [0, 2, 6, 13],
  },
};

const HEAT_CONFIG: Record<HeatLevel, { label: string; color: string; bgClass: string; barClass: string; textClass: string }> = {
  low:      { label: 'Cool',    color: '#3b82f6', bgClass: 'bg-blue-500/10', barClass: 'bg-blue-500',   textClass: 'text-blue-400' },
  moderate: { label: 'Warm',   color: '#f59e0b', bgClass: 'bg-amber-500/10', barClass: 'bg-amber-500',  textClass: 'text-amber-400' },
  high:     { label: 'Hot',    color: '#f97316', bgClass: 'bg-orange-500/10', barClass: 'bg-orange-500', textClass: 'text-orange-400' },
  viral:    { label: 'Viral!', color: '#ef4444', bgClass: 'bg-red-500/10',    barClass: 'bg-red-500',    textClass: 'text-red-400' },
};

function getHeatLevel(platform: 'etsy' | 'fiverr', signalType: string, count: number): HeatLevel {
  const thresholds = HEAT_THRESHOLDS[signalType]?.[platform] || [0, 3, 10, 20];
  if (count >= thresholds[3]) return 'viral';
  if (count >= thresholds[2]) return 'high';
  if (count >= thresholds[1]) return 'moderate';
  return 'low';
}

function getHeatPercent(platform: 'etsy' | 'fiverr', signalType: string, count: number): number {
  const thresholds = HEAT_THRESHOLDS[signalType]?.[platform] || [0, 3, 10, 20];
  const max = thresholds[3];
  const pct = Math.min((count / max) * 100, 100);
  return Math.max(pct, 5); // minimum 5% for visibility
}

// ─── Platform Icons ──────────────────────────────────────────────────────────

const PlatformIcon = ({ platform, className }: { platform: string; className?: string }) => {
  if (platform === 'etsy') return <ShoppingBag className={cn('w-4 h-4', className)} />;
  return <Zap className={cn('w-4 h-4', className)} />;
};

// ─── Signal Descriptions ─────────────────────────────────────────────────────

const SIGNAL_INFO: Record<string, { label: string; description: string; icon: typeof Flame }> = {
  baskets: {
    label: 'In Baskets',
    description: 'Number of Etsy shoppers who currently have this style in their cart — a real-time demand indicator.',
    icon: ShoppingBag,
  },
  orders: {
    label: 'Orders in Queue',
    description: 'Active paid orders for this gig style on Fiverr — reflects direct market willingness to pay.',
    icon: TrendingUp,
  },
};

// ─── MarketHeatMeter Component ───────────────────────────────────────────────

interface MarketHeatMeterProps {
  signal: MarketSignal;
  /** Show compact variant for tight spaces */
  compact?: boolean;
  className?: string;
}

export function MarketHeatMeter({ signal, compact = false, className }: MarketHeatMeterProps) {
  const heatLevel = getHeatLevel(signal.platform, signal.signalType, signal.count);
  const heatConfig = HEAT_CONFIG[heatLevel];
  const heatPercent = getHeatPercent(signal.platform, signal.signalType, signal.count);
  const signalInfo = SIGNAL_INFO[signal.signalType];

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3 p-3 rounded-xl bg-theme-background border border-theme', className)}>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', heatConfig.bgClass)}>
          <PlatformIcon platform={signal.platform} className={heatConfig.textClass} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
              {signal.platform === 'etsy' ? 'Etsy' : 'Fiverr'} — {signalInfo.label}
            </span>
            <span className={cn('text-[9px] font-black', heatConfig.textClass)}>
              {signal.count}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${heatPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={cn('h-full rounded-full', heatConfig.barClass)}
            />
          </div>
        </div>
        <div className={cn(
          'px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest',
          heatConfig.bgClass, heatConfig.textClass
        )}>
          {heatConfig.label}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative p-5 rounded-2xl border-2 transition-all cursor-default',
        heatConfig.bgClass,
        'border-transparent hover:border-current',
        className
      )}
      style={{ '--heat-color': heatConfig.color } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', heatConfig.bgClass)}>
            <PlatformIcon platform={signal.platform} className={cn('w-5 h-5', heatConfig.textClass)} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              {signal.platform === 'etsy' ? 'Etsy' : 'Fiverr'} — {signalInfo.label}
            </p>
            <p className="text-sm font-bold text-foreground">{signal.displayLabel}</p>
          </div>
        </div>
        <div className={cn(
          'px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5',
          heatConfig.bgClass, heatConfig.textClass
        )}>
          <Flame className="w-3 h-3" />
          {heatConfig.label}
        </div>
      </div>

      {/* Heat Meter Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[8px] font-bold text-muted-foreground">
          <span>Market Velocity</span>
          <span className={cn('font-black', heatConfig.textClass)}>
            {signal.count} {signal.signalType === 'baskets' ? 'baskets' : 'in queue'}
          </span>
        </div>
        <div className="h-3 rounded-full bg-slate-800 overflow-hidden relative">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-amber-500/20 to-red-500/20" />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${heatPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full rounded-full relative', heatConfig.barClass)}
            style={{ boxShadow: `0 0 12px ${heatConfig.color}40` }}
          >
            {/* Pulse animation for viral */}
            {heatLevel === 'viral' && (
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20"
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>
        {/* Threshold markers */}
        <div className="flex justify-between px-0.5 text-[6px] font-bold text-slate-700">
          <span>0</span>
          {signal.signalType === 'baskets' ? (
            <><span>3</span><span>10</span><span>20+</span></>
          ) : (
            <><span>2</span><span>6</span><span>13+</span></>
          )}
        </div>
      </div>

      {/* Tooltip description — shown on hover */}
      <div className="mt-4 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-start gap-2">
          <Thermometer className={cn('w-3.5 h-3.5 mt-0.5 shrink-0', heatConfig.textClass)} />
          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
            {signalInfo.description}
            {signal.niche && (
              <> Currently tracking <span className="text-foreground font-bold">"{signal.niche}"</span> trends.</>
            )}
          </p>
        </div>
      </div>

      {/* Last updated */}
      {signal.lastUpdated && (
        <p className="mt-3 text-[7px] font-bold text-slate-700 uppercase tracking-widest">
          Updated {signal.lastUpdated}
        </p>
      )}
    </div>
  );
}

// ─── ViralSignalsPanel (Combined View) ──────────────────────────────────────

interface ViralSignalsPanelProps {
  etsySignal?: MarketSignal;
  fiverrSignal?: MarketSignal;
  className?: string;
}

export function ViralSignalsPanel({ etsySignal, fiverrSignal, className }: ViralSignalsPanelProps) {
  // Default mock data if none provided
  const etsy = etsySignal || {
    platform: 'etsy' as const,
    signalType: 'baskets' as const,
    count: 24,
    displayLabel: "In 20+ people's baskets",
    niche: 'Digital Planners',
    lastUpdated: '2 min ago',
  };

  const fiverr = fiverrSignal || {
    platform: 'fiverr' as const,
    signalType: 'orders' as const,
    count: 17,
    displayLabel: '17 Orders in Queue',
    niche: 'Notion Templates',
    lastUpdated: '5 min ago',
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <h3 className="font-black text-foreground text-sm uppercase tracking-tight italic">Real-Time Market Heat</h3>
          <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">
            Live velocity signals from Etsy & Fiverr
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MarketHeatMeter signal={etsy} />
        <MarketHeatMeter signal={fiverr} />
      </div>
    </div>
  );
}

// ─── Mock Data Generator ─────────────────────────────────────────────────────

export function generateMockSignals(): { etsy: MarketSignal; fiverr: MarketSignal } {
  const etsyBaskets = Math.floor(Math.random() * 25) + 1;
  const fiverrQueue = Math.floor(Math.random() * 18) + 1;
  const niches = ['Digital Planners', 'Notion Templates', 'Canva Kits', 'ADHD Planners', 'Budget Trackers'];

  return {
    etsy: {
      platform: 'etsy',
      signalType: 'baskets',
      count: etsyBaskets,
      displayLabel: etsyBaskets >= 20
        ? "In 20+ people's baskets"
        : `In ${etsyBaskets} people's baskets`,
      niche: niches[Math.floor(Math.random() * niches.length)],
      lastUpdated: `${Math.floor(Math.random() * 10) + 1} min ago`,
    },
    fiverr: {
      platform: 'fiverr',
      signalType: 'orders',
      count: fiverrQueue,
      displayLabel: `${fiverrQueue} Orders in Queue`,
      niche: niches[Math.floor(Math.random() * niches.length)],
      lastUpdated: `${Math.floor(Math.random() * 15) + 1} min ago`,
    },
  };
}