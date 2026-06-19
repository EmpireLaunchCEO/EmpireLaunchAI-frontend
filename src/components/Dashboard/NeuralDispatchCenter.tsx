"use client";

import React, { useState } from 'react';
import { 
  Video, 
  Edit3, 
  UserSquare2, 
  Palette, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';

export function NeuralDispatchCenter() {
  const { connectedPlatforms } = useEmpire();
  const [activeQueue, setActiveQueue] = useState<string | null>(null);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState(false);

  const categories = [
    { id: 'videos', label: 'Pending Videos', icon: Video, count: 5 },
    { id: 'edits', label: 'Pending Edits', icon: Edit3, count: 3 },
    { id: 'faceless', label: 'Pending Faceless', icon: UserSquare2, count: 2 },
    { id: 'designs', label: 'Pending Designs', icon: Palette, count: 4 },
  ];

  const handleAppToggle = (platform: string) => {
    if (!isApproved) return;
    setSelectedApps(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  return (
    <div className="bg-theme-surface/40 backdrop-blur-xl border-2 border-theme rounded-[40px] overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
        
        {/* LEFT SIDE: 2x2 GRID */}
        <div className="md:w-1/2 p-6 md:p-10 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Creation Queues</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveQueue(cat.id)}
                className={cn(
                  "aspect-square rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 transition-all border-2 relative group overflow-hidden",
                  activeQueue === cat.id
                    ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]"
                    : "bg-slate-900/50 border-white/5 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                  activeQueue === cat.id ? "bg-primary text-slate-950" : "bg-white/5 text-slate-400 group-hover:text-white"
                )}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-white leading-tight">{cat.label}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">{cat.count} items</p>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: LINKED APPS */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-5 h-5 text-primary" />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Dispatch Destinations</h4>
          </div>

          <div className="space-y-3">
            {connectedPlatforms.length > 0 ? (
              connectedPlatforms.map((platform) => {
                const isSelected = selectedApps.includes(platform);
                return (
                  <button
                    key={platform}
                    disabled={!isApproved}
                    onClick={() => handleAppToggle(platform)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all group",
                      !isApproved && "opacity-40 cursor-not-allowed grayscale",
                      isSelected 
                        ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                        : "bg-slate-900/40 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black",
                        isSelected ? "bg-emerald-500 text-slate-950" : "bg-white/5 text-white/40"
                      )}>
                        {platform.charAt(0)}
                      </div>
                      <span className={cn(
                        "text-xs font-black uppercase tracking-widest",
                        isSelected ? "text-emerald-400" : "text-slate-400 group-hover:text-white"
                      )}>
                        {platform}
                      </span>
                    </div>
                    
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected 
                        ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                        : "border-white/10"
                    )}>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Platforms Linked</p>
                <p className="text-[9px] text-slate-600 mt-2 italic">Visit Link Center to activate destinations.</p>
              </div>
            )}
          </div>

          <div className="mt-8">
             <button 
               className={cn(
                 "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3",
                 selectedApps.length > 0
                  ? "bg-primary text-slate-950 shadow-xl shadow-primary/20 scale-[1.02]"
                  : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
               )}
               disabled={selectedApps.length === 0}
             >
               Execute Dispatch
               <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* FOOTER MESSAGE */}
      <div className="bg-slate-900/80 px-6 py-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">
          {isApproved ? "Verification Complete. Select destinations." : "Select a queue to begin review protocol."}
        </p>
        <div className="flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Syncing</span>
        </div>
      </div>
    </div>
  );
}
