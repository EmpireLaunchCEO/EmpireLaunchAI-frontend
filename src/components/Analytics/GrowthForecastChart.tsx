"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Minus, Maximize2, ChevronRight, AlertCircle } from 'lucide-react';
import { analyticsService, ForecastPoint } from '@/lib/api-service';
import { cn } from '@/lib/utils';

export function GrowthForecastChart() {
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-growth-forecast');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsService.getGrowthForecast();
        if (!cancelled) setForecast(data);
      } catch (e) {
        if (!cancelled) setError('Failed to load forecast data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchForecast();
    return () => { cancelled = true; };
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-growth-forecast', String(newState));
  };

  if (!mounted) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-6 border-2 border-theme shadow-xl flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Growth Forecast</h2>
        </div>
        <button onClick={toggleMinimize} className="p-3 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 animate-pulse" />
            <div>
              <div className="h-5 w-40 bg-slate-700 rounded animate-pulse" />
              <div className="h-3 w-24 bg-slate-700 rounded mt-1 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="h-56 bg-slate-800/50 rounded-[32px] animate-pulse flex items-center justify-center">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Loading Forecast...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Forecast Unavailable</h3>
            <p className="text-[10px] text-slate-500 mt-1">Connect data sources to enable projections.</p>
          </div>
        </div>
        <div className="h-56 border-2 border-dashed border-white/5 rounded-[32px] flex items-center justify-center">
          <p className="text-[10px] font-bold text-slate-600 italic">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (forecast.length === 0) {
    return (
      <div className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Growth Forecast</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">30-Day Revenue Projection</p>
          </div>
        </div>
        <div className="h-56 border-2 border-dashed border-white/5 rounded-[32px] flex items-center justify-center">
          <p className="text-[10px] font-bold text-slate-600 italic">Insufficient data to generate forecast. Sync your platforms.</p>
        </div>
      </div>
    );
  }

  // Calculate chart dimensions
  const values = forecast.map(f => f.forecastedRevenue);
  const minVal = Math.min(...forecast.map(f => f.lowerBound));
  const maxVal = Math.max(...forecast.map(f => f.upperBound));
  const range = maxVal - minVal || 1;
  const chartHeight = 180;
  const chartWidth = 100;
  const pointSpacing = chartWidth / (forecast.length - 1);

  // Build SVG path for forecast line
  const linePath = values.map((v, i) => {
    const x = i * pointSpacing;
    const y = chartHeight - ((v - minVal) / range) * chartHeight;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  // Build upper/lower bound area
  const upperPath = forecast.map((f, i) => {
    const x = i * pointSpacing;
    const y = chartHeight - ((f.upperBound - minVal) / range) * chartHeight;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const lowerPath = forecast.map((f, i) => {
    const x = i * pointSpacing;
    const y = chartHeight - ((f.lowerBound - minVal) / range) * chartHeight;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const lastForecast = forecast[forecast.length - 1];
  const totalProjected = lastForecast.forecastedRevenue;
  const totalProjectedFormatted = `$${(totalProjected / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-surface rounded-[40px] p-8 border-2 border-theme shadow-2xl relative overflow-hidden"
    >
      {/* Minimize Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button onClick={toggleMinimize} className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95">
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Growth Forecast</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">30-Day Revenue Projection</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">ARIMA+ ML Model</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full overflow-x-auto pb-4">
        <svg viewBox={`0 0 ${chartWidth + 20} ${chartHeight + 40}`} className="w-full h-auto max-h-64" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = chartHeight - pct * chartHeight;
            const val = Math.round(minVal + pct * range);
            return (
              <g key={pct}>
                <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="currentColor" className="text-white/5" strokeWidth="1" />
                <text x={chartWidth + 4} y={y + 3} className="text-[6px] fill-slate-600 font-bold" textAnchor="start">
                  ${(val / 100).toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Confidence interval area */}
          <path d={`${upperPath} ${lowerPath.split('').reverse().join('')}`} fill="url(#confidenceGrad)" opacity="0.15" />

          {/* Upper bound line */}
          <path d={upperPath} fill="none" stroke="currentColor" className="text-primary/20" strokeWidth="1" strokeDasharray="3,3" />

          {/* Lower bound line */}
          <path d={lowerPath} fill="none" stroke="currentColor" className="text-primary/20" strokeWidth="1" strokeDasharray="3,3" />

          {/* Main forecast line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#forecastGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Data points */}
          {forecast.filter((_, i) => i % Math.max(1, Math.floor(forecast.length / 10)) === 0 || i === forecast.length - 1).map((f, i) => {
            const v = f.forecastedRevenue;
            const x = i * pointSpacing * (forecast.length / Math.max(1, Math.floor(forecast.length / 10)) > 1 ? 1 : 1);
            // Recalculate actual x position
            const actualIdx = forecast.indexOf(f);
            const actualX = actualIdx * pointSpacing;
            const actualY = chartHeight - ((v - minVal) / range) * chartHeight;
            return (
              <g key={f.date}>
                <circle cx={actualX} cy={actualY} r="3" className="fill-primary" />
                <text x={actualX} y={chartHeight + 16} className="text-[5px] fill-slate-500 font-bold" textAnchor="middle" transform={`rotate(-30, ${actualX}, ${chartHeight + 16})`}>
                  {new Date(f.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </text>
              </g>
            );
          })}

          <defs>
            <linearGradient id="forecastGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="confidenceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-theme-background/30 rounded-2xl p-5 border border-theme">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Projected End Revenue</span>
          <span className="text-lg font-black text-foreground">{totalProjectedFormatted}</span>
        </div>
        <div className="bg-theme-background/30 rounded-2xl p-5 border border-theme">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Forecast Days</span>
          <span className="text-lg font-black text-foreground">{forecast.length} days</span>
        </div>
        <div className="bg-theme-background/30 rounded-2xl p-5 border border-theme">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Avg Daily Growth</span>
          <span className="text-lg font-black text-emerald-400">+{(Math.pow(lastForecast.forecastedRevenue / forecast[0].forecastedRevenue, 1 / forecast.length) - 1) * 100 > 0 ? '+' : ''}{((Math.pow(lastForecast.forecastedRevenue / forecast[0].forecastedRevenue, 1 / forecast.length) - 1) * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Confidence note */}
      <div className="flex items-center gap-2 mt-6 px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        <p className="text-[8px] font-medium text-slate-500 italic">
          Confidence interval (±10%) shown as shaded area. Based on ARIMA+ ML model using historical revenue data and platform engagement signals.
        </p>
      </div>
    </motion.div>
  );
}