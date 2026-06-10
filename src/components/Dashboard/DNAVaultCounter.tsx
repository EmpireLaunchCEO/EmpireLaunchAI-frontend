"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Shield, Sparkles, Lock, Cpu, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── DNA Vault Counter ──────────────────────────────────────────────────────

export function DNAVaultCounter() {
  const [count, setCount] = useState(0);
  const [isGlowing, setIsGlowing] = useState(false);
  const targetCount = 1000000; // 1M+ DNA codes

  // Animate count on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = Math.floor(targetCount / steps);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
        return;
      }
      setCount(current);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  // Pulsing glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatCount = (n: number): string => {
    if (n >= 1000000) return (n / 1000000).toFixed(0) + 'M+';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K+';
    return n.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        "relative overflow-hidden rounded-[28px] p-6 md:p-8 border-2 transition-all duration-700",
        "bg-gradient-to-br from-slate-900 via-theme-surface to-slate-900",
        isGlowing ? "border-primary/40 shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)]" : "border-primary/20 shadow-lg"
      )}
    >
      {/* Ambient background glow */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] transition-opacity duration-1000",
        isGlowing ? "opacity-30 bg-primary" : "opacity-10 bg-primary"
      )} />

      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        {/* Vault Icon */}
        <div className="relative shrink-0">
          <div className={cn(
            "w-16 h-16 rounded-[20px] flex items-center justify-center border-2 transition-all duration-500",
            "bg-slate-900 border-primary/30",
            isGlowing && "shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
          )}>
            <Lock className="w-7 h-7 text-primary" />
          </div>
          {/* Animated ring */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -inset-2 rounded-[24px] border border-primary/20 -z-10"
          />
        </div>

        {/* Count & Labels */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <motion.span
              key={count}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-foreground tracking-tight"
            >
              {formatCount(count)}
            </motion.span>
            <div className={cn(
              "px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest transition-all",
              isGlowing
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-primary/10 text-primary border-primary/20"
            )}>
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isGlowing ? "bg-emerald-400 animate-pulse" : "bg-primary"
                )} />
                {isGlowing ? 'Synthesizing' : 'Live'}
              </div>
            </div>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1.5">
            DNA strands harvested from global market intelligence
          </p>
        </div>

        {/* Status Badges */}
        <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <Database className="w-3 h-3 text-cyan-400" />
            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">Universal Vault</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
            <Cpu className="w-3 h-3 text-slate-400" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">AI-Synthesized</span>
          </div>
        </div>

        {/* Mobile badges */}
        <div className="flex sm:hidden items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <Database className="w-2.5 h-2.5 text-cyan-400" />
            <span className="text-[7px] font-black uppercase tracking-widest text-cyan-400">Vault</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
            <Cpu className="w-2.5 h-2.5 text-slate-400" />
            <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">AI</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 mt-5 pt-4 border-t border-theme flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
          <Shield className="w-3 h-3 text-primary" />
          Anti-Copycat Verified
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black text-primary">
          <span>View Vault</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
}