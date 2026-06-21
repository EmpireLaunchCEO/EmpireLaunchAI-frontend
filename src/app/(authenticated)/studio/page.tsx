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
import { DNAVaultCounter } from '@/components/Dashboard/DNAVaultCounter';
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';
import { FileUploadDropZone, UploadState } from '@/components/Dashboard/FileUploadDropZone';
import { InlineConsultant } from '@/components/Studio/InlineConsultant';
import { AIRenderLog, generateMockRenderLogs, RenderLogEntry } from '@/components/Dashboard/AIRenderLog';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { useEmpire } from '@/lib/EmpireContext';

import { BarChart3, PenSquare, Lightbulb, SendHorizonal, Scissors, MonitorPlay, Clapperboard, Info } from 'lucide-react';

export default function StudioPage() {
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

  // Usage state
  const [usage, setUsage] = useState<{
    neural: { remaining: number; limit: number | string; nextReset?: string };
    customize: { remaining: number; limit: number | string; nextReset?: string };
    design: { remaining: number; limit: number | string; nextReset?: string };
  } | null>(null);

  const fetchUsage = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/cinema/usage`);
      if (response.ok) {
        const data = await response.json();
        // Format dates for display
        const formatReset = (dateStr?: string) => {
          if (!dateStr) return undefined;
          const date = new Date(dateStr);
          const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
          const monthName = date.toLocaleDateString(undefined, { month: 'short' });
          const dayNum = date.getDate();
          const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return `${dayName}, ${monthName} ${dayNum} at ${timeStr}`;
        };
        setUsage({
          neural: { ...data.neural, nextReset: formatReset(data.neural.nextReset) },
          customize: { ...data.customize, nextReset: formatReset(data.customize.nextReset) },
          design: { ...data.design, nextReset: formatReset(data.design.nextReset) }
        });
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

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
      fetchUsage();
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
    // Demo mode logic without harvestActivity
  };

  // Custom design idea input state
  const [customIdea, setCustomIdea] = useState('');
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);

  // New Content Creation States
  const [customVideoIdea, setCustomVideoIdea] = useState('');
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);
  const [videoIdeaSubmitted, setVideoIdeaSubmitted] = useState(false);

  const [facelessIdea, setFacelessIdea] = useState('');
  const [isSubmittingFaceless, setIsSubmittingFaceless] = useState(false);
  const [facelessSubmitted, setFacelessSubmitted] = useState(false);

  const handleCustomVideoSubmit = async () => {
    if (!customVideoIdea.trim()) return;
    setIsSubmittingVideo(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmittingVideo(false);
    setVideoIdeaSubmitted(true);
    setCustomVideoIdea('');
    setTimeout(() => setVideoIdeaSubmitted(false), 5000);
  };

  const handleFacelessSubmit = async () => {
    if (!facelessIdea.trim()) return;
    setIsSubmittingFaceless(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmittingFaceless(false);
    setFacelessSubmitted(true);
    setFacelessIdea('');
    setTimeout(() => setFacelessSubmitted(false), 5000);
  };

  const handleCustomIdeaSubmit = async () => {
    if (!customIdea.trim()) return;
    setIsSubmittingIdea(true);
    // Simulate AI processing custom design concept
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmittingIdea(false);
    setIdeaSubmitted(true);
    setCustomIdea('');
    fetchUsage();
    setTimeout(() => setIdeaSubmitted(false), 5000);
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
            {(empireData?.name === 'HOME BASE' || empireData?.title === 'HOME BASE' || empireData?.name === 'Business 1' || !empireData?.name) ? "EmpireLaunch AI" : (empireData?.name || empireData?.title)}
          </h1>
        </div>

        {/* Usage Quota Overview */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-theme-surface border-2 border-theme rounded-[24px] p-5 flex flex-col gap-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Video className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-foreground">{usage?.customize?.remaining ?? 14}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Available</span>
                <div className="relative ml-1">
                  <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                    <p className="font-black text-white uppercase tracking-widest mb-1">Weekly Video Quota</p>
                    Your 14 weekly video slots reset every {usage?.customize?.nextReset || '7 days'}. Unused slots do not roll over. Resets are synchronized with your signup time.
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Weekly Video Slots</div>
          </div>

          <div className="bg-theme-surface border-2 border-theme rounded-[24px] p-5 flex flex-col gap-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-foreground">{usage?.neural?.remaining ?? 14}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Available</span>
                <div className="relative ml-1">
                  <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                    <p className="font-black text-white uppercase tracking-widest mb-1">Neural Twin Quota</p>
                    Your 14 weekly Neural Twin slots reset every {usage?.neural?.nextReset || '7 days'}. Unused slots do not roll over. Resets are synchronized with your signup time.
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Weekly Twin Slots</div>
          </div>

          <div className="bg-theme-surface border-2 border-theme rounded-[24px] p-5 flex flex-col gap-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                <Palette className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-foreground">{usage?.design?.remaining ?? 50}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Available</span>
                <div className="relative ml-1">
                  <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                    <p className="font-black text-white uppercase tracking-widest mb-1">Monthly Design Quota</p>
                    Your 50 monthly design slots reset every {usage?.design?.nextReset || '30 days'}. Unused slots do not roll over. Resets occur on the same day of the month as your initial subscription.
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Monthly Design Slots</div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 animate-in fade-in duration-1000">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* 1. Customize Video Box */}
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4 relative">
                {usage?.customize && (
                  <div className="absolute top-6 right-6 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    {(typeof usage.customize.limit === 'number' ? usage.customize.limit : 0) - usage.customize.remaining}/{usage.customize.limit}
                    <Info className="w-3 h-3 text-slate-600 cursor-help" title={`Your weekly slots reset every ${usage.customize.nextReset || '7 days'}. Unused slots do not roll over.`} />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center">
                    <MonitorPlay className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-sm uppercase tracking-tight italic">Customize Video</h3>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                      Direct the AI — define your style, pace, and visual narrative
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={customVideoIdea}
                    onChange={(e) => setCustomVideoIdea(e.target.value)}
                    placeholder="e.g. A 15-second high-energy product reveal for TikTok, fast cuts, vibrant neon overlays, focused on the 'Midnight Black' edition..."
                    disabled={isSubmittingVideo}
                    className="w-full bg-theme-background border border-theme rounded-2xl p-4 pr-12 text-xs font-medium outline-none focus:border-white/40 transition-all min-h-[100px] text-foreground placeholder:text-slate-600 resize-none"
                  />
                  <button
                    onClick={handleCustomVideoSubmit}
                    disabled={!customVideoIdea.trim() || isSubmittingVideo}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isSubmittingVideo ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <SendHorizonal className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {videoIdeaSubmitted && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Video directive received — generating visual storyboard</span>
                  </motion.div>
                )}

                <InlineConsultant context="video" />
              </div>

              {/* 2. Upload Video Box for Edits */}
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-sm uppercase tracking-tight italic">AI Video Editor</h3>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                      Upload raw clips — I'll apply the Empire Polish (Cuts, Captions, Music)
                    </p>
                  </div>
                </div>

                <FileUploadDropZone
                  type="raw-video"
                  state={rawVideoUpload}
                  onFileSelect={handleRawVideoSelect}
                  onRemove={handleRawVideoRemove}
                  disabled={rawVideoUpload.status === 'uploading' || rawVideoUpload.status === 'processing'}
                />

                <InlineConsultant context="editor" />
              </div>

              {/* 3. Faceless Content Creation Box */}
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Clapperboard className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-sm uppercase tracking-tight italic">Faceless Empire Builder</h3>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                      Generate viral faceless videos — you provide the niche, I provide the vision
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={facelessIdea}
                    onChange={(e) => setFacelessIdea(e.target.value)}
                    placeholder="e.g. 5 viral facts about 'Sustainable Living' for YouTube Shorts, stock footage background, lo-fi beats, clean minimal captions..."
                    disabled={isSubmittingFaceless}
                    className="w-full bg-theme-background border border-theme rounded-2xl p-4 pr-12 text-xs font-medium outline-none focus:border-white/40 transition-all min-h-[100px] text-foreground placeholder:text-slate-600 resize-none"
                  />
                  <button
                    onClick={handleFacelessSubmit}
                    disabled={!facelessIdea.trim() || isSubmittingFaceless}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isSubmittingFaceless ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <SendHorizonal className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {facelessSubmitted && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Faceless concept received — sourcing viral stock material</span>
                  </motion.div>
                )}

                <InlineConsultant context="faceless" />
              </div>

              {/* Custom Design Input — Free-text Idea Entry */}
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4 relative">
                {usage?.design && (
                  <div className="absolute top-6 right-6 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    {(typeof usage.design.limit === 'number' ? usage.design.limit : 0) - usage.design.remaining}/{usage.design.limit}
                    <Info className="w-3 h-3 text-slate-600 cursor-help" title={`Your monthly slots reset every ${usage.design.nextReset || '30 days'}. Unused slots do not roll over.`} />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <PenSquare className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-sm uppercase tracking-tight italic">Custom Design Idea</h3>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                      Describe your concept — I'll synthesize it with market-winning DNA
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={customIdea}
                    onChange={(e) => setCustomIdea(e.target.value)}
                    placeholder="e.g. A minimalist sage-green yoga mat with gold mandala print, 72x24 inches, boho-luxe aesthetic..."
                    disabled={isSubmittingIdea}
                    className="w-full bg-theme-background border border-theme rounded-2xl p-4 pr-12 text-xs font-medium outline-none focus:border-amber-400/50 transition-all min-h-[100px] text-foreground placeholder:text-slate-600 resize-none"
                  />
                  <button
                    onClick={handleCustomIdeaSubmit}
                    disabled={!customIdea.trim() || isSubmittingIdea}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmittingIdea ? (
                      <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    ) : (
                      <SendHorizonal className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {ideaSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                      Design concept received — injecting into Neural Synthesis pipeline
                    </span>
                  </motion.div>
                )}

                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-600">
                  <Lightbulb className="w-3 h-3" />
                  <span>Tip: Be specific about colors, materials, dimensions, and target platform</span>
                </div>

                <InlineConsultant context="design" />
              </div>

              {/* Neural Twin Section - Single Box with Active Badge */}
              <div className="relative bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-6">
                <div className="absolute top-6 right-6 flex items-center gap-3">
                  {usage?.neural && (
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      {(typeof usage.neural.limit === 'number' ? usage.neural.limit : 0) - usage.neural.remaining}/{usage.neural.limit}
                      <Info className="w-3 h-3 text-slate-600 cursor-help" title={`Your weekly slots reset every ${usage.neural.nextReset || '7 days'}. Unused slots do not roll over.`} />
                    </div>
                  )}
                  {facialDnaUpload.status === 'complete' && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest text-shadow-glow">active</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <Stars className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white italic">Neural Twin.</h3>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">Perfect Lip-Sync AI Video</p>
                  </div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed italic max-w-2xl">
                  "Upload a clear photo of yourself, and I'll create your Neural Twin. I can then generate high-fidelity marketing videos with perfect lip-syncing for any script you provide."
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
                    </motion.div>
                  )}

                  <button
                    onClick={handleSynthesizeTwin}
                    disabled={facialDnaUpload.status !== 'complete'}
                    className="w-full max-w-sm mx-auto flex justify-center py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {facialDnaUpload.status === 'complete' ? 'Synthesize Twin Double' : 'Upload a photo first'}
                  </button>
                </div>

                <InlineConsultant context="neural-twin" />
              </div>

              {/* Production Logs Section */}
              <AIRenderLog
                logs={renderLogs}
                isProcessing={isRendering}
                type={activeRenderType}
                onClear={handleClearLogs}
              />
            </motion.div>
          </div>

          {/* Version Verification */}
          <div className="flex justify-center pb-20 pt-12">
            <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest opacity-30">
              Command Center v3.0.2 (Neural Sync Active)
            </span>
          </div>
        </div>
      </div>
  );
}
