"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  ArrowUpRight,
  Clock,
  Sparkles,
  Target,
  Zap,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Youtube,
  Music2,
  Camera,
  ExternalLink,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PostPerformance {
  id: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  title: string;
  thumbnail: string;
  postedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  trend: 'up' | 'down' | 'stable';
  trendChange: string;
}

interface PlatformSummary {
  platform: 'tiktok' | 'instagram' | 'youtube';
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgEngagementRate: number;
  followers: number;
  followerChange: string;
  postsThisWeek: number;
  weeklyViewsChange: string;
  weeklyViewsTrend: 'up' | 'down';
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const platformSummaries: PlatformSummary[] = [
  {
    platform: 'tiktok',
    totalViews: 124500,
    totalLikes: 18200,
    totalComments: 3400,
    totalShares: 5200,
    avgEngagementRate: 14.6,
    followers: 8450,
    followerChange: '+12.4%',
    postsThisWeek: 7,
    weeklyViewsChange: '+24.3%',
    weeklyViewsTrend: 'up',
  },
  {
    platform: 'instagram',
    totalViews: 45200,
    totalLikes: 8900,
    totalComments: 1200,
    totalShares: 1800,
    avgEngagementRate: 8.2,
    followers: 3200,
    followerChange: '+5.1%',
    postsThisWeek: 4,
    weeklyViewsChange: '-2.1%',
    weeklyViewsTrend: 'down',
  },
  {
    platform: 'youtube',
    totalViews: 12800,
    totalLikes: 2100,
    totalComments: 450,
    totalShares: 320,
    avgEngagementRate: 16.3,
    followers: 980,
    followerChange: '+8.7%',
    postsThisWeek: 2,
    weeklyViewsChange: '+31.2%',
    weeklyViewsTrend: 'up',
  },
];

const recentPosts: PostPerformance[] = [
  {
    id: '1',
    platform: 'tiktok',
    title: 'Morning Routine with Digital Planner',
    thumbnail: 'TikTok',
    postedAt: '2 hours ago',
    views: 28400,
    likes: 4200,
    comments: 380,
    shares: 1100,
    engagementRate: 16.2,
    trend: 'up',
    trendChange: '+34%',
  },
  {
    id: '2',
    platform: 'instagram',
    title: 'New Product Teaser - Zen Collection',
    thumbnail: 'Instagram',
    postedAt: '5 hours ago',
    views: 8200,
    likes: 1800,
    comments: 210,
    shares: 340,
    engagementRate: 11.5,
    trend: 'up',
    trendChange: '+8%',
  },
  {
    id: '3',
    platform: 'youtube',
    title: 'How I Organize My Day with AI Templates',
    thumbnail: 'YouTube',
    postedAt: '1 day ago',
    views: 3600,
    likes: 580,
    comments: 140,
    shares: 95,
    engagementRate: 17.8,
    trend: 'up',
    trendChange: '+42%',
  },
  {
    id: '4',
    platform: 'tiktok',
    title: 'Behind the Scenes: Creating a Journal',
    thumbnail: 'TikTok',
    postedAt: '1 day ago',
    views: 12100,
    likes: 2100,
    comments: 180,
    shares: 650,
    engagementRate: 15.7,
    trend: 'up',
    trendChange: '+12%',
  },
  {
    id: '5',
    platform: 'instagram',
    title: 'Customer Review Highlight Reel',
    thumbnail: 'Instagram',
    postedAt: '2 days ago',
    views: 5400,
    likes: 950,
    comments: 85,
    shares: 120,
    engagementRate: 8.9,
    trend: 'down',
    trendChange: '-5%',
  },
];

// ─── Platform Icon ───────────────────────────────────────────────────────────

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    tiktok: <Music2 className={className} />,
    instagram: <Camera className={className} />,
    youtube: <Youtube className={className} />,
  };
  return <>{icons[platform] || <ExternalLink className={className} />}</>;
}

const platformColors: Record<string, string> = {
  tiktok: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  instagram: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  youtube: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const platformLabels: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
};

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

// ─── Platform Summary Card ───────────────────────────────────────────────────

