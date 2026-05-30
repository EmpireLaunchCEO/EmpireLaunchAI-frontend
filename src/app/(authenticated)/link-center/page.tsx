"use client";

import React from 'react';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { useEmpire } from '@/lib/EmpireContext';
import { motion } from 'framer-motion';
import { Share2, LayoutDashboard, ShieldCheck, Cpu, Stars, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PLATFORM_CAPABILITIES } from '@/data/platform-capabilities';

import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';

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
      <div className="p-4 md:p-8 pb-40 max-w-7xl mx-auto space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
            <Share2 className="w-3 h-3" />
            Link Center
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter italic">
            Neural Sync.
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Connect and manage your empire's high-velocity channels.
          </p>
        </div>

        {isLinkingComplete && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-theme-surface text-foreground px-6 py-3 rounded-2xl border-2 border-theme font-bold text-sm shadow-sm hover:bg-theme-background transition-all group"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            Return to Dashboard
          </Link>
        )}
      </header>

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
              const tier = platformPermissions[id] || 'co-pilot';
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
                        tier === 'empire' ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                      )}>
                        {tier === 'empire' ? <Stars className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                        {tier === 'empire' ? 'Auto-Pilot' : 'Co-Pilot'}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-theme-background flex items-center justify-center border border-theme">
                       <ShieldCheck className={cn("w-5 h-5", tier === 'empire' ? "text-amber-500" : "text-primary")} />
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                      {caps?.description}
                    </p>
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
                    <Stars className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-500/5 rotate-12 group-hover:scale-110 transition-transform" />
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="p-8 rounded-[40px] bg-amber-500/5 border-2 border-amber-500/20 flex flex-col md:flex-row items-center gap-8">
             <div className="w-16 h-16 rounded-[24px] bg-amber-500 flex items-center justify-center text-foreground shrink-0">
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
