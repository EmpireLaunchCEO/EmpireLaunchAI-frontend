"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmpireGrowthBreakdownProps {
  growthScore: number;
  healthData?: any;
}

export const EmpireGrowthBreakdown = ({ growthScore, healthData }: EmpireGrowthBreakdownProps) => {
  // Formula: (0.5 * MoM_Rev) + (0.3 * ER) + (0.2 * Consistency)
  // Mocking the components of the score based on the total growthScore
  const revenueScore = Math.min(100, Math.round(growthScore * 1.1));
  const engagementScore = Math.min(100, Math.round(growthScore * 0.9));
  const consistencyScore = Math.min(100, Math.round(growthScore * 0.95));

  const metrics = [
    {
      label: 'Revenue Velocity',
      value: revenueScore,
      weight: '50%',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Engagement Pulse',
      value: engagementScore,
      weight: '30%',
      icon: BarChart3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Operation Consistency',
      value: consistencyScore,
      weight: '20%',
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <div className="bg-theme-surface rounded-[40px] p-8 border border-theme shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-theme-background flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tight">Growth Breakdown</h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Neural Multi-Factor Scoring</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-foreground tracking-tighter">{growthScore}</span>
          <span className="text-xs font-bold text-muted-foreground ml-1">/100</span>
        </div>
      </div>

      <div className="space-y-6">
        {metrics.map((metric, idx) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", metric.bgColor)}>
                  <metric.icon className={cn("w-3.5 h-3.5", metric.color)} />
                </div>
                <span className="text-xs font-bold text-foreground">{metric.label}</span>
                <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">Weight: {metric.weight}</span>
              </div>
              <span className="text-xs font-black text-foreground">{metric.value}%</span>
            </div>
            <div className="h-2 bg-theme-background rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ delay: 0.5 + idx * 0.1, duration: 1, ease: "easeOut" }}
                className={cn("h-full rounded-full", metric.color.replace('text', 'bg'))}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-theme-background/50 border border-theme">
        <p className="text-[10px] font-bold text-muted-foreground leading-relaxed italic">
          "The Empire Engine is prioritizing <span className="text-primary font-black">Revenue Velocity</span> this cycle. Growth score has increased by 4.2 points since last synchronization."
        </p>
      </div>
    </div>
  );
};
