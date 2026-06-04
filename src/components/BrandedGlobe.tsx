"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BrandedGlobeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

export function BrandedGlobe({ className, size = 'md', animate = true }: BrandedGlobeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-20 h-20',
  };

  return (
    <motion.div
      className={cn(
        "rounded-full overflow-hidden flex items-center justify-center bg-slate-900 border border-white/10 relative",
        sizeClasses[size],
        className
      )}
      animate={animate ? {
        scale: [1, 1.05, 1],
        rotate: [0, 5, 0, -5, 0],
      } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0070ff] via-[#7000ff] to-[#0070ff] opacity-40 blur-md" />
      
      {/* CSS Globe Fallback structure */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-full h-full rounded-full border border-primary/50" />
        <div className="absolute w-[1px] h-full bg-primary/50" />
        <div className="absolute w-full h-[1px] bg-primary/50" />
        <div className="absolute w-full h-full rounded-full border-x border-primary/50 scale-x-50" />
        <div className="absolute w-full h-full rounded-full border-y border-primary/50 scale-y-50" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-700/40" />
      <img
        src="/branded-globe.png?v=515"
        alt="Empire Globe"
        className="w-full h-full object-cover scale-110 relative z-10 brightness-110 contrast-125 transition-opacity duration-300 opacity-0"
        style={{ imageRendering: 'auto' }}
        onLoad={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-1/2 h-1/2 rounded-full bg-primary/20 blur-xl" />
      </div>
    </motion.div>
  );
}
