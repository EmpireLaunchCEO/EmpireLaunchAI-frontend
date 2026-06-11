"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  FileText, 
  Image as ImageIcon, 
  Check, 
  Trash2, 
  X, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Music2,
  Camera,
  Youtube,
  ShoppingBag,
  Zap,
  Mail,
  Send,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';
import { BrandedGlobe } from '@/components/BrandedGlobe';

// --- Types ---
type AssetType = 'video' | 'script' | 'design';

interface ApprovalAsset {
  id: string;
  type: AssetType;
  title: string;
  previewUrl?: string;
  content?: string;
  suggestedPlatforms: string[];
}

// --- Mock Data ---
const MOCK_ASSETS: ApprovalAsset[] = [
  { id: 'v1', type: 'video', title: 'Viral Faceless Hook', previewUrl: '/placeholder-video.mp4', suggestedPlatforms: ['tiktok', 'instagram', 'youtube'] },
  { id: 's1', type: 'script', title: 'Product Showcase Script', content: "Hook: You won't believe how this digital journal changes your morning routine...\n\nBody: I spent 3 months designing the perfect flow for ADHD brains. It's clean, minimalist, and actually works.\n\nCTA: Link in bio to grab yours today!", suggestedPlatforms: ['gmail', 'tiktok'] },
  { id: 'd1', type: 'design', title: 'Etsy Listing Hero Image', previewUrl: '/placeholder-design.jpg', suggestedPlatforms: ['etsy'] },
];

const PLATFORM_3D_ICONS: Record<string, string> = {
  tiktok: '/brands/tiktok_128.png',
  instagram: '/brands/instagram_128.png',
  youtube: '/brands/youtube_128.png',
  etsy: '/brands/etsy_128.png',
  fiverr: '/brands/fiverr_128.png',
  gmail: '/brands/gmail_128.png',
  facebook: '/brands/facebook_128.png',
  canva: '/brands/canva_128.png',
  kittl: '/brands/kittl_128.png',
  capcut: '/brands/capcut_128.png',
};

function PlatformIcon({ platform, className, size = 20 }: { platform: string; className?: string; size?: number }) {
  const icon3d = PLATFORM_3D_ICONS[platform];
  if (icon3d) {
    return (
      <div className="relative flex items-center justify-center bg-white rounded-lg p-0.5 border border-theme/50" style={{ width: size + 8, height: size + 8 }}>
        <Image src={icon3d} alt={platform} width={size} height={size} className="object-contain" />
      </div>
    );
  }

  const icons: Record<string, any> = {
    tiktok: Music2,
    instagram: Camera,
    youtube: Youtube,
    etsy: ShoppingBag,
    fiverr: Zap,
    gmail: Mail,
  };
  const Icon = icons[platform] || ExternalLink;
  return <Icon className={className} />;
}

// --- Components ---

