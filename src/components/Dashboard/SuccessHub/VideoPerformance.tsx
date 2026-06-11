"use client";

import React from 'react';
import { Play, Eye, Heart, Share2, MousePointer2, Stars, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import { useEmpire } from '@/lib/EmpireContext';

const MOCK_VIDEOS = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    platform: 'TikTok',
    views: '0',
    likes: '0',
    clicks: 0,
    insight: 'Establishing neural sync...',
    status: 'Syncing'
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=400&h=400&fit=crop',
    platform: 'Instagram',
    views: '0',
    likes: '0',
    clicks: 0,
    insight: 'Establishing neural sync...',
    status: 'Syncing'
  },
  {
    id: 3,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop',
    platform: 'YouTube',
    views: '0',
    likes: '0',
    clicks: 0,
    insight: 'Establishing neural sync...',
    status: 'Syncing'
  }
];

export const VideoPerformance = () => {
  const { connectedPlatforms } = useEmpire();
  
  const filteredVideos = MOCK_VIDEOS.filter(v => 
    (connectedPlatforms || []).some(cp => cp && cp.toLowerCase() === v.platform.toLowerCase())
  );

  if (filteredVideos.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-foreground tracking-tight">Video Performance</h3>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-80 transition-colors">
          View All Content
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredVideos.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-theme-surface rounded-[32px] overflow-hidden border border-theme shadow-sm hover:shadow-md transition-all group"
          >
            <div className="relative aspect-square">
              <img
                src={video.thumbnail}
                alt="Thumbnail"
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

              <div className="absolute top-4 left-4">
                <div className="bg-theme-surface/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    video.status === 'Trending' ? 'bg-emerald-500 animate-pulse' :
                    video.status === 'Stable' ? 'bg-primary' : 'bg-amber-500'
                  }`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{video.status}</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-theme-surface/20 backdrop-blur-md flex items-center justify-center">
                     <Play className="w-3 h-3 text-white fill-current" />
                   </div>
                   <span className="text-white text-xs font-bold">{video.platform}</span>
                </div>
                <div className="bg-primary text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
                   <MousePointer2 className="w-2.5 h-2.5" />
                   {video.clicks} Clicks
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <div className="flex flex-col items-center flex-1 border-r border-theme">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-1 flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" /> Views
                  </span>
                  <span className="text-sm font-black text-foreground">{video.views}</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-1 flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5" /> Likes
                  </span>
                  <span className="text-sm font-black text-foreground">{video.likes}</span>
                </div>
              </div>

              <div className="bg-theme-background rounded-2xl p-3 border border-theme">
                <div className="flex items-center gap-2 mb-1">
                  <Stars className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">AI Intelligent Insight</span>
                </div>
                <p className="text-[11px] font-bold text-foreground leading-snug">
                  {video.insight}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
