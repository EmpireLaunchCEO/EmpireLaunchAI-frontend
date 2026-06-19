"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Minus, Maximize2, AlertCircle, ArrowUp, ArrowDown, Minus as MinusIcon } from 'lucide-react';
import { analyticsService, ForecastPoint } from '@/lib/api-service';
import { cn } from '@/lib/utils';

type StoplightStatus = 'green' | 'yellow' | 'red';

function getStoplight(
  firstRevenue: number,
  lastRevenue: number,
  trend: 'up' | 'down' | 'flat'
): { status: StoplightStatus; label: string; description: string } {
  const growth = ((lastRevenue - firstRevenue) / firstRevenue) * 100;

  if (trend === 'up' && growth > 10) {
    return { status: 'green', label: 'Healthy', description: 'Your business is growing well. Keep doing what you\'re doing.' };
  }
  if (trend === 'up' && growth > 0) {
    return { status: 'green', label: 'Healthy', description: 'Moderate growth detected. Stay consistent.' };
  }
  if (trend === 'flat' || (growth >= -5 && growth <= 0)) {
    return { status: 'yellow', label: 'Stable', description: 'Revenue is steady but not growing. Try a new strategy.' };
  }
  if (growth < -5 && growth >= -20) {
    return { status: 'yellow', label: 'Needs Attention', description: 'Revenue is dipping. Check your recent content and engagement.' };
  }
  return { status: 'red', label: 'Needs Attention', description: 'Significant drop detected. Consider pausing to re-strategize.' };
}

function getTrend(firstRevenue: number, lastRevenue: number): 'up' | 'down' | 'flat' {
  const diff = lastRevenue - firstRevenue;
  if (diff > firstRevenue * 0.02) return 'up';
  if (diff < -firstRevenue * 0.02) return 'down';
  return 'flat';
}

const STOPLIGHT_STYLES: Record<StoplightStatus, { dot: string; bg: string; border: string; text: string; icon: any }> = {
  green:  { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: ArrowUp },
  yellow: { dot: 'bg-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: MinusIcon },
  red:    { dot: 'bg-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: ArrowDown },
};

export function GrowthForecastChart() {
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsService.getGrowthForecast();
        if (!cancelled) setForecast(data);
      } catch (e) {
        if (!cancelled) setError('Could not load forecast');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchForecast();
    return () => { cancelled = true; };
  }, []);

  if (!mounted) return null;

  // Loading
  if (loading) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="h-5 w-40 bg-slate-700 rounded animate-pulse mb-6" />
        <div className="h-56 bg-slate-800/50 rounded-[32px] animate-pulse flex items-center justify-center">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Loading forecast...</span>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Forecast</h3>
            <p className="text-xs text-slate-500">Connect platforms to see your growth forecast.</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty
  if (forecast.length === 0) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-sm font-black text-foreground">Growth Forecast</h3>
            <p className="text-xs text-slate-500">Not enough data yet. Keep selling!</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate plain English insights
  const firstRevenue = forecast[0].forecastedRevenue;
  const lastRevenue = forecast[forecast.length - 1].forecastedRevenue;
  const trend = getTrend(firstRevenue, lastRevenue);
  const stoplight = getStoplight(firstRevenue, lastRevenue, trend);
  const TrendIcon = STOPLIGHT_STYLES[stoplight.status].icon;

  // Simple chart
  const values = forecast.map(f => f.forecastedRevenue);
  const minVal = Math.min(...forecast.map(f => f.lowerBound));
  const maxVal = Math.max(...forecast.map(f => f.upperBound));
  const range = maxVal - minVal || 1;
  const chartHeight = 120;
  const chartWidth = 100;
  const pointSpacing = chartWidth / (forecast.length - 1);

  const linePath = values.map((v, i) => {
    const x = i * pointSpacing;
    const y = chartHeight - ((v - minVal) / range) * chartHeight;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const totalProjectedFormatted = `$${(lastRevenue / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const plainEnglishMessage = trend === 'up'
    ? `Sales trending up. You're on track to earn ${totalProjectedFormatted} in 30 days.`
    : trend === 'down'
    ? `Sales slightly down. Your 30-day projection is ${totalProjectedFormatted}.`
    : `Sales are steady. Your 30-day projection is ${totalProjectedFormatted}.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl"
    >
      {/* Stoplight Status — Big & Clear */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center border-2",
            STOPLIGHT_STYLES[stoplight.status].bg,
            STOPLIGHT_STYLES[stoplight.status].border
          )}>
            <TrendIcon className={cn("w-7 h-7", STOPLIGHT_STYLES[stoplight.status].text)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", STOPLIGHT_STYLES[stoplight.status].dot)} />
              <h3 className="text-2xl font-black text-foreground">{stoplight.label}</h3>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">{stoplight.description}</p>
          </div>
        </div>
      </div>

      {/* Simple mini chart */}
      <div className="bg-theme-background/30 rounded-[24px] p-5 border border-theme mb-6">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-32" preserveAspectRatio="xMidYMid meet">
          <motion.path
            d={linePath}
            fill="none"
            stroke="currentColor"
            className={cn(
              stoplight.status === 'green' ? 'text-emerald-400' :
              stoplight.status === 'yellow' ? 'text-amber-400' : 'text-red-400'
            )}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Plain English insight */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-theme-background/40 border border-theme mb-4">
        {trend === 'up' && <ArrowUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
        {trend === 'down' && <ArrowDown className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
        {trend === 'flat' && <MinusIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
        <p className="text-sm text-slate-300 leading-relaxed">{plainEnglishMessage}</p>
      </div>

      {/* Simple stat row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-theme-background/30 rounded-2xl p-4 border border-theme">
          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">30-Day Projection</span>
          <span className="text-lg font-black text-foreground">{totalProjectedFormatted}</span>
        </div>
        <div className="bg-theme-background/30 rounded-2xl p-4 border border-theme">
          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Trend</span>
          <span className="text-lg font-black text-foreground capitalize">{trend === 'up' ? 'Trending Up' : trend === 'down' ? 'Slightly Down' : 'Steady'}</span>
        </div>
      </div>
    </motion.div>
  );
}