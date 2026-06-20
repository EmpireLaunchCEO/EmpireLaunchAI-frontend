"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronRight,
  Palette,
  Eye,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Bot,
  Layout,
  Layers,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { BrandedGlobe } from '@/components/BrandedGlobe';

// ─── Type Definitions (mirrors backend VisualSummary) ──────────────────────

export interface VisualStylePreview {
  snapshotId: string;
  primaryVibe: string;
  colorScheme: string;
  typographyMood: string;
  designPersonality: string;
  bestFor: string[];
  synthesisPrompt: string;
  previewCss: {
    backgroundGradient: string;
    fontFamily: string;
    accentColor: string;
    textColor: string;
    cardStyle: 'minimal' | 'vibrant' | 'warm' | 'dark' | 'playful';
    vibeElement: string;
  };
  category?: string;
  generatedAt: string;
}

// ─── Mock Data (using VisualProxy-style AI-synthesized data) ────────────────

const mockVibes: VisualStylePreview[] = [
  {
    snapshotId: 'vibe_1',
    primaryVibe: 'Modern Boho',
    colorScheme: 'Warm earth tones with sage green accents',
    typographyMood: 'Playful serif headlines with airy sans-serif body',
    designPersonality: 'Free-spirited yet polished — perfect for lifestyle brands',
    bestFor: ['Social media graphics', 'Product thumbnails', 'Instagram stories'],
    synthesisPrompt: 'A beautiful boho product photography scene with warm earth tones...',
    previewCss: {
      backgroundGradient: 'linear-gradient(135deg, #8B7355, #C9B99A)',
      fontFamily: 'Playfair Display',
      accentColor: '#5C7355',
      textColor: '#1a1a2e',
      cardStyle: 'warm',
      vibeElement: '<div>Modern Boho</div>'
    },
    category: 'lifestyle',
    generatedAt: new Date().toISOString()
  },
  {
    snapshotId: 'vibe_2',
    primaryVibe: 'Techno Punk',
    colorScheme: 'Electric cyan against deep violet',
    typographyMood: 'Bold monospace headlines with neon accents',
    designPersonality: 'High-energy digital-native aesthetic',
    bestFor: ['TikTok overlays', 'Gaming content', 'Tech product listings'],
    synthesisPrompt: 'A cyberpunk-inspired scene with electric cyan lighting...',
    previewCss: {
      backgroundGradient: 'linear-gradient(135deg, #0a0519, #00e5ff)',
      fontFamily: 'Space Mono',
      accentColor: '#00e5ff',
      textColor: '#ffffff',
      cardStyle: 'vibrant',
      vibeElement: '<div>Techno Punk</div>'
    },
    category: 'digital',
    generatedAt: new Date().toISOString()
  },
  {
    snapshotId: 'vibe_3',
    primaryVibe: 'Minimalist Slate',
    colorScheme: 'Clean monochrome with warm taupe',
    typographyMood: 'Ultra-light sans-serif with generous whitespace',
    designPersonality: 'Clean, premium, and distraction-free',
    bestFor: ['Brand guidelines', 'Product photography', 'Email headers'],
    synthesisPrompt: 'A minimalist product scene with clean lines...',
    previewCss: {
      backgroundGradient: 'linear-gradient(135deg, #334155, #94a3b8)',
      fontFamily: 'Inter',
      accentColor: '#64748b',
      textColor: '#ffffff',
      cardStyle: 'minimal',
      vibeElement: '<div>Minimalist Slate</div>'
    },
    category: 'professional',
    generatedAt: new Date().toISOString()
  },
  {
    snapshotId: 'vibe_4',
    primaryVibe: 'Vintage Rose',
    colorScheme: 'Dusty rose with cream and gold accents',
    typographyMood: 'Elegant script headlines with classic serif body',
    designPersonality: 'Timeless romanticism with a modern edge',
    bestFor: ['Wedding invitations', 'Beauty products', 'Journal covers'],
    synthesisPrompt: 'A vintage-inspired scene with rose tones...',
    previewCss: {
      backgroundGradient: 'linear-gradient(135deg, #B76E79, #E8D1C8)',
      fontFamily: 'Playfair Display',
      accentColor: '#C9A96E',
      textColor: '#2d1b1f',
      cardStyle: 'warm',
      vibeElement: '<div>Vintage Rose</div>'
    },
    category: 'elegant',
    generatedAt: new Date().toISOString()
  },
  {
    snapshotId: 'vibe_5',
    primaryVibe: 'Dark Luxury',
    colorScheme: 'Deep charcoal with champagne metallic',
    typographyMood: 'High-contrast thin serif with generous letter-spacing',
    designPersonality: 'Opulent, sophisticated, and commanding',
    bestFor: ['Luxury branding', 'High-end product pages', 'VIP experiences'],
    synthesisPrompt: 'A luxury product scene with dramatic lighting...',
    previewCss: {
      backgroundGradient: 'linear-gradient(135deg, #1a1a2e, #2d1b4e)',
      fontFamily: 'Cormorant Garamond',
      accentColor: '#C9A96E',
      textColor: '#ffffff',
      cardStyle: 'dark',
      vibeElement: '<div>Dark Luxury</div>'
    },
    category: 'luxury',
    generatedAt: new Date().toISOString()
  },
  {
    snapshotId: 'vibe_6',
    primaryVibe: 'Playful Pop',
    colorScheme: 'Bright coral with electric yellow accents',
    typographyMood: 'Rounded sans-serif with bounce animation feel',
    designPersonality: 'Energetic, youthful, and attention-grabbing',
    bestFor: ['Social media posts', 'Youth brands', 'Promotional banners'],
    synthesisPrompt: 'A bright playful scene with coral tones...',
    previewCss: {
      backgroundGradient: 'linear-gradient(135deg, #FF6B6B, #FFE66D)',
      fontFamily: 'Nunito',
      accentColor: '#FF6B6B',
      textColor: '#1a1a2e',
      cardStyle: 'playful',
      vibeElement: '<div>Playful Pop</div>'
    },
    category: 'youthful',
    generatedAt: new Date().toISOString()
  }
];

