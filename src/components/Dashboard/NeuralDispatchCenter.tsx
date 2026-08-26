"use client";

import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Edit3, 
  UserSquare2, 
  Palette, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Smartphone,
  Instagram,
  Youtube,
  ShoppingBag,
  Store,
  Mail,
  Globe,
  Zap,
  AlertCircle,
  ThumbsUp,
  Download,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmpire } from '@/lib/EmpireContext';
import { API_URL } from '@/lib/config';

const getAuthHeader = (): string => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('empire_auth_token');
    if (!token) { token = crypto.randomUUID(); localStorage.setItem('empire_auth_token', token); }
    return `Bearer ${token}`;
  }
  return 'Bearer ';
};

const platformIcons: Record<string, any> = {
  TikTok: Smartphone,
  Instagram: Instagram,
  YouTube: Youtube,
  Etsy: ShoppingBag,
  Shopify: Store,
  Gmail: Mail,
  'Empire Email': Mail,
  GoDaddy: Globe,
  'Systeme.io': Zap
};

export function NeuralDispatchCenter() {
  const { connectedPlatforms } = useEmpire();
  const [activeQueue, setActiveQueue] = useState<string | null>(null);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const [view, setView] = useState<'grid' | 'review'>('grid');
  const [draftNumber, setDraftNumber] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});
  const [approvalItems, setApprovalItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentApproval, setCurrentApproval] = useState<any | null>(null);

  const queueTypeMap: Record<string, string> = {
    videos: 'video',
    edits: 'edit',
    faceless: 'faceless',
    designs: 'design'
  };

  // Fetch real pending approvals + completed video assets from backend
  const fetchApprovals = async () => {
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('empire_userId') : null;
      if (!userId) { setIsLoading(false); return; }

      // Fetch pending approvals
      const approvalsRes = await fetch(`${API_URL}/api/approval/pending`, {
        headers: { 'Authorization': getAuthHeader(), 'x-user-id': userId }
      });
      let approvalItems: any[] = [];
      if (approvalsRes.ok) {
        const data = await approvalsRes.json();
        approvalItems = data.approvals || [];
      }

      // Fetch completed assets from Library — all types, map to correct queue
      try {
        const assetsRes = await fetch(`${API_URL}/api/studio/assets`, {
          headers: { 'Authorization': getAuthHeader(), 'x-user-id': userId }
        });
        // Map creation types to queue types for tab routing
        const typeToQueue: Record<string, string> = {
          video: 'video', enhanced_video: 'video', neural_twin: 'video',
          edit: 'edit', video_edit: 'edit', raw_video: 'edit',
          faceless: 'faceless',
          design: 'design',
        };
        if (assetsRes.ok) {
          const assetsData = await assetsRes.json();
          const completedAssets = (assetsData.assets || []).filter(
            (a: any) => a.status !== 'processing' && a.status !== 'failed'
          );
          const assetItems = completedAssets.map((asset: any) => ({
            id: asset.id,
            type: typeToQueue[asset.type] || 'video',
            status: asset.status || 'completed',
            payload: {
              title: asset.title || 'Generated Asset',
              videoUrl: asset.fileUrl,
              assetId: asset.id,
              status: asset.status || 'completed'
            }
          }));
          // Merge assets, avoiding duplicates by id
          const existingIds = new Set(approvalItems.map((i: any) => i.id));
          for (const ai of assetItems) {
            if (!existingIds.has(ai.id)) {
              approvalItems.unshift(ai);
              existingIds.add(ai.id);
            }
          }
        }
      } catch {}

      // Fetch completed video projects from the backend list endpoint — this is
      // the source of truth so projects completed while the browser was closed
      // (restart-safe scene pipeline) still surface on Operations with fresh R2
      // URLs /api/studio/video-projects regenerates signed URLs on read.
      try {
        const projectsRes = await fetch(`${API_URL}/api/studio/video-projects`, {
          headers: { 'Authorization': getAuthHeader(), 'x-user-id': userId }
        });
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          const completedProjects = (projectsData.projects || []).filter((p: any) => p.status === 'completed' && p.finalVideoUrl);
          const existingIds = new Set(approvalItems.map((i: any) => i.id));
          for (const proj of completedProjects) {
            if (!existingIds.has(proj.id)) {
              approvalItems.unshift({
                id: proj.id,
                type: 'video',
                status: 'completed',
                payload: {
                  title: proj.title || 'Scene-Based Video Project',
                  videoUrl: proj.finalVideoUrl,
                  assetId: proj.id,
                  status: 'completed'
                }
              });
              existingIds.add(proj.id);
            }
          }
        }
      } catch {}

      // Fetch completed scene-based video projects from localStorage (fast path).
      // Processed AFTER the backend list so the backend's freshly regenerated R2
      // URL wins for the same id — localStorage only supplies an entry when the
      // backend has no row for it (e.g. stuck entries that never hit the DB). A
      // stale signed URL in localStorage must never shadow a fresh backend URL.
      try {
        const completedProjects = JSON.parse(localStorage.getItem('empire_completed_projects') || '[]');
        const videoProjects = completedProjects.filter((p: any) => p.url);
        const existingIds = new Set(approvalItems.map((i: any) => i.id));
        for (const proj of videoProjects) {
          if (!existingIds.has(proj.id)) {
            approvalItems.unshift({
              id: proj.id,
              type: 'video',
              status: 'completed',
              payload: {
                title: 'Scene-Based Video Project',
                videoUrl: proj.url,
                assetId: proj.id,
                status: 'completed'
              }
            });
            existingIds.add(proj.id);
          }
        }
      } catch {}

      setApprovalItems(approvalItems);
      // Group counts by type
      const counts: Record<string, number> = {};
      approvalItems.forEach((item: any) => {
        const type = item.type?.toLowerCase() || 'other';
        counts[type] = (counts[type] || 0) + 1;
      });
      setPendingCounts(counts);
    } catch (err) {
      console.warn('Failed to fetch approvals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  // When entering review, find matching approval for this queue
  useEffect(() => {
    if (view === 'review' && activeQueue) {
      const approvalType = queueTypeMap[activeQueue];
      // For video queue, only match approvals that actually have a videoUrl
      const match = approvalItems.find((item: any) => {
        const typeMatch = item.type?.toLowerCase() === approvalType;
        if (approvalType === 'video') {
          return typeMatch && item.payload?.videoUrl;
        }
        return typeMatch;
      });
      setCurrentApproval(match || null);
      setDraftNumber(1);
    }
  }, [view, activeQueue, approvalItems]);

  const hasLinks = connectedPlatforms.length > 0;

  const categories = [
    { id: 'videos', label: 'Videos', icon: Video, count: pendingCounts['video'] || pendingCounts['videos'] || (hasLinks && !isLoading ? 0 : 0) },
    { id: 'edits', label: 'Edits', icon: Edit3, count: pendingCounts['edit'] || pendingCounts['edits'] || (hasLinks && !isLoading ? 0 : 0) },
    { id: 'faceless', label: 'Faceless', icon: UserSquare2, count: pendingCounts['faceless'] || pendingCounts['twin'] || (hasLinks && !isLoading ? 0 : 0) },
    { id: 'designs', label: 'Designs', icon: Palette, count: pendingCounts['design'] || pendingCounts['designs'] || (hasLinks && !isLoading ? 0 : 0) },
  ];

  const handleAppToggle = (platform: string) => {
    if (!isApproved) return;
    setSelectedApps(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const handleDelete = async () => {
    // Lightweight confirmation guard before destructive delete.
    const title = currentApproval?.payload?.title || 'this item';
    if (!window.confirm(`Delete "${title}"? This permanently removes it (and its file) — you can't undo this.`)) return;
    // Use the creation ID (payload.assetId) for proper DB+R2 deletion
    const creationId = currentApproval?.payload?.assetId || currentApproval?.id;
    if (!creationId) return;
    let backendDeleted = false;
    try {
      const res = await fetch(`${API_URL}/api/studio/creation/${creationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': getAuthHeader() },
      });
      if (res.ok) backendDeleted = true;
      else if (res.status !== 404) console.error('Delete failed:', await res.text());
      // 404 means there is no backend row — that is fine, the entry may be
      // a localStorage fast-path item with no DB row behind it.
    } catch (e) {
      console.error('Failed to delete creation:', e);
    }
    // Always remove the matching entry from the localStorage fast path too,
    // so stuck items (no backend row) truly disappear from the UI. This is the
    // fix for the "X does nothing" bug on local-only entries.
    try {
      const key = 'empire_completed_projects';
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      const remaining = stored.filter(
        (p: any) => (p.id || p.assetId) !== creationId
      );
      localStorage.setItem(key, JSON.stringify(remaining));
      if (stored.length !== remaining.length) backendDeleted = true;
    } catch {}
    setIsApproved(false);
    setView('grid');
    if (backendDeleted) fetchApprovals();
  };

  const handleSaveToLibrary = async () => {
    if (!currentApproval) return;
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('empire_userId') : null;
      const res = await fetch(`${API_URL}/api/approval/save-to-library`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
          'x-user-id': userId || ''
        },
        body: JSON.stringify({
          approvalId: currentApproval.id
        })
      });
      if (res.ok) {
        setIsApproved(true);
        fetchApprovals();
      }
    } catch (err) {
      console.error('Failed to save to library:', err);
    }
  };

  const handleSyncFeedback = () => {
    setDraftNumber(prev => prev + 1);
    setFeedback('');
  };

  if (view === 'review') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-950 border !border-white/10 rounded-[40px] overflow-hidden shadow-2xl min-h-[600px] flex flex-col"
      >
        {/* REVIEW HEADER */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('grid')} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
            </button>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Reviewing: {activeQueue?.toUpperCase()}</h3>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Draft #{draftNumber}</p>
              {currentApproval?.payload?.ratioLabel ? (
                <p className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {currentApproval.payload.shape === 'horizontal' ? '▬ ' : currentApproval.payload.shape === 'square' ? '□ ' : currentApproval.payload.shape === 'portrait' ? '▮ ' : ''}
                  {currentApproval.payload.ratioLabel}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Rendering Optimized
          </div>
        </div>

        {/* LARGE PLAYER AREA */}
        <div className="flex-1 bg-black/40 flex items-center justify-center relative group p-8">
          {currentApproval?.payload?.videoUrl ? (
              <div className="aspect-video w-full max-w-4xl bg-slate-900 rounded-[32px] border border-white/10 shadow-2xl overflow-hidden relative">
                <video
                  src={currentApproval.payload.videoUrl?.startsWith('http') ? currentApproval.payload.videoUrl : `${API_URL}${currentApproval.payload.videoUrl}`}
                  controls
                  className="w-full h-full object-contain"
                  poster="/brands/video-placeholder.png"
                >
                  Your browser does not support the video element.
                </video>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Pending Review</span>
                </div>
              </div>
            ) : (
            <div className="aspect-video w-full max-w-4xl bg-slate-900 rounded-[32px] border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden">
              <Video className="w-12 h-12 text-white/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                <p className="text-white font-black uppercase tracking-widest text-xs">Creation Preview</p>
                <p className="text-white/40 text-[10px] uppercase font-bold">Neural Engine v4.2</p>
              </div>
            </div>
          )}
        </div>

        {/* NEURAL EDIT BOX */}
        <div className="p-8 bg-slate-900/50 border-t border-white/5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Feedback (One line changes)</label>
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g. 'Change the last sentence to mention free shipping'..."
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleSaveToLibrary}
              className="flex-1 py-5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save
            </button>
            <button 
              onClick={() => {
                const id = currentApproval?.payload?.assetId || currentApproval?.id;
                if (!id) return;
                // Route ALL downloads through the user-scoped download proxy
                // (/api/studio/download/:id). The proxy streams the file buffer
                // directly from R2 server-side, bypassing stale 1hr-presigned
                // signed URLs and CORS — which previously caused "r2 fetch failed"
                // when the Download button window.open'd the raw R2 media URL.
                const userId = localStorage.getItem('empireUserId') || localStorage.getItem('empire_userId') || '';
                window.open(`${API_URL}/api/studio/download/${id}?userId=${encodeURIComponent(userId)}`, '_blank');
              }}
              className="flex-1 py-5 bg-primary text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button 
              onClick={handleDelete}
              className="py-5 px-6 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-theme-surface/40 backdrop-blur-xl border !border-white/10 rounded-[40px] overflow-hidden shadow-2xl p-6 md:p-8 space-y-8 md:space-y-12">
      {/* 50/50 SPLIT: Queues on LEFT, Dispatch Targets on RIGHT */}
      <div className="grid grid-cols-2 gap-4 md:gap-12">
        
        {/* ── LEFT: CREATION QUEUES ─────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] truncate">Queues</h4>
          </div>
          
          <div className="space-y-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveQueue(cat.id);
                  setView('review');
                  setIsApproved(false);
                }}
                className={cn(
                  "w-full rounded-[24px] p-3 md:p-5 flex flex-col md:flex-row items-center gap-3 md:gap-5 transition-all border !border-white/5 relative group overflow-hidden",
                  activeQueue === cat.id
                    ? "bg-white/10 !border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    : "bg-slate-900/50 !border-white/5 hover:!border-white/20"
                )}
              >
                <div className={cn(
                  "w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center transition-colors shrink-0",
                  activeQueue === cat.id ? "bg-white text-slate-950" : "bg-white/5 text-slate-400 group-hover:text-white"
                )}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white leading-tight">{cat.label}</p>
                  <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase mt-0.5">{cat.count} items</p>
                </div>
                <ChevronRight className="w-4 h-4 ml-auto text-slate-600 group-hover:text-primary transition-colors hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: DISPATCH TARGETS ───────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-primary" />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] truncate">
              {isApproved ? 'Targets ✓' : 'Targets'}
            </h4>
          </div>

          {!isApproved && (
            <div className="flex items-center justify-center md:justify-start gap-2 px-3 py-2 rounded-2xl bg-amber-500/5 border !border-amber-500/10">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[8px] font-bold text-amber-300 uppercase tracking-widest">
                LOCKED
              </span>
            </div>
          )}

          <div className="space-y-3">
            {connectedPlatforms.length > 0 ? (
              connectedPlatforms.map((platform) => {
                const isSelected = selectedApps.includes(platform);
                return (
                  <button
                    key={platform}
                    disabled={!isApproved}
                    onClick={() => handleAppToggle(platform)}
                    className={cn(
                      "w-full rounded-[24px] p-3 md:p-4 border !border-white/5 flex flex-col md:flex-row items-center gap-3 md:gap-4 transition-all group relative overflow-hidden",
                      !isApproved && "opacity-25 cursor-not-allowed grayscale",
                      isSelected
                        ? "bg-emerald-500/10 !border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                        : "bg-slate-900/40 !border-white/5 hover:!border-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-xs font-black relative overflow-hidden shrink-0 transition-all",
                      isSelected ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110" : "bg-white/5 text-white/40"
                    )}>
                      {platformIcons[platform] ? React.createElement(platformIcons[platform], { className: "w-5 h-5" }) : platform.charAt(0).toUpperCase()}
                      <AnimatePresence>
                        {isSelected && (
                           <motion.div
                             initial={{ scale: 0, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             exit={{ scale: 0, opacity: 0 }}
                             className="absolute inset-0 bg-emerald-500 flex items-center justify-center"
                           >
                              <CheckCircle2 className="w-5 h-5 text-slate-950" />
                           </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="text-center md:text-left flex-1 min-w-0">
                      <span className={cn(
                        "text-[10px] md:text-xs font-black uppercase tracking-widest truncate block",
                        isSelected ? "text-emerald-400" : "text-slate-400 group-hover:text-white"
                      )}>
                        {platform}
                      </span>
                    </div>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isSelected ? "bg-emerald-500 animate-pulse" : "bg-white/10"
                    )} />
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white/5 rounded-[24px] border !border-white/10">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Link Required</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── EXECUTE DISPATCH — Centered below BOTH columns ── */}
      <div className="flex flex-col items-center gap-8 pt-4">
        <button 
          className={cn(
            "w-full max-w-xl py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 relative overflow-hidden",
            selectedApps.length > 0 && isApproved
              ? "bg-primary text-slate-950 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] scale-[1.02] hover:translate-y-[-2px] active:scale-95"
              : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5 opacity-50"
          )}
          disabled={selectedApps.length === 0 || !isApproved}
          onClick={() => {
            setActiveQueue(null);
            setIsApproved(false);
            setSelectedApps([]);
            setFeedback('');
          }}
        >
          <Sparkles className="w-4 h-4" />
          Execute Dispatch
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* FOOTER - Now inside the big box */}
        <div className="flex flex-col items-center gap-3">
           <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900 border !border-white/5">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                isApproved ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              )} />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">
                {isApproved
                  ? 'Ready to Dispatch.'
                  : 'Awaiting Approval.'}
              </span>
           </div>
           <div className="flex items-center gap-1 opacity-20">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-1 h-1 rounded-full bg-primary" />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
