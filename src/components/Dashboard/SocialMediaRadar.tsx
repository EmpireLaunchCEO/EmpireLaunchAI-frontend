"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  TrendingUp,
  Target,
  Globe,
  Sparkles,
  BarChart3,
  Signal,
  Cpu,
  ArrowUpRight,
  Clock,
  Network,
  Minus,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Music2,
  Camera,
  Youtube,
  Facebook,
  ShoppingBag,
  Zap,
  Mail,
  Play,
  Palette,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';
import { BrandedGlobe } from '@/components/BrandedGlobe';

// ─── Platform Data & Config ──────────────────────────────────────────────────

const MOCK_PLATFORM_DATA: Record<string, any> = {
  tiktok: { totalViews: 125400, totalLikes: 12400, totalComments: 850, totalShares: 1200, avgEngagementRate: 11.2, followers: 42300, followerChange: '+12%', postsThisWeek: 12, weeklyViewsChange: '+24%', weeklyViewsTrend: 'up' },
  instagram: { totalViews: 85200, totalLikes: 8200, totalComments: 420, totalShares: 350, avgEngagementRate: 9.8, followers: 18500, followerChange: '+8%', postsThisWeek: 8, weeklyViewsChange: '-5%', weeklyViewsTrend: 'down' },
  youtube: { totalViews: 45000, totalLikes: 4200, totalComments: 310, totalShares: 150, avgEngagementRate: 16.3, followers: 8200, followerChange: '+15%', postsThisWeek: 2, weeklyViewsChange: '+31%', weeklyViewsTrend: 'up' },
  facebook: { totalViews: 32000, totalLikes: 1200, totalComments: 150, totalShares: 80, avgEngagementRate: 4.2, followers: 5400, followerChange: '+2%', postsThisWeek: 4, weeklyViewsChange: '+8%', weeklyViewsTrend: 'up' },
  etsy: { totalViews: 12000, totalLikes: 450, totalComments: 120, totalShares: 0, avgEngagementRate: 5.5, followers: 850, followerChange: '+5%', postsThisWeek: 3, weeklyViewsChange: '+15%', weeklyViewsTrend: 'up' },
  fiverr: { totalViews: 8500, totalLikes: 210, totalComments: 45, totalShares: 0, avgEngagementRate: 3.8, followers: 120, followerChange: '+1%', postsThisWeek: 1, weeklyViewsChange: '+10%', weeklyViewsTrend: 'up' },
  gmail: { totalViews: 5400, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 25.4, followers: 1200, followerChange: '+4%', postsThisWeek: 15, weeklyViewsChange: '+12%', weeklyViewsTrend: 'up' },
  canva: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 24, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  kittl: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 8, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  capcut: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 14, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  bannerbear: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 42, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
};

const platformColors: Record<string, string> = {
  tiktok: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  instagram: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  youtube: 'text-red-400 bg-red-500/10 border-red-500/20',
  facebook: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  etsy: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  fiverr: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  gmail: 'text-red-400 bg-red-500/10 border-red-500/20',
  canva: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  kittl: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  capcut: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  bannerbear: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const platformLabels: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
  etsy: 'Etsy',
  fiverr: 'Fiverr',
  gmail: 'Gmail',
  canva: 'Canva',
  kittl: 'Kittl',
  capcut: 'CapCut',
  bannerbear: 'Bannerbear',
};

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    tiktok: <Music2 className={className} />,
    instagram: <Camera className={className} />,
    youtube: <Youtube className={className} />,
    facebook: <Facebook className={className} />,
    etsy: <ShoppingBag className={className} />,
    fiverr: <Zap className={className} />,
    gmail: <Mail className={className} />,
    canva: <Sparkles className={className} />,
    kittl: <Palette className={className} />,
    capcut: <Play className={className} />,
    bannerbear: <Zap className={className} />,
  };
  return <>{icons[platform] || <ExternalLink className={className} />}</>;
}

// ─── Platform Summary Card ───────────────────────────────────────────────────

