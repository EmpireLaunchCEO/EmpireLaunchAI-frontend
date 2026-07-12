"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  ExternalLink,
  Stars,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { ViralSignalsPanel, generateMockSignals } from '@/components/Dashboard/MarketHeatMeter';

// ─── Platform Data & Config ──────────────────────────────────────────────────

const MOCK_PLATFORM_DATA: Record<string, any> = {
  tiktok: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  instagram: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'down' },
  youtube: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  facebook: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  etsy: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  fiverr: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  gmail: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  canva: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  kittl: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  capcut: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
  bannerbear: { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagementRate: 0, followers: 0, followerChange: '0%', postsThisWeek: 0, weeklyViewsChange: '0%', weeklyViewsTrend: 'up' },
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

const PLATFORM_3D_ICONS: Record<string, string> = {
  tiktok: '/brands/tiktok_128.png',
  instagram: '/brands/instagram_128.png',
  youtube: '/brands/youtube_128.png',
  etsy: '/brands/etsy_128.png',
  fiverr: '/brands/fiverr_128.png',
  gmail: '/brands/gmail_128.png',
  facebook: '/brands/facebook_128.png',
  canva: '/brands/canva_128.png',
  kittl: '/brands/kittl_128.png',
  capcut: '/brands/capcut_128.png',
  godaddy: '/brands/godaddy_128.png',
  systeme_io: '/brands/systeme_io_128.png',
  shopify: '/brands/shopify_128.png',
  pinterest: '/brands/pinterest_128.png',
  tiktok_shop: '/brands/tiktok_shop_128.png',
  shipstation: '/brands/shipstation_128.png',
  dsers: '/brands/dsers_128.png',
  zendrop: '/brands/zendrop_128.png',
  spocket: '/brands/spocket_128.png',
  printful: '/brands/printful_128.png',
  printify: '/brands/printify_128.png',
  cj_dropshipping: '/brands/cj_dropshipping_128.png',
  autods: '/brands/autods_128.png',
  bannerbear: '/brands/bannerbear_128.png',
};