// ─── Suggestion Bubbles ────────────────────────────────────────────────────

const suggestionBubbles = [
  { label: '✨ Remix this Etsy best-seller?', category: 'etsy', vibe: 'Modern Boho' },
  { label: '🎬 Trend-hack this TikTok hook', category: 'tiktok', vibe: 'Techno Punk' },
  { label: '📱 Generate Instagram Story set', category: 'instagram', vibe: 'Playful Pop' },
  { label: '🛍️ Create luxury product listing', category: 'etsy', vibe: 'Dark Luxury' },
  { label: '🌿 Design minimalist brand kit', category: 'branding', vibe: 'Minimalist Slate' },
];

// ─── Visual Style Card Component ───────────────────────────────────────────

function VisualStyleCard({ 
  vibe, 
  selected,
  onSelect 
}: { 
  vibe: VisualStylePreview; 
  selected?: boolean;
  onSelect?: (vibe: VisualStylePreview) => void;
}) {
  return (
    <motion.button
      onClick={() => onSelect?.(vibe)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative w-full text-left rounded-[24px] overflow-hidden border-2 transition-all flex items-stretch gap-4 p-3 bg-theme-surface",
        selected 
          ? "border-primary shadow-lg" 
          : "border-theme hover:border-white/40"
      )}
    >
      {/* Small Preview Image */}
      <div 
        className="w-24 h-24 rounded-xl shrink-0 overflow-hidden relative" 
        style={{ background: vibe.previewCss.backgroundGradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: vibe.previewCss.accentColor }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-black text-foreground text-sm uppercase tracking-tight truncate">{vibe.primaryVibe}</h3>
        </div>

        <p className="text-[10px] text-muted-foreground font-medium leading-tight line-clamp-2 mb-2">
          {vibe.designPersonality}
        </p>

        <div className="flex flex-wrap gap-1">
          {vibe.bestFor.slice(0, 2).map((use, i) => (
            <span key={i} className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-theme-background border border-theme text-muted-foreground">
              {use}
            </span>
          ))}
        </div>

        {selected && (
          <div className="absolute top-2 left-2 bg-primary rounded-full p-1 shadow-lg z-20">
            <CheckCircle2 className="w-3 h-3 text-slate-950" />
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ─── Inspiration Gallery (Main Dashboard Component) ────────────────────────

interface InspirationGalleryProps {
  onSelectVibe?: (vibe: VisualStylePreview) => void;
}

export function InspirationGallery({ onSelectVibe }: InspirationGalleryProps) {
  const [vibes, setVibes] = useState<VisualStylePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate fetch from VisualProxyService
    const timer = setTimeout(() => {
      setVibes(mockVibes);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['all', ...new Set(vibes.map(v => v.category || 'other'))];
  const filtered = filter === 'all' ? vibes : vibes.filter(v => v.category === filter);

  const handleSelect = (vibe: VisualStylePreview) => {
    setSelectedId(vibe.snapshotId);
    onSelectVibe?.(vibe);
  };

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-black text-foreground text-sm uppercase tracking-tight">Inspiration Gallery</h3>
            <p className="text-[10px] text-muted-foreground font-medium">AI-synthesized style vibes from market intelligence</p>
          </div>
        </div>
        {!loading && (
          <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            {vibes.length} Vibes
          </span>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest whitespace-nowrap transition-all border",
              filter === cat
                ? "bg-primary text-slate-950 border-primary shadow-lg shadow-primary/20"
                : "bg-theme-surface text-muted-foreground border-theme hover:border-white/30"
            )}
          >
            {cat === 'all' ? 'All Styles' : cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-full flex gap-4 p-4 rounded-[24px] border-2 border-theme animate-pulse bg-theme-surface">
              <div className="w-24 h-24 bg-slate-800 rounded-xl shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((vibe) => (
              <motion.div
                key={vibe.snapshotId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full"
              >
                <VisualStyleCard
                  vibe={vibe}
                  selected={selectedId === vibe.snapshotId}
                  onSelect={handleSelect}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Selected Vibe Detail */}
      <AnimatePresence>
        {selectedId && vibes.find(v => v.snapshotId === selectedId) && (() => {
          const vibe = vibes.find(v => v.snapshotId === selectedId)!;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 bg-theme-surface border-2 border-primary/30 rounded-[32px] space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-black text-foreground uppercase tracking-tight">{vibe.primaryVibe} — Details</h4>
                <Eye className="w-4 h-4 text-primary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary">Color Scheme</p>
                  <p className="text-sm font-medium text-foreground">{vibe.colorScheme}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary">Typography</p>
                  <p className="text-sm font-medium text-foreground">{vibe.typographyMood}</p>
                </div>
              </div>
              <div className="h-16 rounded-2xl flex items-center justify-center" style={{ background: vibe.previewCss.backgroundGradient }}>
                <span className="font-black text-sm tracking-wider" style={{ color: vibe.previewCss.textColor, fontFamily: vibe.previewCss.fontFamily }}>
                  {vibe.primaryVibe}
                </span>
              </div>
              <button className="w-full py-3 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
                Generate From This Vibe
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// ─── Studio Vibes Selector ─────────────────────────────────────────────────

interface StudioVibesSelectorProps {
  onVibeSelected: (vibe: VisualStylePreview) => void;
}

export function StudioVibesSelector({ onVibeSelected }: StudioVibesSelectorProps) {
  const [step, setStep] = useState<'choose' | 'detail' | 'generating'>('choose');
  const [selectedVibe, setSelectedVibe] = useState<VisualStylePreview | null>(null);

  const topVibes = mockVibes.slice(0, 3);

  const handleSelect = (vibe: VisualStylePreview) => {
    setSelectedVibe(vibe);
    setStep('detail');
  };

  const handleGenerate = () => {
    if (!selectedVibe) return;
    setStep('generating');
    setTimeout(() => {
      onVibeSelected(selectedVibe);
      setStep('choose');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {step === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 p-4 bg-theme-surface rounded-2xl border border-theme">
              <Bot className="w-6 h-6 text-primary shrink-0" />
              <p className="text-sm font-medium text-foreground italic">
                "I've analyzed the top trends. Pick a visual direction and I'll generate the perfect asset."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topVibes.map((vibe) => (
                <VisualStyleCard
                  key={vibe.snapshotId}
                  vibe={vibe}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 'detail' && selectedVibe && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6 p-6 bg-theme-surface border-2 border-primary/20 rounded-[32px]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-foreground uppercase italic">{selectedVibe.primaryVibe}</h3>
              <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                AI-Synthesized Style Vibe
              </span>
            </div>

            <div className="h-24 rounded-3xl flex items-center justify-center" style={{ background: selectedVibe.previewCss.backgroundGradient }}>
              <span className="font-black text-xl tracking-wider" style={{ color: selectedVibe.previewCss.textColor, fontFamily: selectedVibe.previewCss.fontFamily }}>
                {selectedVibe.primaryVibe}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">{selectedVibe.designPersonality}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 p-4 bg-theme-background rounded-2xl border border-theme">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary">Colors</p>
                <p className="text-xs font-medium text-foreground">{selectedVibe.colorScheme}</p>
              </div>
              <div className="space-y-1 p-4 bg-theme-background rounded-2xl border border-theme">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary">Typography</p>
                <p className="text-xs font-medium text-foreground">{selectedVibe.typographyMood}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('choose')}
                className="flex-1 py-4 border-2 border-theme rounded-2xl font-black text-xs uppercase tracking-widest text-muted-foreground hover:border-white/30 transition-all"
              >
                Try Another
              </button>
              <button
                onClick={handleGenerate}
                className="flex-[2] py-4 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate Asset
              </button>
            </div>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 space-y-6"
          >
            <BrandedGlobe size="sm" animate={true} />
            <div className="text-center space-y-2">
              <p className="font-black text-foreground text-lg">Synthesizing Design...</p>
              <p className="text-sm text-muted-foreground italic">Applying "{selectedVibe?.primaryVibe}" DNA to your asset</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Success Suggestion Bubbles ─────────────────────────────────────────────

interface SuggestionBubblesProps {
  onSelect: (suggestion: string) => void;
}

export function SuggestionBubbles({ onSelect }: SuggestionBubblesProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {suggestionBubbles.map((s, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(s.label)}
          className="w-full px-4 py-3 bg-theme-surface border border-theme rounded-2xl font-bold text-[11px] text-foreground hover:border-white/40 hover:bg-primary/5 transition-all flex items-center justify-between group"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm shrink-0">{s.label.split(' ')[0]}</span>
            <span className="uppercase tracking-tight">{s.label.split(' ').slice(1).join(' ')}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      ))}
    </div>
  );
}