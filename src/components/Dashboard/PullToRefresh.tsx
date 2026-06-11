"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  
  const touchStart = useRef(0);
  const isPulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const y = useMotionValue(0);
  const controls = useAnimation();
  
  const THRESHOLD = 90;
  const REFRESH_POS = 70;

  // Use a ref for onRefresh to avoid listener re-attachment on every render
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      setIsAtTop(scrollY <= 5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isRefreshing || !isAtTop) return;
    touchStart.current = e.touches[0].clientY;
    isPulling.current = true;
  }, [isRefreshing, isAtTop]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current || isRefreshing || !isAtTop) return;
    
    const touchY = e.touches[0].clientY;
    const diff = touchY - touchStart.current;
    
    if (diff > 0) {
      if (e.cancelable) {
        e.preventDefault();
      }
      const pullY = Math.pow(diff, 0.85); 
      y.set(pullY);
      setPullProgress(Math.min(pullY / THRESHOLD, 1));
    } else if (diff < 0) {
      y.set(0);
      setPullProgress(0);
      isPulling.current = false;
    }
  }, [isRefreshing, isAtTop, y]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || isRefreshing) return;
    isPulling.current = false;

    const currentY = y.get();
    if (currentY >= THRESHOLD && isAtTop) {
      setIsRefreshing(true);
      
      await controls.start({ 
        y: REFRESH_POS, 
        transition: { type: "spring", stiffness: 400, damping: 30 } 
      });

      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(15);
      }

      const startTime = Date.now();
      try {
        await onRefreshRef.current();
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1000 - elapsed);
        
        setTimeout(async () => {
          setIsRefreshing(false);
          setPullProgress(0);
          await controls.start({ 
            y: 0, 
            transition: { type: "spring", stiffness: 300, damping: 35 } 
          });
          y.set(0);
        }, remaining);
      }
    } else {
      setPullProgress(0);
      await controls.start({ 
        y: 0, 
        transition: { type: "spring", stiffness: 400, damping: 30 } 
      });
      y.set(0);
    }
  }, [isRefreshing, isAtTop, y, controls]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Standard DOM events are needed to bypass React's passive-by-default behavior
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen overflow-x-hidden"
    >
      {/* Neural Sync Indicator */}
      <div 
        className="fixed top-0 left-0 right-0 flex flex-col items-center justify-center z-0 pointer-events-none" 
        style={{ height: 160 }}
      >
         <motion.div
           style={{
             opacity: isRefreshing ? 1 : pullProgress,
             scale: isRefreshing ? 1 : 0.7 + (pullProgress * 0.3),
           }}
           className="flex flex-col items-center pt-6"
         >
            <div className={cn(
              "p-2 rounded-full border-2 transition-all duration-300 backdrop-blur-md",
              isRefreshing 
                ? "border-primary shadow-[0_0_40px_rgba(var(--primary-rgb),0.5)] bg-slate-900" 
                : "border-white/10 bg-slate-900/40"
            )}>
              <BrandedGlobe
                size="md"
                animate={true}
                spinning={isRefreshing || pullProgress > 0.5}
              />
            </div>
            <motion.span 
              className="mt-3 text-[9px] font-black text-primary uppercase tracking-[0.5em] drop-shadow-lg"
              animate={isRefreshing ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
              transition={isRefreshing ? { repeat: Infinity, duration: 1 } : {}}
            >
              {isRefreshing ? "Neural Syncing" : (pullProgress > 0.9 ? "Release to Sync" : "Pull to Sync")}
            </motion.span>
         </motion.div>
      </div>

      <motion.div
        animate={controls}
        style={{ y }}
        className="relative z-10 w-full min-h-screen bg-theme-surface shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
      >
        {children}
      </motion.div>
    </div>
  );
}
