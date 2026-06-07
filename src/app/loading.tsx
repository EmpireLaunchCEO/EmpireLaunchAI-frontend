'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrandedGlobe } from '@/components/BrandedGlobe';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0519] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse" />
        <BrandedGlobe size="xl" spinning={true} className="relative z-10 shadow-[0_0_60px_rgb(var(--primary-rgb)/0.3)]" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm animate-pulse">
          Calibrating Neural Core
        </h2>
        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-2 italic">Optimizing Engine Parameters...</p>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2 opacity-20">
        <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Empire Intelligence v4.7.0</span>
      </div>
    </div>
  );
}
