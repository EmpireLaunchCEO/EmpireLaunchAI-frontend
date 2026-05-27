'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrandedGlobe } from '@/components/BrandedGlobe';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <motion.div 
          className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <BrandedGlobe size="lg" className="absolute inset-0 m-auto shadow-[0_0_40px_rgba(59,130,246,0.5)]" />
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
