"use client";

import React from 'react';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { useEmpire } from '@/lib/EmpireContext';
import { motion } from 'framer-motion';
import { Share2, LayoutDashboard, ShieldCheck, Cpu, Stars, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PLATFORM_CAPABILITIES } from '@/data/platform-capabilities';

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
  const { isLinkingComplete, connectedPlatforms, platformPermissions } = useEmpire();

  // Define platform icons/colors locally or import them
  // For now I'll just use a simple list

  const handleRefresh = async () => {
    // Simulate refresh logic
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="p-3 md:p-8 pb-40 max-w-full md:max-w-7xl mx-auto space-y-6 md:space-y-12">
      {/* Page Context Header */}
      <div className="bg-theme-surface/30 p-5 rounded-[24px] border border-theme flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
            <Share2 className="w-3 h-3" />
            Link Center
          </div>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium italic">
            Connect and manage your empire's high-velocity channels.
          </p>
        </div>

        {isLinkingComplete && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-theme-surface text-foreground px-5 py-2 rounded-xl border border-theme font-bold text-[10px] uppercase shadow-sm hover:bg-theme-background transition-all group"
          >
            <LayoutDashboard className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
            Dashboard
          </Link>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GuidedLinking isReturning={isLinkingComplete} />
      </motion.div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedPlatforms.map(id => {
              const tier = platformPermissions[id] || 'read-only';
              const caps = PLATFORM_CAPABILITIES[id]?.capabilities?.find(c => c.tier === tier);

              return (
                <motion.div
                  key={id}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-theme-surface border-2 border-theme rounded-[32px] space-y-6 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-1">
                      <h3 className="font-black text-lg capitalize text-foreground">{id}</h3>
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        tier === 'empire' ? "bg-cyan-500/10 text-cyan-400" : 
                        tier === 'co-pilot' ? "bg-primary/10 text-primary" :
                        "bg-slate-500/10 text-slate-400"
                      )}>
                        {tier === 'empire' ? <Stars className="w-3 h-3" /> : 
                         tier === 'co-pilot' ? <Cpu className="w-3 h-3" /> :
                         <Eye className="w-3 h-3" />}
                        {tier === 'empire' ? 'Auto-Pilot' : 
                         tier === 'co-pilot' ? 'Co-Pilot' :
                         'Read-Only'}
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
                          <ShieldCheck className={cn("w-5 h-5", tier === 'empire' ? "text-cyan-400" : "text-primary")} />
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

                    <div className="pt-4 border-t border-theme flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                       <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Encrypted
                       </span>
                    </div>
                  </div>

                  {/* Decorative background icon */}
                  {tier === 'empire' && (
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
    </div>
    </PullToRefresh>
  );
}
