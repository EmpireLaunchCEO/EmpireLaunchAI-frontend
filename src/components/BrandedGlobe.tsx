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
        "rounded-full overflow-hidden flex items-center justify-center bg-transparent relative shrink-0",
        sizeClasses[size],
        className
      )}
      animate={animationProps}
      transition={transitionProps}
    >
      {/* Background Glow */}
      <div className="absolute inset-1 bg-primary/20 blur-xl rounded-full animate-pulse" />
      
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
          "w-full h-full object-cover scale-110 relative z-10 transition-opacity duration-1000",
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
