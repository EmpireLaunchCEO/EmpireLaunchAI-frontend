"use client";

import React, { useState } from 'react';
import { Check, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { libraryService } from '@/lib/api-service';
import { motion, AnimatePresence } from 'framer-motion';

interface AssetNamePromptProps {
  assetId: string;
  defaultName?: string;
  onComplete?: () => void;
  onDismiss?: () => void;
}

export function AssetNamePrompt({ assetId, defaultName, onComplete, onDismiss }: AssetNamePromptProps) {
  const [name, setName] = useState(defaultName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await libraryService.setName(assetId, name.trim() || undefined);
    if (ok) {
      setSaved(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    }
    setSaving(false);
  };

  return (
    <AnimatePresence>
      {!saved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-theme-surface border-2 border-theme rounded-2xl p-4 space-y-3 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] -z-10" />
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs font-bold text-foreground">Name your creation</p>
            {onDismiss && (
              <button onClick={onDismiss} className="ml-auto w-6 h-6 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              placeholder={`Video Design - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              className="flex-1 bg-theme-background border-2 border-theme rounded-xl px-3 py-2.5 text-xs font-bold text-foreground outline-none focus:border-primary transition-colors"
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2",
                saving ? "bg-slate-800 text-slate-500" : "bg-primary text-foreground hover:opacity-90"
              )}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

          <p className="text-[8px] text-muted-foreground font-medium">
            Leave blank to auto-generate a name based on today&apos;s date
          </p>
        </motion.div>
      )}

      {saved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Creation named successfully</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}