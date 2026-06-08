"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Play,
  ThumbsUp,
  Zap,
  Clock,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformMetric {
  platform: string;
  color: string;
  borderColor: string;
  logo: string;
  metrics: {
    label: string;
    value: string;
    change: string;
    direction: 'up' | 'down';
    icon: any;
  }[];
}

const platformData: PlatformMetric[] = [
  {
    platform: 'TikTok',
    color: 'text-pink-400',
    borderColor: 'border-pink-500/30',
    logo: '/brands/tiktok_128.png',
    metrics: [
      { label: 'Views', value: '124.5K', change: '+18%', direction: 'up', icon: Eye },
      { label: 'Likes', value: '8.4K', change: '+12%', direction: 'up', icon: Heart },
      { label: 'Comments', value: '1.2K', change: '+24%', direction: 'up', icon: MessageCircle },
      { label: 'Shares', value: '450', change: '+8%', direction: 'up', icon: Share2 },
    ]
  },
  {
    platform: 'Instagram',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    logo: '/brands/instagram_128.png',
    metrics: [
      { label: 'Views', value: '45.2K', change: '+5%', direction: 'up', icon: Eye },
      { label: 'Likes', value: '3.1K', change: '-2%', direction: 'down', icon: Heart },
      { label: 'Comments', value: '240', change: '+15%', direction: 'up', icon: MessageCircle },
      { label: 'Shares', value: '120', change: '+22%', direction: 'up', icon: Share2 },
    ]
  },
  {
    platform: 'YouTube',
    color: 'text-red-400',
    borderColor: 'border-red-500/30',
    logo: '/brands/youtube_128.png',
    metrics: [
      { label: 'Views', value: '12.8K', change: '+34%', direction: 'up', icon: Eye },
      { label: 'Likes', value: '1.5K', change: '+28%', direction: 'up', icon: ThumbsUp },
      { label: 'Comments', value: '180', change: '+10%', direction: 'up', icon: MessageCircle },
      { label: 'Subs', value: '+320', change: '+5%', direction: 'up', icon: Users },
    ]
  },
  {
    platform: 'Etsy',
    color: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    logo: '/brands/etsy_128.png',
    metrics: [
      { label: 'Visits', value: '8.2K', change: '+15%', direction: 'up', icon: Eye },
      { label: 'Orders', value: '142', change: '+8%', direction: 'up', icon: Zap },
      { label: 'Rev', value: '$4.2K', change: '+22%', direction: 'up', icon: TrendingUp },
      { label: 'Conv', value: '1.7%', change: '+0.2%', direction: 'up', icon: Activity },
    ]
  }
];

const conversionData = [
  { platform: 'TikTok', rate: '4.8%', trend: 'up', change: '+0.6%' },
  { platform: 'Instagram', rate: '1.2%', trend: 'down', change: '-0.3%' },
  { platform: 'YouTube', rate: '4.5%', trend: 'up', change: '+0.9%' },
  { platform: 'Etsy', rate: '1.7%', trend: 'up', change: '+0.2%' },
];

export function SocialMediaRadar() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-black text-foreground text-sm uppercase tracking-tight">Social Media Radar</h3>
            <p className="text-[10px] text-muted-foreground font-medium">Granular platform performance tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <Zap className="w-3 h-3 text-primary" />
          <span className="text-[8px] font-black text-primary uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformData.map((platform) => (
          <motion.button
            key={platform.platform}
            onClick={() => setSelectedPlatform(selectedPlatform === platform.platform ? null : platform.platform)}
            whileHover={{ y: -2 }}
            className={cn(
              "p-5 bg-theme-surface border-2 rounded-[28px] text-left transition-all group",
              selectedPlatform === platform.platform ? "border-primary shadow-sm" : "border-theme hover:border-primary/30"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white p-1 border border-theme">
                  <Image 
                    src={platform.logo} 
                    alt={platform.platform} 
                    fill 
                    className="object-contain"
                  />
                </div>
                <h4 className={cn("font-black text-sm uppercase tracking-tight", platform.color)}>{platform.platform}</h4>
              </div>
              <div className={cn("p-2 rounded-xl bg-theme-background border border-theme", platform.color)}>
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {platform.metrics.map((metric) => (
                <div key={metric.label} className="space-y-1">
                  <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                    <metric.icon className="w-2.5 h-2.5" />
                    {metric.label}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-foreground">{metric.value}</span>
                    <span className={cn(
                      "text-[9px] font-black flex items-center",
                      metric.direction === 'up' ? "text-emerald-400" : "text-red-400"
                    )}>
                      {metric.direction === 'up' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Conversion Rates */}
      <div className="p-5 bg-theme-surface border-2 border-theme rounded-[28px] space-y-4">
        <h4 className="font-black text-foreground text-xs uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Conversion Rates
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {conversionData.map((item) => (
            <div key={item.platform} className="text-center space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{item.platform}</p>
              <p className="text-xl font-black text-foreground">{item.rate}</p>
              <span className={cn(
                "text-[9px] font-black inline-flex items-center gap-0.5",
                item.trend === 'up' ? "text-emerald-400" : "text-red-400"
              )}>
                {item.trend === 'up' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Detail (when platform selected) */}
      <AnimatePresence>
        {selectedPlatform && (() => {
          const data = platformData.find(p => p.platform === selectedPlatform);
          if (!data) return null;
          return (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 bg-slate-900 rounded-[28px] border border-slate-800 space-y-4 overflow-hidden"
            >
              <h4 className={cn("font-black text-sm uppercase tracking-tight", data.color)}>{data.platform} — Deep Dive</h4>
              <p className="text-sm text-slate-300 italic">
                "Engagement velocity is {data.metrics[0].direction === 'up' ? 'accelerating' : 'decelerating'}. I recommend {data.platform === 'TikTok' ? 'posting 2x daily during peak hours (6-9 PM)' : data.platform === 'Instagram' ? 'focusing on Reels content for higher reach' : data.platform === 'YouTube' ? 'optimizing video titles for search discovery' : 'refreshing Etsy keywords and checking seasonal best-sellers'}."
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-[8px] uppercase tracking-widest border border-primary/20 hover:bg-primary/20 transition-all">
                  Auto-Optimize Strategy
                </button>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}