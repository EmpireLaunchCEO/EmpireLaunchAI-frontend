"use client";

import React from 'react';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { useEmpire } from '@/lib/EmpireContext';
import { motion } from 'framer-motion';
import { Share2, LayoutDashboard, ShieldCheck, Cpu, Stars, ShieldAlert, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PLATFORM_CAPABILITIES } from '@/data/platform-capabilities';

import { VerticalPlatformRadar } from '@/components/Dashboard/VerticalPlatformRadar';
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';
import { EmpireAIChatBox } from '@/components/Dashboard/EmpireAIChatBox';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';

const PLATFORM_LOGOS: Record<string, string> = {
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
  shopify: '/brands/shopify_128.png',
  godaddy: '/brands/godaddy_128.png',
  systeme_io: '/brands/systeme_io_128.png',
  pinterest: '/brands/pinterest_128.png',
  printful: '/brands/printful_128.png',
  printify: '/brands/printify_128.png',
  behance: '/brands/behance_128.png',
  substack: '/brands/substack_128.png',
  tiktok_shop: '/brands/tiktok_shop_128.png',
};

export default function LinkCenterPage() {
  const { 
    isLinkingComplete, 
    connectedPlatforms, 
    platformPermissions, 
    updatePlatformPermission,
    spendingPermissions,
    updateSpendingPermission,
    activeEmpire: empireData,
    registerRefreshHandler
  } = useEmpire();

  const handleRefresh = React.useCallback(async () => {
    // Simulate refresh logic
    await new Promise(resolve => setTimeout(resolve, 1500));
  }, []);

  React.useEffect(() => {
    return registerRefreshHandler(handleRefresh);
  }, [registerRefreshHandler, handleRefresh]);

  return (
      <div className="p-4 md:p-8 pb-32 max-w-full md:max-w-7xl mx-auto space-y-12 md:space-y-16 overflow-x-hidden">
        
        {/* 1. Identity Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/60">Link Center Active</span>
          </div>
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
                      {(empireData?.name === 'HOME BASE' || empireData?.title === 'HOME BASE' || empireData?.name === 'Business 1' || !empireData?.name) ? "EmpireLaunch AI" : (empireData?.name || empireData?.title)}
                    </h1>
        </div>

        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 animate-in fade-in duration-1000">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GuidedLinking isReturning={isLinkingComplete} hideEstablished={true} />
          </motion.div>

          <VerticalPlatformRadar />

          {connectedPlatforms.length > 0 && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Permission Governance</h2>
                  <p className="text-sm text-muted-foreground font-medium">Active neural tiers and access scopes.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-theme-surface border border-theme rounded-xl text-[10px] font-black uppercase tracking-widest text-primary">
                  <ShieldCheck className="w-3 h-3" />
                  Secure Vault Active
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {connectedPlatforms.map(id => {
                  const tier = platformPermissions[id] || 'read-only';
                  
                  return (
                    <motion.div
                      key={id}
                      whileHover={{ y: -4 }}
                      className="p-5 bg-theme-surface border-2 border-theme rounded-[28px] space-y-5 relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between gap-3 relative z-10">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white p-1.5 border border-theme flex items-center justify-center shrink-0">
                            {PLATFORM_LOGOS[id] ? (
                              <Image 
                                src={PLATFORM_LOGOS[id]} 
                                alt={id} 
                                width={24} 
                                height={24} 
                                className="object-contain"
                              />
                            ) : (
                              <Share2 className="w-5 h-5 text-slate-900" />
                            )}
                          </div>
                          <div className="truncate">
                            <h3 className="font-black text-sm capitalize text-foreground truncate">{id}</h3>
                            <div className="flex items-center gap-1">
                               <div className={cn("w-1 h-1 rounded-full animate-pulse", tier === 'empire' ? "bg-cyan-400" : tier === 'co-pilot' ? "bg-primary" : "bg-slate-500")} />
                               <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                                  {tier === 'empire' ? 'Auto-Pilot' : tier === 'co-pilot' ? 'Co-Pilot' : 'Read-Only'}
                               </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-theme/30 relative z-10">
                        {/* Read-Only Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-tight text-foreground">Read-Only</span>
                            <span className="text-[7px] font-bold text-slate-500">AI monitors and analyzes</span>
                          </div>
                          <button
                            className="w-8 h-4 rounded-full relative bg-primary/40 cursor-not-allowed opacity-80"
                            disabled
                          >
                            <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-0.75 right-0.75" />
                          </button>
                        </div>

                        {/* Co-Pilot Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-tight text-foreground">Co-Pilot</span>
                            <span className="text-[7px] font-bold text-slate-500">AI drafts and suggests</span>
                          </div>
                          <button
                            onClick={() => updatePlatformPermission(id, (tier === 'co-pilot' || tier === 'empire') ? 'read-only' : 'co-pilot')}
                            className={cn(
                              "w-8 h-4 rounded-full relative transition-all",
                              (tier === 'co-pilot' || tier === 'empire') ? "bg-primary" : "bg-slate-800"
                            )}
                          >
                            <div className={cn(
                              "w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-0.75 transition-all",
                              (tier === 'co-pilot' || tier === 'empire') ? "right-0.75" : "left-0.75"
                            )} />
                          </button>
                        </div>

                        {/* Auto-Pilot Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-tight text-foreground">Auto-Pilot</span>
                            <span className="text-[7px] font-bold text-slate-500">AI posts content daily</span>
                          </div>
                          <button
                            onClick={() => updatePlatformPermission(id, tier === 'empire' ? 'co-pilot' : 'empire')}
                            className={cn(
                              "w-8 h-4 rounded-full relative transition-all",
                              tier === 'empire' ? "bg-cyan-400" : "bg-slate-800"
                            )}
                          >
                            <div className={cn(
                              "w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-0.75 transition-all",
                              tier === 'empire' ? "right-0.75" : "left-0.75"
                            )} />
                          </button>
                        </div>

                        {/* AI Spending Toggle */}
                        <div className="flex items-center justify-between pt-2 border-t border-theme/20">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-tight text-foreground">Spending</span>
                            <span className="text-[7px] font-bold text-slate-500">Purchasing power</span>
                          </div>
                          <button
                            onClick={() => updateSpendingPermission(id, !spendingPermissions[id])}
                            className={cn(
                              "w-8 h-4 rounded-full relative transition-all",
                              spendingPermissions[id] ? "bg-emerald-500" : "bg-slate-800"
                            )}
                          >
                            <div className={cn(
                              "w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-0.75 transition-all",
                              spendingPermissions[id] ? "right-0.75" : "left-0.75"
                            )} />
                          </button>
                        </div>
                      </div>

                      {/* Decorative background pulse */}
                      {tier === 'empire' && (
                        <div className="absolute inset-0 bg-cyan-400/5 animate-pulse pointer-events-none" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-8 rounded-[40px] bg-primary/5 border-2 border-primary/20 flex flex-col md:flex-row items-center gap-8">
                 <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-foreground shrink-0">
                    <ShieldAlert className="w-8 h-8" />
                 </div>
                 <div className="flex-1 space-y-1 text-center md:text-left">
                    <h4 className="text-lg font-black text-foreground">Ownership Sovereignty</h4>
                    <p className="text-sm text-muted-foreground font-medium">
                      EmpireLaunch AI operates under "Admin Blindness" protocols. Your platform tokens are stored in the Ownership Vault and are never visible to team members or system administrators.
                    </p>
                 </div>
                 <button className="px-8 py-4 bg-theme-surface border-2 border-theme rounded-2xl font-black text-xs uppercase tracking-widest text-foreground hover:bg-theme-background transition-all">
                    Vault Audit
                 </button>
              </div>
            </section>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <FeedbackBox />
          </motion.div>

          {/* Version Verification */}
          <div className="flex justify-center pb-20">
            <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
              Command Center v3.0.2 (Neural Sync Active)
            </span>
          </div>
        </div>
      </div>
  );
}
