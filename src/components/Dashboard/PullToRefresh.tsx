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
  
  // Lower threshold for easier triggering (50px instead of 80px)
  const THRESHOLD = 50;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      setIsAtTop(scrollY <= 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Frequent checks during load to ensure sync
    const interval = setInterval(handleScroll, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handlePan = (e: any, info: any) => {
    if (!isAtTop || isRefreshing) return;
    
    // Only respond to downward pulls
    if (info.offset.y > 0) {
      // Apply linear resistance for a "snappy" feel
      const pullY = info.offset.y * 0.4;
      y.set(pullY);
      setPullProgress(Math.min(pullY / THRESHOLD, 1));
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

      // Snap to active refresh position
      await controls.start({ 
        y: 60, 
        transition: { type: "spring", stiffness: 400, damping: 25 } 
      });

      try {
        // Trigger haptic if available (Android)
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate(10);
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
      {/* Neural Sync Indicator (Centered background layer) */}
      <div className="fixed top-0 left-0 right-0 flex flex-col items-center justify-center z-0 pointer-events-none" style={{ height: 140 }}>
         <motion.div
           style={{
             opacity: isRefreshing ? 1 : pullProgress,
             scale: isRefreshing ? 1 : 0.8 + (pullProgress * 0.2),
           }}
           className="flex flex-col items-center"
         >
            <div className={cn(
              "p-2 rounded-full border-2 transition-all duration-300 bg-slate-900",
              isRefreshing ? "border-primary shadow-[0_0_30px_rgba(0,229,255,0.3)]" : "border-white/5"
            )}>
              <BrandedGlobe
                size="md"
                animate={true}
                spinning={isRefreshing}
              />
            </div>
            <span className="mt-2 text-[8px] font-black text-primary uppercase tracking-[0.4em] drop-shadow-md">
              {isRefreshing ? "Neural Syncing" : "Pull to Sync"}
            </span>
         </motion.div>
      </div>

      <motion.div
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        animate={controls}
        style={{ y, touchAction: 'auto' }}
        className="relative z-10 w-full min-h-screen bg-transparent"
      >
        {children}
      </motion.div>
    </div>
  );
}
