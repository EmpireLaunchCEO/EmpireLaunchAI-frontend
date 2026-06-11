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
  Palette,
  Film,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InspirationGallery, SuggestionBubbles } from '@/components/Dashboard/InspirationGallery';
import { DNAVaultCounter } from '@/components/Dashboard/DNAVaultCounter';
import { FileUploadDropZone, UploadState } from '@/components/Dashboard/FileUploadDropZone';
import { AIRenderLog, generateMockRenderLogs, RenderLogEntry } from '@/components/Dashboard/AIRenderLog';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { useEmpire } from '@/lib/EmpireContext';

// ─── Mock Harvest Activity ────────────────────────────────────────────────

const vaultActivity = [
  { id: 1, action: 'Harvested', source: 'Etsy', niche: 'Digital Zen Planners', time: '2 min ago', confidence: 94 },
  { id: 2, action: 'Extracted', source: 'TikTok', niche: 'Morning Routine Aesthetic', time: '15 min ago', confidence: 88 },
  { id: 3, action: 'Analyzed', source: 'Pinterest', niche: 'Sage Green Office Trends', time: '1 hour ago', confidence: 92 },
  { id: 4, action: 'Vaulted', source: 'Instagram', niche: 'Boho Luxe Color Palette', time: '2 hours ago', confidence: 96 },
  { id: 5, action: 'Synthesized', source: 'AI', niche: 'Avatar: Casual Lifestyle DNA', time: '3 hours ago', confidence: 91 },
  { id: 6, action: 'Vaulted', source: 'AI', niche: 'Animal: Pet Portrait Fur DNA', time: '4 hours ago', confidence: 87 },
];

