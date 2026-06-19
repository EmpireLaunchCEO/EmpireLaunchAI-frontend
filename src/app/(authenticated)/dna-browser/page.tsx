"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Filter } from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { DNAVaultCounter } from '@/components/Dashboard/DNAVaultCounter';
import { GlobalDnaPoolPanel, AutoPilotStatusBadge } from '@/components/Dashboard/GlobalDnaPoolPanel';
import { StylePickerGallery } from '@/components/Dashboard/StylePickerGallery';

export default function DnaBrowserPage() {
  const { activeEmpire: empireData } = useEmpire();

  return (
    <div className="p-4 md:p-8 pb-32 max-w-full md:max-w-7xl mx-auto space-y-12 md:space-y-16 overflow-x-hidden">
      {/* Identity Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-cyan-400">DNA Browser</span>
          <AutoPilotStatusBadge />
        </div>
        <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
          Global DNA Pool.
        </h1>
        <p className="text-sm md:text-base text-muted-foreground font-medium italic max-w-2xl mx-auto">
          Browse, filter, and apply market-harvested design DNA — synthesized from millions of viral signals across Etsy, Fiverr, TikTok, and more.
        </p>
      </motion.div>

      {/* DNA Vault Counter — Live stats */}
      <DNAVaultCounter />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Global DNA Pool Stats Panel */}
        <GlobalDnaPoolPanel />

        {/* Style Picker / DNA Browser */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Filter className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h2 className="font-black text-foreground text-sm uppercase tracking-tight italic">Browse DNA Strands</h2>
              <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">
                Filter by category, niche, or search
              </p>
            </div>
          </div>

          <StylePickerGallery inline />
        </div>
      </div>

      {/* Version Verification */}
      <div className="flex justify-center pb-20 pt-12">
        <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
          Global DNA Browser v1.0 · Powered by Empire Vault
        </span>
      </div>
    </div>
  );
}