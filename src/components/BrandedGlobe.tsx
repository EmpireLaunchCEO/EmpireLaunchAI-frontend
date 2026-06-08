"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, Transition } from 'framer-motion';

interface BrandedGlobeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  spinning?: boolean;
}

export function BrandedGlobe({ className, size = 'md', animate = true, spinning = false }: BrandedGlobeProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const animationProps = spinning 
    ? { rotate: [0, 360] }
    : animate 
      ? {
          scale: [1, 1.04, 1],
          rotate: [0, 360],
        }
      : {};

  const transitionProps: Transition = spinning
    ? {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear"
      }
    : {
        rotate: {
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      };

  return (
    <motion.div
      className={cn(
        "rounded-full flex items-center justify-center bg-white relative shrink-0 overflow-hidden",
        sizeClasses[size],
        className
      )}
      animate={animationProps}
      transition={transitionProps}
    >
      {/* Subtle depth overlay */}
      <div className="absolute inset-0 rounded-full z-20 pointer-events-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" />
      
      
      {/* CSS Globe Fallback structure */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center fallback-globe rounded-full transition-opacity duration-700",
        isLoaded ? "opacity-0" : "opacity-70"
      )}>
        <div className="absolute w-1/3 h-1/3 bg-primary/40 rounded-full blur-sm animate-pulse" />
        <div className="w-full h-full rounded-full border-2 border-primary/40 bg-primary/20 animate-pulse" />
      </div>

      <img
        src="/branded-globe.png"
        alt="Empire Globe"
        className={cn(
          "w-full h-full object-contain p-1 relative z-10 transition-all duration-1000",
          isLoaded ? "opacity-100" : "opacity-0",
          spinning && "brightness-125 contrast-110"
        )}
        style={{ imageRendering: 'auto' }}
        onLoad={() => setIsLoaded(true)}
      />
    </motion.div>
  );
}