function PlatformIcon({ platform, className, size = 16 }: { platform: string; className?: string; size?: number }) {
  const icon3d = PLATFORM_3D_ICONS[platform];
  if (icon3d) {
    return (
      <div className="relative flex items-center justify-center bg-white rounded-lg p-0.5 border border-theme/50" style={{ width: size + 8, height: size + 8 }}>
        <Image src={icon3d} alt={platform} width={size} height={size} className="object-contain" />
      </div>
    );
  }

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
      className="bg-theme-background border-2 border-theme rounded-[24px] overflow-hidden hover:border-white/30 transition-all shadow-sm"
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
    <div className="p-4 bg-theme-background border border-theme rounded-2xl space-y-2 hover:border-white/30 transition-all">
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

// ─── Research Panel ────────────────────────────────────────────────────
function ResearchPanel({ displayNiche, connectedPlatforms, onSyncStateChange }: { displayNiche: string; connectedPlatforms: string[]; onSyncStateChange?: (syncing: boolean) => void }) {
  const [researchText, setResearchText] = useState("Initializing research protocols...");
  const [researchPhase, setResearchPhase] = useState("Connecting to platforms...");
  const [progress, setProgress] = useState(0);
  const [platformIntels, setPlatformIntels] = useState<any[]>([]);

  useEffect(() => {
    // Fetch real research data from backend
    const fetchIntel = async () => {
      onSyncStateChange?.(true);
      setResearchText(`Analyzing trending content in '${displayNiche}'...`);
      setResearchPhase("Gathering platform intelligence");
      setProgress(25);

      try {
        const userId = localStorage.getItem('empire_userId');
        if (!userId) {
          onSyncStateChange?.(false);
          return;
        }

        // Fetch global DNA/market research data
        const dnaRes = await fetch(`${API_URL}/api/market-dna/global?limit=10`, {
          headers: { 'x-user-id': userId }
        });
        
        if (dnaRes.ok) {
          const dnaData = await dnaRes.json();
          if (dnaData.strands && dnaData.strands.length > 0) {
            // Group strands by source platform
            const byPlatform: Record<string, any[]> = {};
            dnaData.strands.forEach((s: any) => {
              const p = s.sourcePlatform || 'unknown';
              if (!byPlatform[p]) byPlatform[p] = [];
              byPlatform[p].push(s);
            });
            
            const intels = Object.entries(byPlatform).map(([platform, strands]) => ({
              platform,
              strandCount: strands.length,
              topCategories: [...new Set(strands.map((s: any) => s.subCategory).filter(Boolean))].slice(0, 3),
              avgScore: Math.round(strands.reduce((a: number, s: any) => a + s.performanceScore, 0) / strands.length),
            }));
            
            setPlatformIntels(intels);
            setResearchText(`Market intelligence gathered for ${connectedPlatforms.length} connected platforms`);
            setResearchPhase("Analysis complete");
            setProgress(100);
            onSyncStateChange?.(false);
            return;
          }
        }
      } catch {
        // Fallback: use niche-based research text
      }

      // Fallback: platform-specific research
      const platformNames = connectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
      setResearchText(`Monitoring ${connectedPlatforms.length} platforms for ${displayNiche} trends`);
      setResearchPhase("AI analysis active");
      setProgress(85);
      onSyncStateChange?.(false);
    };

    fetchIntel();
    // Refresh every 30 seconds
    const interval = setInterval(fetchIntel, 30000);
    return () => clearInterval(interval);
  }, [displayNiche, connectedPlatforms]);

  return (
    <div className="p-6 border-2 border-dashed border-theme rounded-3xl space-y-4 bg-theme-surface/50">
      <div className="flex items-center gap-3">
        <BrandedGlobe size="sm" spinning />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground italic text-sm truncate">"{researchText}"</p>
        </div>
      </div>
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: progress + "%" }}
          className="bg-primary h-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
        />
      </div>
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
        <span>{researchPhase}</span>
        <span>{progress}% Complete</span>
      </div>
      {platformIntels.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-2">
          {platformIntels.map((intel) => (
            <div key={intel.platform} className="p-2 bg-theme-background/50 rounded-xl border border-theme/50">
              <p className="text-[9px] font-black uppercase text-primary">{intel.platform}</p>
              <p className="text-[10px] font-bold text-foreground">{intel.strandCount} patterns</p>
              <p className="text-[8px] text-muted-foreground">Score: {intel.avgScore}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Social Media Radar Component ──────────────────────────────────────

export function SocialMediaRadar() {
  const { activeEmpire, isAdmin, isLinkingComplete, connectedPlatforms } = useEmpire();
  const [userBusinessNiche, setUserBusinessNiche] = useState<string>('');
  const [userBusinessAngle, setUserBusinessAngle] = useState<string>('');

  // Fetch user's actual business niche from backend settings
  useEffect(() => {
    const fetchNiche = async () => {
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') : null;
        if (!userId) return;
        const res = await fetch(`${API_URL}/api/settings/`, {
          headers: {
            'Authorization': 'Bearer mock-mobile-token',
            'x-user-id': userId
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.businessNiche) setUserBusinessNiche(data.businessNiche);
          if (data.businessAngle) setUserBusinessAngle(data.businessAngle);
        }
      } catch (e) {
        // Silently fail — fall back to empire/context niche
      }
    };
    fetchNiche();
  }, []);

  const displayNiche = userBusinessNiche || activeEmpire?.niche || (isAdmin ? "All in One Business Runner" : 'business');
  const displayAngle = userBusinessAngle || activeEmpire?.angle || '';

  const [isThinking, setIsThinking] = useState(false);
  const [activePanel, setActivePanel] = useState<'overview' | 'signals' | 'metrics'>('overview');
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viralSignals] = useState(() => generateMockSignals());

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

  // Sync state is controlled by ResearchPanel's real data fetching
  const handleSyncStateChange = (syncing: boolean) => {
    setIsThinking(syncing);
  };

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
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'intelligence' as const, label: 'Signals', icon: TrendingUp },
    { id: 'research' as const, label: 'Research', icon: BrainCircuit },
  ];

  const intelligenceMetrics = [
    { label: 'Processing Speed', value: isLinkingComplete ? '98%' : '0%', detail: isLinkingComplete ? 'Neural sync active' : 'Awaiting data link', icon: Cpu },
    { label: 'Prediction Accuracy', value: isLinkingComplete ? '94%' : '0%', detail: isLinkingComplete ? 'Confidence score' : 'Awaiting data link', icon: Target },
    { label: 'Data Sources', value: isLinkingComplete ? connectedPlatforms.length.toString() : '0', detail: isLinkingComplete ? 'Platforms monitored' : 'Awaiting data link', icon: Network },
    { label: 'Market Coverage', value: isLinkingComplete ? '100%' : '0%', detail: isLinkingComplete ? 'Digital goods niche' : 'Awaiting data link', icon: Globe },
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

      <div className="absolute -top-4 right-4 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95 shadow-lg"
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
                      "Market velocity is favoring high-contrast 'Sage Green' aesthetics. I recommend creating a campaign variant immediately to capture current search volume."
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
                   className="p-5 bg-theme-background border-2 border-theme rounded-[24px] space-y-3 hover:border-white/30 transition-all group"
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

                                 {/* Real-Time Market Heat — Etsy & Fiverr Velocity Meters */}
                                 {isLinkingComplete && (
                                   <div className="pt-4">
                                     <ViralSignalsPanel
                                       etsySignal={viralSignals.etsy}
                                       fiverrSignal={viralSignals.fiverr}
                                     />
                                   </div>
                                 )}
                               </motion.div>
                             )}
        {activePanel === 'research' && (
          <motion.div
            key="research"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="p-6 bg-theme-background border-2 border-theme rounded-[32px] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-foreground pr-2">AI Active Research</h3>
                <button 
                  onClick={() => {
                    const el = document.querySelector('[data-consultant-input]') as HTMLInputElement;
                    if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth' }); }
                  }}
                  className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all cursor-pointer"
                >New Request +</button>
              </div>

              <div className="space-y-4">
                {connectedPlatforms.length > 0 ? (
                  <ResearchPanel displayNiche={displayNiche} connectedPlatforms={connectedPlatforms} onSyncStateChange={handleSyncStateChange} />
                ) : (
                  <div className="p-8 text-center text-muted-foreground font-medium text-xs italic bg-theme-background rounded-3xl border border-theme">
                    Link a platform in the Link Center to initialize research protocols.
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-blue-900/20 border-2 border-indigo-500/20 rounded-[32px] space-y-4">
               <h4 className="text-sm font-black text-indigo-300 uppercase tracking-widest">Research Roadmap</h4>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">
                 The AI is currently hunting for high-velocity keywords. Once synthesis is complete, a new "Campaign Blueprint" will appear in your Pending Approvals.
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}