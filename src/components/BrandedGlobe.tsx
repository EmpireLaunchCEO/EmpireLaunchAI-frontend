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
        "rounded-full overflow-hidden flex items-center justify-center bg-slate-900 border border-white/10",
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
      <img 
        src="/branded-globe.png" 
        alt="Empire Globe" 
        className="w-full h-full object-cover scale-110" 
      />
    </motion.div>
  );
}
