'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BrandedGlobe } from '@/components/BrandedGlobe';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0519] flex flex-col items-center justify-center gap-10">
      <div className="relative flex items-center justify-center">
        {/* Animated Rings */}
        <motion.div 
          className="absolute w-40 h-40 rounded-full border border-primary/20"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute w-32 h-32 rounded-full border border-primary/40 border-dashed"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        <BrandedGlobe size="xl" spinning glow />
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 mb-2">
           <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
           <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
           <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
        </div>
        <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs animate-pulse text-center">
          Initializing Empire Intelligence
        </h2>
        <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mt-2 italic text-center opacity-80">
          Neural Core Calibration in Progress...
        </p>
      </div>

      {/* Version Indicator */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-30">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">v4.7.0 ELECTRIC</span>
        </div>
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
    </div>
  );
}
