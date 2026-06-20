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
  ShoppingBag,
  Cpu
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
  const { 
    connectedPlatforms,
    platformPermissions,
    updatePlatformPermission,
    spendingPermissions,
    updateSpendingPermission
  } = useEmpire();

  // Filter based on connected platforms (simulated for now with all if none connected)
  const displayData = connectedPlatforms.length > 0 
    ? PLATFORM_STATUS_DATA.filter(p => connectedPlatforms.some(cp => cp.toLowerCase() === p.id))
    : PLATFORM_STATUS_DATA;

  if (displayData.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight italic">Neural Vital Signs</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Platform Governance & Performance</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-black text-primary uppercase tracking-widest">Neural Link Active</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:gap-8">
        {displayData.map((platform) => {
          const id = platform.id;
          const tier = platformPermissions[id] || 'read-only';
          const isSpendingEnabled = spendingPermissions[id] || false;

          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="group relative bg-theme-surface border-2 border-theme rounded-[32px] md:rounded-[48px] overflow-hidden transition-all shadow-xl"
            >
              {/* Background Glow */}
              <div className={cn("absolute top-0 right-0 w-[400px] h-[400px] blur-[100px] -z-10 opacity-10 transition-opacity group-hover:opacity-20", platform.bgSecondary)} />

              <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 min-h-[220px] md:min-h-[280px]">
                {/* LEFT SIDE: Linked App Identity & Performance Metrics */}
                <div className="p-6 md:p-10 flex flex-col justify-center gap-6 bg-primary/5 border-b md:border-b-0 md:border-r border-theme/30">
                  <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] bg-white p-3 border-2 border-theme shadow-xl transition-all duration-700">
                      <Image 
                        src={platform.logo} 
                        alt={platform.name} 
                        fill 
                        className="object-contain p-3"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter italic leading-none">{platform.name}</h3>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-[9px] font-black text-green-500 uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Neural Health: Optimal
                        </span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Last Sync: 124ms ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics - Vital Signs */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 md:p-4 rounded-[20px] bg-theme-background/40 border border-theme/30 backdrop-blur-sm">
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{platform.metricLabel}</div>
                      <div className="flex items-end gap-1.5">
                        <span className="text-xl md:text-2xl font-black text-foreground leading-none">{platform.followers}</span>
                        <span className="text-[9px] font-black text-green-500 mb-0.5 flex items-center gap-0.5">
                          <TrendingUp className="w-2.5 h-2.5" />
                          {platform.growth}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 md:p-4 rounded-[20px] bg-theme-background/40 border border-theme/30 backdrop-blur-sm">
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{platform.secondaryMetricLabel}</div>
                      <div className="text-xl md:text-2xl font-black text-foreground leading-none">{platform.likes}</div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: Governance Toggles (AI Capabilities) */}
                <div className="p-6 md:p-10 space-y-4 md:space-y-5 flex flex-col justify-center bg-theme-surface/30">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.2em]">Strict AI Governance</h4>
                      <div className="px-1.5 py-0.5 bg-slate-900 border border-white/10 rounded-md">
                        <span className="text-[7px] font-black text-slate-500 uppercase">Default: Manual Only</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase">Authorization required for AI interaction</p>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    {/* Toggle 1: Co-Pilot */}
                    <button 
                      onClick={() => updatePlatformPermission(id, (tier === 'co-pilot' || tier === 'empire') ? 'read-only' : 'co-pilot')}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 md:p-4 rounded-[18px] md:rounded-[24px] border-2 transition-all group/toggle shadow-lg",
                        (tier === 'co-pilot' || tier === 'empire') 
                          ? "bg-primary/10 border-primary shadow-primary/10" 
                          : "bg-theme-background border-theme hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors",
                          (tier === 'co-pilot' || tier === 'empire') ? "bg-primary text-slate-950" : "bg-slate-800 text-slate-400"
                        )}>
                          <Zap className="w-4 h-4 md:w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={cn("text-[10px] md:text-xs font-black uppercase tracking-tight", (tier === 'co-pilot' || tier === 'empire') ? "text-primary" : "text-foreground")}>Co-Pilot</span>
                          <span className="text-[8px] md:text-[9px] font-bold text-slate-500 italic">AI drafts content for your approval</span>
                        </div>
                      </div>
                      <div className={cn(
                        "w-10 h-5 rounded-full relative transition-all border-2",
                        (tier === 'co-pilot' || tier === 'empire') ? "bg-primary border-primary" : "bg-slate-800 border-slate-700"
                      )}>
                        <div className={cn(
                          "w-3 h-3 bg-slate-950 rounded-full absolute top-0.5 transition-all shadow-xl",
                          (tier === 'co-pilot' || tier === 'empire') ? "right-0.5" : "left-0.5"
                        )} />
                      </div>
                    </button>

                    {/* Toggle 2: Auto-Pilot */}
                    <button 
                      onClick={() => updatePlatformPermission(id, tier === 'empire' ? 'co-pilot' : 'empire')}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 md:p-4 rounded-[18px] md:rounded-[24px] border-2 transition-all group/toggle shadow-lg",
                        tier === 'empire' 
                          ? "bg-cyan-400/10 border-cyan-400 shadow-cyan-400/10" 
                          : "bg-theme-background border-theme hover:border-cyan-400/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors",
                          tier === 'empire' ? "bg-cyan-400 text-slate-950" : "bg-slate-800 text-slate-400"
                        )}>
                          <Cpu className="w-4 h-4 md:w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={cn("text-[10px] md:text-xs font-black uppercase tracking-tight", tier === 'empire' ? "text-cyan-400" : "text-foreground")}>Auto-Pilot</span>
                          <span className="text-[8px] md:text-[9px] font-bold text-slate-500 italic">Grant power to post content automatically</span>
                        </div>
                      </div>
                      <div className={cn(
                        "w-10 h-5 rounded-full relative transition-all border-2",
                        tier === 'empire' ? "bg-cyan-400 border-cyan-400" : "bg-slate-800 border-slate-700"
                      )}>
                        <div className={cn(
                          "w-3 h-3 bg-slate-950 rounded-full absolute top-0.5 transition-all shadow-xl",
                          tier === 'empire' ? "right-0.5" : "left-0.5"
                        )} />
                      </div>
                    </button>

                    {/* Toggle 3: Financial Power */}
                    <button 
                      onClick={() => updateSpendingPermission(id, !isSpendingEnabled)}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 md:p-4 rounded-[18px] md:rounded-[24px] border-2 transition-all group/toggle shadow-lg",
                        isSpendingEnabled 
                          ? "bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10" 
                          : "bg-theme-background border-theme hover:border-emerald-500/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors",
                          isSpendingEnabled ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                        )}>
                          <ShoppingBag className="w-4 h-4 md:w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={cn("text-[10px] md:text-xs font-black uppercase tracking-tight", isSpendingEnabled ? "text-emerald-500" : "text-foreground")}>Financial Power</span>
                          <span className="text-[8px] md:text-[9px] font-bold text-slate-500 italic">Grant power to manage ads & inventory</span>
                        </div>
                      </div>
                      <div className={cn(
                        "w-10 h-5 rounded-full relative transition-all border-2",
                        isSpendingEnabled ? "bg-emerald-500 border-emerald-500" : "bg-slate-800 border-slate-700"
                      )}>
                        <div className={cn(
                          "w-3 h-3 bg-slate-950 rounded-full absolute top-0.5 transition-all shadow-xl",
                          isSpendingEnabled ? "right-0.5" : "left-0.5"
                        )} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Version Verification */}
      <div className="flex justify-center pt-8">
        <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
          Vital Signs Engine v3.1.0 (Real-Time)
        </span>
      </div>
    </section>
  );
}
