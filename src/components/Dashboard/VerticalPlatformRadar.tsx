"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  Mail,
  Zap,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  ExternalLink,
  MessageCircle,
  Eye,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';

interface PlatformStatus {
  id: string;
  name: string;
  logo: string;
  followers: string;
  likes: string;
  messages: number;
  growth: string;
  color: string;
  bgSecondary: string;
  metricLabel: string;
  secondaryMetricLabel: string;
}

const PLATFORM_STATUS_DATA: PlatformStatus[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    logo: '/brands/tiktok_128.png',
    followers: '0',
    likes: '0',
    messages: 0,
    growth: '0%',
    color: 'text-pink-500',
    bgSecondary: 'bg-pink-500/5',
    metricLabel: 'Followers',
    secondaryMetricLabel: 'Likes'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    logo: '/brands/instagram_128.png',
    followers: '0',
    likes: '0',
    messages: 0,
    growth: '0%',
    color: 'text-purple-500',
    bgSecondary: 'bg-purple-500/5',
    metricLabel: 'Followers',
    secondaryMetricLabel: 'Likes'
  },
  {
    id: 'etsy',
    name: 'Etsy',
    logo: '/brands/etsy_128.png',
    followers: '0',
    likes: '0',
    messages: 0,
    growth: '0%',
    color: 'text-orange-500',
    bgSecondary: 'bg-orange-500/5',
    metricLabel: 'Visits',
    secondaryMetricLabel: 'Orders'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    logo: '/brands/youtube_128.png',
    followers: '0',
    likes: '0',
    messages: 0,
    growth: '0%',
    color: 'text-red-500',
    bgSecondary: 'bg-red-500/5',
    metricLabel: 'Subs',
    secondaryMetricLabel: 'Views'
  }
];

export function VerticalPlatformRadar() {
  const { connectedPlatforms } = useEmpire();

  // Filter based on connected platforms (simulated for now with all if none connected)
  const displayData = connectedPlatforms.length > 0 
    ? PLATFORM_STATUS_DATA.filter(p => connectedPlatforms.some(cp => cp.toLowerCase() === p.id))
    : PLATFORM_STATUS_DATA;

  if (displayData.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">Neural Vital Signs</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Real-time platform performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
          <Zap className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-[9px] font-black text-primary uppercase">Active Sync</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {displayData.map((platform) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01 }}
            className="group relative bg-theme-surface border-2 border-theme rounded-[32px] p-5 md:p-6 overflow-hidden transition-all hover:border-primary/30 shadow-sm"
          >
            {/* Background Glow */}
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] -z-10 opacity-30", platform.bgSecondary)} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Platform Identity */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-2xl bg-white p-2 border border-theme shadow-sm group-hover:scale-110 transition-transform">
                  <Image 
                    src={platform.logo} 
                    alt={platform.name} 
                    fill 
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{platform.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase">
                      <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                      Healthy
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Synced 2m ago</span>
                  </div>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="flex flex-1 items-center justify-around md:justify-end md:gap-12 lg:gap-20">
                <div className="text-center md:text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {platform.id === 'etsy' ? <Eye className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                    {platform.metricLabel}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-foreground">{platform.followers}</span>
                    <span className="text-[10px] font-black text-emerald-500 flex items-center">
                      <ArrowUpRight className="w-3 h-3" />
                      {platform.growth}
                    </span>
                  </div>
                </div>

                <div className="text-center md:text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {platform.id === 'etsy' ? <ShoppingBag className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
                    {platform.secondaryMetricLabel}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-foreground">{platform.likes}</span>
                  </div>
                </div>

                {/* Mail Icon / Messages */}
                <div className="relative group/mail">
                  <button className="w-12 h-12 rounded-2xl bg-theme-background border border-theme flex items-center justify-center text-slate-400 hover:text-primary transition-all relative">
                    <Mail className={cn("w-6 h-6", platform.messages > 0 ? "text-primary animate-pulse" : "opacity-30")} />
                    {platform.messages > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-theme-surface">
                        {platform.messages}
                      </span>
                    )}
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/mail:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl z-20">
                    {platform.messages > 0 ? `${platform.messages} unread messages` : 'No new messages'}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button className="p-3 bg-theme-background border border-theme rounded-2xl text-slate-400 hover:text-primary transition-all group-hover:border-primary/20">
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
