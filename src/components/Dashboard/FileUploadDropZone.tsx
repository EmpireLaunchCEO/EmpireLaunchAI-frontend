"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, FileVideo, CheckCircle2, AlertCircle, Loader2, X, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

export type UploadType = 'facial-dna' | 'raw-video';
export type UploadStatus = 'idle' | 'selected' | 'uploading' | 'processing' | 'complete' | 'error';

export interface UploadState {
  file: File | null;
  preview: string | null;
  status: UploadStatus;
  progress: number;
  metadata?: any;
}

interface Props {
  type: UploadType;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  state: UploadState;
  disabled?: boolean;
}

const typeConfig = {
  'facial-dna': {
    icon: Image,
    label: 'Upload Facial DNA (Photo)',
    accept: 'image/png,image/jpeg,image/webp',
    hint: 'PNG, JPG or WebP — Clear, well-lit face photo',
    maxSize: '10MB',
    color: 'purple',
  },
  'raw-video': {
    icon: Film,
    label: 'Upload Raw Video Material',
    accept: 'video/mp4,video/quicktime,video/webm',
    hint: 'MP4, MOV or WebM — Raw footage for AI editing',
    maxSize: '500MB',
    color: 'blue',
  },
};

export function FileUploadDropZone({ type, onFileSelect, onRemove, state, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const config = typeConfig[type];
  const Icon = config.icon;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleClick = () => {
    if (!disabled && state.status === 'idle') {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const statusColors: Record<UploadStatus, string> = {
    idle: 'border-theme hover:border-primary/40 text-slate-500 group-hover:text-white',
    selected: 'border-primary/50 text-primary',
    uploading: 'border-blue-500/50 text-blue-400',
    processing: 'border-purple-500/50 text-purple-400',
    complete: 'border-emerald-500/50 text-emerald-400',
    error: 'border-red-500/50 text-red-400',
  };

  const statusBgColors: Record<UploadStatus, string> = {
    idle: 'bg-slate-800 group-hover:bg-primary/20',
    selected: 'bg-primary/20',
    uploading: 'bg-blue-500/20',
    processing: 'bg-purple-500/20',
    complete: 'bg-emerald-500/20',
    error: 'bg-red-500/20',
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drop Zone */}
      <motion.div
        whileHover={state.status === 'idle' ? { scale: 1.01 } : {}}
        whileTap={state.status === 'idle' ? { scale: 0.99 } : {}}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative p-6 md:p-8 border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden group",
          isDragging ? "border-primary border-solid bg-primary/5" : statusColors[state.status],
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Background gradient on hover/drag */}
        <div className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          isDragging ? "opacity-100 bg-gradient-to-br from-primary/10 to-transparent" : "group-hover:opacity-100 group-hover:bg-gradient-to-br from-white/[0.02] to-transparent"
        )} />

        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Status icon */}
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
            statusBgColors[state.status],
            state.status === 'complete' ? "scale-110" : "",
            isDragging ? "scale-110 bg-primary/20" : ""
          )}>
            <AnimatePresence mode="wait">
              {state.status === 'uploading' ? (
                <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
                </motion.div>
              ) : state.status === 'processing' ? (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
                </motion.div>
              ) : state.status === 'complete' ? (
                <motion.div key="complete" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </motion.div>
              ) : state.status === 'error' ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AlertCircle className="w-7 h-7 text-red-400" />
                </motion.div>
              ) : state.status === 'selected' ? (
                <motion.div key="selected" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  {type === 'facial-dna' ? <Image className="w-7 h-7 text-primary" /> : <FileVideo className="w-7 h-7 text-primary" />}
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Upload className="w-7 h-7 group-hover:scale-110 transition-transform" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text */}
          <div className="text-center space-y-1">
            <p className={cn(
              "text-xs md:text-sm font-black uppercase tracking-wider transition-colors",
              state.status === 'idle' && !isDragging ? "text-slate-400 group-hover:text-foreground" : "",
              isDragging ? "text-primary" : ""
            )}>
              {state.status === 'idle' ? (isDragging ? 'Drop file here' : config.label) :
               state.status === 'selected' ? `${state.file?.name || 'File selected'}` :
               state.status === 'uploading' ? 'Uploading...' :
               state.status === 'processing' ? 'Analyzing with AI...' :
               state.status === 'complete' ? 'Upload complete' :
               'Upload failed — try again'}
            </p>
            {state.status === 'idle' && (
              <p className="text-[9px] text-muted-foreground font-medium">
                {config.hint} · Max {config.maxSize}
              </p>
            )}
          </div>

          {/* Progress bar */}
          {(state.status === 'uploading' || state.status === 'processing') && (
            <div className="w-full max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${state.progress}%` }}
                className={cn(
                  "h-full rounded-full",
                  state.status === 'uploading' ? "bg-blue-500" : "bg-purple-500"
                )}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}