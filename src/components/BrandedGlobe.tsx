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
  const [isLoaded, setIsLoaded] = React.useState(false);
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
    xl: 'w-28 h-28',
  };

  return (
    <motion.div
      className={cn(
        "rounded-full overflow-hidden flex items-center justify-center bg-slate-900 border border-white/10 relative shrink-0",
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
      <div className={cn(
        "absolute inset-0 flex items-center justify-center fallback-globe rounded-full transition-opacity duration-700",
        isLoaded ? "opacity-20" : "opacity-60"
      )}>
        <div className="w-full h-full rounded-full border border-primary/30" />
        <div className="absolute w-[1px] h-full bg-primary/20" />
        <div className="absolute w-full h-[1px] bg-primary/20" />
        <div className="absolute w-full h-full rounded-full border-x border-primary/20 scale-x-50" />
        <div className="absolute w-full h-full rounded-full border-y border-primary/20 scale-y-50" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-700/40" />
      <img
        src="/apple-v11.png"
        alt="Empire Globe"
        className={cn(
          "w-full h-full object-cover scale-110 relative z-10 brightness-110 contrast-125 transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ imageRendering: 'auto' }}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="w-1/2 h-1/2 rounded-full bg-primary/30 blur-xl animate-pulse" />
      </div>
    </motion.div>
  );
}
