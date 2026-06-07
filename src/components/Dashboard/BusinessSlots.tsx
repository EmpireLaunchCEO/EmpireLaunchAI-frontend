"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Stars, TrendingUp, ChevronRight, Briefcase, Video, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StudioTeaserModal } from '../Studio/StudioTeaserModal';

interface BusinessSlotProps {
  id: string;
  name: string;
  niche: string;
  status: 'active' | 'locked' | 'hype';
  growthScore?: number;
  onHypeClick?: () => void;
  onClick?: () => void;
}

const BusinessSlot = ({ name, niche, status, growthScore, onHypeClick, onClick }: BusinessSlotProps) => {
  const isLocked = status === 'locked';
  const isHype = status === 'hype';

  const handleClick = () => {
    if (isHype && onHypeClick) onHypeClick();
    else if (!isLocked && onClick) onClick();
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      <div className={cn(
        "relative overflow-hidden rounded-[24px] md:rounded-[32px] p-5 md:p-6 h-40 md:h-48 transition-all duration-500",
        isLocked
          ? "bg-theme-background border-2 border-theme opacity-80"
          : isHype
          ? "bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-blue-400 text-white shadow-2xl shadow-blue-500/20"
          : "bg-theme-surface border-2 border-blue-50 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10"
      )}>
        {/* Hype Content */}
        {isHype && (
          <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-100">Neural Expansion</span>
              </div>
              <h3 className="text-xl font-black leading-[0.9] tracking-tighter uppercase italic">Empire Studio</h3>
              <p className="text-[10px] font-bold text-blue-100 mt-2 uppercase tracking-tight">AI Creative Engine</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md border border-white/20">
                View Blueprint
              </span>
              <Video className="w-6 h-6 text-white/50" />
            </div>
          </div>
        )}

        {/* Active Content */}
        {!isLocked && !isHype && (
          <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Primary Empire</span>
              </div>
              <h3 className="text-lg font-black text-foreground leading-tight tracking-tight uppercase italic">{name}</h3>
              <p className="text-xs font-medium text-muted-foreground">{niche}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
                  <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Score: {growthScore}</span>
                </div>
                <TrendingUp className="w-3 h-3 text-primary" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
            </div>
          </div>
        )}

        {/* Locked Content */}
        {isLocked && (
          <div className="flex flex-col h-full items-center justify-center text-center space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-theme-surface shadow-sm flex items-center justify-center text-slate-300">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Slot</span>
              <p className="text-xs font-bold text-slate-300 italic">Expansion Pending...</p>
            </div>
          </div>
        )}

        {/* The Shiny Glass Lock Overlay */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 z-20 backdrop-blur-md bg-theme-surface/10 flex items-center justify-center p-6 border border-white/20"
          >
            <div className="relative group/lock">
              {/* Glass background */}
              <div className="absolute inset-0 bg-theme-surface/30 rounded-full blur-xl group-hover/lock:scale-150 transition-transform duration-700" />

              <div className="relative bg-theme-surface/80 backdrop-blur-2xl w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl border border-white/50">
                <Lock className="w-7 h-7 text-blue-600" />
                <Stars className="absolute -top-2 -right-2 w-5 h-5 text-amber-400 animate-pulse" />
              </div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center gap-2"
              >
                <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-2xl border border-white/10">
                  Authorize Slot ($40)
                </span>
                <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  + $40/mo added to sub
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative gradient for active slot */}
      {!isLocked && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[36px] -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
};

export function BusinessSlots({ currentEmpire }: { currentEmpire?: any }) {
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const handleSlotClick = () => {
    // If niche is missing or pending, trigger the global Intelligence Sync UI
    if (!currentEmpire?.niche || currentEmpire.niche === 'Niche Pending' || currentEmpire.title === 'The First Empire') {
      window.dispatchEvent(new CustomEvent('empire:force-intel-sync'));
    } else {
      // Otherwise navigate to Empire Center for operations
      window.location.href = '/empire-center';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-foreground tracking-tight uppercase italic">Empire Slots</h2>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expansion Enabled</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BusinessSlot
          id="1"
          name={currentEmpire?.name || "The First Empire"}
          niche={currentEmpire?.niche || "Niche Pending"}
          status="active"
          growthScore={92}
          onClick={handleSlotClick}
        />
        <BusinessSlot
          id="studio"
          name="Empire Studio"
          niche="Creative Engine"
          status="hype"
          onHypeClick={() => setIsStudioOpen(true)}
        />
        <BusinessSlot id="2" name="Empty" niche="Empty" status="locked" />
        <BusinessSlot id="3" name="Empty" niche="Empty" status="locked" />
      </div>

      <StudioTeaserModal 
        isOpen={isStudioOpen} 
        onClose={() => setIsStudioOpen(false)} 
      />
    </div>
  );
}
