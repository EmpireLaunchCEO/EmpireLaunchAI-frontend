"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  Activity,
  Zap,
  TrendingUp,
  Target,
  Globe,
  Shield,
  Sparkles,
  Bot,
  Eye,
  ChevronRight,
  BarChart3,
  RefreshCw,
  Signal,
  Cpu,
  Database,
  ArrowUpRight,
  Clock,
  Layers,
  Network,
  MessageSquare,
  Minus,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Mock AI Intelligence Data ────────────────────────────────────────────

const aiThoughtStream = [
  { id: 1, type: 'scan', message: 'Scanning Etsy best-sellers in "Digital Planners"...', time: 'Now', icon: Activity },
  { id: 2, type: 'analyze', message: 'Pattern detected: "Sage Green" + "Minimalist" (+24% WoW)', time: '1m ago', icon: TrendingUp },
  { id: 3, type: 'reason', message: 'Correlating TikTok trending sounds with Etsy listing velocity...', time: '3m ago', icon: BrainCircuit },
  { id: 4, type: 'insight', message: 'Identified 3 high-conversion hooks for morning routine content', time: '5m ago', icon: Sparkles },
  { id: 5, type: 'action', message: 'Generated 2 draft listings for "Zen Morning Planner"', time: '8m ago', icon: Zap },
  { id: 6, type: 'vault', message: 'Harvested "Boho Luxe" color palette from Pinterest trend', time: '12m ago', icon: Database },
  { id: 7, type: 'monitor', message: 'Instagram engagement for @your_brand up 18% this hour', time: '15m ago', icon: Signal },
  { id: 8, type: 'strategy', message: 'Calculating optimal posting time: 6:15 PM EST (+34% reach)', time: '20m ago', icon: Target },
];

const marketSignals = [
  { id: 1, signal: 'Rising', metric: 'Sage Green searches', source: 'Etsy', change: '+24%', direction: 'up' as const },
  { id: 2, signal: 'Spiking', metric: '"ADHD Planner" demand', source: 'TikTok', change: '+41%', direction: 'up' as const },
  { id: 3, signal: 'Declining', metric: 'Neon color palettes', source: 'Pinterest', change: '-12%', direction: 'down' as const },
  { id: 4, signal: 'Emerging', metric: 'AI-assisted journaling', source: 'Google Trends', change: '+67%', direction: 'up' as const },
];

const intelligenceMetrics = [
  { label: 'Processing Speed', value: '98%', detail: '12 threads active', icon: Cpu },
  { label: 'Prediction Accuracy', value: '94%', detail: 'Last 24h: 142/151 correct', icon: Target },
  { label: 'Data Sources', value: '18', detail: 'Platforms monitored', icon: Network },
  { label: 'Market Coverage', value: '92%', detail: 'Digital goods niche', icon: Globe },
];

// ─── Intelligence Activity Item ────────────────────────────────────────────

function ThoughtItem({ item, index }: { item: typeof aiThoughtStream[0]; index: number }) {
  const typeColors: Record<string, string> = {
    scan: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    analyze: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    reason: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    insight: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    action: 'bg-primary/10 text-primary border-primary/20',
    vault: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    monitor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    strategy: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-start gap-4 p-4 bg-theme-surface/50 rounded-2xl border border-theme/50 hover:border-primary/20 transition-all group"
    >
      <div className={cn("p-2 rounded-xl border shrink-0", typeColors[item.type] || 'bg-slate-500/10')}>
        <item.icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">{item.message}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{item.type}</span>
          <span className="text-[9px] text-muted-foreground">·</span>
          <Clock className="w-2.5 h-2.5 text-muted-foreground" />
          <span className="text-[9px] text-muted-foreground">{item.time}</span>
        </div>
      </div>
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </motion.div>
  );
}

// ─── Market Signal Card ────────────────────────────────────────────────────

function SignalCard({ signal }: { signal: typeof marketSignals[0] }) {
  return (
    <div className="p-4 bg-theme-surface border border-theme rounded-2xl space-y-2 hover:border-primary/30 transition-all">
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
          signal.direction === 'up' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
        )}>
          {signal.signal}
        </span>
        <span className="text-[9px] font-black text-muted-foreground">{signal.source}</span>
      </div>
      <p className="text-sm font-bold text-foreground">{signal.metric}</p>
      <div className="flex items-center gap-1">
        {signal.direction === 'up' ? (
          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
        ) : (
          <ArrowUpRight className="w-3 h-3 text-red-400 rotate-180" />
        )}
        <span className={cn(
          "text-[9px] font-black",
          signal.direction === 'up' ? "text-emerald-400" : "text-red-400"
        )}>
          {signal.change}
        </span>
      </div>
    </div>
  );
}

// ─── Main Intelligence Center Component ────────────────────────────────────
import { useEmpire } from '@/lib/EmpireContext';

