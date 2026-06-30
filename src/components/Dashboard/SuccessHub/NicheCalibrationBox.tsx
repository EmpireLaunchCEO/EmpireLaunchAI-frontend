"use client";
import React, { useState, useEffect } from 'react';
import { Target, Minus, Maximize2 } from 'lucide-react';
import { BrandedGlobe } from '@/components/BrandedGlobe';

interface NicheBoxProps {
  niche?: string;
  angle?: string;
  archetype?: string;
  isOperationsBase?: boolean;
}

export const NicheCalibrationBox = ({ niche, angle, archetype, isOperationsBase }: NicheBoxProps) => {
  const isPending = !niche;
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-niche-calibration');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-niche-calibration', String(newState));
  };

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-3xl p-4 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[64px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-foreground">Niche Calibration</h2>
        </div>
        <button 
          onClick={toggleMinimize}
          className="p-2 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  const nicheDisplay = isOperationsBase 
    ? (niche || "DONE FOR YOU BUSINESS")
    : (niche || "Niche Pending");

  return (
    <div className="bg-theme-surface border-2 border-theme rounded-[32px] p-8 shadow-lg space-y-6 relative">
      {/* Minimize Toggle */}
      <div className="absolute top-4 right-5 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-2 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              {isPending ? (
                <BrandedGlobe size="md" spinning glow={false} />
              ) : (
                <Target className="w-6 h-6 text-primary" />
              )}
           </div>
           <div>
              <h3 className="text-xl font-black text-foreground uppercase italic tracking-tight">NICHE</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {isPending ? "Neural Calibration Active" : "Neural Calibration Status"}
              </p>
           </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
           <p className={`text-sm font-black uppercase italic \${isPending ? "text-primary animate-pulse" : "text-foreground"}`}>
             {nicheDisplay}
           </p>
           {archetype && (
             <span className="text-[7px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
               {archetype === 'CREATOR' ? 'The Creator' : 'The Catalyst'}
             </span>
           )}
           <p className="text-[9px] font-bold text-primary uppercase tracking-widest">

           </p>
        </div>

      {angle && (
        <div className="pt-6 border-t border-theme/20 space-y-4">
          <div>
            <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-2">Strategic Angle</p>
            <p className="text-xs font-medium text-muted-foreground italic leading-relaxed">
              "{angle}"
            </p>
          </div>
          <div className="pt-4 border-t border-theme/10 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Locked: Changes managed by AI via Feedback</p>
          </div>
        </div>
      )}
    </div>
  );
};
