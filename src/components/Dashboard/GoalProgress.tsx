"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface GoalProgressProps {
  current: number;
  target: number;
  label: string;
}

export function GoalProgress({ current, target, label }: GoalProgressProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
      <h3 className="text-slate-500 font-medium mb-6">{label}</h3>
      <div className="relative flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-100"
          />
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            className="text-blue-600"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold text-slate-900">${current.toLocaleString()}</span>
          <span className="text-sm text-slate-500 mt-1">of ${target.toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 w-full">
        <div className="bg-slate-50 p-3 rounded-xl text-center">
          <span className="block text-xs text-slate-500">Etsy</span>
          <span className="font-semibold">$400</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl text-center">
          <span className="block text-xs text-slate-500">TikTok</span>
          <span className="font-semibold">$200</span>
        </div>
      </div>
    </div>
  );
}
