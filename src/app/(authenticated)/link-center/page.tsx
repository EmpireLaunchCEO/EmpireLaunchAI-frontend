"use client";

import React from 'react';
import { createPortal } from 'react-dom';
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

  // ── FROSTED-GLASS "COMING SOON" GATE (owner Sep 28/29) ─────────────────
  // The Link Center is gated for everyone until integrations are fully
  // figured out. The page and route stay; clients see a frosted-glass lock
  // overlay that prevents any integration from being used.
  //
  // FULL-VIEWPORT COVER: the gate is rendered via createPortal to
  // document.body at z-[10000010] — ABOVE the app shell's highest chrome
  // (MobileNav z-[10000005], Sidebar z-[10005], GlobalEmpireHeader inside
  // <main> z-[1]). An in-page fixed overlay would be bounded by <main>'s
  // stacking context (z-[1]) and the bottom nav / sidebar would paint over
  // it, so the owner would still see them. The portal escapes <main> and
  // covers the ENTIRE screen including the 3-brand top bar.
  // Mounted-state guard keeps SSR/hydration safe (document only exists
  // client-side).
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const comingSoonGate = (
    <div
      className="fixed inset-0 z-[10000010] flex items-center justify-center overflow-hidden bg-[#0a0519]/85 backdrop-blur-xl"
      data-link-center-gate="true"
    >
      {/* Electric shimmer decor (hard-locked purple/blue theme) — full-bleed decor of the screen, not a card */}
      <div className="pointer-events-none absolute -top-32 -right-24 w-[34rem] h-[34rem] bg-primary/20 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 w-[34rem] h-[34rem] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="relative flex flex-col items-center justify-center text-center space-y-6 px-6">
        <div className="w-16 h-16 rounded-3xl bg-white/5 border !border-white/10 flex items-center justify-center">
          <Lock className="w-7 h-7 text-primary" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Neural Link Center
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
          Coming Soon
        </h1>
      </div>
    </div>
  );

  return (
    <>
      {mounted && createPortal(comingSoonGate, document.body)}
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
    </>
  );
}
