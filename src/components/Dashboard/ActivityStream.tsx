"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Video,
  Instagram,
  Target,
  Search,
  Zap,
  ArrowRight,
  ExternalLink,
  Eye,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService, ActivityEvent } from '@/lib/api-service';
import Link from 'next/link';

import { useEmpire } from '@/lib/EmpireContext';
import { BrandedGlobe } from '@/components/BrandedGlobe';

export function ActivityStream() {
  const { connectedPlatforms } = useEmpire();
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const data = await analyticsService.getActivityStream();
    
    // Filter activities based on linked platforms
    // We allow 'AI' and 'Empire' types as they are system-level
    const filtered = data.filter(activity => {
      const platform = activity.platform.toLowerCase();
      if (platform === 'ai' || platform === 'empire') return true;
      return connectedPlatforms.some(cp => cp.toLowerCase() === platform);
    });

    setActivities(filtered);
    setLoading(false);
  }, [connectedPlatforms]);

  useEffect(() => {
    loadData();

    // Mock real-time updates (polling)
    const interval = setInterval(() => {
      loadData();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadData]);

  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'sale': return <ShoppingBag className="w-4 h-4" />;
      case 'post': return <Video className="w-4 h-4" />;
      case 'comment': return <Instagram className="w-4 h-4" />;
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'research': return <Search className="w-4 h-4" />;
      case 'production': return <BrandedGlobe size="sm" animate={true} />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'sale': return 'bg-emerald-500 text-white';
      case 'post': return 'bg-blue-500 text-white';
      case 'comment': return 'bg-purple-500 text-white';
      case 'milestone': return 'bg-slate-900 text-white';
      case 'research': return 'bg-amber-500 text-white';
      case 'production': return 'bg-indigo-500 text-white';
      default: return 'bg-theme-background text-white';
    }
  };

  if (loading) {
    return <div className="h-40 flex items-center justify-center">
      <BrandedGlobe size="sm" animate={true} />
    </div>;
  }

  return (
    <div className="bg-theme-surface border border-theme rounded-[40px] p-8 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-foreground">Activity Stream</h3>
        <button className="p-2 hover:bg-theme-background rounded-xl transition-colors">
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-theme-background">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-12 group"
          >
            <div className={cn(
              "absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg z-10 transition-transform group-hover:scale-110",
              getIconColor(activity.type)
            )}>
               {getIcon(activity.type)}
            </div>

            <div className="space-y-1 flex-1">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activity.platform}</span>
                  <span className="text-[10px] font-bold text-slate-400">{activity.timestamp}</span>
               </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <h4 className="text-sm font-bold text-foreground leading-tight">
                      {activity.title}
                    </h4>

                    {activity.meta?.reasoning && (
                      <p className="text-[10px] text-muted-foreground italic leading-relaxed bg-theme-background p-2 rounded-lg border border-theme">
                        <span className="text-blue-500 font-bold not-italic mr-1">AI Logic:</span>
                        {activity.meta?.reasoning}
                      </p>
                    )}

                    {activity.type === 'sale' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest Revenue Locked">Revenue Locked</span>
                      </div>
                    )}
                  </div>

                  {activity.meta?.link && (
                    <a
                      href={activity.meta.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-2 bg-theme-background text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {activity.meta?.gateId && (
                    <Link
                      href={`/review?id=${activity.meta.gateId}`}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Link>
                  )}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full py-4 bg-theme-background text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-colors">
        Full History
      </button>
    </div>
  );
}
