"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Video,
  Database,
  Clock,
  Shield,
  Zap,
  Bot,
  Stars,
  ChevronRight,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InspirationGallery, SuggestionBubbles } from '@/components/Dashboard/InspirationGallery';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';

// ─── Mock Harvest Activity ────────────────────────────────────────────────

const vaultActivity = [
  { id: 1, action: 'Harvested', source: 'Etsy', niche: 'Digital Zen Planners', time: '2 min ago', confidence: 94 },
  { id: 2, action: 'Extracted', source: 'TikTok', niche: 'Morning Routine Aesthetic', time: '15 min ago', confidence: 88 },
  { id: 3, action: 'Analyzed', source: 'Pinterest', niche: 'Sage Green Office Trends', time: '1 hour ago', confidence: 92 },
  { id: 4, action: 'Vaulted', source: 'Instagram', niche: 'Boho Luxe Color Palette', time: '2 hours ago', confidence: 96 },
  { id: 5, action: 'Synthesized', source: 'AI', niche: 'Avatar: Casual Lifestyle DNA', time: '3 hours ago', confidence: 91 },
  { id: 6, action: 'Vaulted', source: 'AI', niche: 'Animal: Pet Portrait Fur DNA', time: '4 hours ago', confidence: 87 },
];

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'cinema' | 'activity'>('gallery');
  const [harvestActivity, setHarvestActivity] = useState(vaultActivity);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const startDemo = () => {
    setIsDemoMode(true);
    // Add demo items to harvest activity
    const demoItems = [
      { id: Date.now() + 1, action: 'Synthesized', source: 'DEMO', niche: 'Minimalist Tech Aesthetic', time: 'Just now', confidence: 99 },
      { id: Date.now() + 2, action: 'Vaulted', source: 'DEMO', niche: 'Holographic Gradient Pack', time: 'Just now', confidence: 98 },
    ];
    setHarvestActivity([...demoItems, ...harvestActivity]);
  };

  const handleRefresh = async () => {
    await new Promise(r => setTimeout(r, 1000));
  };

  const handleSuggestion = (suggestion: string) => {
    console.log('Studio suggestion:', suggestion);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="px-4 py-6 md:p-8 pb-40 w-full max-w-7xl mx-auto space-y-6 md:space-y-12 overflow-x-hidden relative">
        <style jsx global>{`
          @media (max-width: 768px) {
            html, body {
              width: 100% !important;
              max-width: 100% !important;
              overflow-x: hidden !important;
              position: relative !important;
            }
          }
        `}</style>
        {/* Tab Navigation */}
        <div className="flex bg-theme-background/60 p-1.5 rounded-[24px] border border-theme w-fit max-w-[calc(100%-2rem)] overflow-x-auto no-scrollbar gap-1.5 mx-auto shadow-2xl backdrop-blur-xl px-2 flex-nowrap relative z-50">
          {[
            { id: 'gallery', label: 'Universal Studio', icon: Palette },
            { id: 'cinema', label: 'Cinema Hub', icon: Video },
            { id: 'activity', label: 'DNA Feed', icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-5 py-3 rounded-[18px] font-black text-[10px] uppercase tracking-tighter transition-all flex items-center gap-2 whitespace-nowrap min-w-fit",
                activeTab === tab.id
                  ? "bg-theme-surface text-foreground shadow-lg border border-theme scale-105"
                  : "text-slate-400 hover:text-foreground hover:bg-theme-surface/40"
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-primary" : "")} />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* AI Consultant Message */}
              <div className="flex items-start gap-4 p-4 md:p-5 bg-theme-surface border-2 border-primary/20 rounded-[24px] md:rounded-[28px]">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-foreground italic leading-relaxed">
                    "I've synchronized <span className="text-primary font-bold">1,000,000+ DNA codes</span> from across the global marketplace. Whether it's custom rugs, apparel, or digital blueprints, I can now synthesize <span className="text-primary font-bold">anything</span> based on market-winning patterns. Choose a vibe and let's build your next physical or digital empire item."
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[8px] font-black uppercase tracking-widest text-cyan-400">
                    <Database className="w-2.5 h-2.5" />
                    Universal Vault Injected — Infinite Synthesis Active
                    <Shield className="w-2.5 h-2.5" />
                  </div>
                  
                  {!isDemoMode && (
                    <button 
                      onClick={startDemo}
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      View Sample Rendering Campaign
                    </button>
                  )}
                </div>
              </div>

              {/* Suggestion Bubbles - FORCED VERTICAL */}
              <div className="flex flex-col gap-2">
                <SuggestionBubbles onSelect={handleSuggestion} />
              </div>

              {/* Inspiration Gallery */}
              <InspirationGallery />
            </motion.div>
          )}

          {activeTab === 'cinema' && (
            <motion.div
              key="cinema"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Cinema Engine Intro */}
              <div className="flex flex-col md:flex-row gap-8 items-stretch">
                <div className="flex-1 p-6 md:p-8 bg-theme-surface border-2 border-primary/20 rounded-[32px] md:rounded-[40px] space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                      <Stars className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-white italic">Neural Twin.</h3>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">Perfect Lip-Sync AI Video</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    "Upload a clear photo of yourself, and I'll create your Neural Twin. I can then generate high-fidelity marketing videos with perfect lip-syncing for any script you provide. Your double, but autonomous."
                  </p>

                  <div className="space-y-4">
                    <div className="p-6 border-2 border-dashed border-theme hover:border-primary/40 rounded-3xl transition-all group cursor-pointer text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20">
                        <Palette className="w-6 h-6 text-slate-500 group-hover:text-primary" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Upload Facial DNA (Photo)</p>
                    </div>

                    <button className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all">
                      Synthesize Twin Double
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 bg-slate-900 border border-theme rounded-[32px] md:rounded-[40px] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Video className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-white uppercase italic">Twin Active.</h4>
                  <p className="text-sm text-slate-400">
                    Once your Twin is synthesized, you can generate cinematic clips for TikTok, Instagram, and YouTube instantly.
                  </p>
                </div>
              </div>

              {/* Cinema Gallery Placeholder */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-[9/16] bg-theme-surface border-2 border-theme rounded-[24px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-purple-400">Neural Ready</span>
                      </div>
                      <p className="text-[10px] font-bold text-white">Cinema Clip #{i}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                       <Zap className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Harvest Activity Feed */}
              <div className="bg-theme-surface border-2 border-theme rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                      <Database className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground tracking-tight">Recently Vaulted DNA</h3>
                      <p className="text-xs text-muted-foreground font-medium">Automatic harvest from market intelligence</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                    {harvestActivity.length} Strands
                  </span>
                </div>

                <div className="space-y-3">
                  {harvestActivity.map((item) => (
                    <div key={item.id} className="p-4 md:p-5 bg-theme-background rounded-[24px] border border-theme hover:border-primary/30 transition-all group">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-[9px] font-black",
                            item.action === 'Harvested' ? "bg-emerald-500/10 text-emerald-500" :
                            item.action === 'Extracted' ? "bg-blue-500/10 text-blue-500" :
                            item.action === 'Analyzed' ? "bg-amber-500/10 text-amber-500" :
                            item.action === 'Vaulted' ? "bg-cyan-500/10 text-cyan-400" :
                            "bg-primary/10 text-primary"
                          )}>
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">AI-Synthesized</span>
                              <span className="text-[9px] font-bold text-muted-foreground">·</span>
                              <span className="text-[9px] font-bold text-muted-foreground">{item.action} from {item.source}</span>
                            </div>
                            <p className="text-sm font-bold text-foreground mt-0.5">{item.niche}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div className="hidden sm:block">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confidence</p>
                            <p className="text-sm font-black text-primary">{item.confidence}%</p>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                            <Database className="w-2.5 h-2.5 text-cyan-400" />
                            <span className="text-[7px] font-black uppercase tracking-widest text-cyan-400">Vaulted</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Harvest Summary */}
                <div className="p-4 md:p-5 bg-slate-900 rounded-[24px] md:rounded-[28px] text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Harvest Intelligence</span>
                  </div>
                  <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
                    "I'm continuously scanning Etsy, TikTok, Pinterest, and Instagram for emerging design patterns. Each strand is extracted, analyzed, and synthesized into unique visual DNA — stored in your Vault for instant creative execution. No copies, no clones — just pure market intelligence converted into original design."
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PullToRefresh>
  );
}