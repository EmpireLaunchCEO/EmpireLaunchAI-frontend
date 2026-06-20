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
            <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight italic">EMPIRE LINKS</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Platform Governance & Performance</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-black text-primary uppercase tracking-widest">Neural Link Active</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
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
              className="group relative bg-theme-surface border-2 border-theme rounded-[24px] md:rounded-[40px] overflow-hidden transition-all shadow-xl"
            >
              {/* Background Glow */}
              <div className={cn("absolute top-0 right-0 w-[400px] h-[400px] blur-[100px] -z-10 opacity-10 transition-opacity group-hover:opacity-20", platform.bgSecondary)} />

              <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 min-h-[180px] md:min-h-[220px]">
                {/* LEFT SIDE: Linked App Identity & Performance Metrics */}
                <div className="p-4 md:p-8 flex flex-col justify-center gap-4 bg-primary/5 border-b md:border-b-0 md:border-r border-theme/30">
                  <div className="flex items-center gap-5">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-[18px] md:rounded-[24px] bg-white p-2.5 border-2 border-theme shadow-xl transition-all duration-700">
                      <Image 
                        src={platform.logo} 
                        alt={platform.name} 
                        fill 
                        className="object-contain p-2.5"
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tighter italic leading-none truncate pr-2">{platform.name}</h3>
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-black text-green-500 uppercase tracking-widest">
                          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          Optimal
                        </span>
                        <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Sync: 124ms</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics - EMPIRE LINKS */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 md:p-3.5 rounded-[16px] bg-theme-background/40 border border-theme/30 backdrop-blur-sm">
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{platform.metricLabel}</div>
                      <div className="flex items-end gap-1">
                        <span className="text-lg md:text-xl font-black text-foreground leading-none">{platform.followers}</span>
                        <span className="text-[8px] font-black text-green-500 mb-0.5 flex items-center gap-0.5">
                          <TrendingUp className="w-2 h-2" />
                          {platform.growth}
                        </span>
                      </div>
                    </div>
                    <div className="p-2.5 md:p-3.5 rounded-[16px] bg-theme-background/40 border border-theme/30 backdrop-blur-sm">
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{platform.secondaryMetricLabel}</div>
                      <div className="text-lg md:text-xl font-black text-foreground leading-none">{platform.likes}</div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: Governance Toggles (AI Capabilities) */}
                <div className="p-4 md:p-8 space-y-3 md:space-y-4 flex flex-col justify-center bg-theme-surface/30">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[9px] md:text-[11px] font-black text-primary uppercase tracking-[0.2em]">AI Governance</h4>
                      <div className="px-1 py-0.5 bg-slate-900 border border-white/10 rounded-md">
                        <span className="text-[6px] font-black text-slate-500 uppercase tracking-tighter">Manual Only</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    {/* Toggle 1: Co-Pilot */}
                    <button 
                      onClick={() => updatePlatformPermission(id, (tier === 'co-pilot' || tier === 'empire') ? 'read-only' : 'co-pilot')}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 md:p-3 rounded-[14px] md:rounded-[20px] border-2 transition-all group/toggle shadow-lg",
                        (tier === 'co-pilot' || tier === 'empire') 
                          ? "bg-primary/10 border-primary shadow-primary/10" 
                          : "bg-theme-background border-theme hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-colors",
                          (tier === 'co-pilot' || tier === 'empire') ? "bg-primary text-slate-950" : "bg-slate-800 text-slate-400"
                        )}>
                          <Zap className="w-3.5 h-3.5 md:w-4 h-4" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={cn("text-[9px] md:text-[11px] font-black uppercase tracking-tight", (tier === 'co-pilot' || tier === 'empire') ? "text-primary" : "text-foreground")}>Co-Pilot</span>
                          <span className="text-[7px] md:text-[8px] font-bold text-slate-500 italic">AI drafts for approval</span>
                        </div>
                      </div>
                      <div className={cn(
                        "w-8 h-4 rounded-full relative transition-all border-2",
                        (tier === 'co-pilot' || tier === 'empire') ? "bg-primary border-primary" : "bg-slate-800 border-slate-700"
                      )}>
                        <div className={cn(
                          "w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-0.5 transition-all shadow-xl",
                          (tier === 'co-pilot' || tier === 'empire') ? "right-0.5" : "left-0.5"
                        )} />
                      </div>
                    </button>

                    {/* Toggle 2: Auto-Pilot */}
                    <button 
                      onClick={() => updatePlatformPermission(id, tier === 'empire' ? 'co-pilot' : 'empire')}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 md:p-3 rounded-[14px] md:rounded-[20px] border-2 transition-all group/toggle shadow-lg",
                        tier === 'empire' 
                          ? "bg-cyan-400/10 border-cyan-400 shadow-cyan-400/10" 
                          : "bg-theme-background border-theme hover:border-cyan-400/50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-colors",
                          tier === 'empire' ? "bg-cyan-400 text-slate-950" : "bg-slate-800 text-slate-400"
                        )}>
                          <Cpu className="w-3.5 h-3.5 md:w-4 h-4" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={cn("text-[9px] md:text-[11px] font-black uppercase tracking-tight", tier === 'empire' ? "text-cyan-400" : "text-foreground")}>Auto-Pilot</span>
                          <span className="text-[7px] md:text-[8px] font-bold text-slate-500 italic">Grant power to post automatically</span>
                        </div>
                      </div>
                      <div className={cn(
                        "w-8 h-4 rounded-full relative transition-all border-2",
                        tier === 'empire' ? "bg-cyan-400 border-cyan-400" : "bg-slate-800 border-slate-700"
                      )}>
                        <div className={cn(
                          "w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-0.5 transition-all shadow-xl",
                          tier === 'empire' ? "right-0.5" : "left-0.5"
                        )} />
                      </div>
                    </button>

                    {/* Toggle 3: Financial Power */}
                    <button 
                      onClick={() => updateSpendingPermission(id, !isSpendingEnabled)}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 md:p-3 rounded-[14px] md:rounded-[20px] border-2 transition-all group/toggle shadow-lg",
                        isSpendingEnabled 
                          ? "bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10" 
                          : "bg-theme-background border-theme hover:border-emerald-500/50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-colors",
                          isSpendingEnabled ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                        )}>
                          <ShoppingBag className="w-3.5 h-3.5 md:w-4 h-4" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={cn("text-[9px] md:text-[11px] font-black uppercase tracking-tight", isSpendingEnabled ? "text-emerald-500" : "text-foreground")}>Financial Power</span>
                          <span className="text-[7px] md:text-[8px] font-bold text-slate-500 italic">Grant power to manage ads</span>
                        </div>
                      </div>
                      <div className={cn(
                        "w-8 h-4 rounded-full relative transition-all border-2",
                        isSpendingEnabled ? "bg-emerald-500 border-emerald-500" : "bg-slate-800 border-slate-700"
                      )}>
                        <div className={cn(
                          "w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-0.5 transition-all shadow-xl",
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
          EMPIRE LINKS Engine v3.1.0 (Real-Time)
        </span>
      </div>
    </section>
  );
}
