"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft,
  MousePointer2,
  CheckCircle2,
  ExternalLink,
  Bot,
  Smartphone,
  Palette,
  Scissors,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyItem {
  label: string;
  text: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

interface CopyPastePowerToolProps {
  items: CopyItem[];
  platform: string;
  onComplete: () => void;
  checklist?: ChecklistItem[];
  platformLink?: string;
}

export function CopyPastePowerTool({ items, platform, onComplete, checklist: initialChecklist, platformLink }: CopyPastePowerToolProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist || [
    { id: '1', label: 'Open template in platform', completed: false },
    { id: '2', label: 'Apply branding colors', completed: false },
    { id: '3', label: 'Paste AI-generated copy', completed: false },
    { id: '4', label: 'Export high-res asset', completed: false }
  ]);

  const handleCopy = (item: CopyItem) => {
    navigator.clipboard.writeText(item.text);
    setCopiedLabel(item.label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getDeepLink = (platform: string) => {
    if (platformLink) return platformLink;
    const p = platform.toLowerCase();
    if (p.includes('kittl')) return 'https://www.kittl.com/templates';
    if (p.includes('capcut')) return 'https://www.capcut.com/editor';
    if (p.includes('canva')) return 'https://www.canva.com';
    return '#';
  };

  const allCompleted = checklist.every(item => item.completed);

  return (
    <motion.div 
      initial={{ x: 300 }}
      animate={{ x: isExpanded ? 0 : 260 }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[400] flex items-center"
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-10 h-24 bg-slate-900 text-white rounded-l-3xl flex flex-col items-center justify-center shadow-2xl border-y border-l border-white/10 hover:bg-blue-600 transition-all group"
      >
        <div className="mb-2">
           {platform.toLowerCase().includes('kittl') ? <Palette className="w-4 h-4" /> : 
            platform.toLowerCase().includes('capcut') ? <Scissors className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
        </div>
        {isExpanded ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      <div className="w-[320px] bg-theme-surface border-l-4 border-blue-600 shadow-[-20px_0_60px_rgba(0,0,0,0.15)] h-[85vh] flex flex-col overflow-hidden">
        <div className="p-6 bg-slate-950 text-white border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
                 <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="space-y-0.5">
                 <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Manual Co-Pilot</span>
                 <p className="text-xs font-bold truncate max-w-[160px]">{platform} Helper</p>
              </div>
           </div>
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           {/* Deep Link Section */}
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Execution Link</h4>
              <a 
                href={getDeepLink(platform)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 bg-blue-50 border-2 border-blue-100 rounded-2xl flex items-center justify-between group hover:bg-blue-600 hover:border-blue-600 transition-all shadow-sm"
              >
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-theme-surface rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                       <Smartphone className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-black text-blue-900 group-hover:text-white transition-colors tracking-tight">Launch {platform}</span>
                 </div>
                 <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
              </a>
           </div>

           {/* Progress Checklist */}
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Milestones</h4>
                 <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest">
                   {checklist.filter(i => i.completed).length}/{checklist.length}
                 </span>
              </div>
              <div className="space-y-2">
                 {checklist.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => toggleCheck(item.id)}
                     className={cn(
                       "w-full p-3.5 rounded-xl border-2 text-left transition-all flex items-center gap-3 group",
                       item.completed ? "bg-theme-background border-theme" : "bg-theme-surface border-slate-50 hover:border-blue-200"
                     )}
                   >
                     <div className={cn(
                       "w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all",
                       item.completed ? "bg-blue-600 border-blue-600" : "border-theme"
                     )}>
                        {item.completed && <Check className="w-3 h-3 text-white stroke-[4px]" />}
                     </div>
                     <span className={cn(
                       "text-xs font-bold transition-all",
                       item.completed ? "text-slate-400 line-through" : "text-slate-700"
                     )}>
                       {item.label}
                     </span>
                   </button>
                 ))}
              </div>
           </div>

           {/* AI Copyable Elements */}
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Blueprint DNA</h4>
              <div className="space-y-3">
                 {items.map((item) => (
                   <button
                     key={item.label}
                     onClick={() => handleCopy(item)}
                     className={cn(
                       "w-full p-4 rounded-2xl border-2 text-left transition-all group relative overflow-hidden",
                       copiedLabel === item.label ? "border-green-500 bg-green-50" : "border-slate-50 bg-theme-background/30 hover:border-blue-600 hover:bg-theme-surface"
                     )}
                   >
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </span>
                        {copiedLabel === item.label ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                        )}
                     </div>
                     <p className="text-sm font-bold text-slate-800 line-clamp-2 pr-4 italic leading-snug">"{item.text}"</p>
                     
                     {copiedLabel === item.label && (
                       <motion.div 
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         className="absolute inset-0 bg-green-500/10 flex items-center justify-center pointer-events-none"
                       >
                          <span className="bg-green-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-md shadow-lg">Copied to clipboard</span>
                       </motion.div>
                     )}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="p-8 bg-slate-900 space-y-4 border-t border-white/5">
           <button 
             onClick={onComplete}
             disabled={!allCompleted}
             className={cn(
               "w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl",
               allCompleted 
                 ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/40" 
                 : "bg-slate-800 text-slate-500 cursor-not-allowed"
             )}
           >
             <CheckCircle2 className="w-4 h-4" />
             Validate & Upload
           </button>
           {!allCompleted && (
             <p className="text-[9px] text-slate-500 text-center font-medium italic">
                Complete the checklist to unlock validation.
             </p>
           )}
        </div>
      </div>
    </motion.div>
  );
}