export function IntelligenceCenter() {
  const { activeEmpire, isAdmin, isLinkingComplete } = useEmpire();
  const displayNiche = (isAdmin && (!activeEmpire?.niche || activeEmpire?.niche === 'Niche Pending')) ? "AI Business Automation" : (activeEmpire?.niche || 'business');

  const [thoughts, setThoughts] = useState(aiThoughtStream);
  const [isThinking, setIsThinking] = useState(false);
  const [activePanel, setActivePanel] = useState<'stream' | 'signals' | 'metrics'>('stream');
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-intelligence-center');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-intelligence-center', String(newState));
  };

  // Simulate AI thinking pulse
  useEffect(() => {
    if (!isLinkingComplete) {
      setIsThinking(false);
      return;
    }
    const timer = setInterval(() => {
      setIsThinking(prev => !prev);
    }, 3000);
    return () => clearInterval(timer);
  }, [isLinkingComplete]);

  // Simulate new thought arriving
  useEffect(() => {
    if (!isLinkingComplete) return;
    
    const timer = setInterval(() => {
      const newThought = {
        id: Date.now(),
        type: ['scan', 'analyze', 'reason', 'insight', 'action', 'vault', 'monitor', 'strategy'][Math.floor(Math.random() * 8)] as any,
        message: [
          `Cross-referencing Etsy reviews for "${displayNiche}" sentiment...`,
          `Analyzing TikTok comment velocity for "${displayNiche}" products...`,
          `Detected shift in Pinterest color trends toward "${displayNiche}" aesthetics...`,
          `Optimizing Etsy listing tags for "${displayNiche}" search volume...`,
          'Synthesizing new design variants from vault DNA strands...',
        ][Math.floor(Math.random() * 5)],
        time: 'Just now',
        icon: BrainCircuit,
      };
      setThoughts(prev => [newThought, ...prev.slice(0, 20)]);
    }, 12000);
    return () => clearInterval(timer);
  }, [displayNiche, isLinkingComplete]);

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-3xl p-6 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[80px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">AI Intelligence Center</h2>
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

  const panels = [
    { id: 'stream' as const, label: 'Thought Stream', icon: MessageSquare },
    { id: 'signals' as const, label: 'Market Signals', icon: TrendingUp },
    { id: 'metrics' as const, label: 'AI Metrics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="absolute top-0 right-0 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            {isThinking && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
              />
            )}
          </div>
          <div>
            <h3 className="font-black text-foreground text-lg uppercase tracking-tight">AI Intelligence Center</h3>
            <p className="text-xs text-muted-foreground font-medium">Real-time reasoning, market signals, and performance metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
            isThinking ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", isThinking ? "bg-emerald-400 animate-pulse" : "bg-slate-400")} />
            {isThinking ? 'Processing' : 'Idle'}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-theme-background p-1 rounded-[20px] border-2 border-theme">
        {panels.map(panel => (
          <button
            key={panel.id}
            onClick={() => setActivePanel(panel.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-[16px] font-black text-[10px] uppercase tracking-wider transition-all",
              activePanel === panel.id
                ? "bg-theme-surface text-foreground shadow-sm border border-theme"
                : "text-slate-400 hover:text-foreground hover:bg-theme-surface/50"
            )}
          >
            <panel.icon className={cn("w-3.5 h-3.5", activePanel === panel.id ? "text-primary" : "")} />
            {panel.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <AnimatePresence mode="wait">
        {activePanel === 'stream' && (
          <motion.div
            key="stream"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* AI Status Banner */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 rounded-[28px] border border-primary/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white italic leading-relaxed">
                  "I'm continuously monitoring your linked platforms. Every thought below represents a real analysis for your {displayNiche} — synthesizing market data, identifying trends, and preparing assets. You're seeing the raw intelligence layer."
                </p>
              </div>
            </div>

            {/* Thought Stream */}
            <div className="space-y-2">
              {!isLinkingComplete ? (
                <div className="p-8 bg-theme-surface/50 rounded-[32px] border-2 border-dashed border-theme flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                    <Signal className="w-8 h-8 text-slate-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-foreground uppercase tracking-tight italic">Waiting for Neural Link</h4>
                    <p className="text-xs text-muted-foreground font-medium max-w-[240px] mx-auto mt-1">
                      Link your platforms (Etsy, TikTok, etc.) to activate real-time intelligence and market scanning.
                    </p>
                  </div>
                </div>
              ) : (
                thoughts.map((thought, i) => (
                  <ThoughtItem key={thought.id} item={thought} index={i} />
                ))
              )}
            </div>
          </motion.div>
        )}

        {activePanel === 'signals' && (
          <motion.div
            key="signals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="p-5 bg-theme-surface border-2 border-theme rounded-[32px] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <h4 className="font-black text-foreground text-sm uppercase tracking-wider">Live Market Signals</h4>
                </div>
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground animate-spin-slow" />
              </div>
              
              {!isLinkingComplete ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium max-w-[200px]">
                    Market signals are locked until your first platform link is verified.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {marketSignals.map(signal => (
                      <SignalCard key={signal.id} signal={signal} />
                    ))}
                  </div>
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-300 font-medium italic">
                      "Based on these signals, I recommend pivoting your Etsy thumbnails to 'Sage Green' aesthetics and creating an 'ADHD Planner' listing variant."
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {activePanel === 'metrics' && (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-4"
          >
            {intelligenceMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-theme-surface border-2 border-theme rounded-[24px] space-y-3 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <metric.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                    {isLinkingComplete ? metric.value : '0%'}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-black text-foreground uppercase tracking-tight">{metric.label}</p>
                  <p className="text-[9px] font-medium text-muted-foreground mt-0.5">
                    {isLinkingComplete ? metric.detail : 'Awaiting data link'}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}