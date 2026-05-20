"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Plus, 
  HelpCircle, 
  ShoppingBag, 
  Video, 
  Camera, 
  Globe, 
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIConsultantOverlay } from './AIConsultantOverlay';

const platforms = [
  { id: 'tiktok', name: 'TikTok (Content/Shop)', icon: Video, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'youtube', name: 'YouTube (Shorts/Main)', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'etsy', name: 'Etsy Shop', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'fiverr', name: 'Fiverr Gigs', icon: Zap, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'instagram', name: 'Instagram', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'facebook', name: 'Facebook', icon: Share2, color: 'text-blue-600', bg: 'bg-blue-50' },
];

interface PlatformMatrixProps {
  connectedPlatforms: string[];
  onConnect: (id: string) => void;
}

export function PlatformMatrix({ connectedPlatforms, onConnect }: PlatformMatrixProps) {
  const [consultingPlatform, setConsultingPlatform] = useState<string | null>(null);

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Platform Matrix.</h2>
        <p className="text-slate-500 text-lg">Connect your existing channels or get expert advice on new ones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const isConnected = connectedPlatforms.includes(platform.id);
          const Icon = platform.icon;

          return (
            <motion.div
              key={platform.id}
              whileHover={{ y: -5 }}
              className={cn(
                "p-6 rounded-[32px] border-2 transition-all flex flex-col justify-between h-64 relative overflow-hidden group",
                isConnected ? "border-green-500 bg-white" : "border-slate-100 bg-white hover:border-blue-600 shadow-sm"
              )}
            >
              <div className="flex justify-between items-start">
                <div className={cn("p-4 rounded-2xl", platform.bg)}>
                  <Icon className={cn("w-6 h-6", platform.color)} />
                </div>
                {isConnected ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in duration-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected
                  </div>
                ) : (
                  <button 
                    onClick={() => onConnect(platform.id)}
                    className="p-3 bg-slate-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-bold text-slate-900">{platform.name}</h3>
                {!isConnected ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <button 
                      onClick={() => setConsultingPlatform(platform.id)}
                      className="w-full py-3 px-4 bg-blue-600/10 text-blue-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      Consult AI Wizard
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                           <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-400 opacity-50" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Syncing...</span>
                  </div>
                )}
              </div>

              {/* Background Glow */}
              <div className={cn(
                "absolute -right-8 -bottom-8 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity rounded-full",
                platform.color.replace('text-', 'bg-')
              )} />
            </motion.div>
          );
        })}
      </div>

      <AIConsultantOverlay 
        isOpen={!!consultingPlatform}
        onClose={() => setConsultingPlatform(null)}
        platformId={consultingPlatform}
      />
    </div>
  );
}
