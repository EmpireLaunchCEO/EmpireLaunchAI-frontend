"use client";

import React, { useState } from 'react';
import { 
  Video, 
  Edit3, 
  UserSquare2, 
  Palette, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Smartphone,
  Instagram,
  Youtube,
  ShoppingBag,
  Store,
  Mail,
  Globe,
  Zap,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';

const platformIcons: Record<string, any> = {
  TikTok: Smartphone,
  Instagram: Instagram,
  YouTube: Youtube,
  Etsy: ShoppingBag,
  Shopify: Store,
  Gmail: Mail,
  'Empire Email': Mail,
  GoDaddy: Globe,
  'Systeme.io': Zap
};

export function NeuralDispatchCenter() {
  const { connectedPlatforms } = useEmpire();
  const [activeQueue, setActiveQueue] = useState<string | null>(null);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const [view, setView] = useState<'grid' | 'review'>('grid');
  const [draftNumber, setDraftNumber] = useState(1);
  const [feedback, setFeedback] = useState('');

  const categories = [
    { id: 'videos', label: 'Pending Videos', icon: Video, count: 5 },
    { id: 'edits', label: 'Pending Edits', icon: Edit3, count: 3 },
    { id: 'faceless', label: 'Pending Faceless', icon: UserSquare2, count: 2 },
    { id: 'designs', label: 'Pending Designs', icon: Palette, count: 4 },
  ];

  const handleAppToggle = (platform: string) => {
    if (!isApproved) return;
    setSelectedApps(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const handleApprove = () => {
    setIsApproved(true);
    setView('grid');
  };

  const handleSyncFeedback = () => {
    setDraftNumber(prev => prev + 1);
    setFeedback('');
  };

  if (view === 'review') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-950 border-2 border-theme rounded-[40px] overflow-hidden shadow-2xl min-h-[600px] flex flex-col"
      >
        {/* REVIEW HEADER */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('grid')} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
            </button>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Reviewing: {activeQueue?.toUpperCase()}</h3>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Draft #{draftNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Rendering Optimized
          </div>
        </div>

        {/* LARGE PLAYER AREA */}
        <div className="flex-1 bg-black/40 flex items-center justify-center relative group p-8">
           <div className="aspect-video w-full max-w-4xl bg-slate-900 rounded-[32px] border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden">
              <Video className="w-12 h-12 text-white/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                 <p className="text-white font-black uppercase tracking-widest text-xs">Creation Preview</p>
                 <p className="text-white/40 text-[10px] uppercase font-bold">Neural Engine v4.2</p>
              </div>
           </div>
        </div>

        {/* NEURAL EDIT BOX */}
        <div className="p-8 bg-slate-900/50 border-t border-white/5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Feedback (One line changes)</label>
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g. 'Change the last sentence to mention free shipping'..."
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
              />
              <button 
                disabled={!feedback.trim()}
                onClick={handleSyncFeedback}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
              >
                Re-Sync AI
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleApprove}
              className="flex-1 py-5 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Approve Draft #{draftNumber}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-theme-surface/40 backdrop-blur-xl border-2 border-theme rounded-[40px] overflow-hidden shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        
        {/* LEFT SIDE: CREATION QUEUES */}
        <div className="p-6 md:p-10 space-y-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Creation Queues</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveQueue(cat.id);
                  setView('review');
                  setIsApproved(false);
                }}
                className={cn(
                  "w-full rounded-[24px] p-5 flex items-center gap-4 transition-all border-2 relative group overflow-hidden",
                  activeQueue === cat.id
                    ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
                    : "bg-slate-900/50 border-white/5 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                  activeQueue === cat.id ? "bg-primary text-slate-950" : "bg-white/5 text-slate-400 group-hover:text-white"
                )}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white leading-tight">{cat.label}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">{cat.count} Items</p>
                </div>
                <ChevronRight className="w-4 h-4 ml-auto text-slate-600 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: DISPATCH HUB (APPS) */}
        <div className="p-6 md:p-10 space-y-8 bg-black/20">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-primary" />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Dispatch Targets</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {connectedPlatforms.length > 0 ? (
              connectedPlatforms.map((platform) => {
                const isSelected = selectedApps.includes(platform);
                return (
                  <button
                    key={platform}
                    disabled={!isApproved}
                    onClick={() => handleAppToggle(platform)}
                    className={cn(
                      "p-4 rounded-[20px] border-2 flex flex-col items-center justify-center gap-3 transition-all group relative overflow-hidden text-center aspect-square",
                      !isApproved && "opacity-40 cursor-not-allowed grayscale",
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                        : "bg-slate-900/40 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black relative overflow-hidden shrink-0 transition-all",
                      isSelected ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-white/5 text-white/40"
                    )}>
                      {platformIcons[platform] ? React.createElement(platformIcons[platform], { className: "w-5 h-5" }) : platform.charAt(0).toUpperCase()}
                      <AnimatePresence>
                        {isSelected && (
                           <motion.div
                             initial={{ scale: 0, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             exit={{ scale: 0, opacity: 0 }}
                             className="absolute inset-0 bg-emerald-500 flex items-center justify-center"
                           >
                              <CheckCircle2 className="w-5 h-5 text-slate-950" />
                           </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      isSelected ? "text-emerald-400" : "text-slate-400 group-hover:text-white"
                    )}>
                      {platform}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full py-10 text-center bg-white/5 rounded-[32px] border-2 border-dashed border-white/10">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  Link Center Required<br/>
                  <span className="text-slate-600 italic">Connect platforms to enable dispatch.</span>
                </p>
              </div>
            )}
          </div>

          <button 
            className={cn(
              "w-full py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 relative overflow-hidden",
              selectedApps.length > 0
               ? "bg-primary text-slate-950 shadow-xl"
               : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5 opacity-50"
            )}
            disabled={selectedApps.length === 0}
            onClick={() => {
              setActiveQueue(null);
              setIsApproved(false);
              setSelectedApps([]);
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Execute Dispatch
          </button>
        </div>

      </div>
    </div>
  );
}
