"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Stars, Plus } from 'lucide-react';
import { useEmpire } from '@/lib/EmpireContext';

type EmpireStatus = 'on-track' | 'action-needed' | 'planning';

interface Empire {
  id: string;
  name: string;
  logoInitial: string;
  primaryColor: string;
  milestoneProgress: number;
  status: EmpireStatus;
  pendingApprovals: number;
}

const mockEmpires: Empire[] = [
  {
    id: '1',
    name: 'EcoGardens',
    logoInitial: 'E',
    primaryColor: 'bg-emerald-500',
    milestoneProgress: 75,
    status: 'on-track',
    pendingApprovals: 0,
  },
  {
    id: '2',
    name: 'PixelPlanners',
    logoInitial: 'P',
    primaryColor: 'bg-blue-500',
    milestoneProgress: 45,
    status: 'planning',
    pendingApprovals: 3,
  },
  {
    id: '3',
    name: 'HealthHub',
    logoInitial: 'H',
    primaryColor: 'bg-rose-500',
    milestoneProgress: 20,
    status: 'action-needed',
    pendingApprovals: 12,
  },
];

export function EmpireSwitcher() {
  const { activeEmpireId, setActiveEmpireId } = useEmpire();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div 
      className={cn(
        "hidden lg:flex flex-col bg-slate-950 text-white h-screen fixed left-0 top-0 z-[60] transition-all duration-300 border-r border-slate-800 shadow-2xl",
        isExpanded ? "w-[240px]" : "w-[72px]"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4 flex items-center justify-center h-16 border-b border-slate-800 shrink-0">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div 
              key="expanded-header"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3 w-full px-2"
            >
              <Stars className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">Empires</span>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Stars className="w-6 h-6 text-blue-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 py-6 flex flex-col items-center gap-6 overflow-y-auto no-scrollbar overflow-x-hidden">
        {mockEmpires.map((empire) => (
          <div key={empire.id} className="relative group px-3 w-full">
            <button
              onClick={() => setActiveEmpireId(empire.id)}
              onMouseEnter={() => setHoveredId(empire.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative flex items-center w-full focus:outline-none"
            >
              {/* Active Indicator */}
              {activeEmpireId === empire.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -left-3 w-1.5 h-10 bg-blue-500 rounded-r-full z-10"
                />
              )}

              <div className={cn(
                "relative flex items-center transition-all duration-200",
                isExpanded ? "gap-4 w-full" : "justify-center w-full"
              )}>
                {/* Avatar with Progress Ring */}
                <div className="relative shrink-0">
                  <svg className="w-12 h-12 -rotate-90 scale-110">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-slate-800"
                    />
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="transparent"
                      stroke={
                        empire.status === 'on-track' ? '#10b981' : 
                        empire.status === 'action-needed' ? '#f43f5e' : '#3b82f6'
                      }
                      strokeWidth="2.5"
                      strokeDasharray={2 * Math.PI * 20}
                      initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - empire.milestoneProgress / 100) }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  <div className={cn(
                    "absolute inset-[6px] rounded-full flex items-center justify-center text-lg font-bold transition-transform group-hover:scale-105",
                    empire.primaryColor,
                    activeEmpireId === empire.id ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950" : ""
                  )}>
                    {empire.logoInitial}
                  </div>

                  {/* Pending Badge */}
                  {empire.pendingApprovals > 0 && !isExpanded && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-950 shadow-lg">
                      {empire.pendingApprovals}
                    </div>
                  )}
                </div>

                {/* Name and Progress Details (Expanded Only) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex flex-col items-start overflow-hidden"
                    >
                      <span className="font-bold text-slate-200 truncate w-full">{empire.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">
                          {empire.milestoneProgress}% Target
                        </span>
                        {empire.pendingApprovals > 0 && (
                          <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 rounded-full font-bold">
                            {empire.pendingApprovals}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
            
            {/* Tooltip (Collapsed Only) */}
            <AnimatePresence>
              {!isExpanded && hoveredId === empire.id && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 20 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-2xl whitespace-nowrap pointer-events-none z-[70]"
                >
                  {empire.name}
                  <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <button className="group relative px-3 w-full focus:outline-none mt-2">
          <div className={cn(
            "flex items-center transition-all duration-200",
            isExpanded ? "gap-4 w-full" : "justify-center w-full"
          )}>
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-bold text-slate-500 group-hover:text-slate-300"
              >
                New Empire
              </motion.span>
            )}
          </div>
        </button>
      </div>

      <div className="p-4 border-t border-slate-800 flex justify-center shrink-0">
         <div className={cn(
            "flex items-center transition-all duration-200",
            isExpanded ? "gap-3 w-full" : "justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-500/20">
              JD
            </div>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-sm font-bold truncate">John Doe</span>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Pro User</span>
              </motion.div>
            )}
         </div>
      </div>
    </div>
  );
}