function PlatformSummaryCard({ summary }: { summary: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-theme-background border-2 border-theme rounded-[24px] overflow-hidden hover:border-primary/30 transition-all shadow-sm"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", platformColors[summary.platform])}>
            <PlatformIcon platform={summary.platform} className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-black text-foreground uppercase tracking-tight text-xs truncate">{platformLabels[summary.platform] || summary.platform}</h4>
            </div>
            <p className="text-[9px] text-muted-foreground font-bold mt-0.5 truncate">
              {summary.handle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-sm font-black text-foreground">{formatNumber(summary.totalViews)}</p>
            <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Views</p>
          </div>
          {expanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-theme pt-3 bg-theme-background/30">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-theme-background rounded-xl border border-theme">
                  <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Likes</p>
                  <p className="text-xs font-black text-foreground mt-0.5">{formatNumber(summary.totalLikes)}</p>
                </div>
                <div className="p-2 bg-theme-background rounded-xl border border-theme">
                  <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Engage</p>
                  <p className="text-xs font-black text-foreground mt-0.5">{summary.avgEngagementRate}%</p>
                </div>
              </div>

              {/* AI Strategy Suggestion */}
              <div className="p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border border-primary/10 flex items-start gap-2">
                <BrainCircuit className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                <p className="text-[9px] text-muted-foreground font-medium italic leading-tight">
                  Strategy: {summary.platform === 'tiktok'
                    ? 'Engagement is strong. Post 2x/day.'
                    : summary.platform === 'instagram'
                    ? 'Views dipped. Try trending Reels.'
                    : 'Growth is up. Focus on shorts.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Market Signal Card ────────────────────────────────────────────────────

function SignalCard({ signal }: { signal: any }) {
  return (
    <div className="p-4 bg-theme-background border border-theme rounded-2xl space-y-2 hover:border-primary/30 transition-all">
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
          signal.direction === 'up' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
        )}>
          {signal.signal}
        </span>
        <span className="text-[9px] font-black text-muted-foreground">{signal.source}</span>
      </div>
      <p className="text-sm font-bold text-foreground">{signal.metric}</p>
      <p className="text-[10px] text-muted-foreground font-medium italic leading-tight">{signal.insight}</p>
      <div className="flex items-center gap-1">
        {signal.direction === 'up' ? (
          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
        ) : (
          <ArrowUpRight className="w-3 h-3 text-red-400 rotate-180" />
        )}
        <span className={cn(
          "text-[9px] font-black",
          signal.direction === 'up' ? "text-emerald-400" : "text-red-400"
        )}>
          {signal.change}
        </span>
      </div>
    </div>
  );
}

// ─── Main Social Media Radar Component ──────────────────────────────────────

export function SocialMediaRadar() {
  const { activeEmpire, isAdmin, isLinkingComplete, connectedPlatforms } = useEmpire();
  const displayNiche = (isAdmin && (!activeEmpire?.niche || activeEmpire?.niche === 'Niche Pending')) ? "AI Business Automation" : (activeEmpire?.niche || 'business');

  const [isThinking, setIsThinking] = useState(false);
  const [activePanel, setActivePanel] = useState<'overview' | 'signals' | 'metrics'>('overview');
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-social-media-radar');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-social-media-radar', String(newState));
  };

  // Simulate AI thinking pulse
  useEffect(() => {
    if (!isLinkingComplete) {
      setIsThinking(false);
      return;
    }
    const timer = setInterval(() => {
      setIsThinking(prev => !prev);
    }, 3000);
    return () => clearInterval(timer);
  }, [isLinkingComplete]);

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-3xl p-6 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[80px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Social Media Radar</h2>
        </div>
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const platformSummaries = connectedPlatforms
    .filter(id => MOCK_PLATFORM_DATA[id])
    .map(id => {
      const mock = MOCK_PLATFORM_DATA[id];
      const vaultData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`empire_vault_${id}`) || '{}') : {};
      const handle = vaultData.handle || `@EmpireLaunch_${id}`;
      return { platform: id, ...mock, handle };
    });

  const panels = [
    { id: 'overview' as const, label: 'Platform Overview', icon: BarChart3 },
    { id: 'intelligence' as const, label: 'Market Intelligence', icon: TrendingUp },
  ];

  const intelligenceMetrics = [
    { label: 'Processing Speed', value: '0%', detail: 'Awaiting data link', icon: Cpu },
    { label: 'Prediction Accuracy', value: '0%', detail: 'Awaiting data link', icon: Target },
    { label: 'Data Sources', value: '0', detail: 'Platforms monitored', icon: Network },
    { label: 'Market Coverage', value: '0%', detail: 'Digital goods niche', icon: Globe },
  ];

  const marketSignals = [
    {
      id: 'signal-1',
      signal: 'TREND DETECTED',
      metric: "Viral Hook: 'Boho Minimalist'",
      source: 'Etsy Search Pulse',
      change: '+114%',
      direction: 'up',
      insight: "Search volume for 'minimalist boho wall art' is up 114%. Suggest creating 3 new variants today.",
    },
    {
      id: 'signal-2',
      signal: 'GAP IDENTIFIED',
      metric: 'Competitor Gap Analysis',
      source: 'Amazon/Etsy Crawler',
      change: 'Inventory Low',
      direction: 'up',
      insight: "Top 3 competitors are low on stock for 'Digital Wedding Planners'. Optimal time to boost ads.",
    },
    {
      id: 'signal-3',
      signal: 'PRICE OPTIMIZED',
      metric: 'Profit Velocity Scan',
      source: 'Financial Engine',
      change: '+$2.50',
      direction: 'up',
      insight: "Your 'Luxe Bundle' is underpriced. Increasing by $2.50 will boost profit by 12% without affecting volume.",
    }
  ];

  return (
    <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 shadow-lg space-y-8 relative overflow-hidden group/radar">
      {/* Decorative background pulse */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10 group-hover/radar:bg-primary/10 transition-colors" />

      <div className="absolute top-6 right-8 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            {isThinking && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
              />
            )}
          </div>
          <div>
            <h3 className="font-black text-foreground text-lg uppercase tracking-tight">Social Media Radar</h3>
            <p className="text-xs text-muted-foreground font-medium italic">Real-time performance monitoring across active platforms</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
            isThinking ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", isThinking ? "bg-emerald-400 animate-pulse" : "bg-slate-400")} />
            {isThinking ? 'Syncing' : 'Idle'}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-theme-background p-1 rounded-[20px] border-2 border-theme">
        {panels.map(panel => (
          <button
            key={panel.id}
            onClick={() => setActivePanel(panel.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-[16px] font-black text-[10px] uppercase tracking-wider transition-all",
              activePanel === panel.id
                ? "bg-theme-surface text-foreground shadow-sm border border-theme"
                : "text-slate-400 hover:text-foreground hover:bg-theme-surface/50"
            )}
          >
            <panel.icon className={cn("w-3.5 h-3.5", activePanel === panel.id ? "text-primary" : "")} />
            {panel.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <AnimatePresence mode="wait">
        {activePanel === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {platformSummaries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platformSummaries.map((summary: any, i: number) => (
                  <PlatformSummaryCard key={summary.platform} summary={summary} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-4 bg-theme-background border border-theme rounded-[32px] border-dashed opacity-50 grayscale">
                <div className="w-16 h-16 bg-theme-surface rounded-full flex items-center justify-center mx-auto">
                  <Signal className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="font-black text-foreground uppercase italic">Radar Offline</h4>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Link platforms to activate neural monitoring.</p>
              </div>
            )}
          </motion.div>
        )}

        {activePanel === 'intelligence' && (
          <motion.div
            key="intelligence"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Live Signals */}
            <div className="p-6 bg-theme-background border-2 border-theme rounded-[32px] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <h4 className="font-black text-foreground text-sm uppercase tracking-wider italic">Live Market Signals</h4>
                </div>
                <BrandedGlobe size="sm" spinning />
              </div>
              
              {!isLinkingComplete ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium max-w-[200px]">
                    Market signals are locked until your first platform link is verified.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {marketSignals.map(signal => (
                      <SignalCard key={signal.id} signal={signal} />
                    ))}
                  </div>
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <p className="text-[10px] font-black uppercase text-primary tracking-widest">AI Strategic Counsel</p>
                    </div>
                    <p className="text-xs text-slate-300 font-medium italic leading-relaxed">
                      "Market velocity is favoring high-contrast 'Sage Green' aesthetics. I recommend creating an 'ADHD Planner' listing variant immediately to capture current search volume."
                    </p>
                    <button className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
                      Execute All Optimizations
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
               {intelligenceMetrics.map((metric, i) => (
                 <motion.div
                   key={metric.label}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-5 bg-theme-background border-2 border-theme rounded-[24px] space-y-3 hover:border-primary/30 transition-all group"
                 >
                   <div className="flex items-center justify-between">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                       <metric.icon className="w-5 h-5 text-primary" />
                     </div>
                     <span className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                       {isLinkingComplete ? metric.value : '0%'}
                     </span>
                   </div>
                   <div>
                     <p className="text-xs font-black text-foreground uppercase tracking-tight">{metric.label}</p>
                     <p className="text-[9px] font-medium text-muted-foreground mt-0.5">
                       {isLinkingComplete ? metric.detail : 'Awaiting data link'}
                     </p>
                   </div>
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
