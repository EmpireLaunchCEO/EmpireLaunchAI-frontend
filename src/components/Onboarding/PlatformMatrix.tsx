"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ShoppingBag,
  Video,
  Camera,
  Globe,
  Share2,
  Zap,
  Mail,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const platformData: Record<string, { name: string; icon: any; color: string }> = {
  tiktok: { name: 'TikTok', icon: Video, color: 'text-pink-500' },
  instagram: { name: 'Instagram', icon: Camera, color: 'text-purple-500' },
  youtube: { name: 'YouTube', icon: Video, color: 'text-red-500' },
  facebook: { name: 'Facebook', icon: Share2, color: 'text-blue-500' },
  pinterest: { name: 'Pinterest', icon: Camera, color: 'text-rose-500' },
  shopify: { name: 'Shopify', icon: Globe, color: 'text-green-500' },
  etsy: { name: 'Etsy', icon: ShoppingBag, color: 'text-orange-500' },
  amazon: { name: 'Amazon', icon: ShoppingBag, color: 'text-yellow-500' },
  fiverr: { name: 'Fiverr', icon: Zap, color: 'text-emerald-500' },
  gmail: { name: 'Gmail', icon: Mail, color: 'text-cyan-500' },
};

interface PlatformMatrixProps {
  selectedPlatform: string;
  onConnect: (id: string) => void;
}

export function PlatformMatrix({ selectedPlatform, onConnect }: PlatformMatrixProps) {
  const platform = platformData[selectedPlatform];
  if (!platform) return null;

  const Icon = platform.icon;

  return (
    <div className="space-y-10 max-w-md mx-auto pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-black text-theme-gradient tracking-tight uppercase italic">Link Your Account.</h2>
        <p className="text-muted-foreground text-sm md:text-lg font-medium italic">"Connect your platform to let your AI partner manage growth."</p>
      </div>

      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-[32px] border-2 border-primary/30 bg-slate-900 text-center space-y-6 max-w-sm"
        >
          <div className={cn("p-5 rounded-2xl mx-auto w-fit", platform.color.replace('text-', 'bg-') + '/10')}>
            <Icon className={cn("w-10 h-10", platform.color)} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase italic">{platform.name}</h3>
            <p className="text-xs text-slate-400 font-medium mt-2">Your selected platform for this business</p>
          </div>
          <button
            onClick={() => onConnect(selectedPlatform)}
            className="w-full bg-primary text-slate-900 py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Link Your {platform.name} Account
          </button>
          <p className="text-[9px] text-slate-500 font-medium">You can manage connections later in your Dashboard.</p>
        </motion.div>
      </div>
    </div>
  );
}
