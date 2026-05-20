"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
        setIsRefreshing(false);
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
          scale: isRefreshing ? 1.5 : pullProgress,
          y: isRefreshing ? 40 : 0
        }}
      >
        <div className="bg-blue-600 rounded-full p-5 shadow-[0_0_30px_rgba(37,99,235,0.4)] border-4 border-white flex items-center justify-center">
          <Loader2 
            className={`w-10 h-10 text-white ${isRefreshing ? 'animate-spin' : ''}`}
            style={{ 
              transform: isRefreshing ? undefined : `rotate(${pullProgress * 360}deg)` 
            }}
          />
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
