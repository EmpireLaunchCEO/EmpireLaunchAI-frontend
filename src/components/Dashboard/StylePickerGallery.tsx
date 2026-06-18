"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Database,
  Layers,
  Cpu,
  Search,
  X,
  Eye,
  Shield,
  ChevronRight,
  Lock,
  Grid,
  List,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandedGlobe } from '@/components/BrandedGlobe';

// ─── Types (mirrors backend DnaStrand) ──────────────────────────────────────

export interface DnaStrandData {
  id?: string;
  category: string;
  subCategory?: string;
  manifest: {
    name?: string;
    description?: string;
    colorPalette?: string[];
    headerFont?: string;
    bodyFont?: string;
    layoutComplexity?: string;
    vibe?: string;
    tags?: string[];
  };
  performanceScore?: number;
  sourcePlatform?: string;
  synthesisPrompt?: string;
  isSynthesized?: boolean;
  isGlobal?: boolean;
  createdAt?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Styles', icon: Grid },
  { id: 'niche_pattern', label: 'Niche Patterns', icon: Layers },
  { id: 'palette', label: 'Color Palettes', icon: Palette },
  { id: 'typography', label: 'Typography', icon: TypeIcon },
  { id: 'layout', label: 'Layouts', icon: Grid },
  { id: 'avatar', label: 'Avatars', icon: Cpu },
  { id: 'background', label: 'Backgrounds', icon: Layers },
];

const SUBCATEGORIES = [
  { id: 'all', label: 'All Niches', parent: null },
  { id: 'planner', label: 'Planners', parent: 'niche_pattern' },
  { id: 'notion', label: 'Notion Templates', parent: 'niche_pattern' },
  { id: 'tracker', label: 'Trackers', parent: 'niche_pattern' },
  { id: 'social', label: 'Social Media', parent: 'layout' },
  { id: 'branding', label: 'Branding', parent: 'palette' },
  { id: 'editorial', label: 'Editorial', parent: 'typography' },
  { id: 'wellness', label: 'Wellness', parent: 'background' },
];

