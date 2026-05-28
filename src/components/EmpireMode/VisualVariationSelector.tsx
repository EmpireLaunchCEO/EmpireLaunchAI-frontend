"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stars, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Variation {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
}

interface VisualVariationSelectorProps {
  variations: Variation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}

export function VisualVariationSelector({ variations, selectedId, onSelect, onConfirm }: VisualVariationSelectorProps) {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl border border-blue-100 mb-2">
          <Bot className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Anti-Copycat Protocol</span>
        </div>
        <h2 className="text-4xl font-black text-foreground tracking-tight italic">Similar but Distinct.</h2>
        <p className="text-slate-500 font-medium text-lg italic">
          "To ensure your brand stands out, I've generated 3 stylistic 'Twists' on the current market trend. Which one fits your vision?"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {variations.map((v) => (
          <motion.button
            key={v.id}
            onClick={() => onSelect(v.id)}
            whileHover={{ y: -8 }}
            className={cn(
              "relative bg-theme-surface border-2 rounded-[40px] overflow-hidden transition-all text-left shadow-sm group",
              selectedId === v.id ? "border-blue-600 shadow-blue-100 shadow-2xl" : "border-slate-50 hover:border-theme"
            )}
          >
            <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
               <img 
                 src={v.previewUrl} 
                 className={cn(
                   "w-full h-full object-cover transition-transform duration-700",
                   selectedId === v.id ? "scale-110" : "group-hover:scale-105"
                 )}
                 alt={v.name} 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
               
               {selectedId === v.id && (
                 <div className="absolute top-6 right-6 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
               )}

               <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-black text-white mb-1 uppercase italic tracking-tight">{v.name}</h3>
                  <p className="text-white/80 text-xs font-medium line-clamp-2">{v.description}</p>
               </div>
            </div>
            
            <div className="p-6">
               <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Uniqueness Verified</span>
               </div>
               <div className={cn(
                 "w-full py-3 rounded-2xl border font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                 selectedId === v.id ? "bg-blue-600 border-blue-600 text-white" : "bg-theme-surface border-theme text-slate-400"
               )}>
                 {selectedId === v.id ? 'Selected Pattern' : 'Select Style'}
               </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center pt-6">
         <button
           disabled={!selectedId}
           onClick={onConfirm}
           className={cn(
             "px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-2xl",
             selectedId 
               ? "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200" 
               : "bg-slate-100 text-slate-300 cursor-not-allowed"
           )}
         >
           Generate Full Blueprint
           <ArrowRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}
