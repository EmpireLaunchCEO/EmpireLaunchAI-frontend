"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, Transition } from 'framer-motion';

interface BrandedGlobeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  animate?: boolean;
  spinning?: boolean;
  glow?: boolean;
}

export function BrandedGlobe({ 
  className, 
  size = 'md', 
  animate = true, 
  spinning = false,
  glow = true
}: BrandedGlobeProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
    '3xl': 'w-48 h-48',
  };

  const animationProps = spinning
    ? { rotate: [0, 360] }
    : animate
      ? {
          scale: [1, 1.05, 1],
          rotate: [0, 360],
        }
      : {};

  const transitionProps: Transition = spinning
    ? {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    : {
        rotate: {
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      };

  return (
    <div className={cn("relative flex items-center justify-center shrink-0", className)}>
      {/* Outer Glow */}
      {glow && (
        <div className={cn(
          "absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse",
          sizeClasses[size]
        )} />
      )}
      
      <motion.div
        className={cn(
          "rounded-full flex items-center justify-center relative overflow-hidden",
          "shadow-[0_10px_40px_rgba(0,0,0,0.4)]",
          sizeClasses[size]
        )}
        animate={animationProps}
        transition={transitionProps}
      >
        {/* Sphere Volume Overlays */}
        {/* 1. Primary Highlight (top-left) */}
        <div className="absolute inset-0 rounded-full z-30 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_50%)]" />
        
        {/* 2. Deep Shadow (bottom-right) */}
        <div className="absolute inset-0 rounded-full z-20 pointer-events-none shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.6)]" />
        
        {/* 3. Subtle Inset Light (rim light) */}
        <div className="absolute inset-0 rounded-full z-20 pointer-events-none shadow-[inset_0_0_15px_rgba(255,255,255,0.1)]" />

        {/* CSS Globe Fallback structure */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center fallback-globe rounded-full transition-opacity duration-700",
          isLoaded ? "opacity-0" : "opacity-100 bg-[#0f0a25]"
        )}>
          <div className="absolute w-1/2 h-1/2 bg-primary/40 rounded-full blur-md animate-pulse" />
          <div className="w-full h-full rounded-full border-2 border-primary/20 bg-primary/5" />
        </div>

        <img
          src="/branded-globe.png"
          alt="Empire Globe"
          className={cn(
            "w-full h-full object-contain p-2.5 relative z-10 transition-all duration-1000",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90",
            spinning && "brightness-110 contrast-105"
          )}
          style={{ imageRendering: 'high-quality' }}
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </div>
  );
}
