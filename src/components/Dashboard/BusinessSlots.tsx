"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Stars, TrendingUp, ChevronRight, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessSlotProps {
  id: string;
  name: string;
  niche: string;
  status: 'active' | 'locked';
  growthScore?: number;
}

const BusinessSlot = ({ name, niche, status, growthScore }: BusinessSlotProps) => {
  const isLocked = status === 'locked';

  return (
    <div className="relative group cursor-pointer">
      <div className={cn(
        "relative overflow-hidden rounded-[32px] p-6 h-48 transition-all duration-500",
        isLocked 
          ? "bg-slate-50 border-2 border-slate-100 opacity-80" 
          : "bg-white border-2 border-blue-50 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10"
      )}>
        {/* Active Content */}
        {!isLocked && (
          <div className="flex flex-col h-full justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Empire</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">{name}</h3>
              <p className="text-sm font-medium text-slate-500">{niche}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-50 px-2 py-1 rounded-lg">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Score: {growthScore}</span>
                </div>
                <TrendingUp className="w-3 h-3 text-blue-600" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        )}

        {/* Locked Content */}
        {isLocked && (
          <div className="flex flex-col h-full items-center justify-center text-center space-y-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300">
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
            className="absolute inset-0 z-20 backdrop-blur-md bg-white/10 flex items-center justify-center p-6 border border-white/20"
          >
            <div className="relative group/lock">
              {/* Glass background */}
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl group-hover/lock:scale-150 transition-transform duration-700" />
              
              <div className="relative bg-white/80 backdrop-blur-2xl w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl border border-white/50">
                <Lock className="w-7 h-7 text-blue-600" />
                <Stars className="absolute -top-2 -right-2 w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                  Unlock Business 2
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Empires</h2>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slots 1/3</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BusinessSlot 
          id="1" 
          name={currentEmpire?.name || "The First Empire"} 
          niche={currentEmpire?.niche || "Niche Pending"} 
          status="active" 
          growthScore={92}
        />
        <BusinessSlot id="2" name="Empty" niche="Empty" status="locked" />
        <BusinessSlot id="3" name="Empty" niche="Empty" status="locked" />
      </div>
    </div>
  );
}
