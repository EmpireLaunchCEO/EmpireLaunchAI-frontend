"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Minus, Maximize2, AlertCircle, ArrowUp, ArrowDown, Minus as MinusIcon, Activity } from 'lucide-react';
import { analyticsService, ForecastPoint } from '@/lib/api-service';
import { cn } from '@/lib/utils';

type StoplightStatus = 'healthy' | 'stable' | 'at_risk';

interface EmpireHealthStatus {
  status: StoplightStatus;
  description: string;
  progress: number;
  insights: string[];
  revenue: number;
  monthlyRevenue: number;
  profitMargin: number;
}

const STOPLIGHT_CONFIG: Record<StoplightStatus, { dot: string; bg: string; border: string; text: string; label: string; icon: any }> = {
  healthy: { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'Healthy', icon: ArrowUp },
  stable:  { dot: 'bg-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', label: 'Stable', icon: MinusIcon },
  at_risk: { dot: 'bg-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', label: 'Needs Attention', icon: ArrowDown },
};

export function GrowthForecastChart() {
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [health, setHealth] = useState<EmpireHealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [forecastData, healthData] = await Promise.all([
          analyticsService.getGrowthForecast(),
          analyticsService.getEmpireHealth().catch(() => null)
        ]);
        if (cancelled) return;
        setForecast(forecastData || []);
        if (healthData) {
          setHealth({
            status: (healthData as any).status || 'stable',
            description: (healthData as any).description || '',
            progress: healthData.growthScore || 0,
            insights: (healthData as any).logs || [],
            revenue: healthData.revenue || 0,
            monthlyRevenue: (healthData as any).health?.monthlyRevenue || 0,
            profitMargin: (healthData as any).health?.profitMargin || 0,
          });
        }
      } catch (e) {
        if (!cancelled) setError('Could not load health data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (!mounted) return null;

  // Loading
  if (loading) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="h-5 w-40 bg-slate-700 rounded animate-pulse mb-6" />
        <div className="h-56 bg-slate-800/50 rounded-[32px] animate-pulse flex items-center justify-center">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Loading health status...</span>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
            <Activity className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">Empire Health</h3>
            <p className="text-xs text-slate-500">Connect platforms to see your health status.</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine stoplight status
  const status: StoplightStatus = health?.status || (forecast.length > 0 ? 'healthy' : 'stable');
  const cfg = STOPLIGHT_CONFIG[status];
  const TrendIcon = cfg.icon;

  // Pick first insight or generate one
  const insight = health?.insights?.[0] || 
    (forecast.length > 0 ? 'Your empire is active. Keep creating content to grow.' : 'Start linking platforms to begin.');

  // Simple chart if forecast exists
  const hasForecast = forecast.length > 0;
  const firstRevenue = hasForecast ? forecast[0].forecastedRevenue : 0;
  const lastRevenue = hasForecast ? forecast[forecast.length - 1].forecastedRevenue : 0;
  const totalProjectedFormatted = hasForecast 
    ? `$${(lastRevenue / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl"
    >
      {/* ── BIG STOPLIGHT STATUS ─────────────────────────── */}
      <div className={cn(
        "rounded-[28px] p-6 border-2 mb-6",
        cfg.bg, cfg.border
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center border-2",
            cfg.bg, cfg.border
          )}>
            <TrendIcon className={cn("w-8 h-8", cfg.text)} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("w-3.5 h-3.5 rounded-full", cfg.dot)} />
              <h2 className="text-2xl font-black text-foreground">{cfg.label}</h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{insight}</p>
          </div>
        </div>
      </div>

      {/* ── MINI CHART (only when forecast data exists) ──── */}
      {hasForecast && (
        <div className="bg-theme-background/30 rounded-[24px] p-5 border border-theme mb-4">
          <svg viewBox="0 0 100 80" className="w-full h-24" preserveAspectRatio="xMidYMid meet">
            <motion.path
              d={forecast.map((f, i) => {
                const x = (i / (forecast.length - 1)) * 100;
                const y = 80 - ((f.forecastedRevenue - Math.min(...forecast.map(p => p.lowerBound))) / 
                  (Math.max(...forecast.map(p => p.upperBound)) - Math.min(...forecast.map(p => p.lowerBound)) || 1)) * 80;
                return `${i === 0 ? 'M' : 'L'}${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="currentColor"
              className={status === 'healthy' ? 'text-emerald-400' : status === 'stable' ? 'text-amber-400' : 'text-red-400'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
        </div>
      )}

      {/* ── PLAIN ENGLISH STATS ──────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-theme-background/30 rounded-2xl p-4 border border-theme">
          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Status</span>
          <span className={cn("text-sm font-black", cfg.text)}>{cfg.label}</span>
        </div>
        {hasForecast && (
          <div className="bg-theme-background/30 rounded-2xl p-4 border border-theme">
            <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">30-Day Projection</span>
            <span className="text-sm font-black text-foreground">{totalProjectedFormatted}</span>
          </div>
        )}
        {health && (
          <>
            <div className="bg-theme-background/30 rounded-2xl p-4 border border-theme">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Monthly Revenue</span>
              <span className="text-sm font-black text-foreground">${(health.monthlyRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="bg-theme-background/30 rounded-2xl p-4 border border-theme">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Profit Margin</span>
              <span className={cn(
                "text-sm font-black",
                health.profitMargin > 0 ? 'text-emerald-400' : health.profitMargin < 0 ? 'text-red-400' : 'text-slate-400'
              )}>{health.profitMargin || 0}%</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}