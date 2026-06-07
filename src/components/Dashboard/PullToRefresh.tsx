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

  const THRESHOLD = 100;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsAtTop(scrollY <= 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return y.on("change", (latest) => {
      if (!isRefreshing) {
        setPullProgress(Math.min(latest / THRESHOLD, 1));
      }
    });
  }, [y, isRefreshing]);

  const handleDragEnd = async () => {
    const currentY = y.get();
    if (currentY >= THRESHOLD && !isRefreshing && isAtTop) {
      setIsRefreshing(true);
      setPullProgress(1);

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
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsRefreshing(false);
        setPullProgress(0);
        await controls.start({ 
          y: 0, 
          transition: { type: "spring", stiffness: 300, damping: 30 } 
        });
      }
    } else {
      setPullProgress(0);
      await controls.start({ 
        y: 0, 
        transition: { type: "spring", stiffness: 300, damping: 30 } 
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Pull indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 flex flex-col items-center justify-center z-0 pointer-events-none"
        style={{
          height: 160,
          opacity: isRefreshing ? 1 : pullProgress,
          scale: isRefreshing ? 1 : 0.8 + (pullProgress * 0.2),
        }}
      >
        <div className={cn(
          "bg-slate-950 rounded-full p-3 shadow-[0_0_50px_rgba(0,229,255,0.2)] border-2 transition-all duration-300",
          isRefreshing ? "border-primary scale-110 shadow-primary/40" : "border-white/10"
        )}>
          <BrandedGlobe
            size="lg"
            animate={true}
            spinning={isRefreshing}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: (isRefreshing || pullProgress > 0.8) ? 1 : 0 }}
          className="mt-4 flex flex-col items-center gap-1"
        >
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] drop-shadow-lg">
            {isRefreshing ? "Neural Syncing" : "Pull to Sync"}
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 500 }}
        dragElastic={0.15}
        onDrag={(e, info) => {
          if (!isAtTop || isRefreshing) return;
          if (info.offset.y > 0) {
            y.set(info.offset.y * 0.5);
          } else {
            y.set(0);
          }
        }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y }}
        className="relative z-10 w-full bg-theme-surface shadow-[0_-20px_50px_rgba(0,0,0,0.3)] min-h-screen"
      >
        {children}
      </motion.div>
    </div>
  );
}
