"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressConstellationProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressConstellation({ currentStep, totalSteps }: ProgressConstellationProps) {
  // Define star positions (in percentage)
  const stars = [
    { x: 10, y: 50 },
    { x: 35, y: 20 },
    { x: 65, y: 80 },
    { x: 90, y: 50 },
  ];

  return (
    <div className="relative w-full max-w-xl h-24 mb-20 mx-auto mt-8">
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        {/* Draw lines between stars */}
        {stars.map((star, i) => {
          if (i === 0) return null;
          const prevStar = stars[i - 1];
          const isActive = currentStep > i;
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${prevStar.x}%`}
              y1={`${prevStar.y}%`}
              x2={`${star.x}%`}
              y2={`${star.y}%`}
              stroke={isActive ? "#3b82f6" : "#e2e8f0"}
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isActive ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </svg>

      {stars.map((star, i) => {
        const stepNum = i + 1;
        const isActive = currentStep >= stepNum;
        const isCompleted = currentStep > stepNum;

        return (
          <motion.div
            key={`star-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={cn(
              "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl",
              isActive ? "bg-blue-600 text-white ring-8 ring-blue-50" : "bg-white text-slate-300 border-2 border-slate-100"
            )}>
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <span className="text-sm font-black tracking-tighter">{stepNum}</span>
              )}
              
              {isActive && !isCompleted && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-400 -z-10"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
