"use client";

import React, { useState } from 'react';
import { X, PenSquare, Download, Trash2, Clock, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AssetDetailModalProps {
  asset: any;
  categoryIcon?: React.ElementType;
  categoryColor?: string;
  onClose: () => void;
  onRename: (id: string, name: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onAssetUpdated: () => void;
}

export function AssetDetailModal({ asset, categoryIcon: Icon, categoryColor, onClose, onRename, onDelete, onAssetUpdated }: AssetDetailModalProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(asset?.name || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [renamed, setRenamed] = useState(false);

  if (!asset) return null;

  const isExpired = asset.expired || (asset.expiresAt && new Date(asset.expiresAt) < new Date());
  const expiresDate = asset.expiresAt ? new Date(asset.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

  const handleRename = async () => {
    if (!renameValue.trim()) return;
    const ok = await onRename(asset.id, renameValue.trim());
    if (ok) {
      setRenamed(true);
      setTimeout(() => setRenamed(false), 2000);
      setIsRenaming(false);
      onAssetUpdated();
    }
  };

  const handleDelete = async () => {
    const ok = await onDelete(asset.id);
    if (ok) {
      setShowDeleteConfirm(false);
      setIsDeleting(true);
      setTimeout(() => onClose(), 500);
      onAssetUpdated();
    }
  };

  const isVideo = asset.type === 'video' || asset.type === 'twin_video' || asset.type === 'edit' || asset.type === 'faceless' || asset.mimeType?.startsWith('video/');
  const fileUrl = asset.filePath || asset.fileUrl || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={cn(
          "bg-theme-surface border-2 rounded-[32px] p-6 md:p-8 max-w-lg w-full space-y-5 relative overflow-hidden",
          isExpired ? "border-red-500/30" : "border-theme"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] -z-10" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", categoryColor?.replace('text-', 'bg-').replace(/-\d+/, '') + '/10')}>
                <Icon className={cn("w-5 h-5", categoryColor)} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {isRenaming ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') { setIsRenaming(false); setRenameValue(asset.name); } }}
                    className="bg-theme-background border border-theme rounded-lg px-2 py-1 text-sm font-bold text-foreground outline-none focus:border-primary w-full"
                    autoFocus
                  />
                  <button onClick={handleRename} className="text-[10px] font-black text-primary uppercase tracking-wider hover:opacity-80 shrink-0">Save</button>
                  <button onClick={() => { setIsRenaming(false); setRenameValue(asset.name); }} className="text-[10px] font-black text-muted-foreground uppercase tracking-wider hover:opacity-80 shrink-0">Cancel</button>
                </div>
              ) : (
                <h3 className="text-sm font-black text-foreground truncate max-w-[200px]">{asset.name || 'Untitled'}</h3>
              )}
              <p className="text-[9px] font-medium text-muted-foreground">
                {new Date(asset.createdAt || asset.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => { setIsRenaming(true); setRenameValue(asset.name); }} className="w-8 h-8 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all" title="Rename">
              <PenSquare className="w-3.5 h-3.5" />
            </button>
            {fileUrl && (
              <a href={fileUrl} download className="w-8 h-8 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 flex items-center justify-center transition-all" title="Download">
                <Download className="w-3.5 h-3.5" />
              </a>
            )}
            <button onClick={() => setShowDeleteConfirm(true)} className="w-8 h-8 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all" title="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expired badge */}
        {isExpired && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-widest text-red-400">Expired</span>
          </div>
        )}

        {/* Renamed indicator */}
        {renamed && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Name Updated</span>
          </div>
        )}

        {/* Preview */}
        <div className={cn("aspect-video rounded-xl overflow-hidden flex items-center justify-center", isExpired ? "opacity-50" : "")}>
          {fileUrl && isVideo ? (
            <video src={fileUrl} controls className="w-full h-full object-contain" />
          ) : fileUrl ? (
            <img src={fileUrl} alt={asset.name} className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-600">
              {Icon && <Icon className="w-12 h-12 opacity-30" />}
              <span className="text-[10px] font-medium">No preview available</span>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div className="p-3 bg-theme-background rounded-xl border border-theme">
            <p className="font-black uppercase tracking-wider text-muted-foreground mb-0.5">Type</p>
            <p className="font-bold text-foreground capitalize">{asset.type?.replace('_', ' ') || 'Unknown'}</p>
          </div>
          <div className={cn("p-3 rounded-xl border", isExpired ? "bg-red-500/5 border-red-500/20" : "bg-theme-background border-theme")}>
            <p className="font-black uppercase tracking-wider text-muted-foreground mb-0.5">Status</p>
            <p className={cn("font-bold capitalize", isExpired ? "text-red-400" : "text-emerald-400")}>
              {isExpired ? 'Expired' : 'Active'}
            </p>
          </div>
          {expiresDate && (
            <div className="p-3 bg-theme-background rounded-xl border border-theme col-span-2 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <div>
                <p className="font-black uppercase tracking-wider text-muted-foreground mb-0.5">Expires</p>
                <p className={cn("font-bold", isExpired ? "text-red-400" : "text-foreground")}>{expiresDate}</p>
              </div>
            </div>
          )}
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-foreground">Delete this asset? This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:opacity-90 transition-all">Delete</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 bg-theme-background border border-theme rounded-xl font-black text-[9px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Cancel</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}