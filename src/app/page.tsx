"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stars,
  ArrowRight,
  Shield,
  Rocket,
  Target,
  Globe,
  Coins,
  ChevronDown,
  Languages,
  CheckCircle2,
  Lock
} from "lucide-react";

import { BrandedGlobe } from "@/components/BrandedGlobe";
import { TermsModal } from '@/components/Legal/TermsModal';
import { useEmpire } from '@/lib/EmpireContext';

export default function LandingPage() {
  const router = useRouter();
  const { isOnboarded, isPaid, isInitialized, isHandoverComplete } = useEmpire();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [currency, setCurrency] = useState('USD');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // AUTO-REDIRECT: If already onboarded, go to dashboard
  useEffect(() => {
    // Only redirect if NOT in a forced preview state
    const isForcedPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');
    
    if (isMounted && isInitialized && isOnboarded && isPaid && !isForcedPreview) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isOnboarded, isPaid, isMounted, router]);

  if (!isMounted) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0519] flex flex-col items-center justify-center gap-6">
        <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(0,229,255,0.4)]" />
      </div>
    );
  }

  // Only show the sync overlay if we are initialized AND determined the user should be fast-tracked
  // For the Owner, this might flicker, but for Customers, they will land on Step 1 immediately.
  const isFastTrack = isInitialized && isHandoverComplete && isOnboarded && isPaid;
  
  return (
    <div className="min-h-screen bg-[#0a0519] selection:bg-blue-500/30 overflow-x-hidden">
      {isFastTrack && (
        <div className="fixed inset-0 z-[100] bg-[#0a0519] flex flex-col items-center justify-center gap-6">
          <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(0,229,255,0.4)]" />
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm animate-pulse">
              Neural Path Authorized
            </h2>
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-2">
              Transferring to Command Center...
            </p>
          </div>
        </div>
      )}

      {/* High-Intelligence Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-surface-border/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <BrandedGlobe size="md" className="shadow-[0_0_20px_rgba(0,229,255,0.2)]" />
          <span className="font-black text-2xl tracking-tighter uppercase italic text-theme-gradient pr-2">EmpireLaunch AI</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-theme-surface/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Live: v4.7.0-HYPE (Empire Studio)</span>
          </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 py-20 text-center max-w-lg mx-auto lg:max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 w-full"
        >
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-md px-5 py-2 rounded-full border border-primary/20 font-bold text-[10px] uppercase tracking-[0.2em]">
            <Stars className="w-4 h-4 text-primary" />
            <span className="bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] bg-clip-text text-transparent">
              Autonomous Business Engineering
            </span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] uppercase italic">
            <span className="">
              Your Empire Awaits
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-[280px] mx-auto leading-relaxed font-medium uppercase tracking-tight">
            The high-intelligence AI partner that builds, markets, and scales your business while you sleep.
          </p>

          <div className="flex flex-col items-center gap-8 pt-6">
            {/* Removed Selectors from Landing - Now in Authorization screen */}

            {/* Main Action */}
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/onboarding?preview=true';
              }}
              className="group relative bg-primary text-slate-950 px-10 py-5 rounded-[24px] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,229,255,0.3)] flex items-center justify-center gap-3 w-full uppercase tracking-tighter italic"
            >
              Authorize Engine
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">System Build: v4.7.0-ELECTRIC-EMPIRE</span>
          </div>
        </motion.div>

        {/* Removed TermsModal from landing - it's a mandatory gate at the end of onboarding */}

        <div className="grid grid-cols-1 gap-6 pt-24 w-full">
          <div className="bg-theme-surface/5 p-8 rounded-[40px] border border-white/5 text-left space-y-4 hover:bg-theme-surface/[0.07] transition-all">
            <div className="bg-primary/20 p-4 rounded-2xl w-fit">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Secure Protocol</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-tight">Your financial data and personal credentials are protected via encrypted sandboxes.</p>
          </div>
          <div className="bg-theme-surface/5 p-8 rounded-[40px] border border-white/5 text-left space-y-4 hover:bg-theme-surface/[0.07] transition-all">
            <div className="bg-primary/20 p-4 rounded-2xl w-fit">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Hyper Scaling</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-tight">AI intelligence monitors global trends 24/7 to adjust your strategy instantly.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * SOURCE LOCK VERIFICATION
 * TIMESTAMP: 2026-05-30T02:45:00Z
 * NO TEAL / NO TURQUOISE / NO "GROW YOUR EMPIRE"
 */
