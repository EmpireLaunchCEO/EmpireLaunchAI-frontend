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
        className="fixed top-8 left-0 right-0 flex justify-center z-[11000] pointer-events-none"
        style={{
          opacity: isRefreshing ? 1 : pullProgress,
          scale: isRefreshing ? 1 : Math.max(0.5, pullProgress)
        }}
      >
        <div className="bg-theme-surface rounded-full p-1.5 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-primary/40 flex items-center justify-center overflow-hidden">
          <motion.div
            animate={isRefreshing ? {
              scale: [1, 1.15, 1],
              rotate: [0, 10, 0, -10, 0]
            } : {
              scale: pullProgress,
              rotate: pullProgress * 180
            }}
            transition={isRefreshing ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            } : {
              duration: 0.1
            }}
          >
            <BrandedGlobe
              size="sm"
              animate={isRefreshing}
              className={cn(
                "transition-colors",
                isRefreshing ? "opacity-100 ring-1 ring-primary/20" : "opacity-80"
              )}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        onPan={(e, info) => {
          // Only pull down if at the very top and moving down
          if (isAtTop && info.offset.y > 0) {
            y.set(info.offset.y * 0.4);
          } else if (info.offset.y < 0 && y.get() > 0) {
            const newVal = Math.max(0, y.get() + info.delta.y);
            y.set(newVal);
          }
        }}
        onPanEnd={handleDragEnd}
        animate={controls}
        style={{ y, touchAction: "pan-y" }}
        className="relative z-10 w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
