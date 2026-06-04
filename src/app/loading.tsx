'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrandedGlobe } from '@/components/BrandedGlobe';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] animate-pulse" />
        <div className="absolute inset-0 bg-violet-600/20 blur-[60px] animate-pulse delay-700" />
        <BrandedGlobe size="xl" className="relative z-10 shadow-[0_0_60px_rgba(0,229,255,0.3)]" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-cyan-300 font-black uppercase tracking-[0.3em] text-sm animate-pulse">
          Synchronizing Nodes
        </h2>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2 opacity-20">
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Empire Intelligence v4.7.0</span>
      </div>
    </div>
  );
}