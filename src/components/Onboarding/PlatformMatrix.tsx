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
  { id: 'instagram', name: 'Instagram', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'youtube', name: 'YouTube (Shorts/Main)', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'facebook', name: 'Facebook', icon: Share2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'pinterest', name: 'Pinterest', icon: Camera, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'shopify', name: 'Shopify Store', icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'etsy', name: 'Etsy Shop', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'fiverr', name: 'Fiverr Gigs', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Platforms You Can Use.</h2>
        <p className="text-slate-500 text-lg">Your AI partner is equipped to manage growth across these channels. You'll securely link your accounts in the Dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;

          return (
            <motion.div
              key={platform.id}
              whileHover={{ y: -5 }}
              className={cn(
                "p-6 rounded-[32px] border-2 transition-all flex flex-col justify-between h-64 relative overflow-hidden group border-slate-100 bg-white hover:border-blue-600 shadow-sm"
              )}
            >
              <div className="flex justify-between items-start">
                <div className={cn("p-4 rounded-2xl", platform.bg)}>
                  <Icon className={cn("w-6 h-6", platform.color)} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Ready to Sync
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-bold text-slate-900">{platform.name}</h3>
                <div className="mt-4 flex flex-col gap-2">
                  <button 
                    onClick={() => setConsultingPlatform(platform.id)}
                    className="w-full py-3 px-4 bg-blue-600/10 text-blue-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    View Strategy
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Background Glow */}
              <div className={cn(
                "absolute -right-8 -bottom-8 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity rounded-full",
                platform.color.replace('text-', 'bg-')
              )} />
            </motion.div>
          );
        })}

        {/* "And Many More" Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col justify-center items-center h-64 text-center space-y-4 group"
        >
          <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm group-hover:border-blue-400 transition-colors">
            <Plus className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">And Many More.</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Your AI can adapt to any marketplace or social ecosystem you choose.</p>
          </div>
        </motion.div>
      </div>

      <AIConsultantOverlay 
        isOpen={!!consultingPlatform}
        onClose={() => setConsultingPlatform(null)}
        platformId={consultingPlatform}
      />
    </div>
  );
}
