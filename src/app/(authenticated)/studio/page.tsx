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
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DNAVaultCounter } from '@/components/Dashboard/DNAVaultCounter';
import { FeedbackBox } from '@/components/Dashboard/FeedbackChannel';
import { FileUploadDropZone, UploadState } from '@/components/Dashboard/FileUploadDropZone';
import { InlineConsultant } from '@/components/Studio/InlineConsultant';
import { VideoProjectProgress } from '@/components/Studio/VideoProjectProgress';
import { PullToRefresh } from '@/components/Dashboard/PullToRefresh';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';

import { PenSquare, Lightbulb, SendHorizonal, Scissors, Clapperboard, Info } from 'lucide-react';

// Video mood/atmosphere options, shared by the Faceless, Scene-Based and Neural
// Twin boxes (owner-locked set of exactly seven lowercase keys — do NOT
// add/remove, no default/'auto'; backend validates this set). Default mood is
// 'energetic'.
const VIDEO_MOODS = [
  { value: 'energetic', label: 'Energetic' },
  { value: 'sad', label: 'Sad' },
  { value: 'calm', label: 'Calm' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'playful', label: 'Playful / Funny' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'inspiring', label: 'Inspiring' },
] as const;

const getAuthHeader = (): string => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('empire_auth_token');
    if (!token) { token = crypto.randomUUID(); localStorage.setItem('empire_auth_token', token); }
    return `Bearer ${token}`;
  }
  return 'Bearer ';
};

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
            'Authorization': getAuthHeader(),
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
  const [activeRenderType, setActiveRenderType] = useState<'facial-dna' | 'raw-video'>('facial-dna');
  // Shared voiceover + duration + screenshot controls (Scene / Faceless).
  // Backend-supported: gender female|male, tone enthusiastic|calm|serious|warm|auto.
  const [facelessVoice, setFacelessVoice] = useState<'female' | 'male' | 'auto'>('auto');
  const [facelessTone, setFacelessTone] = useState<'enthusiastic' | 'calm' | 'serious' | 'warm' | 'auto'>('auto');
  const [facelessMood, setFacelessMood] = useState<string>('energetic');
  const [facelessDuration, setFacelessDuration] = useState<number>(15);
  const [facelessUpload, setFacelessUpload] = useState<UploadState>({ file: null, preview: null, status: 'idle', progress: 0 });
  const [sceneUpload, setSceneUpload] = useState<UploadState>({ file: null, preview: null, status: 'idle', progress: 0 });

  // Handle Facial DNA file selection
  const handleFacialDnaSelect = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setFacialDnaUpload({ file, preview, status: 'selected', progress: 0 });
    
    const formData = new FormData();
    formData.append('photo', file);

    try {
      setFacialDnaUpload(prev => ({ ...prev, status: 'uploading', progress: 10 }));

      const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
      const response = await fetch(`${API_URL}/api/cinema/upload-photo`, {
        method: 'POST',
        headers: { 'Authorization': getAuthHeader(), 'x-user-id': userId },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setFacialDnaUpload(prev => ({ ...prev, status: 'complete', progress: 100, metadata: data }));
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

      const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
      const response = await fetch(`${API_URL}/api/cinema/upload-video`, {
        method: 'POST',
        headers: { 'Authorization': getAuthHeader(), 'x-user-id': userId },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setRawVideoUpload(prev => ({ ...prev, status: 'complete', progress: 100, metadata: data }));
      
      setActiveRenderType('raw-video');
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

  // Handle Design Image file selection
  const handleDesignSelect = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setDesignUpload({ file, preview, status: 'selected', progress: 0 });
    
    const formData = new FormData();
    formData.append('photo', file);

    try {
      setDesignUpload(prev => ({ ...prev, status: 'uploading', progress: 10 }));

      const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
      const response = await fetch(`${API_URL}/api/cinema/upload-photo`, {
        method: 'POST',
        headers: { 'Authorization': getAuthHeader(), 'x-user-id': userId },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      // upload-photo returns the stored R2/photo path — normalize it (like
      // handleSourceImageSelect) so handleCustomIdeaSubmit can send the real
      // URL to the backend instead of a local blob preview.
      const photoUrl = data?.photoUrl || data?.fileUrl || data?.url || '';
      setDesignUpload(prev => ({ ...prev, status: 'complete', progress: 100, metadata: { ...data, photoUrl } }));
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

  // Generic source-image (screenshot) upload shared by Customize / Faceless / Scene.
  const handleSourceImageSelect = async (file: File, setter: (s: UploadState) => void) => {
    const preview = URL.createObjectURL(file);
    setter({ file, preview, status: 'selected', progress: 0 });
    const formData = new FormData();
    formData.append('photo', file);
    try {
      setter(prev => ({ ...prev, status: 'uploading', progress: 10 }));
      const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
      const res = await fetch(`${API_URL}/api/cinema/upload-photo`, {
        method: 'POST',
        headers: { 'Authorization': getAuthHeader(), 'x-user-id': userId },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const photoUrl = data?.photoUrl || data?.fileUrl || data?.url || '';
      setter(prev => ({ ...prev, status: 'complete', progress: 100, metadata: { ...data, photoUrl } }));
    } catch (error) {
      console.error('Source image upload error:', error);
      setter(prev => ({ ...prev, status: 'error' }));
    }
  };
  const handleSourceImageRemove = (setter: (s: UploadState) => void, state: UploadState) => {
    if (state.preview) URL.revokeObjectURL(state.preview);
    setter({ file: null, preview: null, status: 'idle', progress: 0 });
  };
  // Usage state
  const [usage, setUsage] = useState<{
    neural: { remaining: number; limit: number | string; nextReset?: string };
    customize: { remaining: number; limit: number | string; nextReset?: string };
    enhanced: { remaining: number | string; limit: number | string };
    design: { remaining: number; limit: number | string; nextReset?: string };
    faceless: { remaining: number | string; limit: number | string; nextReset?: string };
  } | null>(null);

  const fetchUsage = async () => {
    try {
      const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
      const response = await fetch(`${API_URL}/api/cinema/usage`, {
        headers: { 'Authorization': getAuthHeader(), 'x-user-id': userId }
      });
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
          design: { ...data.design, nextReset: formatReset(data.design.nextReset) },
          faceless: { ...data.faceless, nextReset: formatReset(data.faceless?.nextReset) }
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
  const [twinStatus, setTwinStatus] = useState<'idle' | 'synthesizing' | 'done' | 'error'>('idle');
  const [twinError, setTwinError] = useState<string | null>(null);
  const [twinMood, setTwinMood] = useState<string>('energetic');

  const handleSynthesizeTwin = async () => {
    if (facialDnaUpload.status !== 'complete') return;

    setActiveRenderType('facial-dna');
    setTwinStatus('synthesizing');
    setTwinError(null);

    try {
      const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
      // upload-photo returns the stored path under `photoUrl` (not `path`) — the
      // backend requires photoPath OR photoUrl, so send whichever is present.
      const photoRef = facialDnaUpload.metadata?.photoUrl || facialDnaUpload.metadata?.path || facialDnaUpload.metadata?.fileUrl;
      const response = await fetch(`${API_URL}/api/cinema/create-twin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
          'x-user-id': userId
        },
        body: JSON.stringify({
          userId, // Real user — twin must land in THIS user's Library/Operations
          photoUrl: photoRef,
          photoPath: photoRef,
          mood: twinMood,
          script: "Welcome to my Empire! This is my Neural Twin double, ready to market 24/7.",
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Synthesis failed');
      }
      const data = await response.json();
      console.log('Twin created:', data);
      if (data?.asset?.status === 'failed' && data?.asset?.error) {
        throw new Error(data.asset.error);
      }
      fetchUsage();
      setTwinStatus('done');
    } catch (error) {
      console.error('Twin synthesis error:', error);
      setTwinError(error instanceof Error ? error.message : 'Neural Twin synthesis failed. Please try again.');
      setTwinStatus('error');
    }
  };

  // AI Video Editor — Empire Polish (Cuts, Captions, Music)
  const [editStatus, setEditStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [editError, setEditError] = useState<string | null>(null);

  const handleEnhanceVideo = async (_finalIdea: string) => {
    if (rawVideoUpload.status !== 'complete' || !rawVideoUpload.metadata?.videoUrl) {
      setEditError('Upload a raw video clip first — then tap the wand to apply the Empire Polish.');
      setEditStatus('error');
      return;
    }
    setEditStatus('processing');
    setEditError(null);
    try {
      const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
      const res = await fetch(`${API_URL}/api/cinema/enhance-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
          'x-user-id': userId
        },
        body: JSON.stringify({
          userId,
          videoPath: rawVideoUpload.metadata.videoUrl
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Enhancement failed');
      }
      const data = await res.json();
      if (data?.asset?.status === 'failed' && data?.asset?.error) {
        throw new Error(data.asset.error);
      }
      setEditStatus('done');
      fetchUsage();
    } catch (error) {
      console.error('Enhance error:', error);
      setEditError(error instanceof Error ? error.message : 'Video enhancement failed. Please try again.');
      setEditStatus('error');
    }
  };

  const startDemo = () => {
    setIsDemoMode(true);
    // Demo mode logic without harvestActivity
  };

  // Custom design idea input state
  const [customIdea, setCustomIdea] = useState('');
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);

  const [facelessIdea, setFacelessIdea] = useState('');
  const [isSubmittingFaceless, setIsSubmittingFaceless] = useState(false);
  const [facelessSubmitted, setFacelessSubmitted] = useState(false);

  // Scene-based video project — the SINGLE video builder (consultant + controls
  // folded in from the removed Customize Video box).
  const [projectTitle, setProjectTitle] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [projectDuration, setProjectDuration] = useState('');
  const [projectVoice, setProjectVoice] = useState<'female' | 'male' | ''>('');
  const [projectTone, setProjectTone] = useState<'enthusiastic' | 'calm' | 'serious' | 'warm' | 'auto' | ''>('');
  const [projectMood, setProjectMood] = useState<string>('energetic');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  // The refined idea surfaced by the AI consultant chat (conversation summary).
  // A "Launch Project" button (not the wand) submits this via the scene engine.
  const [refinedVideoIdea, setRefinedVideoIdea] = useState('');
  // The raw idea to seed the consultant chat (only sent to the AI on explicit
  // Enter/submit — never on every keystroke).
  const [consultantSeed, setConsultantSeed] = useState('');

  // Send the raw textarea idea to the AI consultant for refinement.
  const handleSendToConsultant = () => {
    if (!projectIdea.trim()) return;
    setConsultantSeed(projectIdea.trim());
    setProjectIdea('');
  };

  // Submit the (consultant-refined) video idea through the Scene-Based engine.
  const handleSubmitProject = async (finalIdea?: string) => {
    const ideaToUse = (finalIdea && finalIdea.trim()) || projectIdea.trim();
    if (!ideaToUse || isSubmittingProject) return;
    setIsSubmittingProject(true);
    try {
      const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
      const res = await fetch(`${API_URL}/api/studio/video-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
          'x-user-id': userId
        },
        body: JSON.stringify({
          title: projectTitle.trim() || 'Untitled Project',
          idea: ideaToUse,
          duration: projectDuration ? parseInt(projectDuration) : undefined,
          voice: projectVoice || undefined,
          tone: projectTone || undefined,
          mood: projectMood || undefined,
          sourceImages: sceneUpload.metadata?.photoUrl ? [sceneUpload.metadata.photoUrl] : []
        })
      });
      if (res.ok) {
        const data = await res.json();
        const pid = data.projectId || data.id;
        setActiveProjectId(pid);
        // Persist fast-path entry so Operations can show it while rendering.
        if (pid) {
          try {
            const completed = JSON.parse(localStorage.getItem('empire_completed_projects') || '[]');
            completed.push({ id: pid, url: '', ts: Date.now(), status: 'processing' });
            localStorage.setItem('empire_completed_projects', JSON.stringify(completed.slice(-10)));
          } catch {}
        }
      } else {
        console.error('Scene project creation failed:', await res.text());
      }
    } catch (err) {
      console.error('Failed to create video project:', err);
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleFacelessSubmit = async () => {
    if (!facelessIdea.trim()) return;
    setIsSubmittingFaceless(true);
    try {
      const userId = localStorage.getItem('empire_userId');
      const res = await fetch(`${API_URL}/api/approval/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
          'x-user-id': userId || ''
        },
        body: JSON.stringify({
          type: 'faceless',
          description: facelessIdea.trim(),
          payload: {
            category: 'faceless-video',
            isCatalyst: isCatalyst,
            mood: facelessMood,
            duration: facelessDuration
          },
          voice: facelessVoice === 'auto' ? undefined : facelessVoice,
          tone: facelessTone === 'auto' ? undefined : facelessTone,
          mood: facelessMood,
          duration: facelessDuration,
          sourceImages: facelessUpload.metadata?.photoUrl ? [facelessUpload.metadata.photoUrl] : []
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
          'Authorization': getAuthHeader(),
          'x-user-id': userId || ''
        },
        body: JSON.stringify({
          type: 'design',
          description: customIdea.trim(),
          payload: {
            category: 'custom-design',
            hasUpload: designUpload.status === 'complete' || designUpload.status === 'selected',
            uploadPreview: designUpload.preview
          },
          sourceImages: designUpload.metadata?.photoUrl ? [designUpload.metadata.photoUrl] : []
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
              {/* 1. Scene-Based Video — the single video builder (AI consultant + controls) */}
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4 relative group">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                    <span className="text-[10px] font-black text-primary">{usage?.customize?.remaining ?? 0}</span>
                    <span className="text-[9px] font-black text-slate-400">/</span>
                    <span className="text-[9px] font-black text-slate-500">{usage?.customize?.limit ?? 7}</span>
                  </div>
                  <div className="relative">
                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                    <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                      <p className="font-black text-white uppercase tracking-widest mb-1">Weekly Video Quota</p>
                      Your 7 weekly video slots reset every {usage?.customize?.nextReset || '7 days'}. Unused slots do not roll over. Resets are synchronized with your signup time.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Film className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-sm uppercase tracking-tight italic">Scene-Based Video</h3>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                      AI consultant storyboards your video — vibe, colors, font &amp; background
                    </p>
                  </div>
                </div>

                {!activeProjectId ? (
                  <div className="space-y-3">
                    {/* 1. Duration + voiceover + tone + mood — at the very top, under the header */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Duration, Voice, Tone &amp; Mood (optional)</span>
                      <div className="flex flex-wrap gap-2">
                        <select
                          value={projectDuration}
                          onChange={(e) => setProjectDuration(e.target.value)}
                          className="flex-1 min-w-[90px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                        >
                          <option value="">Auto</option>
                          <option value="30">30 seconds</option>
                          <option value="60">1 min</option>
                          <option value="120">2 min</option>
                          <option value="180">3 min</option>
                        </select>
                        <select
                          value={projectVoice}
                          onChange={(e) => setProjectVoice(e.target.value as 'female' | 'male' | '')}
                          className="flex-1 min-w-[90px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                        >
                          <option value="">Auto gender</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                        </select>
                        <select
                          value={projectTone}
                          onChange={(e) => setProjectTone(e.target.value as any)}
                          className="flex-1 min-w-[110px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                        >
                          <option value="">Auto tone</option>
                          <option value="enthusiastic">Enthusiastic</option>
                          <option value="calm">Calm</option>
                          <option value="serious">Serious</option>
                          <option value="warm">Warm</option>
                        </select>
                        <select
                          value={projectMood}
                          onChange={(e) => setProjectMood(e.target.value)}
                          className="flex-1 min-w-[90px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                        >
                          {VIDEO_MOODS.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* 2. Describe-idea textarea + AI consultant combined (no Project Title box) */}
                    <div className="space-y-3">
                      <div className="relative">
                        <textarea
                          value={projectIdea}
                          onChange={(e) => setProjectIdea(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendToConsultant(); } }}
                          placeholder="Describe your video idea, then press Enter to send it to the AI consultant — it will ask a few sharp questions (with suggestions) and remember what you settle."
                          rows={3}
                          className="w-full bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2.5 pr-12 text-xs text-foreground placeholder:text-slate-600 focus:outline-none focus:border-white/30 resize-none"
                        />
                        <button
                          onClick={handleSendToConsultant}
                          disabled={!projectIdea.trim()}
                          className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          <SendHorizonal className="w-4 h-4" />
                        </button>
                      </div>
                      {/* AI consultant chat — describes, suggests, remembers settled details */}
                      <InlineConsultant context={isCatalyst ? "catalyst-video" : "video"} idea={consultantSeed} onGenerate={handleSubmitProject} suppressWand onRefinedIdea={setRefinedVideoIdea} settledSettings={{ duration: projectDuration, voice: projectVoice, tone: projectTone }} empireContext={{ niche: userNiche || empireData?.niche, angle: empireData?.angle, targetCustomers: empireData?.targetCustomers, businessGoals: empireData?.businessGoals }} />
                    </div>
                    {/* 3. Source image (screenshot) upload */}
                    <div className="space-y-3">
                      <FileUploadDropZone
                        type="source-image"
                        state={sceneUpload}
                        onFileSelect={(file) => handleSourceImageSelect(file, setSceneUpload)}
                        onRemove={() => handleSourceImageRemove(setSceneUpload, sceneUpload)}
                        disabled={sceneUpload.status === 'uploading'}
                      />
                      {sceneUpload.preview && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 mx-auto"
                        >
                          <img src={sceneUpload.preview} alt="Uploaded source" className="w-full h-full object-cover" />
                        </motion.div>
                      )}
                    </div>
                    {/* 4. Launch Project — submits the consultant-refined idea (or the raw text) */}
                    <button
                      onClick={() => handleSubmitProject(refinedVideoIdea || projectIdea)}
                      disabled={!projectIdea.trim() && !refinedVideoIdea || isSubmittingProject}
                      className="w-full px-4 py-2.5 rounded-xl bg-primary text-slate-950 font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isSubmittingProject ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        'Launch Project'
                      )}
                    </button>
                  </div>
                ) : (
                  <VideoProjectProgress
                    projectId={activeProjectId}
                    onComplete={(finalVideoUrl) => {
                      // Store completed project for NeuralDispatchCenter
                      const completed = JSON.parse(localStorage.getItem('empire_completed_projects') || '[]');
                      completed.push({ id: activeProjectId, url: finalVideoUrl, ts: Date.now(), status: 'completed' });
                      // Keep last 10
                      localStorage.setItem('empire_completed_projects', JSON.stringify(completed.slice(-10)));
                      console.log('[Studio] Project complete:', finalVideoUrl);
                    }}
                  />
                )}
              </div>

              {/* 2. Faceless Content Creation Box */}
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4 relative group">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                    <span className="text-[10px] font-black text-primary">{usage?.faceless?.remaining ?? 7}</span>
                    <span className="text-[9px] font-black text-slate-400">/</span>
                    <span className="text-[9px] font-black text-slate-500">{usage?.faceless?.limit ?? 7}</span>
                  </div>
                  <div className="relative">
                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                    <div className="absolute bottom-full right-0 mb-3 w-48 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                      <p className="font-black text-white uppercase tracking-widest mb-1">Faceless Videos</p>
                      Your 7 weekly faceless video slots reset every {usage?.faceless?.nextReset || '7 days'}. Unused slots do not roll over. Resets are synchronized with your signup time.
                    </div>
                  </div>
                </div>
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

                {/* Mood + Duration selectors (Faceless) */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Mood &amp; Length</span>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={facelessMood}
                      onChange={(e) => setFacelessMood(e.target.value)}
                      className="flex-1 min-w-[90px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                    >
                      {VIDEO_MOODS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                    <select
                      value={facelessDuration}
                      onChange={(e) => setFacelessDuration(Number(e.target.value))}
                      className="flex-1 min-w-[90px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                    >
                      <option value={10}>10 seconds</option>
                      <option value={15}>15 seconds</option>
                    </select>
                  </div>
                </div>
                {/* Voiceover (shared control) */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Voiceover (optional)</span>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={facelessVoice}
                      onChange={(e) => setFacelessVoice(e.target.value as 'female' | 'male' | 'auto')}
                      className="flex-1 min-w-[90px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                    >
                      <option value="auto">Auto gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                    <select
                      value={facelessTone}
                      onChange={(e) => setFacelessTone(e.target.value as any)}
                      className="flex-1 min-w-[110px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                    >
                      <option value="auto">Auto tone</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="calm">Calm</option>
                      <option value="serious">Serious</option>
                      <option value="warm">Warm</option>
                    </select>
                  </div>
                </div>
                {/* Source image (screenshot) upload */}
                <div className="space-y-3">
                  <FileUploadDropZone
                    type="source-image"
                    state={facelessUpload}
                    onFileSelect={(file) => handleSourceImageSelect(file, setFacelessUpload)}
                    onRemove={() => handleSourceImageRemove(setFacelessUpload, facelessUpload)}
                    disabled={facelessUpload.status === 'uploading'}
                  />
                  {facelessUpload.preview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/30 mx-auto"
                    >
                      <img src={facelessUpload.preview} alt="Uploaded source" className="w-full h-full object-cover" />
                    </motion.div>
                  )}
                </div>
                <textarea
                  value={facelessIdea}
                  onChange={(e) => setFacelessIdea(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFacelessSubmit(); } }}
                  placeholder={isCatalyst ? "e.g. 3 reasons why most 9-5s are a trap, high-impact b-roll, professional voiceover, strong 'Link in Bio' CTA..." : "e.g. 5 viral facts about 'Sustainable Living' for YouTube Shorts..."}
                  disabled={isSubmittingFaceless}
                  className="w-full bg-theme-background border border-theme rounded-2xl p-4 text-xs font-medium outline-none focus:border-white/40 transition-all min-h-[100px] text-foreground placeholder:text-slate-600 resize-none"
                />
                <button
                  onClick={handleFacelessSubmit}
                  disabled={!facelessIdea.trim() || isSubmittingFaceless}
                  className="w-full px-4 py-2.5 rounded-xl bg-primary text-slate-950 font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmittingFaceless ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Launch Project'
                  )}
                </button>

                {facelessSubmitted && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Faceless concept received — sourcing viral stock material</span>
                  </motion.div>
                )}

                <InlineConsultant context="faceless" empireContext={{ niche: userNiche || empireData?.niche, angle: empireData?.angle, targetCustomers: empireData?.targetCustomers, businessGoals: empireData?.businessGoals }} />
              </div>

              {/* 3. Neural Twin Section - Single Box with Active Badge */}
              <div className="relative bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-6 group">
                <div className="absolute top-6 right-6 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                      <span className="text-[10px] font-black text-primary">{usage?.neural?.remaining ?? 0}</span>
                      <span className="text-[9px] font-black text-slate-400">/</span>
                      <span className="text-[9px] font-black text-slate-500">{usage?.neural?.limit ?? 7}</span>
                    </div>
                    <div className="relative">
                      <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                      <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                        <p className="font-black text-white uppercase tracking-widest mb-1">Neural Twin Quota</p>
                        Your 7 weekly Neural Twin slots reset every {usage?.neural?.nextReset || '7 days'}. Unused slots do not roll over. Resets are synchronized with your signup time.
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

                  <div className="flex flex-col gap-2 max-w-sm mx-auto w-full">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Mood</span>
                    <select
                      value={twinMood}
                      onChange={(e) => setTwinMood(e.target.value)}
                      className="bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                    >
                      {VIDEO_MOODS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSynthesizeTwin}
                    disabled={facialDnaUpload.status !== 'complete' || twinStatus === 'synthesizing'}
                    className="w-full max-w-sm mx-auto flex justify-center items-center gap-2 py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {twinStatus === 'synthesizing' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Synthesizing...
                      </>
                    ) : facialDnaUpload.status === 'complete' ? 'Synthesize Twin Double' : 'Upload a photo first'}
                  </button>

                  {twinStatus === 'done' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm mx-auto space-y-3">
                      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">Neural Twin Ready</p>
                          <p className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-wider mt-0.5">Saved to your Library — view on Operations</p>
                        </div>
                      </div>
                      <Link href="/empire-center" className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all">
                        <ChevronRight className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider">Go to Operations to View</span>
                      </Link>
                    </motion.div>
                  )}
                  {twinStatus === 'error' && (
                    <div className="max-w-sm mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center space-y-2">
                      <p className="text-xs font-bold text-red-400">{twinError || 'Neural Twin synthesis failed. Please try again.'}</p>
                      <button onClick={() => setTwinStatus('idle')} className="text-[10px] text-red-400 underline">Dismiss</button>
                    </div>
                  )}
                </div>

                <InlineConsultant context="neural-twin" empireContext={{ niche: userNiche || empireData?.niche, angle: empireData?.angle, targetCustomers: empireData?.targetCustomers, businessGoals: empireData?.businessGoals }} />
              </div>

              {/* 4. Upload Video Box for Edits */}
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

                {editStatus === 'processing' && (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <BrandedGlobe size="md" spinning={true} className="animate-pulse" />
                    <p className="text-xs font-black text-foreground uppercase tracking-widest animate-pulse">Applying Empire Polish...</p>
                    <p className="text-[10px] text-muted-foreground">Color grading, cuts, captions & music</p>
                  </div>
                )}
                {editStatus === 'done' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">Edit Complete</p>
                        <p className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-wider mt-0.5">Ready to view on Operations</p>
                      </div>
                    </div>
                    <Link href="/empire-center" className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-wider">Go to Operations to View</span>
                    </Link>
                    <button
                      onClick={() => { setEditStatus('idle'); setRawVideoUpload(p => ({ ...p, status: 'idle', file: null, preview: null, metadata: null })); }}
                      className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Edit Another Video
                    </button>
                  </div>
                )}
                {editStatus === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center space-y-2">
                    <p className="text-xs font-bold text-red-400">{editError || 'Enhancement failed'}</p>
                    <button onClick={() => setEditStatus('idle')} className="text-[10px] text-red-400 underline">Dismiss</button>
                  </div>
                )}

                <InlineConsultant context="editor" onGenerate={handleEnhanceVideo} isParentGenerating={editStatus === 'processing'} empireContext={{ niche: userNiche || empireData?.niche, angle: empireData?.angle, targetCustomers: empireData?.targetCustomers, businessGoals: empireData?.businessGoals }} />
              </div>

              {/* 5. Custom Design Input — Free-text Idea Entry */}
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

                <InlineConsultant context="design" empireContext={{ niche: userNiche || empireData?.niche, angle: empireData?.angle, targetCustomers: empireData?.targetCustomers, businessGoals: empireData?.businessGoals }} />
              </div>


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
