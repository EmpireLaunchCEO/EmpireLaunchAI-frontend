"use client";

import React from 'react';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { useEmpire } from '@/lib/EmpireContext';
import { motion } from 'framer-motion';
import { Share2, LayoutDashboard, ShieldCheck, Cpu, Stars, ShieldAlert, Eye, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PLATFORM_CAPABILITIES } from '@/data/platform-capabilities';

import { VerticalPlatformRadar } from '@/components/Dashboard/VerticalPlatformRadar';
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';
import { EmpireAIChatBox } from '@/components/Dashboard/EmpireAIChatBox';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';

export default function LinkCenterPage() {
  const { 
    isLinkingComplete, 
    empireData,
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
      <div className="relative">
        {/* ── FROSTED-GLASS "COMING SOON" GATE (owner Sep 28) ───────────────
            The Link Center is gated for everyone until integrations are fully
            figured out. The page and route stay; clients see a frosted-glass
            lock overlay that prevents any integration from being used. This is
            a visual gate ONLY — no navigation/route removal. */}
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" />
          <div className="relative w-full max-w-xl rounded-[40px] bg-slate-900/70 border !border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden p-10 md:p-14 text-center space-y-6">
            {/* Electric shimmer decor (hard-locked purple/blue theme) */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative mx-auto w-16 h-16 rounded-3xl bg-white/5 border !border-white/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>

            <div className="relative space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Neural Link Center
              </p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
                Coming Soon
              </h1>
              <p className="text-sm text-slate-400 font-medium max-w-md mx-auto">
                Integrations are being wired up. Once ready, this is where every
                platform connects to your Empire — one tap, fully autonomous.
              </p>
            </div>
          </div>
        </div>

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

          {/* Combined EMPIRE LINKS & Governance */}
          <VerticalPlatformRadar />

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <FeedbackBox />
          </motion.div>

          {/* Version Verification */}
          <div className="flex justify-center pb-20">
            <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
              Command Center v3.1.0 (Neural Sync Active)
            </span>
          </div>
        </div>
      </div>
      </div>
  );
}
