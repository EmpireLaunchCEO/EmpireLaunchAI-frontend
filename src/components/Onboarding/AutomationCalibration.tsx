"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Stars,
  MousePointer2,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutomationCalibrationProps {
  mode: 'co-pilot' | 'empire';
  onModeChange: (mode: 'co-pilot' | 'empire') => void;
}

export function AutomationCalibration({ mode, onModeChange }: AutomationCalibrationProps) {
  return (
    <div className="space-y-8 md:space-y-12 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight uppercase italic">Automation Calibration.</h2>
        <p className="text-muted-foreground text-base md:text-lg font-medium italic">"Define how much control you want to hand over to the AI."</p>
      </div>

      <div className="flex p-2 md:p-3 bg-slate-900 rounded-[32px] md:rounded-[40px] relative h-24 md:h-28 items-center max-w-md mx-auto border-4 border-slate-800 shadow-inner">
        <motion.div
          className="absolute inset-1.5 md:inset-2 bg-slate-800 rounded-[24px] md:rounded-[32px] shadow-2xl z-10 border border-primary/20"
          initial={false}
          animate={{ x: mode === 'co-pilot' ? 0 : '100%' }}
          style={{ width: 'calc(50% - 6px)' }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />

        <button
          onClick={() => onModeChange('co-pilot')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 relative z-20 transition-colors duration-500 py-3 md:py-4",
            mode === 'co-pilot' ? "text-white" : "text-slate-400 hover:text-slate-300"
          )}
        >
          <MousePointer2 className={cn("w-5 h-5 md:w-6 h-6", mode === 'co-pilot' ? "text-primary" : "text-inherit")} />
          <span className="font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">Co-Pilot</span>
          <span className={cn("text-[8px] font-bold", mode === 'co-pilot' ? "text-primary/80" : "opacity-60")}>Manual Approval</span>
        </button>

        <button
          id="automation-empire-mode"
          onClick={() => onModeChange('empire')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 relative z-20 transition-colors duration-500 py-3 md:py-4",
            mode === 'empire' ? "text-white" : "text-slate-400 hover:text-slate-300"
          )}
        >
          <div className={cn("absolute -top-3 px-2 py-0.5 text-[7px] font-black uppercase tracking-widest rounded-full shadow-lg animate-bounce", mode === 'empire' ? "bg-primary text-slate-950" : "bg-slate-800 text-slate-400")}>
            Recommended
          </div>
          <Bot className={cn("w-5 h-5 md:w-6 h-6", mode === 'empire' ? "text-primary" : "text-inherit")} />
          <span className="font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">Auto-Pilot</span>
          <span className={cn("text-[8px] font-bold", mode === 'empire' ? "text-primary/80" : "opacity-60")}>Full Autonomy</span>
        </button>
      </div>

      {mode === 'empire' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/10 p-4 rounded-2xl max-w-md mx-auto text-center"
        >
          <p className="text-primary text-[10px] font-black uppercase tracking-tight leading-tight italic">
            "Select Empire Mode to start. THIS allows me to instantly scan and link the accounts on your phone (Gmail, Etsy, TikTok) to retrieve your API keys and secure tokens automatically."
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
        <div className={cn(
          "p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-2 transition-all",
          mode === 'co-pilot' ? "border-primary bg-primary/5 shadow-2xl shadow-amber-900/10" : "border-slate-800 bg-slate-900 opacity-40"
        )}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-950 shadow-sm flex items-center justify-center mb-4 md:mb-6 text-primary border border-primary/20">
            <User className="w-5 h-5 md:w-6 h-6" />
          </div>
          <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight mb-2">High Control</h3>
          <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
            I'll draft everything—posts, descriptions, price adjustments—but nothing goes live until you click 'Approve'.
          </p>
          <ul className="mt-4 md:mt-6 space-y-3">
            {['Manual Publishing', 'Manual Price Sync', 'Human Customer Service'].map(f => (
              <li key={f} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className={cn(
          "p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-2 transition-all",
          mode === 'empire' ? "border-primary bg-primary/5 shadow-2xl shadow-amber-900/10" : "border-slate-800 bg-slate-900 opacity-40"
        )}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-950 shadow-sm flex items-center justify-center mb-4 md:mb-6 text-primary border border-primary/20">
            <Zap className="w-5 h-5 md:w-6 h-6 fill-current" />
          </div>
          <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight mb-2">High Autonomy</h3>
          <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
            I'll autonomously manage daily operations. You only intervene for major financial decisions or brand pivots.
          </p>
          <ul className="mt-4 md:mt-6 space-y-3">
            {['Auto-Posting', 'Dynamic Pricing', 'AI Support Desk'].map(f => (
              <li key={f} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 rounded-[32px] bg-slate-900 border border-slate-800 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-primary mt-1 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-sm font-black text-white uppercase tracking-widest">Safety First Security</h4>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-relaxed">
            Regardless of the mode, the AI will NEVER spend money or initiate subscriptions without your explicit one-time approval.
          </p>
        </div>
      </div>
    </div>
  );
}
