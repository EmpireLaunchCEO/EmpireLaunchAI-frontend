"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Type,
  AlignLeft,
  CheckCircle2,
  X,
  Edit3,
  Shield,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Save,
  Eye,
  Layers,
  Database,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VaultInjected } from '@/components/VaultInjected';

interface DnaColor {
  hex: string;
  role: string;
  locked?: boolean;
}

interface DnaFont {
  platform: string;
  pairing: string;
}

interface DnaScriptSegment {
  label: string;
  text: string;
}

interface DnaPacing {
  label: string;
  beats: string[];
  tempo: 'slow' | 'medium' | 'fast';
}

interface StyleDNA {
  id: string;
  title: string;
  niche: string;
  intelligence: string;
  colors: DnaColor[];
  fonts: DnaFont[];
  script: DnaScriptSegment[];
  pacing: DnaPacing;
  compositionUrl?: string;
  confidence: number;
}

interface DnaApprovalGateProps {
  dna: StyleDNA;
  onApprove: (dna: StyleDNA) => void;
  onReject: () => void;
  onRefine?: (feedback: string) => void;
  onBack?: () => void;
}

const defaultDNA: StyleDNA = {
  id: 'dna_' + Date.now(),
  title: 'Vintage Botanical Journal Cover',
  niche: 'Digital Zen Journals',
  intelligence: 'High-velocity "Hook-Value-CTA" structure optimized for TikTok/Reels. Using fast-cut transitions and high-contrast overlays.',
  colors: [
    { hex: '#2D4F1E', role: 'Primary', locked: true },
    { hex: '#E4D5B7', role: 'Background', locked: false },
    { hex: '#8B4513', role: 'Accent', locked: false },
    { hex: '#F5F5DC', role: 'Highlight', locked: false },
    { hex: '#FBBF24', role: 'CTA Button', locked: false },
  ],
  fonts: [
    { platform: 'Kittl', pairing: 'Montserrat + Playfair Display' },
    { platform: 'CapCut', pairing: 'Modern Bold + Classic Italic' },
    { platform: 'Canva', pairing: 'Lora + Poppins' },
    { platform: 'System', pairing: 'Serif + Sans' },
  ],
  script: [
    { label: 'Hook (0:00)', text: 'Your morning routine is about to change forever.' },
    { label: 'Problem (0:03)', text: 'Most people struggle to stay organized because they use the wrong system.' },
    { label: 'Solution (0:06)', text: 'The Digital Zen Journal aligns your tasks with your energy levels.' },
    { label: 'CTA (0:09)', text: 'Link in bio to transform your mornings today.' },
    { label: 'CapCut Effects', text: 'Glitch Transition, Bounce In, Shake 2, Soft Blur' },
  ],
  pacing: {
    label: 'Fast-Cut Vertical',
    beats: ['0:00 Hook (3s)', '0:03 Problem (3s)', '0:06 Solution (4s)', '0:10 CTA (4s)'],
    tempo: 'fast'
  },
  confidence: 94
};