export function OmniApprovalHub() {
  const { connectedPlatforms } = useEmpire();
  const [activeCategory, setActiveCategory] = useState<AssetType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [isFullView, setIsFullView] = useState(false);

  const filteredAssets = MOCK_ASSETS.filter(a => a.type === activeCategory);
  const currentAsset = filteredAssets[currentIndex];

  const handleOpenCategory = (type: AssetType) => {
    setActiveCategory(type);
    setCurrentIndex(0);
    const initialDest = MOCK_ASSETS.find(a => a.type === type)?.suggestedPlatforms || [];
    setSelectedDestinations(initialDest.filter(p => connectedPlatforms.map(cp => cp.toLowerCase()).includes(p.toLowerCase())));
  };

  const toggleDestination = (platform: string) => {
    setSelectedDestinations(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const categoryConfigs = [
    { type: 'video' as const, label: 'Videos', icon: Play, count: MOCK_ASSETS.filter(a => a.type === 'video').length, color: 'text-blue-400 bg-blue-500/10' },
    { type: 'script' as const, label: 'Scripts', icon: FileText, count: MOCK_ASSETS.filter(a => a.type === 'script').length, color: 'text-purple-400 bg-purple-500/10' },
    { type: 'design' as const, label: 'Designs', icon: ImageIcon, count: MOCK_ASSETS.filter(a => a.type === 'design').length, color: 'text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hub Pillar Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categoryConfigs.map((config) => (
          <motion.button
            key={config.type}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenCategory(config.type)}
            className="bg-theme-surface border-2 border-theme rounded-[32px] p-6 text-left flex flex-col justify-between h-[180px] group transition-all hover:border-primary/30"
          >
            <div className="flex justify-between items-start">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border border-theme", config.color)}>
                <config.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-theme-background px-3 py-1 rounded-full border border-theme">
                {config.count} Pending
              </span>
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">{config.label} Hub</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">
                Review Production →
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 2. Review Overlay (Neural Modal) */}
      <AnimatePresence>
        {activeCategory && currentAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setActiveCategory(null)} />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl bg-theme-surface border-2 border-theme rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full max-h-[850px]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveCategory(null)}
                className="absolute top-6 right-6 z-30 p-3 rounded-full bg-theme-background border border-theme text-muted-foreground hover:text-red-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* A. Content Viewer (Left) */}
              <div className="flex-1 bg-theme-background p-6 md:p-12 flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                       <Sparkles className="w-3 h-3" /> Neural Render
                    </span>
                 </div>

                 {/* Video Player Placeholder */}
                 {activeCategory === 'video' && (
                    <div className="relative aspect-[9/16] max-h-[600px] mx-auto rounded-[32px] overflow-hidden bg-slate-900 border-4 border-theme shadow-2xl group">
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 animate-pulse">
                             <Play className="w-10 h-10 ml-1" />
                          </div>
                       </div>
                       <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setIsFullView(true)} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white">
                             <Maximize2 className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                 )}

                 {/* Script View */}
                 {activeCategory === 'script' && (
                    <div className="max-w-xl mx-auto space-y-6">
                       <h2 className="text-3xl font-black text-foreground uppercase tracking-tight leading-none italic">{currentAsset.title}</h2>
                       <div className="bg-theme-surface border-2 border-theme rounded-[32px] p-8 text-lg font-medium leading-relaxed text-slate-700 font-mono whitespace-pre-wrap relative">
                          <div className="absolute top-4 right-4 opacity-10">
                             <FileText className="w-12 h-12" />
                          </div>
                          {currentAsset.content}
                       </div>
                    </div>
                 )}

                 {/* Design View */}
                 {activeCategory === 'design' && (
                    <div className="aspect-square max-h-[600px] mx-auto rounded-[32px] overflow-hidden bg-slate-100 border-4 border-theme shadow-2xl relative group">
                       <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                          <ImageIcon className="w-20 h-20 opacity-20" />
                       </div>
                       <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setIsFullView(true)} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white">
                             <Maximize2 className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                 )}

                 {/* Navigation Controls */}
                 {filteredAssets.length > 1 && (
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
                       <button 
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                        className="p-4 rounded-full bg-theme-surface border border-theme text-foreground disabled:opacity-30 transition-all active:scale-90"
                       >
                          <ChevronLeft className="w-6 h-6" />
                       </button>
                       <button 
                        disabled={currentIndex === filteredAssets.length - 1}
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        className="p-4 rounded-full bg-theme-surface border border-theme text-foreground disabled:opacity-30 transition-all active:scale-90"
                       >
                          <ChevronRight className="w-6 h-6" />
                       </button>
                    </div>
                 )}
              </div>

              {/* B. Destination Routing (Right) */}
              <div className="w-full lg:w-[400px] p-8 md:p-12 space-y-10 border-l border-theme">
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter italic">Target Routing</h3>
                    <p className="text-xs text-muted-foreground font-medium">Select linked destinations for deployment.</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {connectedPlatforms.map((platform) => {
                       const id = platform.toLowerCase();
                       const isSelected = selectedDestinations.includes(id);

                       return (
                          <button
                            key={id}
                            onClick={() => toggleDestination(id)}
                            className={cn(
                               "relative flex flex-col items-center justify-center p-6 rounded-[28px] border-2 transition-all group",
                               isSelected
                                ? "bg-theme-surface border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                                : "bg-theme-background border-theme hover:border-slate-300"
                            )}
                          >
                             <div className="mb-3">
                                <PlatformIcon platform={id} size={24} />
                             </div>
                             <span className={cn("text-[10px] font-black uppercase tracking-widest", isSelected ? "text-foreground" : "text-slate-400")}>
                                {platform}
                             </span>

                             {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-theme-surface shadow-lg"
                                >
                                   <Check className="w-3.5 h-3.5 stroke-[4px]" />
                                </motion.div>
                             )}
                          </button>
                       );
                    })}

                    {connectedPlatforms.length === 0 && (
                       <div className="col-span-2 py-8 text-center bg-theme-background rounded-[28px] border-2 border-dashed border-theme">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">No Platforms Linked</p>
                       </div>
                    )}
                 </div>

                 <div className="space-y-4 pt-10">
                    <button 
                      className="w-full py-5 bg-primary text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                       <Send className="w-4 h-4" />
                       Deploy to {selectedDestinations.length} Targets
                    </button>
                    <button 
                      className="w-full py-5 bg-theme-background border-2 border-theme text-red-500 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500/5 transition-all flex items-center justify-center gap-3"
                    >
                       <Trash2 className="w-4 h-4" />
                       Decline & Purge
                    </button>
                 </div>

                 <div className="pt-6 border-t border-theme flex items-center gap-3">
                 <BrandedGlobe size="sm" spinning />
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
                       Neural Suggestion: Deployment to {currentAsset.suggestedPlatforms.join(', ')} recommended for max ROI.
                    </p>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Full Screen Viewing Modal */}
      <AnimatePresence>
         {isFullView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-slate-950 flex items-center justify-center p-4"
            >
               <button 
                onClick={() => setIsFullView(false)}
                className="absolute top-10 right-10 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[120]"
               >
                  <X className="w-8 h-8" />
               </button>
               <div className="w-full h-full max-w-5xl max-h-[90vh] rounded-[40px] overflow-hidden bg-slate-900 border-2 border-white/10 shadow-2xl flex items-center justify-center">
                  {activeCategory === 'video' && <Play className="w-20 h-20 text-white/20" />}
                  {activeCategory === 'design' && <ImageIcon className="w-20 h-20 text-white/20" />}
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
