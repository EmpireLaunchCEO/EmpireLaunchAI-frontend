"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { API_URL } from '@/lib/config';

import { BarChart3, PenSquare, Lightbulb, SendHorizonal, Scissors, MonitorPlay, Clapperboard, Info } from 'lucide-react';

export default function StudioPage() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { activeEmpire: empireData, registerRefreshHandler } = useEmpire();
  const [userNiche, setUserNiche] = useState<string>('');

  const isCatalyst = empireData?.archetype === 'CATALYST';

  // Fetch user's business niche from onboarding settings
  useEffect(() => {
    const fetchUserNiche = async () => {
      try {
        const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
        if (!userId) return;
        const res = await fetch(`${API_URL}/api/settings/`, {
          headers: {
            'Authorization': 'Bearer mock-mobile-token',
            'x-user-id': userId
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUserNiche(data.businessNiche || data.niche || data.business_angle || '');
        }
      } catch (e) {
        // Silently fail
      }
    };
    fetchUserNiche();
  }, []);

  const handleRefresh = React.useCallback(async () => {
    await new Promise(r => setTimeout(r, 1000));
  }, []);

  React.useEffect(() => {
    return registerRefreshHandler(handleRefresh);
  }, [registerRefreshHandler, handleRefresh]);

  // Upload states
  const [facialDnaUpload, setFacialDnaUpload] = useState<UploadState>({ file: null, preview: null, status: 'idle', progress: 0 });
  const [rawVideoUpload, setRawVideoUpload] = useState<UploadState>({ file: null, preview: null, status: 'idle', progress: 0 });
  const [designUpload, setDesignUpload] = useState<UploadState>({ file: null, preview: null, status: 'idle', progress: 0 });
  const [facelessVideoUpload, setFacelessVideoUpload] = useState<UploadState>({ file: null, preview: null, status: 'idle', progress: 0 });
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
      
      const response = await fetch(`${API_URL}/api/cinema/upload-photo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setFacialDnaUpload(prev => ({ ...prev, status: 'complete', progress: 100, metadata: data }));
      
      // Fetch real creations from backend instead of mock logs
      try {
        const creationsRes = await fetch(`${API_URL}/api/cinema/creations?userId=${localStorage.getItem('empire_userId')}`, {
          headers: { 'x-user-id': localStorage.getItem('empire_userId') || '' }
        });
        if (creationsRes.ok) {
          const creationsData = await creationsRes.json();
          if (creationsData.creations?.length > 0) {
            const realLogs = creationsData.creations.map((c: any, i: number) => ({
              id: c.id,
              timestamp: new Date(c.createdAt).toLocaleTimeString(),
              action: c.type === 'facial_dna' ? 'Facial Photo Upload' : c.type === 'raw_video' ? 'Video Upload' : 'Creation',
              status: c.status === 'completed' ? 'success' as const : c.status === 'processing' ? 'processing' as const : 'error' as const,
              details: c.title || c.type,
              type: c.type,
              creationId: c.id,
            }));
            setRenderLogs(realLogs);
          } else {
            setRenderLogs(generateMockRenderLogs('facial-dna'));
          }
        } else {
          setRenderLogs(generateMockRenderLogs('facial-dna'));
        }
      } catch {
        setRenderLogs(generateMockRenderLogs('facial-dna'));
      }
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
      
      const response = await fetch(`${API_URL}/api/cinema/upload-video`, {
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

  // Handle Faceless Video file selection
  const handleFacelessVideoSelect = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setFacelessVideoUpload({ file, preview, status: 'selected', progress: 0 });

    const formData = new FormData();
    formData.append('video', file);

    try {
      setFacelessVideoUpload(prev => ({ ...prev, status: 'uploading', progress: 10 }));

      const response = await fetch(`${API_URL}/api/cinema/upload-video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFacelessVideoUpload(prev => ({ ...prev, status: 'complete', progress: 100, metadata: data }));
    } catch (error) {
      console.error('Faceless video upload error:', error);
      setFacelessVideoUpload(prev => ({ ...prev, status: 'error' }));
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

  // Handle Design Image file selection
  const handleDesignSelect = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setDesignUpload({ file, preview, status: 'selected', progress: 0 });
    
    const formData = new FormData();
    formData.append('photo', file);

    try {
      setDesignUpload(prev => ({ ...prev, status: 'uploading', progress: 10 }));
      
      const response = await fetch(`${API_URL}/api/cinema/upload-photo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setDesignUpload(prev => ({ ...prev, status: 'complete', progress: 100, metadata: data }));
    } catch (error) {
      console.error('Design upload error:', error);
      setDesignUpload(prev => ({ ...prev, status: 'error' }));
    }
  };

  // Remove Design Image file
  const handleDesignRemove = () => {
    if (designUpload.preview) URL.revokeObjectURL(designUpload.preview);
    setDesignUpload({ file: null, preview: null, status: 'idle', progress: 0 });
  };

  // Usage state
  const [usage, setUsage] = useState<{
    neural: { remaining: number; limit: number | string; nextReset?: string };
    customize: { remaining: number; limit: number | string; nextReset?: string };
    enhanced: { remaining: number | string; limit: number | string };
    design: { remaining: number; limit: number | string; nextReset?: string };
  } | null>(null);

  const fetchUsage = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cinema/usage`);
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
          enhanced: { remaining: data.enhanced?.remaining ?? '∞', limit: data.enhanced?.limit ?? '∞' },
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
      const response = await fetch(`${API_URL}/api/cinema/create-twin`, {
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
  const [videoIdeaSubmitted, setVideoIdeaSubmitted] = useState(false);

  const [facelessIdea, setFacelessIdea] = useState('');
  const [isSubmittingFaceless, setIsSubmittingFaceless] = useState(false);
  const [facelessSubmitted, setFacelessSubmitted] = useState(false);

  // Shared idea for Consultant review flow
  const [sharedVideoIdea, setSharedVideoIdea] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenerated, setVideoGenerated] = useState(false);

  // Handle Custom Video: Send idea to Consultant for review instead of directly generating
  const handleCustomVideoSubmit = () => {
    if (!customVideoIdea.trim()) return;
    // Send the idea to the Consultant for review/refinement
    setSharedVideoIdea(customVideoIdea.trim());
    setCustomVideoIdea('');
    setVideoGenerated(false);
  };

  // Called by InlineConsultant's "Generate Video" button after refinement
  const handleGenerateVideo = async (finalIdea: string) => {
    setIsGeneratingVideo(true);
    setRenderLogs([]);
    setIsRendering(true);
    setActiveRenderType('facial-dna');

    // Add initial render log
    const addLog = (action: string, status: 'processing' | 'success' | 'error' = 'processing', details?: string) => {
      setRenderLogs(prev => [...prev, {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        action,
        status,
        details: details || '',
        type: 'creation',
      }]);
    };

    addLog('Consultant Review', 'processing', 'Refining creative direction...');
    await new Promise(r => setTimeout(r, 1000));

    try {
      const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
      const niche = userNiche || empireData?.niche || 'general';
      const angle = empireData?.angle || 'trending';

      addLog('Concept Finalization', 'processing', `Finalizing: ${finalIdea.substring(0, 60)}...`);
      await new Promise(r => setTimeout(r, 800));

      // Call the full creation pipeline
      addLog('AI Content Generation', 'processing', 'Generating visuals and script...');
      const res = await fetch(`${API_URL}/api/studio/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token',
          'x-user-id': userId
        },
        body: JSON.stringify({
          niche,
          angle,
          styleDna: {
            colors: ['#FF6B6B', '#4ECDC4', '#FFFFFF', '#2C3E50'],
            fonts: { headline: 'Montserrat Bold', body: 'Open Sans Regular' },
            hooks: ['Trending Now', 'You Need To See This', 'Game Changer'],
            keywords: [niche, 'viral', 'trending', 'creative'],
            tone: 'energetic_persuasive'
          },
          platforms: ['tiktok', 'instagram'],
          title: finalIdea.substring(0, 80),
          description: finalIdea
        })
      });

      if (res.ok) {
        const data = await res.json();
        addLog('Creation Complete', 'success', data.assetId ? `Asset: ${data.assetId}` : 'Video created successfully');
        setIsGeneratingVideo(false);
        setVideoGenerated(true);
        setCreatedAssetId(data.assetId || null);
        setTimeout(() => {
          setVideoGenerated(false);
          setIsRendering(false);
        }, 12000);
        return;
      }

      // Pipeline failed — show error, no placeholder
      const errorText = await res.text().catch(() => 'Pipeline error');
      throw new Error(errorText);
    } catch (error) {
      console.error('Video pipeline failed:', error);
      addLog('Creation Failed', 'error', 'Video generation could not complete. Please try again.');
      setIsGeneratingVideo(false);
      setVideoGenerated(false);
      setIsRendering(false);
    }
  };

  // State for tracking created asset
  const [createdAssetId, setCreatedAssetId] = useState<string | null>(null);

  const handleFacelessSubmit = async () => {
    if (!facelessIdea.trim()) return;
    setIsSubmittingFaceless(true);
    try {
      const userId = localStorage.getItem('empire_userId');
      const res = await fetch(`${API_URL}/api/approval/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token',
          'x-user-id': userId || ''
        },
        body: JSON.stringify({
          type: 'faceless',
          description: facelessIdea.trim(),
          payload: { category: 'faceless-video', isCatalyst: isCatalyst }
        })
      });
      if (!res.ok) throw new Error('Approval creation failed');
      const data = await res.json();
      console.log('Faceless approval created:', data);
      setIsSubmittingFaceless(false);
      setFacelessSubmitted(true);
      setFacelessIdea('');
      setTimeout(() => setFacelessSubmitted(false), 5000);
    } catch (error) {
      console.error('Faceless approval error:', error);
      setIsSubmittingFaceless(false);
    }
  };

  const handleCustomIdeaSubmit = async () => {
    if (!customIdea.trim()) return;
    setIsSubmittingIdea(true);
    try {
      const userId = localStorage.getItem('empire_userId');
      const res = await fetch(`${API_URL}/api/approval/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-mobile-token',
          'x-user-id': userId || ''
        },
        body: JSON.stringify({
          type: 'design',
          description: customIdea.trim(),
          payload: {
            category: 'custom-design',
            hasUpload: designUpload.status === 'complete' || designUpload.status === 'selected',
            uploadPreview: designUpload.preview
          }
        })
      });
      if (!res.ok) throw new Error('Approval creation failed');
      const data = await res.json();
      console.log('Design approval created:', data);
      setIsSubmittingIdea(false);
      setIdeaSubmitted(true);
      setCustomIdea('');
      fetchUsage();
      setTimeout(() => setIdeaSubmitted(false), 5000);
    } catch (error) {
      console.error('Design approval error:', error);
      setIsSubmittingIdea(false);
    }
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
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* 1. Customize Video Box */}
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4 relative group">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                    <span className="text-[10px] font-black text-primary">{usage?.customize?.remaining ?? 0}</span>
                    <span className="text-[9px] font-black text-slate-400">/</span>
                    <span className="text-[9px] font-black text-slate-500">{usage?.customize?.limit ?? 14}</span>
                  </div>
                  <div className="relative">
                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                    <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                      <p className="font-black text-white uppercase tracking-widest mb-1">Weekly Video Quota</p>
                      Your 14 weekly video slots reset every {usage?.customize?.nextReset || '7 days'}. Unused slots do not roll over. Resets are synchronized with your signup time.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center">
                    <MonitorPlay className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-sm uppercase tracking-tight italic">{isCatalyst ? "High-Conversion Video" : "Customize Video"}</h3>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                      {isCatalyst ? "Direct the AI — define your hooks, calls-to-action, and marketing flow" : "Direct the AI — define your style, pace, and visual narrative"}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={customVideoIdea}
                    onChange={(e) => setCustomVideoIdea(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCustomVideoSubmit(); } }}
                    placeholder={isCatalyst ? "e.g. A 15-second high-energy hook for my Daily Pay offer, emphasizing $300/day potential, fast cuts, urgent CTA..." : "e.g. A 15-second high-energy product reveal for TikTok, fast cuts, vibrant neon overlays..."}
                    disabled={isGeneratingVideo}
                    className="w-full bg-theme-background border border-theme rounded-2xl p-4 pr-12 text-xs font-medium outline-none focus:border-white/40 transition-all min-h-[100px] text-foreground placeholder:text-slate-600 resize-none"
                  />
                  <button
                    onClick={handleCustomVideoSubmit}
                    disabled={!customVideoIdea.trim() || isGeneratingVideo}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <SendHorizonal className="w-4 h-4" />
                  </button>
                </div>

                {videoGenerated && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">Video Generation Started</p>
                        <p className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-wider mt-0.5">Ready in ~2 minutes — check Operations</p>
                      </div>
                    </div>
                    {createdAssetId && (
                      <Link href="/empire-center" className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all">
                        <ChevronRight className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider">Go to Operations to View</span>
                      </Link>
                    )}
                  </motion.div>
                )}

                {!videoGenerated && (
                  <InlineConsultant context={isCatalyst ? "catalyst-video" : "video"} idea={sharedVideoIdea} onGenerate={handleGenerateVideo} />
                )}
              </div>

              {/* 2. Upload Video Box for Edits */}
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4 relative group">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                    <span className="text-[10px] font-black text-primary">{usage?.enhanced?.remaining ?? '∞'}</span>
                    <span className="text-[9px] font-black text-slate-400">/</span>
                    <span className="text-[9px] font-black text-slate-500">{usage?.enhanced?.limit ?? '∞'}</span>
                  </div>
                  <div className="relative">
                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                    <div className="absolute bottom-full right-0 mb-3 w-48 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                      <p className="font-black text-white uppercase tracking-widest mb-1">Video Edits</p>
                      Unlimited AI video enhancements. No quota restrictions.
                    </div>
                  </div>
                </div>
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
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4 relative group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Clapperboard className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-sm uppercase tracking-tight italic">Faceless Empire Builder</h3>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                      {isCatalyst ? "Generate viral faceless marketing — speak to their pain points" : "Generate viral faceless videos — you provide the niche, I provide the vision"}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={facelessIdea}
                    onChange={(e) => setFacelessIdea(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFacelessSubmit(); } }}
                    placeholder={isCatalyst ? "e.g. 3 reasons why most 9-5s are a trap, high-impact b-roll, professional voiceover, strong 'Link in Bio' CTA..." : "e.g. 5 viral facts about 'Sustainable Living' for YouTube Shorts..."}
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

                {/* Upload video for faceless */}
                <div className="pt-2">
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-2">Or upload your own video footage</p>
                  <FileUploadDropZone
                    type="raw-video"
                    onFileSelect={handleFacelessVideoSelect}
                    onRemove={() => setFacelessVideoUpload({ file: null, preview: null, status: 'idle', progress: 0 })}
                    state={facelessVideoUpload}
                    disabled={isSubmittingFaceless}
                  />
                </div>

                <InlineConsultant context="faceless" />
              </div>

              {/* Custom Design Input — Free-text Idea Entry */}
              <div className={cn(
                "bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4 relative group",
                isCatalyst ? "opacity-40 grayscale pointer-events-none overflow-hidden" : ""
              )}>
                {isCatalyst && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/40 backdrop-blur-[1px]">
                    <div className="bg-slate-900 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
                      <Shield className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Locked for Catalyst Archetype</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                    <span className="text-[10px] font-black text-primary">{usage?.design?.remaining ?? 0}</span>
                    <span className="text-[9px] font-black text-slate-400">/</span>
                    <span className="text-[9px] font-black text-slate-500">{usage?.design?.limit ?? 50}</span>
                  </div>
                  <div className="relative">
                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                    <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                      <p className="font-black text-white uppercase tracking-widest mb-1">Monthly Design Quota</p>
                      Your 50 monthly design slots reset every {usage?.design?.nextReset || '30 days'}. Unused slots do not roll over. Resets occur on the same day of the month as your initial subscription.
                    </div>
                  </div>
                </div>
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

                {/* Design Image Upload */}
                <div className="space-y-3">
                  <FileUploadDropZone
                    type="facial-dna"
                    state={designUpload}
                    onFileSelect={handleDesignSelect}
                    onRemove={handleDesignRemove}
                    disabled={designUpload.status === 'uploading'}
                  />
                  {designUpload.preview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-500/30 mx-auto"
                    >
                      <img src={designUpload.preview} alt="Uploaded design" className="w-full h-full object-cover" />
                    </motion.div>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    value={customIdea}
                    onChange={(e) => setCustomIdea(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCustomIdeaSubmit(); } }}
                    placeholder={designUpload.preview ? "Tell me what changes you want, or ask me to create 5 unique variations based on this design" : "e.g. A minimalist sage-green yoga mat with gold mandala print, 72x24 inches, boho-luxe aesthetic..."}
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
              <div className="relative bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-6 group">
                <div className="absolute top-6 right-6 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                      <span className="text-[10px] font-black text-primary">{usage?.neural?.remaining ?? 0}</span>
                      <span className="text-[9px] font-black text-slate-400">/</span>
                      <span className="text-[9px] font-black text-slate-500">{usage?.neural?.limit ?? 14}</span>
                    </div>
                    <div className="relative">
                      <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                      <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                        <p className="font-black text-white uppercase tracking-widest mb-1">Neural Twin Quota</p>
                        Your 14 weekly Neural Twin slots reset every {usage?.neural?.nextReset || '7 days'}. Unused slots do not roll over. Resets are synchronized with your signup time.
                      </div>
                    </div>
                  </div>
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
