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

  // Container sizes - using explicit pixel values for absolute containment
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    '2xl': 64,
    '3xl': 96,
  };

  const pixelSize = sizeMap[size];

  // Image scaling - kept at ~94% to allow for the white container padding
  const imageScale = isLoaded ? "scale-[0.94]" : "scale-0";

  const animationProps = spinning
    ? { rotate: 360 }
    : animate
      ? {
          scale: [1, 1.03, 1],
          rotate: 360,
        }
      : {};

  const transitionProps: Transition = spinning
    ? {
        rotate: {
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }
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
    <div 
      className={cn(
        "relative flex items-center justify-center shrink-0 bg-white shadow-2xl overflow-hidden border border-white/20", 
        className
      )}
      style={{ 
        width: `${pixelSize}px`, 
        height: `${pixelSize}px`,
        minWidth: `${pixelSize}px`,
        minHeight: `${pixelSize}px`,
        borderRadius: size === 'sm' ? '4px' : size === 'md' ? '6px' : '12px'
      }}
    >
      {/* Subtle depth glow for the white container */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-slate-200/30 pointer-events-none" />
      )}
      
      <motion.div
        key={spinning ? 'spinning' : 'static'}
        className="flex items-center justify-center relative z-10"
        style={{ width: '100%', height: '100%' }}
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
            "object-contain relative z-10 transition-all duration-1000",
            imageScale,
            spinning && "brightness-105 contrast-110"
          )}
          style={{ 
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            imageRendering: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' 
          }}
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </div>
  );
}
