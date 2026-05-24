"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Video, 
  Instagram, 
  Youtube, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService, EngagementMetric } from '@/lib/api-service';

export function SocialAnalytics() {
  const [metrics, setMetrics] = useState<EngagementMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await analyticsService.getSocialEngagement();
      setMetrics(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'TikTok': return <Video className="w-5 h-5" />;
      case 'Instagram': return <Instagram className="w-5 h-5" />;
      case 'YouTube': return <Youtube className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'TikTok': return 'bg-slate-900 text-white';
      case 'Instagram': return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white';
      case 'YouTube': return 'bg-red-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  if (loading) {
    return <div className="h-40 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900">Platform Engagement</h3>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time sync active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div key={metric.platform} className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm group hover:border-blue-100 transition-colors">
            <div className={cn("p-6 flex items-center justify-between", getPlatformColor(metric.platform))}>
               <div className="flex items-center gap-3">
                  {getPlatformIcon(metric.platform)}
                  <span className="font-black uppercase tracking-widest text-xs">{metric.platform}</span>
               </div>
               <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                  <span className="text-[10px] font-black">{metric.conversionRate}% Conv.</span>
               </div>
            </div>
            
            <div className="p-6 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <div className="flex items-center gap-1.5 text-slate-400">
                        <Eye className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Views</span>
                     </div>
                     <p className="text-lg font-black text-slate-900">{(metric.views / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-1.5 text-slate-400">
                        <Heart className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Likes</span>
                     </div>
                     <p className="text-lg font-black text-slate-900">{(metric.likes / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-1.5 text-slate-400">
                        <MessageCircle className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Comments</span>
                     </div>
                     <p className="text-lg font-black text-slate-900">{metric.comments.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-1.5 text-slate-400">
                        <Share2 className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Shares</span>
                     </div>
                     <p className="text-lg font-black text-slate-900">{metric.shares.toLocaleString()}</p>
                  </div>
               </div>

               <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <TrendingUp className="w-4 h-4 text-green-500" />
                     <span className="text-xs font-bold text-green-500">+12.4%</span>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                    View Platform Hub
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
