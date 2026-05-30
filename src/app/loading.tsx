'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrandedGlobe } from '@/components/BrandedGlobe';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600/20 blur-[60px] animate-pulse" />
        <div className="absolute inset-0 bg-purple-600/20 blur-[60px] animate-pulse delay-700" />
        <BrandedGlobe size="xl" className="relative z-10 shadow-[0_0_60px_rgba(176,38,255,0.4)]" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-blue-200 font-black uppercase tracking-[0.3em] text-sm animate-pulse">
          Synchronizing Nodes
        </h2>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2 opacity-20">
        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Empire Intelligence v3.3.1</span>
      </div>
    </div>
  );
}
