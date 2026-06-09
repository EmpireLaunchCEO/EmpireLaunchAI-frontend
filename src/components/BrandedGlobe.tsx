"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, Transition } from 'framer-motion';

/**
 * ============================================================================
 * STRICT BRANDING LOCK - EMPIRELAUNCH AI
 * ============================================================================
 * THIS COMPONENT IS HARD-LOCKED. 
 * IDENTITY: 3D Realistic Globe (Blue Water, Green Land)
 * CONTAINER: Pure White Rounded Square (#FFFFFF)
 * ROUNDING: 24% (rounded-2xl or rounded-[22%])
 * SHADOW: Soft elevation shadow
 * 
 * DESIGN RATIONALE:
 * The white background is critical for contrast against the "Electric Shimmer" 
 * dark theme. It ensures the brand mark is legible and premium across all pages.
 * ============================================================================
 */

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

  // Container sizes - reduced to shrink the "white" footprint
  const sizeClasses = {
    sm: 'w-4.5 h-4.5 rounded-sm',
    md: 'w-7 h-7 rounded-md',
    lg: 'w-10 h-10 rounded-lg',
    xl: 'w-18 h-18 rounded-xl',
    '2xl': 'w-24 h-24 rounded-[1.5rem]',
    '3xl': 'w-36 h-36 rounded-[2rem]',
  };

  // Image scaling - increased to ~94% to keep the globe the same absolute size 
  // while the surrounding white container is now smaller.
  const imageScale = isLoaded ? "scale-[0.94]" : "scale-0";

  const animationProps = spinning
    ? { rotate: [0, 360] }
    : animate
      ? {
          scale: [1, 1.03, 1],
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
          duration: 40,
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
    <div className={cn(
      "relative flex items-center justify-center shrink-0 bg-white shadow-2xl overflow-hidden border border-white/20", 
      sizeClasses[size],
      className
    )}>
      {/* Subtle depth glow for the white container */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-slate-200/30 pointer-events-none" />
      )}
      
      <motion.div
        className="w-full h-full flex items-center justify-center relative z-10"
        animate={animationProps}
        transition={transitionProps}
      >
        {/* Loading / Fallback state */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="w-1/2 h-1/2 bg-blue-500/10 rounded-full animate-pulse blur-md" />
          </div>
        )}

        <img
          src="/branded-globe.png"
          alt="EmpireLaunch AI"
          className={cn(
            "w-full h-full object-contain relative z-10 transition-all duration-1000",
            imageScale,
            spinning && "brightness-105 contrast-110"
          )}
          style={{ 
            imageRendering: 'high-quality',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' 
          }}
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </div>
  );
}
