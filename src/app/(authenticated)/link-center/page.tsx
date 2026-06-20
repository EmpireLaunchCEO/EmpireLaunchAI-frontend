"use client";

import React from 'react';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { useEmpire } from '@/lib/EmpireContext';
import { motion } from 'framer-motion';
import { Share2, LayoutDashboard, ShieldCheck, Cpu, Stars, ShieldAlert, Eye, Lock, CheckCircle2 } from 'lucide-react';
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
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">Link Center Active</span>
          </div>
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
                      {(empireData?.name === 'HOME BASE' || empireData?.title === 'HOME BASE' || empireData?.name === 'Business 1' || !empireData?.name) ? "EmpireLaunch AI" : (empireData?.name || empireData?.title)}
                    </h1>
        </div>

        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 animate-in fade-in duration-1000">
          
          <VerticalPlatformRadar />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GuidedLinking isReturning={isLinkingComplete} />
          </motion.div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(PLATFORM_CAPABILITIES).map(id => {
                  const isConnected = connectedPlatforms.includes(id);
                  const tier = platformPermissions[id] || 'read-only';
                  const caps = PLATFORM_CAPABILITIES[id]?.capabilities?.find(c => c.tier === tier);

                  return (
                    <motion.div
                      key={id}
                      whileHover={{ y: -5 }}
                      className={cn(
                        "p-6 rounded-[32px] space-y-6 relative overflow-hidden group border-2 transition-all",
                        isConnected 
                          ? "bg-theme-surface border-theme"
                          : "bg-theme-background/30 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-1">
                          <h3 className="font-black text-lg capitalize text-foreground">{id}</h3>
                          <div className="flex items-center gap-2">
                            {isConnected ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                Connected
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                <Lock className="w-3 h-3" />
                                Available
                              </div>
                            )}
                            <div className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              tier === 'empire' ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : 
                              tier === 'co-pilot' ? "bg-primary/10 text-primary border border-primary/20" :
                              "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                            )}>
                              {tier === 'empire' ? <Stars className="w-3 h-3" /> : 
                               tier === 'co-pilot' ? <Cpu className="w-3 h-3" /> :
                               <Eye className="w-3 h-3" />}
                              {tier === 'empire' ? 'Auto-Pilot' : 
                               tier === 'co-pilot' ? 'Co-Pilot' :
                               'Read-Only'}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-theme flex items-center justify-center overflow-hidden">
                            {PLATFORM_LOGOS[id] ? (
                              <Image 
                                src={PLATFORM_LOGOS[id]} 
                                alt={id} 
                                width={32} 
                                height={32} 
                                className="object-contain"
                              />
                            ) : (
                              <ShieldCheck className={cn("w-5 h-5", isConnected ? "text-emerald-400" : tier === 'empire' ? "text-cyan-400" : "text-primary")} />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 relative z-10">
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                          {caps?.description || 'Establishing secure monitoring protocols.'}
                        </p>
                        
                        {/* Tier Selection Buttons */}
                        <div className="grid grid-cols-3 gap-2 pt-2">
                           {['read-only', 'co-pilot', 'empire'].map((t) => (
                             <button
                               key={t}
                               onClick={() => updatePlatformPermission(id, t as any)}
                               className={cn(
                                 "py-2 rounded-lg text-[8px] font-black uppercase tracking-tight border transition-all",
                                 tier === t 
                                   ? "bg-primary text-slate-950 border-primary" 
                                   : "bg-theme-background text-slate-500 border-theme hover:border-primary/30"
                               )}
                             >
                               {t === 'read-only' ? 'Read' : t === 'co-pilot' ? 'Co-Pilot' : 'Auto'}
                             </button>
                           ))}
                        </div>

                        {isConnected && (
                          <div className="pt-4 border-t border-theme flex flex-col gap-4">
                             <div className="flex items-center justify-between">
                               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                               <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Green Check — Secure
                               </span>
                             </div>

                             <div className="flex items-center justify-between bg-theme-background p-3 rounded-2xl border border-theme">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase tracking-tight text-foreground">AI Spending</span>
                                  <span className="text-[8px] font-bold text-slate-500">Autonomous purchasing power</span>
                                </div>
                                <button
                                  onClick={() => updateSpendingPermission(id, !spendingPermissions[id])}
                                  className={cn(
                                    "w-10 h-5 rounded-full relative transition-all",
                                    spendingPermissions[id] ? "bg-primary" : "bg-slate-700"
                                  )}
                                >
                                  <div className={cn(
                                    "w-3 h-3 bg-slate-950 rounded-full absolute top-1 transition-all",
                                    spendingPermissions[id] ? "right-1" : "left-1"
                                  )} />
                                </button>
                             </div>
                          </div>
                        )}

                        {!isConnected && (
                          <div className="pt-4 border-t border-white/5">
                            <button className="w-full py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all">
                              Connect {id}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Decorative background icon */}
                      {isConnected && tier === 'empire' && (
                        <Stars className="absolute -right-4 -bottom-4 w-24 h-24 text-cyan-400/5 rotate-12 group-hover:scale-110 transition-transform" />
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
            <EmpireAIChatBox className="max-w-6xl mx-auto" />
          </motion.div>

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
