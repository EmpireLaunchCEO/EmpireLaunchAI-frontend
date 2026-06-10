"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Cpu, Sparkles, CheckCircle2, Loader2, AlertCircle, Clock, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RenderLogEntry {
  id: string;
  stage: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  message: string;
  timestamp: string;
  details?: string;
}

interface Props {
  logs: RenderLogEntry[];
  isProcessing: boolean;
  type: 'facial-dna' | 'raw-video' | 'rendering';
  onClear?: () => void;
}

// ─── Stage Config ───────────────────────────────────────────────────────────

const stageIcons: Record<string, React.ReactNode> = {
  'Analyzing': <Eye className="w-3.5 h-3.5" />,
  'Extracting': <Cpu className="w-3.5 h-3.5" />,
  'Synthesizing': <Sparkles className="w-3.5 h-3.5" />,
  'Rendering': <Loader2 className="w-3.5 h-3.5" />,
  'Encoding': <Cpu className="w-3.5 h-3.5" />,
  'Finalizing': <CheckCircle2 className="w-3.5 h-3.5" />,
};

const stageColors: Record<string, string> = {
  pending: 'text-slate-500 border-slate-800',
  active: 'text-primary border-primary/30 bg-primary/5',
  complete: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
  error: 'text-red-400 border-red-500/20 bg-red-500/5',
};

// ─── Render Log Component ───────────────────────────────────────────────────

export function AIRenderLog({ logs, isProcessing, type, onClear }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [visibleLogs, setVisibleLogs] = useState<RenderLogEntry[]>([]);

  // Animate logs appearing
  useEffect(() => {
    if (logs.length === 0) {
      setVisibleLogs([]);
      return;
    }
    // Show latest logs first, newest at bottom
    setVisibleLogs(logs);
  }, [logs]);

  const typeLabel = type === 'facial-dna' ? 'Neural Twin Synthesis' :
    type === 'raw-video' ? 'AI Video Enhancement' : 'Native Rendering Pipeline';

  return (
    <div className="bg-theme-surface border-2 border-theme rounded-[28px] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 md:p-5 flex items-center justify-between border-b border-theme hover:bg-theme-background/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border",
            isProcessing ? "bg-primary/10 border-primary/20" : "bg-slate-800 border-slate-700"
          )}>
            <Bot className={cn("w-5 h-5", isProcessing ? "text-primary animate-pulse" : "text-slate-400")} />
          </div>
          <div className="text-left">
            <h4 className="font-black text-foreground text-sm uppercase tracking-tight">AI Render Log</h4>
            <p className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              isProcessing ? "text-primary" : "text-muted-foreground"
            )}>
              {isProcessing ? `${typeLabel} — Active` : typeLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[7px] font-black uppercase tracking-widest text-emerald-400">Live</span>
            </div>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Log Entries */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-5 space-y-3 max-h-[400px] overflow-y-auto">
              {visibleLogs.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-foreground uppercase italic">No Activity Yet</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-1">
                      Upload content above to begin AI processing pipeline.
                    </p>
                  </div>
                </div>
              ) : (
                visibleLogs.map((log, i) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-2xl border transition-all",
                      stageColors[log.status]
                    )}
                  >
                    {/* Stage icon */}
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                      log.status === 'complete' ? "bg-emerald-500/10 border-emerald-500/20" :
                      log.status === 'active' ? "bg-primary/10 border-primary/20" :
                      log.status === 'error' ? "bg-red-500/10 border-red-500/20" :
                      "bg-slate-800 border-slate-700"
                    )}>
                      {log.status === 'complete' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : log.status === 'active' ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : log.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-wider",
                          log.status === 'active' ? "text-primary" :
                          log.status === 'complete' ? "text-emerald-400" :
                          log.status === 'error' ? "text-red-400" :
                          "text-slate-500"
                        )}>
                          {log.stage}
                        </span>
                        <span className="text-[8px] font-medium text-muted-foreground">·</span>
                        <span className="text-[8px] font-medium text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className={cn(
                        "text-xs font-medium mt-0.5",
                        log.status === 'pending' ? "text-slate-500" : "text-foreground"
                      )}>
                        {log.message}
                      </p>
                      {log.details && log.status === 'active' && (
                        <p className="text-[9px] text-muted-foreground mt-1 italic">{log.details}</p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}

              {/* Clear button */}
              {visibleLogs.length > 0 && onClear && (
                <button
                  onClick={onClear}
                  className="w-full py-2 text-center text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear Log
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mock Pipeline Generator ────────────────────────────────────────────────

export function generateMockRenderLogs(type: 'facial-dna' | 'raw-video'): RenderLogEntry[] {
  if (type === 'facial-dna') {
    return [
      {
        id: '1',
        stage: 'Analyzing',
        status: 'complete',
        message: 'Uploaded photo analyzed — face detected with 99.2% confidence',
        timestamp: '2s ago',
      },
      {
        id: '2',
        stage: 'Extracting',
        status: 'complete',
        message: 'Facial landmarks mapped — 468 key points identified',
        timestamp: '4s ago',
      },
      {
        id: '3',
        stage: 'Synthesizing',
        status: 'active',
        message: 'Building Neural Twin mesh with texture synthesis...',
        timestamp: 'Now',
        details: 'Applying 3D morphable model — stage 2/5',
      },
      {
        id: '4',
        stage: 'Rendering',
        status: 'pending',
        message: 'Generating lip-sync animation pipeline',
        timestamp: '—',
      },
      {
        id: '5',
        stage: 'Finalizing',
        status: 'pending',
        message: 'Encoding final video output with Empire branding',
        timestamp: '—',
      },
    ];
  }

  return [
    {
      id: '1',
      stage: 'Analyzing',
      status: 'complete',
      message: 'Raw footage scanned — 1,240 frames at 30fps',
      timestamp: '3s ago',
    },
    {
      id: '2',
      stage: 'Extracting',
      status: 'complete',
      message: 'Audio track isolated — Empire Style captioning initialized',
      timestamp: '6s ago',
    },
    {
      id: '3',
      stage: 'Synthesizing',
      status: 'active',
      message: 'Applying color grading (Empire Gold preset) to scene timeline...',
      timestamp: 'Now',
      details: 'Scene 3/8 — 62% complete',
    },
    {
      id: '4',
      stage: 'Rendering',
      status: 'pending',
      message: 'Compositing overlays — branding, transitions, trending audio',
      timestamp: '—',
    },
    {
      id: '5',
      stage: 'Finalizing',
      status: 'pending',
      message: 'Encoding Empire-Certified video at 1080p 60fps',
      timestamp: '—',
    },
  ];
}