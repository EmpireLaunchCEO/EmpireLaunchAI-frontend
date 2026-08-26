"use client";

import React from 'react';
import { useEmpire } from '@/lib/EmpireContext';
import { motion } from 'framer-motion';
import { Link2, ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

import { VerticalPlatformRadar } from '@/components/Dashboard/VerticalPlatformRadar';
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';

export default function LinkCenterPage() {
  const { 
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
          
          {/* Connect now happens on Home Base — Link Center is governed here */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 md:p-10 relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Link2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter italic mb-3">
                Connect your apps from Home Base
              </h2>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Linking new platforms now lives on your Home Base, right where your
                Empire info, Intel and Library live. This page is where you manage
                and govern the platforms you've already connected — permissions,
                auto-pilot controls, and performance are all set here.
              </p>
              <Link href="/dashboard">
                <button className="mt-8 px-8 py-4 bg-primary text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center gap-3 shadow-2xl shadow-primary/40 group">
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Home Base to connect apps
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary rounded-full blur-[120px] opacity-5 -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-5 -ml-32 -mb-32" />
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
  );
}
