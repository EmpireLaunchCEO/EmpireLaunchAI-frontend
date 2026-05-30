"use client";

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const controls = useAnimation();
  const y = useMotionValue(0);

  const THRESHOLD = 60;

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.scrollTop !== undefined) {
        setIsAtTop(target.scrollTop <= 0);
      } else {
        setIsAtTop(window.scrollY <= 0);
      }
    };

    // Listen on capture phase to catch scrolls from any parent
    window.addEventListener('scroll', handleScroll, true);
    // Also check on mount
    handleScroll({ target: document.querySelector('main') } as any);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    return y.onChange((latest) => {
      if (!isRefreshing) {
        setPullProgress(Math.min(latest / THRESHOLD, 1));
      }
    });
  }, [y, isRefreshing]);

  const handleDragEnd = async () => {
    if (y.get() >= THRESHOLD && !isRefreshing && isAtTop) {
      setIsRefreshing(true);
      setPullProgress(1);

      // Snap to refreshing position
      await controls.start({ y: 70, transition: { type: "spring", stiffness: 300, damping: 20 } });

      try {
        await onRefresh();
      } finally {
        // Go still for a moment
        setIsRefreshing(false);
        await new Promise(resolve => setTimeout(resolve, 800));
        setPullProgress(0);
        await controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
      }
    } else {
      await controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
    }
  };

  return (
    <div className="relative min-h-screen bg-theme-background">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-12 left-0 right-0 flex justify-center z-[1000] pointer-events-none"
        style={{
          opacity: isRefreshing ? 1 : pullProgress,
          y: isRefreshing ? 40 : 0
        }}
      >
        <div className="bg-theme-surface rounded-full p-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-2 border-theme flex items-center justify-center overflow-hidden">
          <motion.div
            animate={isRefreshing ? {
              scale: [1, 1.1, 1],
              rotate: 360
            } : {
              scale: pullProgress,
              rotate: pullProgress * 360
            }}
            transition={isRefreshing ? {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            } : {
              duration: 0.1
            }}
          >
            <BrandedGlobe
              size="lg"
              animate={isRefreshing}
              className={cn(
                "transition-colors",
                isRefreshing ? "opacity-100 ring-4 ring-primary/20" : "opacity-80"
              )}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        drag={isAtTop ? "y" : false}
        dragConstraints={{ top: 0, bottom: 400 }}
        dragElastic={0.05}
        dragDirectionLock
        onDragStart={(e, info) => {
          // If the user is swiping UP (negative Y), kill the drag to let native scroll take over
          if (info.delta.y < 0) {
             controls.stop();
          }
        }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