function TypeIcon({ className }: { className?: string }) { return <span className={cn('font-black text-xs', className)}>T</span>; }

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_STRANDS: DnaStrandData[] = [
  { id: 's1', category: 'niche_pattern', subCategory: 'planner', manifest: { name: 'Modern Boho Planner', description: 'Warm earth tones with sage green accents for lifestyle planning', colorPalette: ['#8B7355', '#C9B99A', '#5C7355', '#F5F0E8'], headerFont: 'Playfair Display', bodyFont: 'Inter', layoutComplexity: 'structured_grid', vibe: 'Free-spirited yet polished', tags: ['planner', 'boho', 'lifestyle'] }, performanceScore: 94, sourcePlatform: 'etsy', synthesisPrompt: 'A beautiful boho product photography scene with warm earth tones and sage green accents...', isSynthesized: true, isGlobal: true },
  { id: 's2', category: 'niche_pattern', subCategory: 'notion', manifest: { name: 'Techno Punk Notion', description: 'Electric cyan against deep violet for high-energy digital products', colorPalette: ['#0a0519', '#00e5ff', '#7c3aed', '#1a1a2e'], headerFont: 'Space Mono', bodyFont: 'JetBrains Mono', layoutComplexity: 'retro_maximalist', vibe: 'High-energy digital-native', tags: ['notion', 'tech', 'cyberpunk'] }, performanceScore: 88, sourcePlatform: 'tiktok', synthesisPrompt: 'A cyberpunk-inspired scene with electric cyan lighting...', isSynthesized: true, isGlobal: true },
  { id: 's3', category: 'palette', manifest: { name: 'Minimalist Slate', description: 'Clean monochrome with warm taupe for premium branding', colorPalette: ['#334155', '#94a3b8', '#64748b', '#f1f5f9'], headerFont: 'Inter', bodyFont: 'DM Sans', layoutComplexity: 'minimalist', vibe: 'Clean, premium, distraction-free', tags: ['branding', 'minimal', 'professional'] }, performanceScore: 92, sourcePlatform: 'instagram', synthesisPrompt: 'A minimalist product scene with clean lines and subtle shadows...', isSynthesized: true, isGlobal: true },
  { id: 's4', category: 'palette', manifest: { name: 'Vintage Rose', description: 'Dusty rose with cream and gold accents for elegant products', colorPalette: ['#B76E79', '#E8D1C8', '#C9A96E', '#2d1b1f'], headerFont: 'Playfair Display', bodyFont: 'Lora', layoutComplexity: 'organic_boho', vibe: 'Timeless romanticism with modern edge', tags: ['wedding', 'beauty', 'elegant'] }, performanceScore: 86, sourcePlatform: 'pinterest', synthesisPrompt: 'A vintage-inspired scene with rose tones and gold foil...', isSynthesized: true, isGlobal: true },
  { id: 's5', category: 'niche_pattern', subCategory: 'tracker', manifest: { name: 'Dark Luxury Tracker', description: 'Deep charcoal with champagne metallic for high-end products', colorPalette: ['#1a1a2e', '#2d1b4e', '#C9A96E', '#0f0f23'], headerFont: 'Cormorant Garamond', bodyFont: 'Inter', layoutComplexity: 'structured_grid', vibe: 'Opulent, sophisticated, commanding', tags: ['luxury', 'tracker', 'premium'] }, performanceScore: 90, sourcePlatform: 'fiverr', synthesisPrompt: 'A luxury product scene with dramatic lighting and metallic accents...', isSynthesized: true, isGlobal: true },
  { id: 's6', category: 'layout', manifest: { name: 'Playful Pop Layout', description: 'Bright coral with electric yellow for social media graphics', colorPalette: ['#FF6B6B', '#FFE66D', '#4ECDC4', '#1a1a2e'], headerFont: 'Nunito', bodyFont: 'Poppins', layoutComplexity: 'retro_maximalist', vibe: 'Energetic, youthful, attention-grabbing', tags: ['social', 'youth', 'promotional'] }, performanceScore: 84, sourcePlatform: 'canva', synthesisPrompt: 'A bright playful scene with coral tones and yellow accents...', isSynthesized: true, isGlobal: true },
  { id: 's7', category: 'typography', manifest: { name: 'Serif Elegance', description: 'Refined serif pairings for premium editorial content', colorPalette: ['#2d2d2d', '#fafafa', '#c9a96e', '#666666'], headerFont: 'Cormorant Garamond', bodyFont: 'Source Serif Pro', layoutComplexity: 'minimalist', vibe: 'Refined, editorial, premium', tags: ['editorial', 'luxury', 'print'] }, performanceScore: 82, sourcePlatform: 'behance', synthesisPrompt: 'An elegant editorial layout with refined typography...', isSynthesized: true, isGlobal: true },
  { id: 's8', category: 'background', manifest: { name: 'Sage Green Nature', description: 'Organic green tones for wellness and nature-themed products', colorPalette: ['#2D4F1E', '#E4D5B7', '#8FBC8F', '#F5F2EB'], headerFont: 'Libre Baskerville', bodyFont: 'Lato', layoutComplexity: 'organic_boho', vibe: 'Natural, calming, organic', tags: ['wellness', 'nature', 'organic'] }, performanceScore: 78, sourcePlatform: 'etsy', synthesisPrompt: 'A nature-inspired botanical scene with sage green tones...', isSynthesized: true, isGlobal: true },
];

// ─── StyleCard Component ────────────────────────────────────────────────────

interface StyleCardProps {
  strand: DnaStrandData;
  selected?: boolean;
  onSelect?: (strand: DnaStrandData) => void;
}

