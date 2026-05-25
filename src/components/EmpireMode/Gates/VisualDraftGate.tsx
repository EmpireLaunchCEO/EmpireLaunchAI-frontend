"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ChevronRight, 
  Scissors,
  Star,
  Download,
  AlertTriangle,
  Play,
  FileText,
  X,
  ChevronLeft,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisualDraftGateProps {
  payload: {
    title: string;
    platform: string;
    assets: Array<{ type: string; url: string; previewUrl: string }>;
    caption: string;
    isProTemplate: boolean;
    proCost?: number;
  };
  onApprove: () => void;
  onReject: () => void;
  onManualAssist?: () => void;
}

export function VisualDraftGate({ payload, onApprove, onReject, onManualAssist }: VisualDraftGateProps) {
  const [activeIndex, setIndex] = useState(0);
  const [rating, setRating] = useState(0);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-blue-600/5 p-6 rounded-[32px] border border-blue-600/10">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Scissors className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 leading-tight">Visual Draft Review.</h3>
          <p className="text-sm text-slate-500 font-medium italic">"I've generated the first set of assets for {payload?.platform ?? 'your chosen platform'}. Do these meet your brand standards?"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Preview Area */}
        <div className="lg:col-span-2 space-y-6">
           <div className="relative aspect-video bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl group">
              <img 
                src={(payload?.assets ?? [])[activeIndex]?.previewUrl ?? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'} 
                className="w-full h-full object-cover opacity-80"
                alt="Draft Preview"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-white text-white ml-1" />
                 </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                 <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{payload?.platform ?? 'Platform'} Post</p>
                    <h4 className="text-white font-bold">{payload?.title ?? 'Untitled Concept'}</h4>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-white hover:bg-white/20 transition-colors">
                       <Download className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           </div>

           <div className="flex justify-center gap-2">
              {(payload?.assets ?? []).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    activeIndex === i ? "bg-blue-600 w-8" : "bg-slate-200"
                  )}
                />
              ))}
           </div>
        </div>

        {/* Feedback & Actions */}
        <div className="space-y-8">
           <div className="bg-white border-2 border-slate-50 rounded-[40px] p-8 space-y-8 shadow-sm">
              <div className="space-y-4">
                 <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">AI Marketing Hook</h4>
                 <p className="text-sm text-slate-500 font-mono bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                   "{payload?.caption ?? 'Drafting the perfect hook for you...'}"
                 </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                 <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Quality Rating</h4>
                 <div className="flex gap-2">
                    {[1,2,3,4,5].map((s) => (
                      <button 
                        key={s}
                        onClick={() => setRating(s)}
                        className={cn(
                          "p-2 rounded-xl transition-all",
                          rating >= s ? "text-amber-500 bg-amber-50" : "text-slate-200 bg-slate-50 hover:text-slate-300"
                        )}
                      >
                        <Star className={cn("w-6 h-6", rating >= s && "fill-current")} />
                      </button>
                    ))}
                 </div>
              </div>

              {payload.isProTemplate && (
                 <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-600">
                       <AlertTriangle className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Cost Alert</span>
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed font-medium">
                       This design uses a **Pro Template** ({payload.proCost ? `$${payload.proCost}` : 'Subscription Required'}). Use credits to proceed?
                    </p>
                 </div>
              )}
           </div>

           <div className="flex flex-col gap-3">
              <button 
                onClick={() => onApprove()}
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
                className="w-full py-4 border-2 border-slate-100 rounded-3xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Redo Drafting
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
