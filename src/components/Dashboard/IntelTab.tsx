"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Sun, ShoppingBag, Crosshair, Lightbulb, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService, type IntelItem, type IntelTrendsResult } from '@/lib/api-service';

interface IntelTabProps {
  empireData: any;
}

type IntelSectionKey = 'trendingThemes' | 'seasonalOpportunities' | 'hotSellingItems' | 'lowCompetitionItems' | 'contentIdeas';

const INTEL_SECTIONS: { key: IntelSectionKey; label: string; icon: any; color: string; bgColor: string; source: 'google' | 'etsy' }[] = [
  { key: 'trendingThemes', label: 'Trending Themes', icon: TrendingUp, color: 'text-purple-400', bgColor: 'bg-purple-500/10', source: 'google' },
  { key: 'seasonalOpportunities', label: 'Seasonal Opportunities', icon: Sun, color: 'text-amber-400', bgColor: 'bg-amber-500/10', source: 'google' },
  { key: 'hotSellingItems', label: 'Hot Selling Items', icon: ShoppingBag, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', source: 'etsy' },
  { key: 'lowCompetitionItems', label: 'Low Competition Items', icon: Crosshair, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', source: 'etsy' },
  { key: 'contentIdeas', label: 'Content Ideas', icon: Lightbulb, color: 'text-pink-400', bgColor: 'bg-pink-500/10', source: 'google' },
];

const GOOGLE_UNAVAILABLE = 'Live search is unavailable right now — nothing is shown rather than something invented.';
const ETSY_NOT_CONFIGURED = 'Etsy is not connected yet — add the Etsy keystring and shared secret in Secrets.';
const ETSY_ERROR = 'Etsy did not answer (rate limit or outage) — try again in a few minutes.';

/** "Updated 3 minutes ago" from the server's generatedAt. Never a made-up timestamp. */
function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const diffMs = Date.now() - then;
  if (diffMs < 0) return 'just now';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 minute ago';
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

/** The honest reason a box is empty, in the client's words. */
function sectionStatusLine(section: typeof INTEL_SECTIONS[number], data: IntelTrendsResult): string | null {
  if (section.source === 'google') {
    if (data.sources.google !== 'ok') return data.sources.googleReason || GOOGLE_UNAVAILABLE;
    return 'Google returned no suggestions for this niche right now — refresh to look again.';
  }
  if (data.sources.etsy === 'not_configured') return data.sources.etsyReason || ETSY_NOT_CONFIGURED;
  if (data.sources.etsy === 'error') return data.sources.etsyReason || ETSY_ERROR;
  return 'Etsy returned no listings for this niche right now — refresh to look again.';
}

function SourceBadge({ source }: { source: 'google' | 'etsy' }) {
  return (
    <span
      className={cn(
        'px-1.5 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest shrink-0',
        source === 'etsy'
          ? 'bg-orange-500/10 border-orange-500/20 text-orange-300'
          : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
      )}
    >
      {source === 'etsy' ? 'Etsy' : 'Google'}
    </span>
  );
}

function IntelRow({ item, color }: { item: IntelItem; color: string }) {
  const title = item.url ? (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-foreground hover:underline underline-offset-2 transition-colors inline-flex items-start gap-1"
    >
      <span>{item.text}</span>
      <ExternalLink className="w-2.5 h-2.5 mt-0.5 shrink-0 opacity-60" />
    </a>
  ) : (
    <span>{item.text}</span>
  );

  return (
    <li className="flex items-start gap-2 text-xs font-medium text-muted-foreground">
      <span className={cn('w-1.5 h-1.5 rounded-full mt-1 shrink-0', color.replace('text-', 'bg-'))} />
      <div className="min-w-0 space-y-1">
        <div className="flex items-start gap-2">
          <div className="min-w-0 break-words">{title}</div>
          <SourceBadge source={item.source} />
        </div>
        {item.detail && (
          <p className="text-[10px] text-slate-500 leading-snug break-words">{item.detail}</p>
        )}
      </div>
    </li>
  );
}

export function IntelTab({ empireData }: IntelTabProps) {
  const [data, setData] = useState<IntelTrendsResult | null>(null);
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
      // Always render the boxes: each one carries its own honest reason when a source is down.
      setData(result);
    } catch (e: any) {
      console.error('Intel fetch failed:', e);
      setError('Could not load market intel just now — check your connection and hit Refresh.');
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
        <div className="flex items-center gap-3">
          {data && !loading && (
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Updated {formatRelativeTime(data.generatedAt)}
            </span>
          )}
          <button
            onClick={fetchIntel}
            disabled={loading}
            className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl font-black text-[8px] uppercase tracking-widest text-primary hover:bg-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            {loading ? 'Researching...' : 'Refresh'}
          </button>
        </div>
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
        <div className="space-y-4">
          {data.fallbackMessage && (
            <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-muted-foreground">{data.fallbackMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INTEL_SECTIONS.map((section) => {
              const Icon = section.icon;
              const items: IntelItem[] = data[section.key] || [];
              const statusLine = items.length === 0 ? sectionStatusLine(section, data) : null;
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
                    <span className="ml-auto">
                      <SourceBadge source={section.source} />
                    </span>
                  </div>
                  {items.length > 0 ? (
                    <ul className="space-y-2.5">
                      {items.map((item, idx) => (
                        <IntelRow key={`${item.text}-${idx}`} item={item} color={section.color} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 leading-snug">{statusLine}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