import { SocialMediaRadar } from '@/components/Dashboard/SocialMediaRadar';
import { BarChart3 } from 'lucide-react';

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'cinema' | 'activity' | 'radar'>('gallery');
  const [cinemaActiveSlot, setCinemaActiveSlot] = useState<'twin' | 'lab' | 'logs'>('twin');
  const [harvestActivity, setHarvestActivity] = useState(vaultActivity);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { activeEmpire: empireData, registerRefreshHandler } = useEmpire();

  const handleRefresh = React.useCallback(async () => {
    await new Promise(r => setTimeout(r, 1000));
  }, []);

  React.useEffect(() => {
    return registerRefreshHandler(handleRefresh);
  }, [registerRefreshHandler, handleRefresh]);

  // Upload states
  const [facialDnaUpload, setFacialDnaUpload] = useState<UploadState>({ file: null, preview: null, status: 'idle', progress: 0 });
  const [rawVideoUpload, setRawVideoUpload] = useState<UploadState>({ file: null, preview: null, status: 'idle', progress: 0 });
  const [renderLogs, setRenderLogs] = useState<RenderLogEntry[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [activeRenderType, setActiveRenderType] = useState<'facial-dna' | 'raw-video'>('facial-dna');

  // Handle Facial DNA file selection
  const handleFacialDnaSelect = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setFacialDnaUpload({ file, preview, status: 'selected', progress: 0 });
    
    const formData = new FormData();
    formData.append('photo', file);

    try {
      setFacialDnaUpload(prev => ({ ...prev, status: 'uploading', progress: 10 }));
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/cinema/upload-photo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setFacialDnaUpload(prev => ({ ...prev, status: 'complete', progress: 100, metadata: data }));
      
      // Trigger render logs
      setActiveRenderType('facial-dna');
      setRenderLogs(generateMockRenderLogs('facial-dna'));
      setIsRendering(true);
    } catch (error) {
      console.error('Facial DNA upload error:', error);
      setFacialDnaUpload(prev => ({ ...prev, status: 'error' }));
    }
  };

  // Handle Raw Video file selection
  const handleRawVideoSelect = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setRawVideoUpload({ file, preview, status: 'selected', progress: 0 });
    
    const formData = new FormData();
    formData.append('video', file);

    try {
      setRawVideoUpload(prev => ({ ...prev, status: 'uploading', progress: 10 }));
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/cinema/upload-video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setRawVideoUpload(prev => ({ ...prev, status: 'complete', progress: 100, metadata: data }));
      
      setActiveRenderType('raw-video');
      setRenderLogs(generateMockRenderLogs('raw-video'));
      setIsRendering(true);
    } catch (error) {
      console.error('Raw video upload error:', error);
      setRawVideoUpload(prev => ({ ...prev, status: 'error' }));
    }
  };

  // Remove Facial DNA file
  const handleFacialDnaRemove = () => {
    if (facialDnaUpload.preview) URL.revokeObjectURL(facialDnaUpload.preview);
    setFacialDnaUpload({ file: null, preview: null, status: 'idle', progress: 0 });
  };

  // Remove Raw Video file
  const handleRawVideoRemove = () => {
    if (rawVideoUpload.preview) URL.revokeObjectURL(rawVideoUpload.preview);
    setRawVideoUpload({ file: null, preview: null, status: 'idle', progress: 0 });
  };

  // Synthesize Twin
  const handleSynthesizeTwin = async () => {
    if (facialDnaUpload.status !== 'complete') return;
    
    setRenderLogs(generateMockRenderLogs('facial-dna'));
    setIsRendering(true);
    setActiveRenderType('facial-dna');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/cinema/create-twin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'system', // In a real app, this would be the actual user ID
          photoPath: facialDnaUpload.metadata?.path,
          script: "Welcome to my Empire! This is my Neural Twin double, ready to market 24/7.",
        }),
      });

      if (!response.ok) throw new Error('Synthesis failed');
      const data = await response.json();
      console.log('Twin created:', data);
    } catch (error) {
      console.error('Twin synthesis error:', error);
    }
  };

  // Clear logs
  const handleClearLogs = () => {
    setRenderLogs([]);
    setIsRendering(false);
  };

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
      <div className="p-4 md:p-8 pb-32 max-w-full md:max-w-7xl mx-auto space-y-12 md:space-y-16 overflow-x-hidden">
        
        {/* 1. Identity Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary">Link Center Active</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-theme-gradient">
            {(empireData?.name === 'HOME BASE' || empireData?.title === 'HOME BASE') ? "EmpireLaunch AI" : (empireData?.name || empireData?.title || "EmpireLaunch AI")}
          </h1>
        </div>

        {/* DNA Vault Counter — Live Harvest Intelligence */}
        <DNAVaultCounter />

        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 animate-in fade-in duration-1000">
          {/* Tab Navigation */}
          <div className="flex bg-theme-background/60 p-1.5 rounded-[24px] border border-theme w-fit max-w-[calc(100%-2rem)] overflow-x-auto no-scrollbar gap-1.5 mx-auto shadow-2xl backdrop-blur-xl px-2 flex-nowrap relative z-50">
            {[
              { id: 'gallery', label: 'Universal Studio', icon: Palette },
              { id: 'cinema', label: 'Cinema Hub', icon: Video },
              { id: 'radar', label: 'Social Radar', icon: BarChart3 },
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
                {/* Cinema Slot Bar */}
                <div className="flex bg-slate-900/50 p-1 rounded-[20px] border border-theme w-full max-w-2xl mx-auto gap-1">
                  {[
                    { id: 'twin', label: 'Neural Twin', icon: Stars },
                    { id: 'lab', label: 'AI Video Lab', icon: Film },
                    { id: 'logs', label: 'Production Logs', icon: Clock },
                  ].map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setCinemaActiveSlot(slot.id as any)}
                      className={cn(
                        "flex-1 py-3 rounded-[16px] font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                        cinemaActiveSlot === slot.id
                          ? "bg-primary text-slate-950 shadow-lg"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <slot.icon className="w-3 h-3" />
                      <span>{slot.label}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {cinemaActiveSlot === 'twin' && (
                    <motion.div
                      key="twin"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col md:flex-row gap-8 items-stretch"
                    >
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
                          <FileUploadDropZone
                            type="facial-dna"
                            state={facialDnaUpload}
                            onFileSelect={handleFacialDnaSelect}
                            onRemove={handleFacialDnaRemove}
                            disabled={facialDnaUpload.status === 'uploading' || facialDnaUpload.status === 'processing'}
                          />

                          {facialDnaUpload.preview && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 mx-auto"
                            >
                              <img src={facialDnaUpload.preview} alt="Uploaded facial photo" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                            </motion.div>
                          )}

                          <button
                            onClick={handleSynthesizeTwin}
                            disabled={facialDnaUpload.status !== 'complete'}
                            className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {facialDnaUpload.status === 'complete' ? 'Synthesize Twin Double' : 'Upload a photo first'}
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
                        {isRendering && activeRenderType === 'facial-dna' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                          >
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Twin Synthesis in Progress</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {cinemaActiveSlot === 'lab' && (
                    <motion.div
                      key="lab"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="p-6 md:p-8 bg-theme-surface border-2 border-theme rounded-[32px] md:rounded-[40px] space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <Film className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-xl md:text-2xl font-black text-white italic">Raw Material Upload.</h3>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">AI-Powered Video Enhancement</p>
                          </div>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed italic">
                          "Upload your raw footage and I'll apply the Empire Style — color grading, smart captions, trending music, and professional cuts. Your content, empire-certified."
                        </p>

                        <FileUploadDropZone
                          type="raw-video"
                          state={rawVideoUpload}
                          onFileSelect={handleRawVideoSelect}
                          onRemove={handleRawVideoRemove}
                          disabled={rawVideoUpload.status === 'uploading' || rawVideoUpload.status === 'processing'}
                        />

                        {rawVideoUpload.status === 'complete' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-emerald-400">Raw video received</p>
                              <p className="text-[9px] text-emerald-400/70 font-medium">Queued for AI enhancement pipeline</p>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight px-1">Enhanced Clips</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {[1, 2].map(i => (
                            <div key={i} className="aspect-[9/16] bg-theme-surface border-2 border-theme rounded-[24px] relative overflow-hidden group">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                              <div className="absolute bottom-4 left-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Ready</span>
                                </div>
                                <p className="text-[10px] font-bold text-white">Enhanced Reel #{i}</p>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                <Zap className="w-8 h-8 text-primary" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {cinemaActiveSlot === 'logs' && (
                    <motion.div
                      key="logs"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <AIRenderLog
                        logs={renderLogs}
                        isProcessing={isRendering}
                        type={activeRenderType}
                        onClear={handleClearLogs}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'radar' && (
              <motion.div
                key="radar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <SocialMediaRadar />
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

          {/* Version Verification */}
          <div className="flex justify-center pb-20">
            <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
              Command Center v3.0.2 (Neural Sync Active)
            </span>
          </div>
        </div>
      </div>
  );
}
