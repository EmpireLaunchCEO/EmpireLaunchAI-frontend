"use client";

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Globe } from 'lucide-react';
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
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div className="relative min-h-screen bg-slate-50">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-12 left-0 right-0 flex justify-center z-[1000] pointer-events-none"
        style={{ 
          opacity: isRefreshing ? 1 : pullProgress,
          y: isRefreshing ? 40 : 0
        }}
      >
        <div className="bg-white rounded-full p-4 shadow-2xl border-2 border-slate-100 flex items-center justify-center overflow-hidden">
          <motion.div
            animate={isRefreshing ? {
              scale: [1, 1.3, 1],
            } : {
              scale: pullProgress,
              rotate: pullProgress * 360
            }}
            transition={isRefreshing ? {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            } : {
              duration: 0.1
            }}
          >
            <Globe 
              className={cn(
                "w-10 h-10 transition-colors",
                isRefreshing ? "text-blue-600" : "text-slate-300"
              )}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        drag={isAtTop ? "y" : false}
        dragConstraints={{ top: 0, bottom: 400 }}
        dragElastic={0.4}
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
