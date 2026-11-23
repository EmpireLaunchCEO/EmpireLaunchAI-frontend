"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  Loader2,
  Play,
  Square,
  X
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
import { API_URL, OWNER_EMAIL } from '@/lib/config';

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

// Shape of GET /api/voices (the backend's one voice list) — only the fields the
// picker renders. The dropdown's label is "Name — character", e.g.
// "Nova — bright, upbeat", so the character words must come from the backend.
type VoiceOption = { id: string; name: string; character: string; sampleUrl?: string };
type VoiceGenderGroup = { id: string; label: string; voices: VoiceOption[] };

const getAuthHeader = (): string => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('empire_auth_token');
    if (!token) { token = crypto.randomUUID(); localStorage.setItem('empire_auth_token', token); }
    return `Bearer ${token}`;
  }
  return 'Bearer ';
};

// THE FACELESS LAUNCH CONFIRMATION MUST SURVIVE A REFRESH (owner, Nov 12):
// generation takes 5–10 minutes and the customer reloads the page while they
// wait, so a successful launch writes this entry and the page restores the green
// line on mount. Only the dismiss X (or a new successful launch) clears it —
// typing a new chat message does NOT.
const FACELESS_LAUNCH_CONFIRMATION_KEY = 'faceless_launch_confirmation';
// Owner (23 Nov): 30s videos land inside this window, so the line states a bound,
// never a measurement — "may take up to 10 minutes".
const FACELESS_LAUNCH_CONFIRMATION_TEXT = 'Generating video, may take up to 10 minutes — check Operations!';

const currentUserId = (): string =>
  (typeof window !== 'undefined' && (localStorage.getItem('empire_userId') || localStorage.getItem('empireUserId'))) || '';

