"use client";
import { cn } from "@/lib/utils";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Zap, History, Info } from 'lucide-react';
import { retentionService, TrustScore, SentimentPoint } from '@/lib/api-service';

export const TrustPulse = () => {
  const [score, setScore] = useState<TrustScore | null>(null);
  const [sentimentMap, setSentimentMap] = useState<SentimentPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [scoreData, sentimentData] = await Promise.all([
        retentionService.getTrustPulse(),
        retentionService.getSentimentMap()
      ]);
      setScore(scoreData);
      setSentimentMap(sentimentData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading || !score) {
    return <div className="h-64 flex items-center justify-center bg-theme-surface rounded-[40px] border border-theme animate-pulse" />;
  }

  const metrics = [
    {
      label: 'Review Velocity',
      value: score.velocity,
      weight: '40%',
      icon: History,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      label: 'Sentiment Analysis',
      value: score.sentiment,
      weight: '40%',
      icon: Heart,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10'
    },
    {
      label: 'Response Agility',
      value: score.agility,
      weight: '20%',
      icon: Zap,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
  ];

  // Simple Sentiment Chart
  const scores = sentimentMap.length > 0 ? sentimentMap.map(p => p.score) : [0];
  const maxScore = Math.max(...scores, 100);
  const minScore = Math.min(...scores, 0);
  const range = maxScore - minScore;

  return (
    <div className="bg-theme-surface rounded-[40px] p-8 border border-theme shadow-sm space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tight italic uppercase">Trust Pulse</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Brand Authority Multiplier</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-foreground tracking-tighter">{score.score}</span>
          <span className="text-xs font-bold text-muted-foreground ml-1">ETS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <div key={metric.label} className="p-4 rounded-3xl bg-theme-background border border-theme space-y-3">
            <div className="flex items-center justify-between">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", metric.bgColor)}>
                <metric.icon className={cn("w-4 h-4", metric.color)} />
              </div>
              <span className="text-xs font-black text-foreground">{metric.value}%</span>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-foreground leading-none">{metric.label}</p>
               <p className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest">Weight: {metric.weight}</p>
            </div>
            <div className="h-1 bg-theme-surface rounded-full overflow-hidden">
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: `${metric.value}%` }}
                 transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                 className={cn("h-full", metric.color.replace('text', 'bg'))}
               />
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between px-2">
           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sentiment Map (7D)</span>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold text-foreground">Score Trend</span>
           </div>
        </div>

        <div className="h-32 w-full flex items-end justify-between gap-1 px-2 relative">
           {/* Grid lines */}
           <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
              <div className="w-full border-t border-foreground" />
              <div className="w-full border-t border-foreground" />
              <div className="w-full border-t border-foreground" />
           </div>

           {sentimentMap.map((point, idx) => {
             const height = `${((point.score - minScore) / (range || 1)) * 100}%`;
             return (
               <div key={point.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                 <motion.div
                   initial={{ height: 0 }}
                   animate={{ height: height }}
                   transition={{ delay: 0.8 + idx * 0.05, duration: 0.5 }}
                   className="w-full max-w-[12px] bg-primary rounded-t-full rounded-b-sm group-hover:bg-primary/80 transition-colors"
                 />
                 <span className="text-[8px] font-bold text-muted-foreground rotate-45 mt-2 origin-left whitespace-nowrap">
                    {new Date(point.date).toLocaleDateString('en-US', { weekday: 'short' })}
                 </span>

                 {/* Tooltip */}
                 <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-white/10 shadow-xl">
                    {point.score}% Sentiment
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
        <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-muted-foreground leading-relaxed italic">
          "The <span className="text-primary font-black uppercase">Retention Oracle</span> reports high satisfaction for Digital Art products. Review velocity is peaking on Etsy (+12%)."
        </p>
      </div>
    </div>
  );
};
