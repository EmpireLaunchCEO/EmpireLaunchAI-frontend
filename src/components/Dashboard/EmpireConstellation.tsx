"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users, Zap, DollarSign, Activity, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmpireConstellation() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-empire-constellation');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-empire-constellation', String(newState));
  };

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-3xl p-6 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[80px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Empire Constellation</h2>
        </div>
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }
  // Constellation Node Definitions
  const nodes = [
    { id: 'revenue', label: 'Revenue', x: 50, y: 15, icon: DollarSign, color: 'text-blue-500', value: '$12.4K' },
    { id: 'growth', label: 'Growth', x: 15, y: 40, icon: TrendingUp, color: 'text-emerald-500', value: '+24%' },
    { id: 'engagement', label: 'Reach', x: 85, y: 40, icon: Users, color: 'text-purple-500', value: '185K' },
    { id: 'efficiency', label: 'Efficiency', x: 50, y: 85, icon: Zap, color: 'text-amber-500', value: '92%' },
    { id: 'activity', label: 'Active Cycles', x: 50, y: 50, icon: Activity, color: 'text-slate-400', value: '3' },
  ];

  // Connections between nodes to form the constellation
  const connections = [
    ['revenue', 'growth'],
    ['revenue', 'engagement'],
    ['growth', 'activity'],
    ['engagement', 'activity'],
    ['activity', 'efficiency'],
    ['growth', 'efficiency'],
    ['engagement', 'efficiency'],
  ];

  return (
    <div className="bg-theme-surface p-8 rounded-[40px] border border-theme shadow-sm space-y-6 relative overflow-hidden">
      {/* Minimize Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">Empire Constellation</h3>
        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-widest">
          Neural Map v2.1
        </span>
      </div>

      <div className="relative w-full aspect-square max-w-[400px] mx-auto">
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          {connections.map(([from, to], i) => {
            const start = nodes.find(n => n.id === from)!;
            const end = nodes.find(n => n.id === to)!;
            return (
              <motion.line
                key={`conn-${i}`}
                x1={`${start.x}%`}
                y1={`${start.y}%`}
                x2={`${end.x}%`}
                y2={`${end.y}%`}
                stroke="#e2e8f0"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
              />
            );
          })}
        </svg>

        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: i * 0.1 }}
          >
            <div className="relative flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-2xl bg-theme-surface border-2 border-theme flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:border-white/50 group-hover:shadow-primary/20",
                node.id === 'activity' ? "w-16 h-16 bg-slate-900 border-slate-800" : ""
              )}>
                <node.icon className={cn("w-6 h-6", node.color, node.id === 'activity' ? "text-white" : "")} />
              </div>

              <div className="absolute top-full mt-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 text-white p-2 rounded-xl text-[10px] z-10 pointer-events-none">
                <span className="font-black uppercase tracking-widest">{node.label}</span>
                <span className="font-bold text-primary">{node.value}</span>
              </div>

              {node.id === 'activity' && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-primary -z-10"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-6 border-t border-theme">
        <p className="text-xs text-muted-foreground leading-relaxed italic text-center">
          "The nodes represent your Empire's vital organs. The brighter the connection, the stronger the synergy."
        </p>
      </div>
    </div>
  );
}