function StyleCard({ strand, selected, onSelect }: StyleCardProps) {
  const palette = strand.manifest.colorPalette || [];
  const score = strand.performanceScore || 0;

  return (
    <motion.button
      layout
      onClick={() => onSelect?.(strand)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative w-full text-left rounded-[24px] overflow-hidden border-2 transition-all flex flex-col',
        selected
          ? 'border-primary shadow-lg shadow-primary/20'
          : 'border-theme hover:border-primary/40 bg-theme-surface'
      )}
    >
      {/* Color palette strip */}
      {palette.length > 0 && (
        <div className="flex h-16">
          {palette.slice(0, 4).map((color, i) => (
            <div
              key={i}
              className="flex-1 relative"
              style={{ backgroundColor: color }}
            >
              {i === 0 && (
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/30 backdrop-blur-sm">
                  <span className="text-[6px] font-bold text-white font-mono">{color}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-bold text-foreground text-sm truncate">
              {strand.manifest.name || 'Untitled Style'}
            </h4>
            <p className="text-[9px] text-muted-foreground font-medium mt-0.5 flex items-center gap-1.5">
              <span className={cn(
                'px-1.5 py-0.5 rounded text-[7px] font-black uppercase',
                strand.category === 'niche_pattern' ? 'bg-cyan-500/10 text-cyan-400' :
                strand.category === 'palette' ? 'bg-purple-500/10 text-purple-400' :
                strand.category === 'typography' ? 'bg-amber-500/10 text-amber-400' :
                'bg-slate-500/10 text-slate-400'
              )}>
                {strand.category}
              </span>
              {strand.sourcePlatform && (
                <span className="text-muted-foreground">via {strand.sourcePlatform}</span>
              )}
            </p>
          </div>
          {/* Score badge */}
          <div className={cn(
            'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black',
            score >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
            score >= 80 ? 'bg-blue-500/10 text-blue-400' :
            score >= 70 ? 'bg-amber-500/10 text-amber-400' :
            'bg-slate-500/10 text-slate-400'
          )}>
            {score}
          </div>
        </div>

        {/* Typography info */}
        {strand.manifest.headerFont && (
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-medium">
            <span className="font-bold text-foreground" style={{ fontFamily: strand.manifest.headerFont }}>
              {strand.manifest.headerFont}
            </span>
            {strand.manifest.bodyFont && (
              <>
                <span className="text-muted-foreground/40">+</span>
                <span>{strand.manifest.bodyFont}</span>
              </>
            )}
          </div>
        )}

        {/* Vibe */}
        {strand.manifest.vibe && (
          <p className="text-[9px] text-muted-foreground italic leading-relaxed line-clamp-2">
            "{strand.manifest.vibe}"
          </p>
        )}

        {/* Tags */}
        {strand.manifest.tags && strand.manifest.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {strand.manifest.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-theme-background border border-theme text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Selection indicator */}
        {selected && (
          <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-lg z-10">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
          </div>
        )}

        {/* Synthesis badge */}
        {strand.isSynthesized && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30">
            <Cpu className="w-2.5 h-2.5 text-emerald-400" />
            <span className="text-[6px] font-black uppercase tracking-widest text-emerald-400">AI</span>
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ─── StyleDetail Modal ───────────────────────────────────────────────────────

interface StyleDetailModalProps {
  strand: DnaStrandData | null;
  onClose: () => void;
  onApply: (strand: DnaStrandData) => void;
}

function StyleDetailModal({ strand, onClose, onApply }: StyleDetailModalProps) {
  if (!strand) return null;
  const palette = strand.manifest.colorPalette || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-theme-surface w-full max-w-lg rounded-[32px] border border-theme shadow-2xl relative overflow-hidden"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-theme-background border border-theme text-muted-foreground hover:text-foreground z-10">
            <X className="w-4 h-4" />
          </button>

          <div className="p-8 space-y-6">
            {/* Color palette preview */}
            {palette.length > 0 && (
              <div className="flex h-20 rounded-2xl overflow-hidden border border-theme">
                {palette.slice(0, 4).map((color, i) => (
                  <div key={i} className="flex-1 relative group/color" style={{ backgroundColor: color }}>
                    <div className="absolute inset-0 opacity-0 group-hover/color:opacity-100 transition-opacity bg-black/20 flex items-center justify-center">
                      <span className="text-[7px] font-mono font-bold text-white drop-shadow-lg">{color}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-foreground uppercase tracking-tight italic">
                    {strand.manifest.name || 'Untitled'}
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    {strand.category.replace('_', ' ')} · Score: {strand.performanceScore}
                  </p>
                </div>
                {strand.isSynthesized && (
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Cpu className="w-3 h-3 text-emerald-400" />
                    <span className="text-[7px] font-black uppercase tracking-widest text-emerald-400">AI Original</span>
                  </div>
                )}
              </div>

              {strand.manifest.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {strand.manifest.description}
                </p>
              )}

              {/* Typography */}
              {(strand.manifest.headerFont || strand.manifest.bodyFont) && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-theme-background rounded-2xl border border-theme">
                  {strand.manifest.headerFont && (
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-primary">Header Font</p>
                      <p className="text-sm font-bold text-foreground" style={{ fontFamily: strand.manifest.headerFont }}>
                        {strand.manifest.headerFont}
                      </p>
                    </div>
                  )}
                  {strand.manifest.bodyFont && (
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-primary">Body Font</p>
                      <p className="text-sm font-medium text-foreground">{strand.manifest.bodyFont}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Synthesis prompt */}
              {strand.synthesisPrompt && (
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-[8px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Synthesis Prompt
                  </p>
                  <p className="text-xs text-slate-300 font-medium italic leading-relaxed">
                    "{strand.synthesisPrompt}"
                  </p>
                </div>
              )}

              {/* Source & Security */}
              <div className="flex items-center justify-between text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Database className="w-3 h-3" />
                  <span>{strand.sourcePlatform || 'AI-Generated'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-primary" />
                  <span>Anti-Copycat</span>
                </div>
              </div>
            </div>

            {/* Apply button */}
            <button
              onClick={() => { onApply(strand); onClose(); }}
              className="w-full py-4 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              Apply This Style
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ─── StylePickerGallery (Main Export) ────────────────────────────────────────

interface StylePickerGalleryProps {
  /** Override for showing the gallery inline (no panel wrapper) */
  inline?: boolean;
  /** Called when user applies a style */
  onApplyStyle?: (strand: DnaStrandData) => void;
  className?: string;
}

export function StylePickerGallery({ inline, onApplyStyle, className }: StylePickerGalleryProps) {
  const [strands, setStrands] = useState<DnaStrandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [selectedStrand, setSelectedStrand] = useState<DnaStrandData | null>(null);
  const [detailStrand, setDetailStrand] = useState<DnaStrandData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStrands = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/market-dna/global?limit=50`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.strands) {
            setStrands(data.strands.map((s: any) => ({
              id: s.id,
              category: s.category,
              subCategory: s.subCategory,
              manifest: typeof s.manifest === 'string' ? JSON.parse(s.manifest) : s.manifest,
              performanceScore: s.performanceScore,
              sourcePlatform: s.sourcePlatform,
              synthesisPrompt: s.synthesisPrompt,
              isSynthesized: s.isSynthesized,
              isGlobal: s.isGlobal,
              createdAt: s.createdAt,
            })));
            return;
          }
        }
      } catch {}
      // Fall back to mock data
      setStrands(MOCK_STRANDS);
      setLoading(false);
    };

    fetchStrands();
    const interval = setInterval(fetchStrands, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = strands.filter(s => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    if (activeSubCategory !== 'all' && s.subCategory !== activeSubCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (s.manifest.name || '').toLowerCase();
      const tags = (s.manifest.tags || []).join(' ').toLowerCase();
      const vibe = (s.manifest.vibe || '').toLowerCase();
      return name.includes(q) || tags.includes(q) || vibe.includes(q);
    }
    return true;
  });

  const relevantSubCategories = SUBCATEGORIES.filter(
    sc => sc.parent === null || sc.parent === activeCategory || activeCategory === 'all'
  );

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setActiveSubCategory('all');
  };

  const handleSelect = (strand: DnaStrandData) => {
    setSelectedStrand(strand);
    setDetailStrand(strand);
  };

  const handleApply = (strand: DnaStrandData) => {
    onApplyStyle?.(strand);
    setSelectedStrand(null);
  };

  const content = (
    <div className={cn('space-y-6', className)}>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search styles by name, tag, or vibe..."
            className="w-full bg-theme-background border border-theme rounded-2xl pl-10 pr-4 py-3 text-xs font-medium outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-full font-black text-[8px] uppercase tracking-widest whitespace-nowrap transition-all border shrink-0',
                activeCategory === cat.id
                  ? 'bg-primary text-slate-950 border-primary shadow-lg shadow-primary/20'
                  : 'bg-theme-surface text-muted-foreground border-theme hover:border-primary/30'
              )}
            >
              <Icon className="w-3 h-3" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* SubCategory/Niche filter tabs */}
      {relevantSubCategories.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {relevantSubCategories.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setActiveSubCategory(sc.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg font-bold text-[7px] uppercase tracking-widest whitespace-nowrap transition-all border shrink-0',
                activeSubCategory === sc.id
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-transparent text-muted-foreground border-transparent hover:border-theme'
              )}
            >
              {sc.label}
            </button>
          ))}
        </div>
      )}

      {/* Strand count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[9px] font-bold text-muted-foreground">
          {filtered.length} styles found
        </p>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
          <Database className="w-2.5 h-2.5 text-primary" />
          <span className="text-[7px] font-black uppercase tracking-widest text-primary">Global DNA Pool</span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <BrandedGlobe size="lg" animate={true} className="shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">
            Loading DNA Strands...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center space-y-4 bg-theme-surface rounded-[32px] border-2 border-dashed border-theme">
          <Layers className="w-12 h-12 text-muted-foreground mx-auto opacity-30" />
          <p className="text-sm font-bold text-foreground">No styles found</p>
          <p className="text-[10px] text-muted-foreground font-medium">
            Try adjusting your category filter or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((strand) => (
              <motion.div
                key={strand.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <StyleCard
                  strand={strand}
                  selected={selectedStrand?.id === strand.id}
                  onSelect={handleSelect}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Selected strand bottom bar */}
      <AnimatePresence>
        {selectedStrand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="sticky bottom-0 p-4 bg-theme-surface border-2 border-primary/30 rounded-[24px] shadow-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex gap-1">
                {(selectedStrand.manifest.colorPalette || []).slice(0, 4).map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-lg" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {selectedStrand.manifest.name}
                </p>
                <p className="text-[8px] text-muted-foreground font-medium">
                  Score: {selectedStrand.performanceScore} · {selectedStrand.category}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setDetailStrand(selectedStrand)}
                className="px-4 py-2 rounded-xl border border-theme text-muted-foreground hover:text-foreground text-[9px] font-black uppercase tracking-widest transition-all"
              >
                <Eye className="w-3.5 h-3.5 inline mr-1" />
                Details
              </button>
              <button
                onClick={() => handleApply(selectedStrand)}
                className="px-5 py-2 bg-primary text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Apply Style
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail modal */}
      <StyleDetailModal
        strand={detailStrand}
        onClose={() => setDetailStrand(null)}
        onApply={handleApply}
      />
    </div>
  );

  if (inline) return content;

  return (
    <div className={cn(
      'bg-theme-surface border-2 border-theme rounded-[32px] p-6 md:p-8 shadow-lg',
      'relative overflow-hidden',
      className
    )}>
      {/* Decorative background */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/5 blur-[60px] -z-10" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-cyan-500/5 blur-[60px] -z-10" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Palette className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-black text-foreground text-sm uppercase tracking-tight italic">Style Picker</h3>
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
            Browse and apply market-harvested design DNA
          </p>
        </div>
      </div>

      {content}
    </div>
  );
}