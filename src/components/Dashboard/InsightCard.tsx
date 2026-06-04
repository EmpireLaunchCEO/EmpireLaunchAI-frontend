"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  ExternalLink,
  Play,
  X,
  Stars,
} from 'lucide-react';
import { BrandedGlobe } from '@/components/BrandedGlobe';

interface InsightCardProps {
  platform: 'Etsy' | 'TikTok' | 'Instagram' | 'Youtube';
  title: string;
  description: string;
  roi: string;
  onExecute?: () => void;
  isExecuting?: boolean;
}

export function InsightCard({ platform, title, description, roi, onExecute, isExecuting }: InsightCardProps) {
  return (
    <div className="bg-theme-surface p-6 rounded-2xl shadow-sm border border-theme hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Stars className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{platform}</span>
        </div>
        <div className="bg-green-100/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
          {roi} ROI
        </div>
      </div>

      <h4 className="text-lg font-bold text-foreground mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={onExecute}
          disabled={isExecuting}
          className={cn(
            "flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
            isExecuting
              ? "bg-primary text-slate-900 cursor-wait"
              : "bg-primary text-slate-900 hover:bg-white"
          )}
        >
          {isExecuting ? (
            <>
              <BrandedGlobe size="sm" animate={true} />
              Creating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Execute
            </>
          )}
        </button>
        <button className="p-2.5 rounded-xl border border-theme text-slate-400 hover:text-foreground hover:bg-theme-background transition-all">
          <ExternalLink className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-xl border border-theme text-slate-400 hover:text-red-500 hover:bg-red-50/10 transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
