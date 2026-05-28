"use client";

import React from 'react';
import { X, Check, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComparisonModeProps {
  isOpen: boolean;
  onClose: () => void;
  originalTitle: string;
  originalDescription: string;
  proposedTitle: string;
  proposedDescription: string;
  onAccept: () => void;
  onReject: () => void;
}

export function ComparisonMode({
  isOpen,
  onClose,
  originalTitle,
  originalDescription,
  proposedTitle,
  proposedDescription,
  onAccept,
  onReject
}: ComparisonModeProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-theme-surface w-full max-w-6xl h-[80vh] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-theme flex justify-between items-center bg-theme-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-2xl">
              <ArrowLeftRight className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Compare Versions</h2>
              <p className="text-theme-background0 text-sm font-medium">Review the changes made by your AI Partner</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Original */}
          <div className="flex-1 flex flex-col border-r border-theme overflow-hidden">
            <div className="px-8 py-4 bg-theme-background/50 border-b border-theme shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original Version</span>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Title</label>
                <div className="p-4 bg-theme-background rounded-2xl text-slate-400 font-semibold line-through decoration-slate-300">
                  {originalTitle}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                <div className="p-4 bg-theme-background rounded-2xl text-slate-400 text-sm leading-relaxed line-through decoration-slate-300 whitespace-pre-wrap">
                  {originalDescription}
                </div>
              </div>
            </div>
          </div>

          {/* AI Proposed */}
          <div className="flex-1 flex flex-col overflow-hidden bg-green-50/10">
            <div className="px-8 py-4 bg-green-50/30 border-b border-theme shrink-0 flex justify-between items-center">
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">AI Proposed Changes</span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Optimized</span>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div>
                <label className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-2 block">New Title</label>
                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-foreground font-bold">
                  {proposedTitle}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-2 block">New Description</label>
                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {proposedDescription}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-theme bg-theme-background/30 flex justify-end gap-4 shrink-0">
          <button 
            onClick={onReject}
            className="px-8 py-4 rounded-2xl text-sm font-bold text-slate-600 bg-theme-surface border border-theme hover:bg-theme-background transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Keep Original
          </button>
          <button 
            onClick={onAccept}
            className="px-10 py-4 rounded-2xl text-sm font-bold text-white bg-primary hover:bg-primary transition-all flex items-center gap-2 shadow-xl shadow-primary/20"
          >
            <Check className="w-4 h-4" />
            Accept AI Version
          </button>
        </div>
      </motion.div>
    </div>
  );
}
