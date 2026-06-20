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
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';
import { EmpireAIChatBox } from '@/components/Dashboard/EmpireAIChatBox';

import { FileUploadDropZone, UploadState } from '@/components/Dashboard/FileUploadDropZone';
import { AIRenderLog, generateMockRenderLogs, RenderLogEntry } from '@/components/Dashboard/AIRenderLog';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { useEmpire } from '@/lib/EmpireContext';

import { BarChart3, PenSquare, Lightbulb, SendHorizonal, Scissors, MonitorPlay, Clapperboard } from 'lucide-react';

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

        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 animate-in fade-in duration-1000">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <EmpireAIChatBox className="max-w-6xl mx-auto" />
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* 1. Customize Video Box */}
              <div className="bg-theme-surface border-2 border-theme hover:border-primary/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <MonitorPlay className="w-5 h-5 text-blue-400" />
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
                    className="w-full bg-theme-background border border-theme rounded-2xl p-4 pr-12 text-xs font-medium outline-none focus:border-blue-400/50 transition-all min-h-[100px] text-foreground placeholder:text-slate-600 resize-none"
                  />
                  <button
                    onClick={handleCustomVideoSubmit}
                    disabled={!customVideoIdea.trim() || isSubmittingVideo}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isSubmittingVideo ? (
                      <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
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
              </div>

              {/* 2. Upload Video Box for Edits */}
              <div className="bg-theme-surface border-2 border-white hover:border-primary/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4">
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
              </div>

              {/* 3. Faceless Content Creation Box */}
              <div className="bg-theme-surface border-2 border-theme hover:border-primary/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4">
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
                    className="w-full bg-theme-background border border-theme rounded-2xl p-4 pr-12 text-xs font-medium outline-none focus:border-emerald-400/50 transition-all min-h-[100px] text-foreground placeholder:text-slate-600 resize-none"
                  />
                  <button
                    onClick={handleFacelessSubmit}
                    disabled={!facelessIdea.trim() || isSubmittingFaceless}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isSubmittingFaceless ? (
                      <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
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
              </div>

              {/* Custom Design Input — Free-text Idea Entry */}
              <div className="bg-theme-surface border-2 border-theme hover:border-primary/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4">
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
              </div>

              {/* Neural Twin Section - Moved from Cinema Hub */}
              <div className="flex flex-col md:flex-row gap-8 items-stretch">
                <div className="flex-1 p-6 md:p-8 bg-theme-surface border-2 border-theme hover:border-primary/30 transition-all rounded-[32px] md:rounded-[40px] space-y-6">
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
                      className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {facialDnaUpload.status === 'complete' ? 'Synthesize Twin Double' : 'Upload a photo first'}
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 bg-theme-surface border border-theme rounded-[32px] md:rounded-[40px] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Video className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-white uppercase italic">Twin Active.</h4>
                  <p className="text-sm text-slate-400">
                    Once your Twin is synthesized, you can generate cinematic clips instantly.
                  </p>
                </div>
              </div>

              {/* Suggestion Bubbles - FORCED VERTICAL */}
              <div className="flex flex-col gap-2">
                <SuggestionBubbles onSelect={handleSuggestion} />
              </div>

              {/* Inspiration Gallery */}
              <InspirationGallery />

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
