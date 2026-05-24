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
    <div className="space-y-8 md:space-y-12 max-w-3xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Automation Calibration.</h2>
        <p className="text-slate-500 text-base md:text-lg">Define how much control you want to hand over to the AI.</p>
      </div>

      <div className="flex p-2 md:p-3 bg-slate-100 rounded-[32px] md:rounded-[40px] relative h-24 md:h-28 items-center max-w-2xl mx-auto border-4 border-slate-50 shadow-inner">
        <motion.div
          className="absolute inset-1.5 md:inset-2 bg-white rounded-[24px] md:rounded-[32px] shadow-2xl z-10 border border-slate-100"
          initial={false}
          animate={{ x: mode === 'co-pilot' ? 0 : '100%' }}
          style={{ width: 'calc(50% - 6px)' }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
        
        <button
          onClick={() => onModeChange('co-pilot')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 relative z-20 transition-colors duration-500 py-3 md:py-4",
            mode === 'co-pilot' ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <MousePointer2 className="w-5 h-5 md:w-6 h-6" />
          <span className="font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">Co-Pilot</span>
          <span className="text-[8px] font-bold opacity-60">Manual Approval</span>
        </button>
        
        <button
          id="automation-empire-mode"
          onClick={() => onModeChange('empire')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 relative z-20 transition-colors duration-500 py-3 md:py-4",
            mode === 'empire' ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <Bot className="w-5 h-5 md:w-6 h-6" />
          <span className="font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">Empire Mode</span>
          <span className="text-[8px] font-bold opacity-60">Full Autonomy</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
        <div className={cn(
          "p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-2 transition-all",
          mode === 'co-pilot' ? "border-blue-600 bg-blue-50/30" : "border-slate-100 bg-white opacity-40"
        )}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 md:mb-6 text-blue-600">
            <User className="w-5 h-5 md:w-6 h-6" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">High Control</h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            I'll draft everything—posts, descriptions, price adjustments—but nothing goes live until you click 'Approve'.
          </p>
          <ul className="mt-4 md:mt-6 space-y-3">
            {['Manual Publishing', 'Manual Price Sync', 'Human Customer Service'].map(f => (
              <li key={f} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className={cn(
          "p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-2 transition-all",
          mode === 'empire' ? "border-blue-600 bg-blue-50/30" : "border-slate-100 bg-white opacity-40"
        )}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 md:mb-6 text-blue-600">
            <Zap className="w-5 h-5 md:w-6 h-6 fill-current" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">High Autonomy</h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            I'll autonomously manage daily operations. You only intervene for major financial decisions or brand pivots.
          </p>
          <ul className="mt-4 md:mt-6 space-y-3">
            {['Auto-Posting', 'Dynamic Pricing', 'AI Support Desk'].map(f => (
              <li key={f} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 rounded-[32px] bg-amber-50 border border-amber-100 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-500 mt-1 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900">Safety First Security</h4>
          <p className="text-xs font-medium text-amber-700 leading-relaxed">
            Regardless of the mode, the AI will NEVER spend money or initiate subscriptions without your explicit one-time approval.
          </p>
        </div>
      </div>
    </div>
  );
}