export default function StudioPage() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { activeEmpire: empireData, registerRefreshHandler, isAdmin, userEmail } = useEmpire();
  const [userNiche, setUserNiche] = useState<string>('');

  // NEURAL TWIN IS PARKED (owner Nov 9, fully parked Nov 12): Twin is hidden
  // from the Studio mode selection for every account — clients AND the owner —
  // while its renderer is rebuilt. `isOwner` is resolved from auth exactly like
  // the other owner-only surfaces (isAdmin is granted by EmpireContext only for
  // the seeded owner zero-UUID; userEmail comes back from /api/settings/hydrate)
  // — never assumed, never derived from anything a client controls.
  const isOwner = isAdmin || userEmail?.toLowerCase() === OWNER_EMAIL;

  // SCENE AND NEURAL TWIN ARE FULLY PARKED (owner decision, Nov 12): both are
  // now hidden from HER OWN Studio page too, not only from client accounts, so
  // the page shows exactly one video box: Faceless. Nothing was deleted — every
  // Scene and Twin box, handler and state below is still in this file, made
  // unreachable by this ONE flag. TO RESTORE: set PARKED_SCENE_AND_TWIN to
  // `false` and both modes come back for the owner; to bring them back for
  // clients as well, also drop the `isOwner` condition from the two flags below.
  const PARKED_SCENE_AND_TWIN: boolean = true;
  const SHOW_NEURAL_TWIN = !PARKED_SCENE_AND_TWIN && isOwner;
  const SHOW_SCENE_BASED = !PARKED_SCENE_AND_TWIN && isOwner;

  // THE AI VIDEO EDITOR IS LIVE (owner reversed part of #108, Nov 12): the Edits
  // queue is back in Operations Base — only the VIDEOS queue stays parked
  // (PARKED_VIDEOS in NeuralDispatchCenter.tsx) — so a finished edit has a queue
  // to land in again and this box is rendered. The flag is kept, split out from
  // the old PARKED_VIDEOS_AND_EDITS, so the box can be parked again by setting
  // it to `true` TOGETHER WITH PARKED_EDITS in NeuralDispatchCenter.tsx.
  const PARKED_EDITS: boolean = false;

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

  // THE VOICE PICKER (owner, 23 Nov): gender → tone → the voice you can HEAR.
  // The list is the backend's own catalogue (GET /api/voices), never a copy in
  // this file — a voice we offer and cannot speak is a promise we break, and the
  // launch route 400s a voice it does not know. 'auto' is the first option and
  // the default, so a client who does not care gets exactly today's behaviour.
  const [voiceCatalogue, setVoiceCatalogue] = useState<VoiceGenderGroup[]>([]);
  const [facelessVoiceId, setFacelessVoiceId] = useState<string>('auto');
  const [voiceSamplePlaying, setVoiceSamplePlaying] = useState(false);
  const [voiceSampleError, setVoiceSampleError] = useState<string | null>(null);
  const voiceSampleRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/voices`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data?.genders)) setVoiceCatalogue(data.genders);
      } catch {
        // The picker falls back to "Auto voice" only — no invented voices.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Voices offered for the gender chosen above: one gender's list, or every
  // voice grouped by gender while the gender is still Auto.
  const facelessVoiceGroups = facelessVoice === 'auto'
    ? voiceCatalogue
    : voiceCatalogue.filter((g) => g.id === facelessVoice);
  const facelessVoiceChoices = facelessVoiceGroups.flatMap((g) => g.voices);
  const selectedFacelessVoice = facelessVoiceChoices.find((v) => v.id === facelessVoiceId) || null;

  const facelessSampleUrl = (voiceId: string, tone: string) =>
    `${API_URL}/api/voices/${encodeURIComponent(voiceId)}/sample?tone=${encodeURIComponent(tone)}`;

  // Changing gender rebuilds the list and keeps a playable selection: a voice
  // that does not belong to the new gender is dropped back to Auto, never
  // silently kept and never silently swapped for another voice.
  const handleFacelessGenderChange = (gender: 'female' | 'male' | 'auto') => {
    setFacelessVoice(gender);
    if (gender === 'auto') return;
    const allowed = voiceCatalogue.find((g) => g.id === gender)?.voices.some((v) => v.id === facelessVoiceId);
    if (!allowed) setFacelessVoiceId('auto');
  };

  // Picking a voice IS hearing it (owner, 23 Nov): a new voice or a new tone
  // plays that voice's sample in that tone, so nothing has to be discovered.
  useEffect(() => {
    const audio = voiceSampleRef.current;
    if (!audio) return;
    if (facelessVoiceId === 'auto') {
      audio.pause();
      setVoiceSamplePlaying(false);
      return;
    }
    setVoiceSampleError(null);
    audio.src = facelessSampleUrl(facelessVoiceId, facelessTone);
    try { audio.currentTime = 0; } catch {}
    const played = audio.play();
    if (played && typeof played.catch === 'function') {
      played.catch(() => setVoiceSamplePlaying(false));
    }
  }, [facelessVoiceId, facelessTone]);

  const toggleVoiceSample = () => {
    const audio = voiceSampleRef.current;
    if (!audio || !selectedFacelessVoice) return;
    if (!audio.paused) { audio.pause(); return; }
    if (!audio.src) audio.src = facelessSampleUrl(facelessVoiceId, facelessTone);
    setVoiceSampleError(null);
    const played = audio.play();
    if (played && typeof played.catch === 'function') {
      played.catch(() => setVoiceSamplePlaying(false));
    }
  };

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
      // handleSourceImageSelect) so handleDesignSubmit can send the real
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
  const [twinDuration, setTwinDuration] = useState<string>('30');
  // Model-layer dictation fidelity (owner Oct 19, ALL-MODES bar): the twin
  // consultant relays the REFINED/dictated script (onRefinedIdea) and the FULL
  // conversation (onConversation) so createNeuralTwin can honor "remember the
  // conversation and include what anyone is wanting it to say" — never the old
  // hardcoded placeholder. Falls back to the legacy greeting when the chat has
  // produced nothing yet.
  const [twinScript, setTwinScript] = useState('');
  const [twinConversation, setTwinConversation] = useState<Array<{ role: string; content: string }>>([]);

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
          duration: twinDuration ? parseInt(twinDuration) : undefined,
          // Owner Oct 19 directive: honor the dictated/refined script from the
          // neural-twin consultant — fall back to the legacy greeting only when
          // the chat produced nothing.
          script: (twinScript && twinScript.trim())
            ? twinScript.trim()
            : "Welcome to my Empire! This is my Neural Twin double, ready to market 24/7.",
          // Remember the conversation (owner Oct 19): the backend unions prior
          // USER turns into dictation extraction so earlier asks (end flash,
          // bullets, mood) are honored, not dropped.
          conversation: twinConversation,
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
      setEditError('Upload a raw video clip first — then use Generate to apply the Empire Polish.');
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

  // Custom design state — the AI consultant chat is the SINGLE idea entry
  // (owner: the old quick-submit box bypassed GPT 5.2 refinement — removed).
  // Launch Design submits the GPT-refined conversation summary with the same
  // submission shape the old quick-submit box sent (type: design). The
  // platform remembers the client's niche/business server-side, so the
  // request stays simple (owner Sep 24: Vault-DNA resolution at generation
  // time is a backend concern, handled in parallel).
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);
  // Post-submit lock (mirrors Faceless): once a design is submitted, the
  // consultant must NOT invite "refine here" again (each refinement is a fresh
  // paid AI generation). The lock holds until the user sends a NEW message
  // (a new request — allowed), which releases it.
  const [designLocked, setDesignLocked] = useState(false);
  const designUserMsgCountRef = useRef(0);
  // The refined idea surfaced by the design consultant chat (conversation
  // summary — user turns only, per the Sep 21 narration fix).
  const [designRefinedIdea, setDesignRefinedIdea] = useState('');

  const [isSubmittingFaceless, setIsSubmittingFaceless] = useState(false);
  const [facelessSubmitted, setFacelessSubmitted] = useState(false);
  // The server's own reason a Faceless launch failed. Owner (Nov 12): a launch
  // that failed only wrote to the console, so nobody could tell WHY it failed.
  // It is shown in the box, in the server's words.
  const [facelessLaunchError, setFacelessLaunchError] = useState<string | null>(null);
  // Post-submit lock: once a Faceless concept is submitted, the consultant
  // must NOT invite "refine here" again (owner: each refinement is a fresh
  // paid AI generation — no wire to spend more mid-flight). The lock holds
  // until the user sends a NEW message (a new request — allowed), which
  // releases it; the in-flight generation itself is untouched.
  const [facelessLocked, setFacelessLocked] = useState(false);
  const facelessUserMsgCountRef = useRef(0);
  // The refined idea surfaced by the AI consultant chat (conversation summary).
  // Owner Sep 18: the old top idea box bypassed GPT 5.2 — the chat is now the
  // SINGLE idea entry, and Launch Project submits its refined summary.
  const [facelessRefinedIdea, setFacelessRefinedIdea] = useState('');
  // FULL consultant conversation + relayed components (mirrors Scene tab) —
  // carried for forward-compat: backend faceless approval path doesn't consume
  // them yet (gap noted in PR), but Scene's video-project path does.
  const [facelessRelayedComponents, setFacelessRelayedComponents] = useState<string[]>([]);
  const [facelessRelayedConversation, setFacelessRelayedConversation] = useState<Array<{ role: string; content: string }>>([]);

  // Restore the green Faceless launch confirmation after a refresh (owner, Nov
  // 12). It is only restored for the account that launched it, and a corrupt
  // entry simply means no confirmation — never a crash on load.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FACELESS_LAUNCH_CONFIRMATION_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { userId?: string; at?: number } | null;
      const userId = currentUserId();
      if (saved?.userId && userId && saved.userId !== userId) return;
      setFacelessSubmitted(true);
    } catch {
      // No confirmation to restore.
    }
  }, []);
  // Owner (Oct 26): the OK-confirmation popup between chat and launch is
  // REMOVED — chat → launch fires directly for owner and customers. Quota and
  // validation stay enforced server-side on every studio/approval route; the
  // handlers below still guard double-fires and empty submits client-side.

  // Expectation preview helper — sets clear expectations before a generation
  // consumes quota (owner: no "surprise" free videos if the client dislikes result).
  // Mirrors the backend's deterministic targetSceneCount (sceneVideoPipelineService:
  // SECONDS_PER_SCENE=6, MIN_SCENES=3, MAX_SCENES=60) so the brief MATCHES the
  // executor's planned scene count instead of lying with a hardcoded marketing
  // approximation ("~3 scenes" for 30s while the planner schedules 5).
  const scenePreview = (duration: string) => {
    const d = Number(duration);
    const secondsPerScene = 6;
    const count = Number.isFinite(d) && d > 0
      ? Math.max(3, Math.min(60, Math.round(d / secondsPerScene)))
      : 0;
    if (count <= 0) return 'a story divided into short AI scenes';
    return `a ${d}-second story, ${count} AI scenes`;
  };

  // Scene-based video project — the SINGLE video builder (consultant + controls
  // folded in from the removed Customize Video box).
  const [projectTitle, setProjectTitle] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [projectDuration, setProjectDuration] = useState('30');
  const [projectVoice, setProjectVoice] = useState<'female' | 'male' | 'none' | ''>('');
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
  // FULL consultant conversation + the concrete components the client relayed in
  // it (owner: GPT must read the whole conversation and every component must
  // land in the video). Passed with every Scene-Based launch payload.
  const [relayedComponents, setRelayedComponents] = useState<string[]>([]);
  const [relayedConversation, setRelayedConversation] = useState<Array<{ role: string; content: string }>>([]);

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
          // '' → undefined (auto gender); 'none' must pass through so the
          // scene engine skips narration entirely.
          voice: projectVoice === '' ? undefined : projectVoice,
          tone: projectTone || undefined,
          mood: projectMood || undefined,
          sourceImages: sceneUpload.metadata?.photoUrl ? [sceneUpload.metadata.photoUrl] : [],
          // Owner directives: GPT must read the FULL consultant conversation
          // (not just the compressed summary) and every component the client
          // relayed must land in the video, all inside the exact duration.
          conversation: relayedConversation,
          components: relayedComponents,
          // suppressWand closing-line hint: the consultant names the real
          // Launch Project button instead of the vanished "tap the wand".
          actionHint: 'Press Launch Project to generate your video'
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

  const handleFacelessSubmit = async (finalIdea?: string) => {
    const ideaToUse = (finalIdea && finalIdea.trim()) || facelessRefinedIdea.trim();
    if (!ideaToUse || isSubmittingFaceless) return;
    setIsSubmittingFaceless(true);
    setFacelessLocked(true);
    // A fresh launch replaces whatever the last one said.
    setFacelessLaunchError(null);
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
          description: ideaToUse,
          payload: {
            category: 'faceless-video',
            isCatalyst: isCatalyst,
            mood: facelessMood,
            duration: facelessDuration
          },
          voice: facelessVoice === 'auto' ? undefined : facelessVoice,
          tone: facelessTone === 'auto' ? undefined : facelessTone,
          // The voice she PICKED (owner, 23 Nov): 'auto' stays absent so the
          // gender+tone behaviour is unchanged; a real voice is the character in
          // the finished video, and the route 400s an id it cannot speak.
          voiceId: facelessVoiceId === 'auto' ? undefined : facelessVoiceId,
          mood: facelessMood,
          duration: facelessDuration,
          // Owner (Oct 19 + Oct 26): relay the FULL consultant conversation so
          // the faceless pipeline plans from every user turn — never just the
          // first message or the refined summary alone.
          conversation: facelessRelayedConversation,
          components: facelessRelayedComponents,
          sourceImages: facelessUpload.metadata?.photoUrl ? [facelessUpload.metadata.photoUrl] : []
        })
      });
      if (!res.ok) {
        // SHOW THE SERVER'S OWN REASON (owner, Nov 12): a failed launch used to
        // write only to the console, which is why nobody could tell why a real
        // launch failed. The response body carries the server's message; the
        // status line is the fallback when the body is not JSON.
        const raw = await res.text().catch(() => '');
        let detail = '';
        try {
          const body = raw ? JSON.parse(raw) : null;
          detail = typeof body === 'string'
            ? body
            : (body?.error || body?.message || body?.detail || '');
        } catch {
          detail = raw;
        }
        throw new Error(
          String(detail || '').trim() || `Launch failed — the server answered ${res.status} ${res.statusText || ''}`.trim()
        );
      }
      const data = await res.json();
      console.log('Faceless approval created:', data);
      setIsSubmittingFaceless(false);
      // Owner (Nov 12): the green confirmation stays up — it survives a refresh
      // and typing a new message, and only the X (or the next successful
      // launch) clears it. No timer takes it down.
      setFacelessSubmitted(true);
      try {
        localStorage.setItem(
          FACELESS_LAUNCH_CONFIRMATION_KEY,
          JSON.stringify({ userId: currentUserId(), at: Date.now() })
        );
      } catch {
        // A browser that refuses localStorage still shows the line this session.
      }
    } catch (error) {
      console.error('Faceless approval error:', error);
      setIsSubmittingFaceless(false);
      // Submission failed — nothing is generating, so the user may retry and
      // the consultant returns to its normal (pre-submit) guidance state.
      setFacelessLocked(false);
      setFacelessSubmitted(false);
      try { localStorage.removeItem(FACELESS_LAUNCH_CONFIRMATION_KEY); } catch {}
      const message = error instanceof Error ? error.message : String(error || '');
      setFacelessLaunchError(message.trim() || 'Launch failed — the server did not say why.');
    }
  };

  // Dismissing the green confirmation also clears the saved copy, so a refresh
  // does not bring back a line the customer already closed.
  const dismissFacelessConfirmation = () => {
    setFacelessSubmitted(false);
    try { localStorage.removeItem(FACELESS_LAUNCH_CONFIRMATION_KEY); } catch {}
  };

  // Relay the FULL consultant conversation (so the Scene-Based payload can send
  // it to the backend planner) and release the post-submit lock the moment the
  // user sends a NEW message — per owner, a new typed message is a NEW request
  // (allowed), never an attached refinement of the in-flight generation.
  // NOTE (owner, Nov 12): typing does NOT clear the green launch confirmation —
  // that video is still being generated, so the customer keeps being told so
  // until they dismiss it.
  const handleFacelessConversation = (messages: Array<{ role: string; content: string }>) => {
    setFacelessRelayedConversation(messages);
    const userMsgCount = messages.filter(m => m.role === 'user').length;
    if (facelessLocked && userMsgCount > facelessUserMsgCountRef.current) {
      setFacelessLocked(false);
    }
    facelessUserMsgCountRef.current = userMsgCount;
  };

  // Submit a Custom Design through the AI consultant chat. The idea is the
  // GPT-refined conversation summary (user turns only) — the same submission
  // shape the old quick-submit box sent (owner Sep 24: the platform remembers
  // the client's niche/business server-side; Vault-DNA resolution at
  // generation time is a backend concern, handled in parallel).
  const handleDesignSubmit = async (finalIdea?: string) => {
    const ideaToUse = (finalIdea && finalIdea.trim()) || designRefinedIdea.trim();
    if (!ideaToUse || isSubmittingIdea) return;
    setIsSubmittingIdea(true);
    setDesignLocked(true);
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
          description: ideaToUse,
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
      fetchUsage();
      setTimeout(() => setIdeaSubmitted(false), 5000);
    } catch (error) {
      console.error('Design approval error:', error);
      setIsSubmittingIdea(false);
      // Submission failed — nothing is generating, so the user may retry and
      // the consultant returns to its normal (pre-submit) guidance state.
      setDesignLocked(false);
    }
  };

  // Release the design post-submit lock the moment the user sends a NEW
  // message — per owner, a new typed message is a NEW request (allowed),
  // never an attached refinement of the in-flight generation.
  const handleDesignConversation = (messages: Array<{ role: string; content: string }>) => {
    const userMsgCount = messages.filter(m => m.role === 'user').length;
    if (designLocked && userMsgCount > designUserMsgCountRef.current) {
      setDesignLocked(false);
    }
    designUserMsgCountRef.current = userMsgCount;
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
              {/* Owner-mandated AI-variance disclaimer (Oct 30) — VERBATIM copy.
                  Sits directly under the business-name heading and directly above
                  the first mode box: quiet page copy, no card/border/background,
                  no icon, no dismiss. Width is capped so it does not stretch
                  across the viewport, and it sits outside the Scene box so the
                  box itself never shifts or resizes. Do NOT reword or "improve". */}
              <p className="max-w-2xl text-xs md:text-sm leading-relaxed text-foreground/60">
                We aim to make all AI-generated content match the request as closely as possible. AI output is variable, and we can not guarantee every video to be perfect.
              </p>

              {/* 1. Scene-Based Video — the single video builder (AI consultant + controls) */}
              {/* PARKED (owner Nov 9, fully parked Nov 12): rendered for nobody —
                  not clients, not the owner — while Scene is retired into
                  Faceless. The backend refuses a Scene request from a client
                  with a plain-language 403 before any paid provider call, so
                  hiding the box is not the only thing keeping it closed. */}
              {SHOW_SCENE_BASED && (
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4 relative group">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                    <span className="text-[10px] font-black text-primary">{usage?.customize?.remaining ?? 0}</span>
                    <span className="text-[9px] font-black text-slate-400">/</span>
                    <span className="text-[9px] font-black text-slate-500">{usage?.customize?.limit ?? 4}</span>
                  </div>
                  <div className="relative">
                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                    <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                      <p className="font-black text-white uppercase tracking-widest mb-1">Weekly Video Quota</p>
                      Your 4 weekly video slots reset every {usage?.customize?.nextReset || '7 days'}. Unused slots do not roll over. Resets are synchronized with your signup time.
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
                          <option value="30">30 seconds</option>
                        </select>
                        <select
                          value={projectVoice}
                          onChange={(e) => setProjectVoice(e.target.value as 'female' | 'male' | 'none' | '')}
                          className="flex-1 min-w-[90px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                        >
                          <option value="">Auto gender</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="none">No voiceover (silent)</option>
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
                      <InlineConsultant
                        context={isCatalyst ? "catalyst-video" : "video"}
                        idea={consultantSeed}
                        onGenerate={handleSubmitProject}
                        suppressWand
                        onRefinedIdea={setRefinedVideoIdea}
                        onConversation={setRelayedConversation}
                        onRelayedComponents={setRelayedComponents}
                        actionHint="Press Launch Project to generate your video"
                        settledSettings={{ duration: projectDuration, voice: projectVoice, tone: projectTone }}
                        empireContext={{ niche: userNiche || empireData?.niche, angle: empireData?.angle, targetCustomers: empireData?.targetCustomers, businessGoals: empireData?.businessGoals }}
                      />
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
                    {/* 4. Launch Project — submits the consultant-refined idea (or the raw text).
                        Owner (Oct 26): no OK-confirmation gate between chat and launch — the
                        button fires the Scene-Based generation directly. Quota is still enforced
                        server-side by the studio route. */}
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

              )}

              {/* 2. Faceless Content Creation Box */}
              <div className="bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[24px] md:rounded-[28px] p-5 md:p-6 space-y-4 relative group">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                    <span className="text-[10px] font-black text-primary">{usage?.faceless?.remaining ?? 15}</span>
                    <span className="text-[9px] font-black text-slate-400">/</span>
                    <span className="text-[9px] font-black text-slate-500">{usage?.faceless?.limit ?? 15}</span>
                  </div>
                  <div className="relative">
                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                    <div className="absolute bottom-full right-0 mb-3 w-48 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                      <p className="font-black text-white uppercase tracking-widest mb-1">Faceless Videos</p>
                      Your 15 weekly faceless video slots (60 a month) reset every {usage?.faceless?.nextReset || '7 days'}. Unused slots do not roll over. Resets are synchronized with your signup time.
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
                      <option value={30}>30 seconds</option>
                    </select>
                  </div>
                </div>
                {/* Voiceover (shared control) */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Voiceover (optional)</span>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={facelessVoice}
                      onChange={(e) => handleFacelessGenderChange(e.target.value as 'female' | 'male' | 'auto')}
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
                    {/* THE VOICE (owner, 23 Nov): the character, not the delivery
                        — filtered by the gender above, Auto first. Picking one
                        plays its sample in the chosen tone, so the choice is also
                        the hearing; the play control replays it on demand. */}
                    <select
                      value={facelessVoiceId}
                      onChange={(e) => setFacelessVoiceId(e.target.value)}
                      aria-label="Voice"
                      className="flex-1 min-w-[150px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                    >
                      <option value="auto">Auto voice</option>
                      {facelessVoice === 'auto'
                        ? facelessVoiceGroups.map((group) => (
                            <optgroup key={group.id} label={group.label}>
                              {group.voices.map((v) => (
                                <option key={v.id} value={v.id}>{v.name} — {v.character}</option>
                              ))}
                            </optgroup>
                          ))
                        : facelessVoiceChoices.map((v) => (
                            <option key={v.id} value={v.id}>{v.name} — {v.character}</option>
                          ))}
                    </select>
                    <button
                      type="button"
                      onClick={toggleVoiceSample}
                      disabled={!selectedFacelessVoice}
                      aria-label={voiceSamplePlaying ? 'Stop voice sample' : 'Play voice sample'}
                      title={selectedFacelessVoice ? 'Hear this voice' : 'Pick a voice to hear it'}
                      className="shrink-0 p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {voiceSamplePlaying
                        ? <Square className="w-3.5 h-3.5" />
                        : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {voiceSampleError && (
                    <span className="text-[9px] font-bold text-red-400 leading-relaxed break-words">{voiceSampleError}</span>
                  )}
                  <audio
                    ref={voiceSampleRef}
                    preload="none"
                    onPlay={() => setVoiceSamplePlaying(true)}
                    onPause={() => setVoiceSamplePlaying(false)}
                    onEnded={() => setVoiceSamplePlaying(false)}
                    onError={() => {
                      setVoiceSamplePlaying(false);
                      setVoiceSampleError('That voice sample would not play — the sound could not be fetched.');
                    }}
                    className="hidden"
                  />
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
                {/* AI consultant chat — the SINGLE GPT 5.2 idea entry (owner approved:
                the old top idea box + send button bypassed GPT refinement — removed). */}
                <InlineConsultant
                  context="faceless"
                  onGenerate={handleFacelessSubmit}
                  onRefinedIdea={setFacelessRefinedIdea}
                  onConversation={handleFacelessConversation}
                  onRelayedComponents={setFacelessRelayedComponents}
                  suppressWand
                  submitted={facelessLocked}
                  actionHint="Press Launch Project to generate your video"
                  settledSettings={{ duration: String(facelessDuration), voice: facelessVoice, tone: facelessTone }}
                  empireContext={{ niche: userNiche || empireData?.niche, angle: empireData?.angle, targetCustomers: empireData?.targetCustomers, businessGoals: empireData?.businessGoals }}
                />

                {facelessSubmitted && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[9px] font-bold text-emerald-400 tracking-wider">{FACELESS_LAUNCH_CONFIRMATION_TEXT}</span>
                    <button
                      type="button"
                      onClick={dismissFacelessConfirmation}
                      aria-label="Dismiss confirmation"
                      className="ml-auto shrink-0 p-0.5 rounded-md text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}

                {/* A failed launch says WHY (owner, Nov 12) — the server's own
                    message, in the box, instead of only the browser console. */}
                {facelessLaunchError && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <span className="text-[9px] font-bold text-red-400 leading-relaxed break-words">{facelessLaunchError}</span>
                    <button
                      type="button"
                      onClick={() => setFacelessLaunchError(null)}
                      aria-label="Dismiss launch error"
                      className="ml-auto shrink-0 p-0.5 rounded-md text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}

                {/* Launch Project — bottom of the panel, below the chat (submits the
                GPT-refined idea from the consultant conversation). */}
                <button
                  onClick={() => handleFacelessSubmit(facelessRefinedIdea.trim())}
                  disabled={!facelessRefinedIdea.trim() || isSubmittingFaceless}
                  className="w-full px-4 py-2.5 rounded-xl bg-primary text-slate-950 font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmittingFaceless ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Launch Project'
                  )}
                </button>
              </div>

              {/* 3. Neural Twin Section - Single Box with Active Badge */}
              {/* PARKED (owner Nov 9, fully parked Nov 12): rendered for nobody —
                  not clients, not the owner — while its renderer is rebuilt, and
                  Scene is parked above with it, so the page shows only the modes
                  that are live. The backend refuses a Twin request from a client
                  with a plain-language 403, so hiding the box is not the only
                  thing keeping it closed. */}
              {SHOW_NEURAL_TWIN && (
              <div className="relative bg-theme-surface border-2 border-theme hover:border-white/30 transition-all rounded-[32px] md:rounded-[40px] p-6 md:p-8 space-y-6 group">
                <div className="absolute top-6 right-6 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5">
                      <span className="text-[10px] font-black text-primary">{usage?.neural?.remaining ?? 0}</span>
                      <span className="text-[9px] font-black text-slate-400">/</span>
                      <span className="text-[9px] font-black text-slate-500">{usage?.neural?.limit ?? 5}</span>
                    </div>
                    <div className="relative">
                      <Info className="w-3.5 h-3.5 text-slate-500 cursor-help peer" />
                      <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] leading-relaxed font-medium text-slate-300 opacity-0 peer-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                        <p className="font-black text-white uppercase tracking-widest mb-1">Neural Twin Quota</p>
                        Your 5 weekly Neural Twin slots reset every {usage?.neural?.nextReset || '7 days'}. Unused slots do not roll over. Resets are synchronized with your signup time.
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
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Mood &amp; Duration</span>
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={twinMood}
                        onChange={(e) => setTwinMood(e.target.value)}
                        className="flex-1 min-w-[90px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                      >
                        {VIDEO_MOODS.map((m) => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                      <select
                        value={twinDuration}
                        onChange={(e) => setTwinDuration(e.target.value)}
                        className="flex-1 min-w-[90px] bg-theme-surface/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-white/30"
                      >
                        <option value="">Auto</option>
                        <option value="15">15 seconds</option>
                        <option value="30">30 seconds</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSynthesizeTwin()}
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

                <InlineConsultant context="neural-twin" onRefinedIdea={setTwinScript} onConversation={setTwinConversation} empireContext={{ niche: userNiche || empireData?.niche, angle: empireData?.angle, targetCustomers: empireData?.targetCustomers, businessGoals: empireData?.businessGoals }} />
              </div>
              )}

              {/* 4. Upload Video Box for Edits */}
              {/* LIVE AGAIN (owner reversed part of #108, Nov 12): the Edits
                  queue is back in Operations Base, so this box is shown again —
                  an edit always has a queue to land in. Park it again with
                  PARKED_EDITS above (and PARKED_EDITS in NeuralDispatchCenter). */}
              {!PARKED_EDITS && (
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
              )}

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

                {/* AI consultant chat — the SINGLE design idea entry (owner: the
                old quick-submit box bypassed GPT 5.2 refinement — removed).
                The consultant refines the idea in chat (its empireContext
                includes the client's harvested brand info), and Launch Design
                submits that refined summary (see handleDesignSubmit). */}
                <InlineConsultant
                  context="design"
                  onGenerate={handleDesignSubmit}
                  onRefinedIdea={setDesignRefinedIdea}
                  onConversation={handleDesignConversation}
                  suppressWand
                  submitted={designLocked}
                  actionHint="Press Launch Design to synthesize your design"
                  empireContext={{ niche: userNiche || empireData?.niche, angle: empireData?.angle, targetCustomers: empireData?.targetCustomers, businessGoals: empireData?.businessGoals }}
                />

                {/* Launch Design — bottom of the panel, below the chat (submits
                the GPT-refined idea from the consultant conversation). */}
                <button
                  onClick={() => handleDesignSubmit(designRefinedIdea.trim())}
                  disabled={!designRefinedIdea.trim() || isSubmittingIdea}
                  className="w-full px-4 py-2.5 rounded-xl bg-primary text-slate-950 font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmittingIdea ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Launch Design'
                  )}
                </button>
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
        {/* OK-confirmation popup between chat and launch REMOVED per owner (Oct 26):
            Launch buttons fire their generation handlers directly. Server-side
            quota/validation (studio + approval routes) is unaffected. */}
      </div>
  );
}
