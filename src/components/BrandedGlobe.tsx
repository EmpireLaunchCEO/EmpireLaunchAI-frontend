"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BrandedGlobeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  spinning?: boolean;
}

export function BrandedGlobe({ className, size = 'md', animate = true, spinning = false }: BrandedGlobeProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
    xl: 'w-28 h-28',
  };

  const animationProps = spinning 
    ? { rotate: 360 }
    : animate 
      ? {
          scale: [1, 1.05, 1],
          rotate: [0, 5, 0, -5, 0],
        }
      : {};

  const transitionProps = spinning
    ? {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    : {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      };

  return (
    <motion.div
      className={cn(
        "rounded-full flex items-center justify-center bg-transparent relative shrink-0",
        sizeClasses[size],
        className
      )}
      animate={animationProps}
      transition={transitionProps}
    >
      {/* 3D Effects Wrapper */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_12px_rgba(255,255,255,0.4),inset_0_-4px_24px_rgba(0,0,0,0.6),0_15px_35px_rgba(0,0,0,0.5)] z-20 pointer-events-none border border-white/5" />
      
      {/* Dynamic Glow Layer */}
      <div className={cn(
        "absolute inset-0 bg-primary/20 blur-2xl rounded-full transition-opacity duration-1000",
        (spinning || animate) ? "opacity-60" : "opacity-20"
      )} />
      
      {/* CSS Globe Fallback structure */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center fallback-globe rounded-full transition-opacity duration-700",
        isLoaded ? "opacity-0" : "opacity-30"
      )}>
        <div className="w-full h-full rounded-full border border-primary/20 bg-primary/5" />
      </div>

      <img
        src="/branded-globe.png"
        alt="Empire Globe"
        className={cn(
          "w-full h-full object-contain scale-100 relative z-10 transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ imageRendering: 'auto' }}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </motion.div>
  );
}
