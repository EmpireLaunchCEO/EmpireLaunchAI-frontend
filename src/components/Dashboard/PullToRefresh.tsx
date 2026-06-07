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

  const THRESHOLD = 80;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsAtTop(scrollY <= 5); // More sensitive top detection
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePan = (e: any, info: any) => {
    if (!isAtTop || isRefreshing) return;
    
    // Only pull down (positive y offset)
    if (info.offset.y > 0) {
      const dampenedY = info.offset.y * 0.6;
      y.set(dampenedY);
      setPullProgress(Math.min(dampenedY / THRESHOLD, 1));
    } else {
      y.set(0);
      setPullProgress(0);
    }
  };

  const handlePanEnd = async (e: any, info: any) => {
    if (isRefreshing) return;
    
    const currentY = y.get();
    if (currentY >= THRESHOLD && isAtTop) {
      setIsRefreshing(true);
      setPullProgress(1);

      // Snap to refreshing position
      await controls.start({ 
        y: 80, 
        transition: { type: "spring", stiffness: 400, damping: 25 } 
      });

      try {
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate(15);
        }
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullProgress(0);
        await controls.start({ 
          y: 0, 
          transition: { type: "spring", stiffness: 300, damping: 30 } 
        });
      }
    } else {
      setPullProgress(0);
      y.set(0);
      await controls.start({ 
        y: 0, 
        transition: { type: "spring", stiffness: 300, damping: 30 } 
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Background Globe Area (hidden behind content) */}
      <div className="fixed top-0 left-0 right-0 flex flex-col items-center justify-center z-0 pointer-events-none overflow-hidden" style={{ height: 180 }}>
         <motion.div
           style={{
             opacity: isRefreshing ? 1 : pullProgress,
             scale: isRefreshing ? 1 : 0.7 + (pullProgress * 0.3),
           }}
           className="flex flex-col items-center"
         >
            <div className={cn(
              "bg-slate-950 rounded-full p-2 border-2 transition-all duration-300",
              isRefreshing ? "border-primary shadow-[0_0_40px_rgba(0,229,255,0.4)]" : "border-white/10"
            )}>
              <BrandedGlobe
                size="lg"
                animate={true}
                spinning={isRefreshing}
              />
            </div>
            <span className="mt-2 text-[8px] font-black text-primary uppercase tracking-[0.4em]">
              {isRefreshing ? "Neural Syncing" : "Pull to Sync"}
            </span>
         </motion.div>
      </div>

      <motion.div
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        animate={controls}
        style={{ y }}
        className="relative z-10 w-full bg-theme-surface shadow-[0_-20px_50px_rgba(0,0,0,0.3)] min-h-screen will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
