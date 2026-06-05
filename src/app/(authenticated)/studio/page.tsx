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
  const [activeTab, setActiveTab] = useState<'gallery' | 'activity'>('gallery');
  const [harvestActivity, setHarvestActivity] = useState(vaultActivity);

  const handleRefresh = async () => {
    await new Promise(r => setTimeout(r, 1000));
  };

  const handleSuggestion = (suggestion: string) => {
    console.log('Studio suggestion:', suggestion);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="p-4 md:p-8 pb-40 max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
              <Video className="w-3 h-3" />
              Empire Studio
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic">
              Universal Synthesis.
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium italic">
              1,000,000+ DNA Codes Synced. The Studio can now create anything — from digital planners to physical products, rugs, and custom mugs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">1.2M DNA STRANDS</span>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 dark:bg-theme-surface p-1 rounded-[20px] w-full max-w-full overflow-hidden border-2 border-theme">
          {[
            { id: 'gallery', label: 'Universal Studio', icon: Palette },
            { id: 'activity', label: 'DNA Harvest Feed', icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-[16px] font-black text-[10px] uppercase tracking-wider transition-all",
                activeTab === tab.id
                  ? "bg-theme-surface text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-primary" : "")} />
              {tab.label}
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
              <div className="flex items-start gap-4 p-5 bg-theme-surface border-2 border-primary/20 rounded-[28px]">
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
                </div>
              </div>

              {/* Suggestion Bubbles */}
              <SuggestionBubbles onSelect={handleSuggestion} />

              {/* Inspiration Gallery */}
              <InspirationGallery />
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
              <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6">
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
                    <div key={item.id} className="p-5 bg-theme-background rounded-[24px] border border-theme hover:border-primary/30 transition-all group">
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
                <div className="p-5 bg-slate-900 rounded-[28px] text-white space-y-3">
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