function PlatformSummaryCard({ summary }: { summary: PlatformSummary }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-theme-surface border-2 border-theme rounded-[28px] overflow-hidden hover:border-primary/30 transition-all"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", platformColors[summary.platform])}>
            <PlatformIcon platform={summary.platform} className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-foreground uppercase tracking-tight">{platformLabels[summary.platform]}</h4>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full",
                summary.weeklyViewsTrend === 'up'
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              )}>
                {summary.weeklyViewsChange}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
              {summary.followers.toLocaleString()} followers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-black text-foreground">{formatNumber(summary.totalViews)}</p>
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Views</p>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
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
            <div className="px-5 pb-5 space-y-4 border-t border-theme pt-4">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-theme-background rounded-2xl border border-theme">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Likes</p>
                  <p className="text-sm font-black text-foreground mt-1">{formatNumber(summary.totalLikes)}</p>
                </div>
                <div className="p-3 bg-theme-background rounded-2xl border border-theme">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Comments</p>
                  <p className="text-sm font-black text-foreground mt-1">{formatNumber(summary.totalComments)}</p>
                </div>
                <div className="p-3 bg-theme-background rounded-2xl border border-theme">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Shares</p>
                  <p className="text-sm font-black text-foreground mt-1">{formatNumber(summary.totalShares)}</p>
                </div>
                <div className="p-3 bg-theme-background rounded-2xl border border-theme">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Engagement</p>
                  <p className="text-sm font-black text-foreground mt-1">{summary.avgEngagementRate}%</p>
                </div>
              </div>

              {/* AI Strategy Suggestion */}
              <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl border border-primary/10 flex items-start gap-3">
                <BrainCircuit className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">
                  AI Strategy: {summary.platform === 'tiktok'
                    ? 'Your TikTok engagement is strong (+24% WoW). Increase posting frequency to 2x/day for max reach.'
                    : summary.platform === 'instagram'
                    ? 'Instagram views dipped slightly. Try Reels with trending audio to regain momentum.'
                    : 'YouTube growth is accelerating (+31%). Consider a weekly series to build subscriber velocity.'}
                </p>
              </div>

              {/* Recent Posts Mini-List */}
              <div className="space-y-2">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                  Recent Posts ({summary.postsThisWeek} this week)
                </p>
                {recentPosts
                  .filter(p => p.platform === summary.platform)
                  .slice(0, 2)
                  .map(post => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-theme-background rounded-xl border border-theme">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-[10px] font-bold text-foreground truncate">{post.title}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[8px] font-black text-muted-foreground">{formatNumber(post.views)}</span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1",
                          post.trend === 'up' ? "text-emerald-400" : post.trend === 'down' ? "text-red-400" : "text-muted-foreground"
                        )}>
                          {post.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span className="text-[8px] font-black">{post.trendChange}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Post Performance Card ───────────────────────────────────────────────────

function PostCard({ post }: { post: PostPerformance }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-theme-surface border border-theme rounded-[24px] space-y-4 hover:border-primary/20 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shrink-0", platformColors[post.platform])}>
            <PlatformIcon platform={post.platform} className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{post.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                {platformLabels[post.platform]}
              </span>
              <span className="text-[8px] text-muted-foreground">·</span>
              <Clock className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[8px] text-muted-foreground">{post.postedAt}</span>
            </div>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black",
          post.trend === 'up' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
        )}>
          {post.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {post.trendChange}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center p-2 bg-theme-background rounded-xl border border-theme">
          <Eye className="w-3 h-3 text-primary mx-auto mb-1" />
          <p className="text-xs font-black text-foreground">{formatNumber(post.views)}</p>
          <p className="text-[6px] font-black text-muted-foreground uppercase tracking-wider">Views</p>
        </div>
        <div className="text-center p-2 bg-theme-background rounded-xl border border-theme">
          <Heart className="w-3 h-3 text-red-400 mx-auto mb-1" />
          <p className="text-xs font-black text-foreground">{formatNumber(post.likes)}</p>
          <p className="text-[6px] font-black text-muted-foreground uppercase tracking-wider">Likes</p>
        </div>
        <div className="text-center p-2 bg-theme-background rounded-xl border border-theme">
          <MessageCircle className="w-3 h-3 text-blue-400 mx-auto mb-1" />
          <p className="text-xs font-black text-foreground">{formatNumber(post.comments)}</p>
          <p className="text-[6px] font-black text-muted-foreground uppercase tracking-wider">Comments</p>
        </div>
        <div className="text-center p-2 bg-theme-background rounded-xl border border-theme">
          <Share2 className="w-3 h-3 text-emerald-400 mx-auto mb-1" />
          <p className="text-xs font-black text-foreground">{formatNumber(post.shares)}</p>
          <p className="text-[6px] font-black text-muted-foreground uppercase tracking-wider">Shares</p>
        </div>
      </div>

      {/* Engagement Rate */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-3 h-3 text-muted-foreground" />
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
            Engagement Rate
          </span>
        </div>
        <span className="text-xs font-black text-foreground">{post.engagementRate}%</span>
      </div>
    </motion.div>
  );
}

// ─── Main Social Media Radar Component ──────────────────────────────────────

export function SocialMediaRadar() {
  const [activeView, setActiveView] = useState<'overview' | 'posts'>('overview');
  const [selectedPlatform, setSelectedPlatform] = useState<string | 'all'>('all');

  const filteredPosts = selectedPlatform === 'all'
    ? recentPosts
    : recentPosts.filter(p => p.platform === selectedPlatform);

  const platforms = ['all', 'tiktok', 'instagram', 'youtube'] as const;

  const totalViews = platformSummaries.reduce((sum, p) => sum + p.totalViews, 0);
  const totalEngagement = platformSummaries.reduce((sum, p) => sum + p.totalLikes + p.totalComments + p.totalShares, 0);
  const conversionRate = totalViews > 0 ? ((totalEngagement / totalViews) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-black text-foreground text-lg uppercase tracking-tight">Social Media Radar</h3>
            <p className="text-xs text-muted-foreground font-medium">
              Real-time performance monitoring across {platformSummaries.length} platforms
            </p>
          </div>
        </div>

        {/* Aggregate KPIs */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-black text-foreground">{formatNumber(totalViews)}</p>
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Total Reach</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-primary">{conversionRate}%</p>
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Engage Rate</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex bg-theme-background p-1 rounded-[20px] border-2 border-theme">
        {(['overview', 'posts'] as const).map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-[16px] font-black text-[10px] uppercase tracking-wider transition-all",
              activeView === view
                ? "bg-theme-surface text-foreground shadow-sm border border-theme"
                : "text-slate-400 hover:text-foreground hover:bg-theme-surface/50"
            )}
          >
            {view === 'overview' ? (
              <BarChart3 className={cn("w-3.5 h-3.5", activeView === view ? "text-primary" : "")} />
            ) : (
              <Play className={cn("w-3.5 h-3.5", activeView === view ? "text-primary" : "")} />
            )}
            {view === 'overview' ? 'Platform Overview' : 'Post Performance'}
          </button>
        ))}
      </div>

      {/* Overview View */}
      {activeView === 'overview' && (
        <div className="space-y-4">
          {platformSummaries.map((summary, i) => (
            <motion.div
              key={summary.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <PlatformSummaryCard summary={summary} />
            </motion.div>
          ))}

          {/* Conversion Comparison */}
          <div className="p-5 bg-theme-surface border-2 border-theme rounded-[28px] space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <h4 className="font-black text-foreground text-sm uppercase tracking-wider">Conversion Rate by Platform</h4>
            </div>
            <div className="space-y-3">
              {platformSummaries.map(summary => (
                <div key={summary.platform} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={summary.platform} className="w-3 h-3" />
                      <span className="text-[10px] font-black text-foreground uppercase">{platformLabels[summary.platform]}</span>
                    </div>
                    <span className="text-xs font-black text-foreground">{summary.avgEngagementRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-theme-background rounded-full overflow-hidden border border-theme">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(summary.avgEngagementRate * 4, 100)}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={cn(
                        "h-full rounded-full",
                        summary.platform === 'tiktok' ? "bg-pink-500" :
                        summary.platform === 'instagram' ? "bg-purple-500" : "bg-red-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-theme-background rounded-2xl border border-theme flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-[10px] text-muted-foreground font-medium italic">
                "Your YouTube content has the highest engagement rate (16.3%). Consider repurposing top-performing YouTube scripts into TikTok and Reels to cross-pollinate reach."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Posts View */}
      {activeView === 'posts' && (
        <div className="space-y-4">
          {/* Platform Filter */}
          <div className="flex gap-2 flex-wrap">
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={cn(
                  "px-3 py-2 rounded-xl font-black text-[9px] uppercase tracking-wider border transition-all",
                  selectedPlatform === platform
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-theme-surface text-muted-foreground border-theme hover:text-foreground"
                )}
              >
                {platform === 'all' ? 'All Platforms' : platformLabels[platform]}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full p-12 text-center space-y-4 bg-theme-surface rounded-[32px] border-2 border-dashed border-theme">
                <div className="w-16 h-16 bg-theme-background rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-black text-foreground uppercase italic">No Posts Found</h4>
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    No recent posts for this platform. Link your accounts to start tracking.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}