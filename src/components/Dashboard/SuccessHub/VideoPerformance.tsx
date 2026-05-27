"use client";

import React from 'react';
import { Play, Eye, Heart, Share2, MousePointer2, Stars, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_VIDEOS = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    platform: 'TikTok',
    views: '12.4K',
    likes: '1.2K',
    clicks: 84,
    insight: 'High Virality Potential',
    status: 'Trending'
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=400&h=400&fit=crop',
    platform: 'Instagram',
    views: '8.2K',
    likes: '942',
    clicks: 126,
    insight: 'High Conversion',
    status: 'Stable'
  },
  {
    id: 3,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop',
    platform: 'YouTube',
    views: '2.1K',
    likes: '341',
    clicks: 42,
    insight: 'Needs Hook Optimization',
    status: 'At Risk'
  }
];

export const VideoPerformance = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Video Performance</h3>
        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
          View All Content
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_VIDEOS.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[32px] overflow-hidden border-2 border-slate-50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="relative aspect-square">
              <img 
                src={video.thumbnail} 
                alt="Thumbnail" 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    video.status === 'Trending' ? 'bg-emerald-500 animate-pulse' : 
                    video.status === 'Stable' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{video.status}</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                     <Play className="w-3 h-3 text-white fill-current" />
                   </div>
                   <span className="text-white text-xs font-bold">{video.platform}</span>
                </div>
                <div className="bg-blue-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1">
                   <MousePointer2 className="w-2.5 h-2.5" />
                   {video.clicks} Clicks
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-slate-500">
                <div className="flex flex-col items-center flex-1 border-r border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" /> Views
                  </span>
                  <span className="text-sm font-black text-slate-900">{video.views}</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5" /> Likes
                  </span>
                  <span className="text-sm font-black text-slate-900">{video.likes}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Stars className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">AI Intelligent Insight</span>
                </div>
                <p className="text-[11px] font-bold text-slate-700 leading-snug">
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
