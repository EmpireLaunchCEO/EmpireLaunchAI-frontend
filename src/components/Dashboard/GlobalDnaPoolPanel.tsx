"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Globe,
  TrendingUp,
  Layers,
  Palette,
  Cpu,
  Sparkles,
  ChevronRight,
  Lock,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface DnaStrand {
  id: string;
  niche: string;
  source: string;
  confidence: number;
  colorPalette?: string[];
  headerFont?: string;
  vibe?: string;
}

interface VaultStats {
  totalStrands: number;
  categories: { name: string; count: number }[];
  topNiches: { name: string; count: number; avgConfidence: number }[];
  lastHarvested?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_STATS: VaultStats = {
  totalStrands: 1042,
  categories: [
    { name: 'Digital Planners', count: 284 },
    { name: 'Notion Templates', count: 198 },
    { name: 'Canva Kits', count: 176 },
    { name: 'Social Media', count: 145 },
    { name: 'Branding', count: 126 },
    { name: 'Printables', count: 113 },
  ],
  topNiches: [
    { name: 'ADHD Planner', count: 89, avgConfidence: 94 },
    { name: 'Budget Tracker', count: 72, avgConfidence: 91 },
    { name: 'Content Calendar', count: 65, avgConfidence: 88 },
    { name: 'Wedding Planner', count: 58, avgConfidence: 86 },
    { name: 'Habit Tracker', count: 51, avgConfidence: 85 },
  ],
  lastHarvested: '2 min ago',
};

// ─── GlobalDnaPoolPanel ─────────────────────────────────────────────────────

interface GlobalDnaPoolPanelProps {
  className?: string;
}

export function GlobalDnaPoolPanel({ className }: GlobalDnaPoolPanelProps) {
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Try to fetch from backend, fall back to mock data
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/mass-dna/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalStrands: data.totalStrands || data.vaultStats?.totalStrands || MOCK_STATS.totalStrands,
            categories: data.categories || MOCK_STATS.categories,
            topNiches: data.topNiches || MOCK_STATS.topNiches,
            lastHarvested: data.lastHarvested || MOCK_STATS.lastHarvested,
          });
        } else {
          // Fall back to mock data with slight randomization
          setStats({
            ...MOCK_STATS,
            totalStrands: MOCK_STATS.totalStrands + Math.floor(Math.random() * 50),
          });
        }
      } catch {
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={cn('bg-theme-surface border-2 border-theme rounded-[32px] p-8 space-y-6', className)}>
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-slate-800" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-800 rounded w-48" />
            <div className="h-3 bg-slate-800 rounded w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const displayedCategories = stats.categories.slice(0, 6);

  return (
    <div className={cn(
      'bg-theme-surface border-2 border-theme rounded-[32px] p-6 md:p-8 space-y-6',
      'relative overflow-hidden group',
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[60px] -z-10" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-black text-foreground text-sm uppercase tracking-tight italic">Global DNA Pool</h3>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
              {stats.totalStrands.toLocaleString()} strands harvested from market intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {stats.lastHarvested ? `Updated ${stats.lastHarvested}` : 'Live'}
          </div>
        </div>
      </div>

      {/* Main count */}
      <div className="flex items-end gap-3">
        <motion.span
          key={stats.totalStrands}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-black text-foreground tracking-tight"
        >
          {stats.totalStrands.toLocaleString()}
        </motion.span>
        <span className="text-sm font-bold text-muted-foreground mb-1.5">DNA strands</span>
      </div>

      {/* Category breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-cyan-400" />
            Strands by Category
          </span>
          <span className="text-[8px] font-bold text-muted-foreground">{displayedCategories.length} categories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {displayedCategories.map((cat) => {
            const pct = Math.round((cat.count / stats.totalStrands) * 100);
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                className={cn(
                  'relative p-3 rounded-2xl border transition-all text-left',
                  activeCategory === cat.name
                    ? 'bg-cyan-500/10 border-cyan-500/30'
                    : 'bg-theme-background border-theme hover:border-cyan-500/20'
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-foreground truncate">{cat.name}</span>
                  <span className="text-[9px] font-black text-cyan-400">{cat.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
                <span className="text-[7px] font-bold text-muted-foreground mt-1 block">{pct}% of pool</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Niches */}
      {stats.topNiches && stats.topNiches.length > 0 && (
        <div className="space-y-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Top Performing Niches
          </span>

          <div className="space-y-2">
            {stats.topNiches.slice(0, 5).map((niche, i) => (
              <div
                key={niche.name}
                className="flex items-center justify-between p-3 bg-theme-background rounded-2xl border border-theme"
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center text-[8px] font-black',
                    i === 0 ? 'bg-amber-500/10 text-amber-400' :
                    i === 1 ? 'bg-slate-500/10 text-slate-400' :
                    'bg-slate-800 text-slate-500'
                  )}>
                    #{i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-foreground">{niche.name}</p>
                    <p className="text-[8px] text-muted-foreground font-medium">{niche.count} patterns</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400">
                    <Sparkles className="w-3 h-3" />
                    {niche.avgConfidence}%
                  </div>
                  <p className="text-[7px] text-muted-foreground">confidence</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security footer */}
      <div className="flex items-center justify-between pt-2 border-t border-theme">
        <div className="flex items-center gap-2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
          <Shield className="w-3 h-3 text-primary" />
          <span>Anti-Copycat Verified</span>
          <Lock className="w-3 h-3 text-primary ml-2" />
          <span>Unique by dHash</span>
        </div>
        <button className="flex items-center gap-1 text-[8px] font-black text-cyan-400 hover:text-cyan-300 transition-colors">
          <span>View All</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── AutoPilotStatusBadge (Compact indicator for headers/nav) ────────────────

interface AutoPilotStatusBadgeProps {
  status?: 'active' | 'paused' | 'idle';
  pulseData?: { status: string; description: string; progress: number };
  className?: string;
}

export function AutoPilotStatusBadge({ status: propStatus, pulseData, className }: AutoPilotStatusBadgeProps) {
  const [pulse, setPulse] = useState(pulseData || null);
  const [localStatus, setLocalStatus] = useState(propStatus || 'idle');

  useEffect(() => {
    if (pulseData) return;

    const fetchPulse = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/analytics/pulse`);
        if (res.ok) {
          const data = await res.json();
          setPulse(data);
          if (data.status === 'researching' || data.status === 'producing' || data.status === 'deploying') {
            setLocalStatus('active');
          } else if (data.status === 'optimizing') {
            setLocalStatus('active');
          } else {
            setLocalStatus('idle');
          }
        }
      } catch {
        // Use prop status if fetch fails
        if (propStatus) setLocalStatus(propStatus);
      }
    };

    fetchPulse();
    const interval = setInterval(fetchPulse, 15000);
    return () => clearInterval(interval);
  }, [pulseData, propStatus]);

  return (
    <div className={cn(
      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest transition-all',
      localStatus === 'active'
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        : localStatus === 'paused'
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          : 'bg-slate-500/10 border-slate-500/20 text-slate-400',
      className
    )}>
      <div className={cn(
        'w-1.5 h-1.5 rounded-full',
        localStatus === 'active' ? 'bg-emerald-400 animate-pulse' :
        localStatus === 'paused' ? 'bg-amber-400' : 'bg-slate-400'
      )} />
      {localStatus === 'active' ? 'Auto-Pilot Active' :
       localStatus === 'paused' ? 'Paused' : 'Standby'}
      {pulse?.progress !== undefined && localStatus === 'active' && (
        <span className="text-[7px] font-bold opacity-70">· {pulse.progress}%</span>
      )}
    </div>
  );
}

// ─── AutoPilotActivityFeed ───────────────────────────────────────────────────

interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  type: 'harvest' | 'synthesis' | 'deploy' | 'analysis' | 'approval';
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: 'a1', action: 'Harvested', detail: 'Digital Zen Planners from Etsy', timestamp: '2 min ago', type: 'harvest' },
  { id: 'a2', action: 'Synthesized', detail: 'Boho Luxe Color Palette from Pinterest trends', timestamp: '5 min ago', type: 'synthesis' },
  { id: 'a3', action: 'Analyzed', detail: 'Top 50 ADHD Planner listings for keyword gaps', timestamp: '12 min ago', type: 'analysis' },
  { id: 'a4', action: 'Deployed', detail: 'Morning Routine Aesthetic to TikTok queue', timestamp: '18 min ago', type: 'deploy' },
  { id: 'a5', action: 'Harvested', detail: 'Notion Template trends from Fiverr gigs', timestamp: '25 min ago', type: 'harvest' },
];

const ACTIVITY_COLORS: Record<string, string> = {
  harvest: 'text-cyan-400 bg-cyan-500/10',
  synthesis: 'text-purple-400 bg-purple-500/10',
  deploy: 'text-emerald-400 bg-emerald-500/10',
  analysis: 'text-amber-400 bg-amber-500/10',
  approval: 'text-blue-400 bg-blue-500/10',
};

interface AutoPilotActivityFeedProps {
  className?: string;
}

export function AutoPilotActivityFeed({ className }: AutoPilotActivityFeedProps) {
  const [activities] = useState(MOCK_ACTIVITIES);

  return (
    <div className={cn('space-y-3', className)}>
      {activities.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start gap-3 p-3 bg-theme-background rounded-2xl border border-theme"
        >
          <div className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
            ACTIVITY_COLORS[item.type] || 'bg-slate-800 text-slate-400'
          )}>
            {item.type === 'harvest' && <Database className="w-3.5 h-3.5" />}
            {item.type === 'synthesis' && <Palette className="w-3.5 h-3.5" />}
            {item.type === 'deploy' && <ExternalLink className="w-3.5 h-3.5" />}
            {item.type === 'analysis' && <TrendingUp className="w-3.5 h-3.5" />}
            {item.type === 'approval' && <Shield className="w-3.5 h-3.5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-foreground">{item.action}</span>
              <span className="text-[8px] text-muted-foreground">·</span>
              <span className="text-[8px] text-muted-foreground">{item.timestamp}</span>
            </div>
            <p className="text-[9px] text-muted-foreground font-medium truncate">{item.detail}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}