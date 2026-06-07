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
      const target = e.target;
      if (target instanceof HTMLElement) {
        setIsAtTop(target.scrollTop <= 5);
      } else {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        setIsAtTop(scrollY <= 5);
      }
    };

    // Listen on capture phase to catch scrolls from any parent
    window.addEventListener('scroll', handleScroll, true);
    // Also check on mount
    handleScroll({ target: document.querySelector('main') } as any);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    return y.on("change", (latest) => {
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
      await controls.start({ y: 80, transition: { type: "spring", stiffness: 300, damping: 20 } });

      try {
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate(10);
        }
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        await new Promise(resolve => setTimeout(resolve, 600));
        setPullProgress(0);
        await controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
      }
    } else {
      setPullProgress(0);
      await controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Pull indicator */}
      <motion.div
        className="fixed top-20 left-0 right-0 flex flex-col items-center justify-center z-[11000] pointer-events-none"
        style={{
          opacity: isRefreshing ? 1 : pullProgress,
          y: isRefreshing ? 0 : (pullProgress * 40) - 20
        }}
      >
        <div className={cn(
          "bg-slate-900 rounded-full p-2 shadow-2xl border-2 transition-all duration-300",
          isRefreshing ? "border-primary scale-110 shadow-primary/20" : "border-white/10"
        )}>
          <BrandedGlobe
            size="md"
            animate={true}
            spinning={isRefreshing}
          />
        </div>
        
        {isRefreshing && (
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-3 drop-shadow-md"
          >
            Neural Syncing
          </motion.span>
        )}
      </motion.div>

      <motion.div
        onPan={(e, info) => {
          // Detect if we are scrolling or pulling
          const isHorizontalSwipe = Math.abs(info.offset.x) > Math.abs(info.offset.y);
          if (isHorizontalSwipe) return;

          if (isAtTop && info.offset.y > 0) {
            // Apply resistance
            const pullY = Math.pow(info.offset.y, 0.85);
            y.set(pullY);
          } else if (info.offset.y < 0 && y.get() > 0) {
            y.set(0);
          }
        }}
        onPanEnd={handleDragEnd}
        animate={controls}
        style={{ y }}
        className="relative z-10 w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
