"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Sun, ShoppingBag, Crosshair, Lightbulb, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService } from '@/lib/api-service';

interface IntelTabProps {
  empireData: any;
}

const INTEL_SECTIONS = [
  { key: 'trendingThemes', label: 'Trending Themes', icon: TrendingUp, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  { key: 'seasonalOpportunities', label: 'Seasonal Opportunities', icon: Sun, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { key: 'hotSellingItems', label: 'Hot Selling Items', icon: ShoppingBag, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  { key: 'lowCompetitionItems', label: 'Low Competition Items', icon: Crosshair, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  { key: 'contentIdeas', label: 'Content Ideas', icon: Lightbulb, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
];

export function IntelTab({ empireData }: IntelTabProps) {
  const [data, setData] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractNiche = () => {
    return empireData?.description?.match(/Empire Niche:\s*(.*?)(?:\.|$)/)?.[1] || empireData?.niche || '';
  };
  const extractAngle = () => {
    return empireData?.description?.match(/Angle:\s*(.*?)(?:\.|$)/)?.[1] || empireData?.angle || '';
  };

  const fetchIntel = useCallback(async () => {
    const niche = extractNiche();
    if (!niche) {
      setError('Set your Business Niche in the Business Info tab to see Intel.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await analyticsService.getIntelTrends({
        niche,
        angle: extractAngle() || undefined,
        targetCustomers: empireData?.targetCustomers || undefined,
        businessGoals: empireData?.businessGoals || undefined,
      });

      const hasData = Object.values(result).some(arr => arr.length > 0);
      if (!hasData) {
        setError('No trend data available yet. Try again later.');
        setData(null);
      } else {
        setData(result as Record<string, string[]>);
      }
    } catch (e: any) {
      console.error('Intel fetch failed:', e);
      setError('Failed to load intel data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [empireData]);

  useEffect(() => {
    fetchIntel();
  }, [fetchIntel]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic">Market Intel</h3>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Real-Time Trend Research</p>
          </div>
        </div>
        <button
          onClick={fetchIntel}
          disabled={loading}
          className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl font-black text-[8px] uppercase tracking-widest text-primary hover:bg-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
          {loading ? 'Researching...' : 'Refresh'}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
            Researching Market Trends...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <AlertCircle className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-sm font-bold text-muted-foreground max-w-md">{error}</p>
        </div>
      )}

      {data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTEL_SECTIONS.map((section) => {
            const Icon = section.icon;
            const items = data[section.key] || [];
            return (
              <div
                key={section.key}
                className="bg-theme-surface border-2 border-theme rounded-2xl p-5 space-y-3 relative overflow-hidden hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all"
              >
                <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] -z-10 opacity-20", section.bgColor)} />
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", section.bgColor)}>
                    <Icon className={cn("w-5 h-5", section.color)} />
                  </div>
                  <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{section.label}</h4>
                </div>
                {items.length > 0 ? (
                  <ul className="space-y-1.5">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-medium text-muted-foreground">
                        <span className={cn("w-1.5 h-1.5 rounded-full mt-1 shrink-0", section.color.replace('text-', 'bg-'))} />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">No data available</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}