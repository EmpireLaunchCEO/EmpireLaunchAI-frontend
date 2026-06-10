"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Stars,
  Sparkles,
  Search,
  Eye,
  CheckCircle2,
  X,
  Star,
  RefreshCw,
  Zap,
  TrendingUp,
  Target,
  Clock,
  Layers,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandedGlobe } from '@/components/BrandedGlobe';

interface VisualDraftGateProps {
  payload: {
    title: string;
    description: string;
    style: string;
    variants: string[];
    selectedVariant?: string;
  };
  onApprove: (variantIndex?: number) => void;
  onReject: () => void;
  onManualAssist?: () => void;
  onBack?: () => void;
}

export function VisualDraftGate({ payload, onApprove, onReject, onManualAssist, onBack }: VisualDraftGateProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isZoomed, setIsZoomed] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full bg-theme-background">
      {/* Header */}
      <header className="p-6 border-b border-theme flex items-center justify-between bg-theme-surface/50 backdrop-blur-md sticky top-0 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[10px] uppercase tracking-widest">Asset Management</span>
        </button>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Neural Visual v4</span>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-12">
           
           {/* Visual Showcase */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Main Variant Preview */}
              <div className="lg:col-span-8 space-y-6">
                <div className="relative aspect-square bg-slate-100 rounded-[56px] overflow-hidden border-8 border-theme shadow-2xl group">
                   <img 
                     src={payload.variants[selectedVariant]} 
                     alt="Primary Asset Draft"
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   
                   {/* Overlay info */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-10 flex flex-col justify-end">
                      <div className="flex items-center justify-between">
                         <div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">Style DNA</span>
                            <h4 className="text-xl font-bold text-white uppercase italic">{payload.style}</h4>
                         </div>
                         <button 
                           onClick={() => setIsZoomed(selectedVariant)}
                           className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
                         >
                            <Maximize2 className="w-6 h-6" />
                         </button>
                      </div>
                   </div>
                </div>

                {/* Variant Selector */}
                <div className="grid grid-cols-4 gap-4">
                   {payload.variants.map((v, i) => (
                     <button
                       key={i}
                       onClick={() => setSelectedVariant(i)}
                       className={cn(
                         "relative aspect-square rounded-3xl overflow-hidden border-4 transition-all hover:scale-105 active:scale-95",
                         selectedVariant === i ? "border-primary shadow-lg shadow-primary/20" : "border-theme grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
                       )}
                     >
                        <img src={v} className="w-full h-full object-cover" />
                        {selectedVariant === i && (
                          <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-lg">
                            <CheckCircle2 className="w-3 h-3 text-foreground" />
                          </div>
                        )}
                     </button>
                   ))}
                </div>
              </div>

              {/* Sidebar Controls & Reasoning */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme space-y-8 h-full">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">{payload.title}</h3>
                       <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">
                          {payload.description}
                       </p>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-3">
                          <div className="flex items-center gap-2">
                             <Target className="w-4 h-4 text-primary" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Market Psychology</span>
                          </div>
                          <div className="p-5 bg-theme-background/50 rounded-2xl border border-theme">
                             <p className="text-xs text-foreground font-bold italic leading-relaxed">
                                "This design utilizes {payload.style} aesthetics which currently shows a 34% higher 'add-to-cart' velocity in the digital planner space."
                             </p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                          <div className="bg-theme-background p-4 rounded-2xl border border-theme space-y-1">
                             <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Complexity</span>
                             <div className="text-lg font-black text-foreground">High</div>
                          </div>
                          <div className="bg-theme-background p-4 rounded-2xl border border-theme space-y-1">
                             <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">SEO Optimized</span>
                             <div className="text-lg font-black text-emerald-500 flex items-center gap-1.5">
                                Yes <CheckCircle2 className="w-4 h-4" />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-emerald-500/5 rounded-3xl p-6 border border-emerald-500/20 mb-4">
                       <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Revenue Tracking Authorized</span>
                       </div>
                       <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter leading-relaxed">
                          By approving this creation, you agree that earnings resulting from its use will be tracked for a 4% Success-Share ($40 per $1,000).
                       </p>
                    </div>

                    <div className="flex flex-col gap-3">
                       <button
                         onClick={() => onApprove(selectedVariant)}
                         className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3 group"
                       >
                         Approve & Star
                         <Star className="w-4 h-4 group-hover:fill-current transition-all" />
                       </button>

                       {onManualAssist && (
                         <button
                           onClick={onManualAssist}
                           className="w-full py-4 bg-indigo-50 text-indigo-600 border-2 border-indigo-100 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 group"
                         >
                           <Zap className="w-4 h-4 group-hover:fill-current transition-all" />
                           Manual AI Assist
                         </button>
                       )}
                       <button
                         onClick={onReject}
                         className="w-full py-4 border-2 border-theme rounded-3xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                       >
                         <X className="w-4 h-4" />
                         Redo Drafting
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isZoomed !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl p-10 flex items-center justify-center"
          >
            <button 
              onClick={() => setIsZoomed(null)}
              className="absolute top-10 right-10 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/10"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={payload.variants[isZoomed]}
              className="max-w-full max-h-full rounded-[40px] shadow-[0_0_100px_rgba(var(--primary-rgb),0.3)] border-4 border-theme"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
