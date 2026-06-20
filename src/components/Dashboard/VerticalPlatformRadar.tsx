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

      <div className="flex flex-col gap-6">
        {displayData.map((platform) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group relative bg-theme-surface border-2 border-theme rounded-[32px] md:rounded-[48px] overflow-hidden transition-all shadow-xl"
          >
            {/* Background Glow */}
            <div className={cn("absolute top-0 right-0 w-64 h-64 blur-[100px] -z-10 opacity-20 transition-opacity group-hover:opacity-40", platform.bgSecondary)} />

            <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
              {/* Left Side: Identity & Health Status */}
              <div className="p-8 md:p-10 flex items-center gap-6 bg-primary/5 border-b md:border-b-0 md:border-r border-theme/30">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-[32px] bg-white p-3 border border-theme shadow-2xl rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500">
                  <Image 
                    src={platform.logo} 
                    alt={platform.name} 
                    fill 
                    className="object-contain p-4"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter italic">{platform.name}</h3>
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Neural Health: Optimal
                    </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Synced: 2m ago</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Vital Metrics & Communication */}
              <div className="p-8 md:p-10 flex flex-col justify-center gap-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {platform.id === 'etsy' ? <Eye className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                      {platform.metricLabel}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-foreground tracking-tighter">{platform.followers}</span>
                      <span className="text-[11px] font-black text-emerald-500 flex items-center">
                        <ArrowUpRight className="w-3 h-3" />
                        {platform.growth}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {platform.id === 'etsy' ? <ShoppingBag className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
                      {platform.secondaryMetricLabel}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-foreground tracking-tighter">{platform.likes}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-theme/20">
                  <div className="flex items-center gap-4">
                    {/* Neural Inbox Link */}
                    <button className="flex items-center gap-3 px-5 py-3 bg-theme-background border border-theme rounded-2xl group/btn transition-all hover:border-primary">
                      <div className="relative">
                        <Mail className={cn("w-5 h-5 transition-colors", platform.messages > 0 ? "text-primary animate-pulse" : "text-slate-500 group-hover/btn:text-primary")} />
                        {platform.messages > 0 && (
                          <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center border border-theme-surface">
                            {platform.messages}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Neural Inbox</span>
                    </button>
                  </div>

                  {/* External Bridge */}
                  <button className="w-12 h-12 flex items-center justify-center bg-theme-background border border-theme rounded-2xl text-slate-500 hover:text-primary transition-all hover:scale-105 active:scale-95">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        {/* Version Verification */}
        <div className="flex justify-center pt-8">
          <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
            Vital Signs Engine v3.1.0 (Real-Time)
          </span>
        </div>
        ))}
      </div>
    </section>
  );
}