export function DnaApprovalGate({ 
  dna: initialDna, 
  onApprove, 
  onReject, 
  onRefine, 
  onBack 
}: DnaApprovalGateProps) {
  const [dna, setDna] = useState<StyleDNA>(initialDna || defaultDNA);
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'script' | 'pacing'>('colors');
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');

  const tabs = [
    { id: 'colors' as const, label: 'Color Palette', icon: Palette },
    { id: 'fonts' as const, label: 'Typography', icon: Type },
    { id: 'script' as const, label: 'Script Structure', icon: AlignLeft },
    { id: 'pacing' as const, label: 'Pacing & Beats', icon: Layers },
  ];

  const handleSubmitFeedback = () => {
    if (onRefine && feedback.trim()) {
      onRefine(feedback.trim());
      setFeedback('');
    }
  };

  const handleColorChange = (index: number, newHex: string) => {
    const updated = [...dna.colors];
    updated[index] = { ...updated[index], hex: newHex };
    setDna({ ...dna, colors: updated });
  };

  const tempoColors = {
    slow: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    fast: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[32px] border border-primary/10">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-primary/20">
          <Palette className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-foreground leading-tight uppercase italic">Style DNA Approval.</h3>
          <p className="text-sm text-muted-foreground font-medium italic">
            "I've extracted the creative DNA for <span className="text-primary font-bold">{dna.niche || 'your brand'}</span>. Review and validate before vault finalization."
          </p>
        </div>
        <div className="flex items-center gap-2">
          <VaultInjected size="md" />
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">{dna.confidence}% Confidence</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-theme-surface p-1 rounded-[20px] border-2 border-theme">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-[16px] font-black text-[9px] uppercase tracking-wider transition-all",
              activeTab === tab.id
                ? "bg-theme-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-primary" : "")} />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.id.charAt(0).toUpperCase() + tab.id.slice(1, 3)}</span>
          </button>
        ))}
      </div>

      {/* AI Intelligence Reasoning */}
      <div className="p-5 bg-slate-900 rounded-[28px] border border-slate-800 text-white space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Strategic Reasoning</span>
        </div>
        <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
          "{dna.intelligence}"
        </p>
      </div>

      {/* Active Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Colors */}
          {activeTab === 'colors' && (
            <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-foreground uppercase tracking-wider text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" /> Color Palette
                </h4>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  {isEditing ? 'Done' : 'Edit'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {dna.colors.map((color, i) => (
                  <div key={i} className="space-y-3 group">
                    <div 
                      className={cn(
                        "w-full aspect-square rounded-[24px] border-2 relative overflow-hidden transition-all group-hover:scale-105",
                        isEditing ? "ring-2 ring-primary/50" : ""
                      )}
                      style={{ backgroundColor: color.hex, borderColor: color.hex }}
                    >
                      {color.locked && (
                        <div className="absolute top-2 right-2 bg-slate-900/60 backdrop-blur-sm rounded-full p-1">
                          <Shield className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      {isEditing && !color.locked && (
                        <input
                          type="text"
                          value={color.hex}
                          onChange={(e) => handleColorChange(i, e.target.value)}
                          className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-sm rounded-lg px-2 py-1 text-[9px] font-black uppercase text-white text-center"
                        />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-foreground">{color.role}</p>
                      <p className="text-[8px] font-bold text-muted-foreground">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isEditing && (
                <p className="text-[9px] text-muted-foreground font-medium italic">
                  Click a swatch hex code to edit. Locked colors ({dna.colors.filter(c => c.locked).length}) are AI-recommended brand anchors.
                </p>
              )}
            </div>
          )}

          {/* Fonts */}
          {activeTab === 'fonts' && (
            <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6">
              <h4 className="font-black text-foreground uppercase tracking-wider text-sm flex items-center gap-2">
                <Type className="w-4 h-4 text-primary" /> Typography Pairings
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dna.fonts.map((font, i) => (
                  <div key={i} className="p-6 bg-theme-background rounded-[32px] border border-theme hover:border-primary/30 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">{font.platform}</span>
                      <div className="w-8 h-8 rounded-xl bg-theme-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-base font-black text-foreground italic">{font.pairing}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Script */}
          {activeTab === 'script' && (
            <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6">
              <h4 className="font-black text-foreground uppercase tracking-wider text-sm flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-primary" /> Script Structure
              </h4>

              <div className="space-y-3">
                {dna.script.map((segment, i) => (
                  <div key={i} className="p-5 bg-theme-background rounded-[24px] border border-theme hover:border-primary/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[8px] font-black text-primary">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary">{segment.label}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{segment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pacing */}
          {activeTab === 'pacing' && (
            <div className="bg-theme-surface border-2 border-theme rounded-[40px] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-foreground uppercase tracking-wider text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Pacing & Beats
                </h4>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                  tempoColors[dna.pacing.tempo]
                )}>
                  {dna.pacing.tempo.toUpperCase()} TEMPO
                </span>
              </div>

              <p className="text-sm font-bold text-foreground">{dna.pacing.label}</p>

              <div className="space-y-3">
                {dna.pacing.beats.map((beat, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-theme-background rounded-2xl border border-theme">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-[9px] font-black",
                      dna.pacing.tempo === 'fast' ? "bg-emerald-500/10 text-emerald-500" :
                      dna.pacing.tempo === 'medium' ? "bg-amber-500/10 text-amber-500" :
                      "bg-blue-500/10 text-blue-500"
                    )}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{beat}</p>
                    </div>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      dna.pacing.tempo === 'fast' ? "bg-emerald-500" :
                      dna.pacing.tempo === 'medium' ? "bg-amber-500" :
                      "bg-blue-500"
                    )} />
                  </div>
                ))}
              </div>

              {dna.pacing.tempo === 'fast' && (
                <div className="p-4 bg-emerald-500/5 rounded-[24px] border border-emerald-500/10">
                  <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Fast pacing optimized for TikTok/Reels. High retention expected with sub-15 second duration.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Refinement Input */}
      {onRefine && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-theme-background rounded-2xl border border-theme">
            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Type refinement instructions (e.g. 'Make colors warmer', 'Slow down pacing')..."
              className="flex-1 bg-transparent text-sm font-medium outline-none text-foreground placeholder:text-muted-foreground"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitFeedback()}
            />
            <button
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim()}
              className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
              Refine
            </button>
          </div>
          <p className="text-[8px] font-medium text-muted-foreground px-2">
            Tell the AI what to adjust. It will regenerate the Style DNA while preserving your approved elements.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onReject}
          className="flex-1 py-5 border-2 border-theme rounded-3xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-red-50/10 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center gap-2 group"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Reject &amp; Rethink
        </button>
        <button
          onClick={() => onApprove(dna)}
          className="flex-[2] py-5 bg-primary text-slate-950 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
        >
          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Finalize DNA to Vault
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}