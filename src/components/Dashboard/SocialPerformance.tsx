"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Globe, 
  Play, 
  Users, 
  Heart, 
  Eye, 
  TrendingUp, 
  Sparkles,
  ArrowUpRight,
  MessageCircle,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const recentPosts = [
  {
    id: '1',
    platform: 'TikTok',
    title: 'Boho Journal Reveal',
    thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400&auto=format&fit=crop',
    stats: { reach: '124.5K', engagement: '8.2%', conversion: '3.1%' },
    status: 'winning'
  },
  {
    id: '2',
    platform: 'Instagram',
    title: 'Sage Green Moodboard',
    thumbnail: 'https://images.unsplash.com/photo-1544816153-151515bf659c?q=80&w=400&auto=format&fit=crop',
    stats: { reach: '45.2K', engagement: '5.4%', conversion: '1.2%' },
    status: 'normal'
  },
  {
    id: '3',
    platform: 'YouTube',
    title: 'Digital Planning 101',
    thumbnail: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=400&auto=format&fit=crop',
    stats: { reach: '12.8K', engagement: '12.1%', conversion: '4.5%' },
    status: 'normal'
  }
];

export function SocialPerformance() {
  const winningPost = recentPosts.find(p => p.status === 'winning');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Social Performance</h2>
        <div className="flex gap-2">
           <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
             Live Tracking
           </span>
        </div>
      </div>

      {winningPost && (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
          <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
            <Sparkles className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span className="text-xs font-black uppercase tracking-widest">Winning Post Spotlight</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-4xl font-black leading-tight">"{winningPost.title}" is scaling fast.</h3>
                <p className="text-blue-100 font-medium leading-relaxed">
                  This post has a 250% higher conversion rate than your average. Should I create a few variations for next week?
                </p>
              </div>

              <div className="flex gap-4">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-3xl font-black text-sm hover:scale-105 transition-transform">
                  Scale with AI
                </button>
                <button className="bg-white/10 text-white px-6 py-4 rounded-3xl font-black text-sm hover:bg-white/20 transition-all">
                  View Data
                </button>
              </div>
            </div>

            <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl group cursor-pointer">
              <img 
                src={winningPost.thumbnail} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt="Winning post" 
              />
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                    <Play className="w-6 h-6 fill-white text-white" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden relative">
              <img 
                src={post.thumbnail} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={post.title} 
              />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2">
                {post.platform === 'TikTok' ? <Video className="w-3 h-3 text-white" /> : <Globe className="w-3 h-3 text-white" />}
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{post.platform}</span>
              </div>
              {post.status === 'winning' && (
                 <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1.5 rounded-xl shadow-lg border border-blue-400">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Winning</span>
                 </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              <h4 className="font-bold text-slate-900 text-lg truncate">{post.title}</h4>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 p-3 rounded-2xl space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Reach</p>
                  <p className="text-xs font-black text-slate-900">{post.stats.reach}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Engage</p>
                  <p className="text-xs font-black text-slate-900">{post.stats.engagement}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-2xl space-y-1 border border-blue-100">
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Sales</p>
                  <p className="text-xs font-black text-blue-600">{post.stats.conversion}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                 <div className="flex items-center gap-3 text-slate-400">
                    <Heart className="w-4 h-4" />
                    <MessageCircle className="w-4 h-4" />
                    <Share2 className="w-4 h-4" />
                 </div>
                 <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                   Full Report <ArrowUpRight className="w-3 h-3" />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
