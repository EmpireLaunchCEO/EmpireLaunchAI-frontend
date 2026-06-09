"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const controls = useAnimation();
  
  // Adjusted thresholds for more sensitive and deliberate trigger
  const THRESHOLD = 80; 
  const REFRESH_POS = 70;

  // Map the y value to a 0-1 progress value for the globe animation
  const pullProgress = useTransform(y, [0, THRESHOLD], [0, 1]);
  const [progressVal, setProgressVal] = useState(0);

  useEffect(() => {
    return pullProgress.on("change", v => setProgressVal(v));
  }, [pullProgress]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      setIsAtTop(scrollY <= 5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDragEnd = async (_: any, info: any) => {
    if (isRefreshing) return;

    const currentY = y.get();
    if (currentY >= THRESHOLD && isAtTop) {
      setIsRefreshing(true);
      
      // Animate to refresh position
      await controls.start({ 
        y: REFRESH_POS, 
        transition: { type: "spring", stiffness: 400, damping: 30 } 
      });

      // Haptic feedback
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(15);
      }

      // Minimum 1.2 second refresh to show high-fidelity animation
      const startTime = Date.now();
      try {
        await onRefresh();
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1200 - elapsed);
        
        setTimeout(async () => {
          setIsRefreshing(false);
          await controls.start({ 
            y: 0, 
            transition: { type: "spring", stiffness: 300, damping: 35 } 
          });
        }, remaining);
      }
    } else {
      controls.start({ 
        y: 0, 
        transition: { type: "spring", stiffness: 400, damping: 30 } 
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Neural Sync Indicator (Centered background layer) */}
      <div 
        className="fixed top-0 left-0 right-0 flex flex-col items-center justify-center z-0 pointer-events-none" 
        style={{ height: 160 }}
      >
         <motion.div
           style={{
             opacity: isRefreshing ? 1 : Math.max(0, progressVal),
             scale: isRefreshing ? 1 : 0.7 + (progressVal * 0.3),
           }}
           className="flex flex-col items-center pt-4"
         >
            <div className={cn(
              "p-2 rounded-full border-2 transition-all duration-300 backdrop-blur-md",
              isRefreshing 
                ? "border-primary shadow-[0_0_40px_rgba(0,229,255,0.5)] bg-slate-900" 
                : "border-white/10 bg-slate-900/40"
            )}>
              <BrandedGlobe
                size="md"
                animate={true}
                spinning={isRefreshing || progressVal > 0.4}
              />
            </div>
            <motion.span 
              className="mt-3 text-[9px] font-black text-primary uppercase tracking-[0.5em] drop-shadow-lg"
              animate={isRefreshing ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
              transition={isRefreshing ? { repeat: Infinity, duration: 1 } : {}}
            >
              {isRefreshing ? "Neural Syncing" : (progressVal > 0.8 ? "Release to Sync" : "Pull to Sync")}
            </motion.span>
         </motion.div>
      </div>

      <motion.div
        ref={containerRef}
        drag={isAtTop && !isRefreshing ? "y" : false}
        dragConstraints={{ top: 0, bottom: THRESHOLD + 40 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y }}
        className="relative z-10 w-full min-h-screen bg-transparent"
      >
        {/* Content wrapper with background to reveal the globe behind it */}
        <div className="w-full h-full bg-slate-950/20 backdrop-blur-[2px]">
           {children}
        </div>
      </motion.div>
    </div>
  );
}
