"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Clock, AlertCircle, RefreshCw, Play } from 'lucide-react';
import { API_URL } from '@/lib/config';

const getAuthHeader = (): string => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('empire_auth_token');
    if (!token) { token = crypto.randomUUID(); localStorage.setItem('empire_auth_token', token); }
    return `Bearer ${token}`;
  }
  return 'Bearer ';
};

interface Scene {
  id: string;
  index: number;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  videoUrl?: string;
  errorMessage?: string;
  metadata?: any;
}

interface ProjectData {
  id: string;
  title: string;
  status: 'draft' | 'processing' | 'completed' | 'error';
  scenes: Scene[];
  finalVideoUrl?: string;
  progress: number;
  error?: string;
}

interface VideoProjectProgressProps {
  projectId: string;
  onComplete?: (finalVideoUrl: string) => void;
}

export function VideoProjectProgress({ projectId, onComplete }: VideoProjectProgressProps) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regeneratingScene, setRegeneratingScene] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('empire_userId') : '';

  const fetchProject = async () => {
    try {
      const res = await fetch(`${API_URL}/api/studio/video-project/${projectId}`, {
        headers: { 'Authorization': getAuthHeader(), 'x-user-id': userId || '' }
      });
      if (!res.ok) return;
      const data = await res.json();
      // Backend contract: { project: {...}, scenes: [...], progress } — normalize
      // into the flat shape this component renders (id/title/status/scenes/etc).
      const raw = data.project || data;
      const rawScenes = Array.isArray(data.scenes) ? data.scenes : (raw.scenes || []);
      const scenes: Scene[] = rawScenes.map((s: any, i: number) => {
        const meta = s.metadata || {};
        return {
          id: s.id,
          index: s.scene_number ?? i + 1,
          description: s.narration || s.visual_prompt || '',
          status: s.status === 'completed' ? 'completed'
            : s.status === 'failed' || s.status === 'error' ? 'error'
            : s.status === 'processing' ? 'processing' : 'pending',
          videoUrl: s.asset_url || undefined,
          errorMessage: meta.error || meta.errorMessage || undefined,
          metadata: meta,
        };
      });
      const failed = raw.status === 'failed' || raw.status === 'error';
      const norm: ProjectData = {
        id: raw.id || projectId,
        title: raw.title || 'Video Project',
        status: failed ? 'error' : raw.status === 'completed' ? 'completed' : 'processing',
        scenes,
        finalVideoUrl: raw.finalVideoUrl || undefined,
        progress: typeof data.progress === 'number' ? data.progress : 0,
        error: failed
          ? (raw.metadata && raw.metadata.error) || scenes.find(s => s.status === 'error')?.errorMessage || 'Project failed — tap Regenerate on a scene to retry'
          : undefined,
      };
      setProject(norm);
      setLoading(false);

      if (norm.status === 'completed' && norm.finalVideoUrl) {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
        onComplete?.(norm.finalVideoUrl);
      } else if (norm.status === 'error') {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      }
    } catch {
      // silent retry
    }
  };

  useEffect(() => {
    fetchProject();
    pollRef.current = setInterval(fetchProject, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [projectId]);

  const handleRegenerateScene = async (sceneId: string) => {
    setRegeneratingScene(sceneId);
    try {
      await fetch(`${API_URL}/api/studio/scene/${sceneId}/regenerate`, {
        method: 'POST',
        headers: { 'Authorization': getAuthHeader(), 'x-user-id': userId || '', 'Content-Type': 'application/json' }
      });
      fetchProject();
    } catch {}
    setRegeneratingScene(null);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'processing': return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-white/5 rounded-full w-1/3" />
        <div className="h-2 bg-white/5 rounded-full w-full" />
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950 border border-white/10 rounded-2xl p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-foreground uppercase tracking-wider">{project.title || 'Video Project'}</h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {project.status === 'completed' ? 'Complete' : `${project.scenes.filter(s => s.status === 'completed').length}/${project.scenes.length} scenes ready`}
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-foreground">{project.progress || 0}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${project.progress || 0}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Scene grid */}
      <div className="grid grid-cols-2 gap-2">
        <AnimatePresence>
          {project.scenes.map((scene) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Scene {scene.index}</span>
                {statusIcon(scene.status)}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{scene.description || 'Generating...'}</p>
              {scene.status === 'completed' && scene.videoUrl && (
                <button
                  onClick={() => window.open(scene.videoUrl, '_blank')}
                  className="flex items-center gap-1 text-[9px] font-bold text-primary uppercase hover:underline"
                >
                  <Play className="w-3 h-3" /> Preview
                </button>
              )}
              {(scene.status === 'error' || scene.status === 'completed') && (
                <button
                  onClick={() => handleRegenerateScene(scene.id)}
                  disabled={regeneratingScene === scene.id}
                  className="flex items-center gap-1 text-[9px] font-bold text-amber-400 uppercase hover:underline disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${regeneratingScene === scene.id ? 'animate-spin' : ''}`} /> Regenerate
                </button>
              )}
              {scene.status === 'error' && (
                <p className="text-[9px] text-red-400 truncate">
                  {scene.errorMessage || (scene.metadata && (scene.metadata.error || scene.metadata.errorMessage)) || 'Scene failed'}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Final video preview removed per owner: appears ONLY on Operations page (Neural Dispatch Center) */}
      {project.status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Video Complete</span>
          </div>
          <p className="text-[10px] text-emerald-500/70 mt-1 font-medium">
            Saved to your Library — go to the Operations page to view and download.
          </p>
        </motion.div>
      )}

      {/* Error state — backend reports project failure as status 'failed' */}
      {(project.status === 'error' || project.status === 'failed') && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
          <p className="text-xs font-bold text-red-400">
            {project.error || (project.metadata && project.metadata.error) || 'Project failed — tap Regenerate on a scene to retry'}
          </p>
        </div>
      )}
    </motion.div>
  );
}
