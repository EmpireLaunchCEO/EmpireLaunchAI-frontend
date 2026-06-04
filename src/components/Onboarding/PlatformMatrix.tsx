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
  Zap,
  Mail,
  Stars
} from 'lucide-react';
import { cn } from '@/lib/utils';

const platforms = [
  { id: 'tiktok', name: 'TikTok (Content/Shop)', icon: Video, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'instagram', name: 'Instagram', icon: Camera, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'youtube', name: 'YouTube (Shorts/Main)', icon: Video, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'facebook', name: 'Facebook', icon: Share2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'gmail', name: 'Gmail (AI Assistant)', icon: Mail, color: 'text-red-400', bg: 'bg-red-400/10' },
  { id: 'pinterest', name: 'Pinterest', icon: Camera, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'shopify', name: 'Shopify Store', icon: Globe, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'etsy', name: 'Etsy Shop', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'amazon', name: 'Amazon Seller', icon: ShoppingBag, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'fiverr', name: 'Fiverr Gigs', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'canva', name: 'Canva (Design)', icon: Stars, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'kittle', name: 'Kittle (Design)', icon: Stars, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { id: 'capcut', name: 'Capcut (Video)', icon: Video, color: 'text-primary', bg: 'bg-primary/10' },
];

import { BrandedGlobe } from '@/components/BrandedGlobe';

interface PlatformMatrixProps {
  connectedPlatforms: string[];
  onConnect: (id: string) => void;
}

export function PlatformMatrix({ connectedPlatforms, onConnect }: PlatformMatrixProps) {
  // Use the global context's platforms to ensure NO duplicates or re-population
  const { connectedPlatforms: globalPlatforms, connectPlatform } = useEmpire();
  
  const displayPlatforms = [...new Set([...connectedPlatforms, ...globalPlatforms])];
  const [consultingPlatform, setConsultingPlatform] = useState<string | null>(null);

  return (
    <div className="space-y-10 max-w-md mx-auto pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight uppercase italic">Platforms You Can Use.</h2>
        <p className="text-muted-foreground text-sm md:text-lg font-medium italic">"Your AI partner is equipped to manage growth across these channels. You'll securely link your accounts in the Dashboard."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;

          return (
            <motion.div
              key={platform.id}
              whileHover={{ y: -5 }}
              className={cn(
                "p-5 md:p-6 rounded-[28px] md:rounded-[32px] border-2 transition-all flex flex-col justify-between h-56 md:h-64 relative overflow-hidden group border-slate-800 bg-slate-900 hover:border-primary shadow-sm"
              )}
            >
              <div className="flex justify-between items-start">
                <div className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl", platform.bg)}>
                  <Icon className={cn("w-5 h-5 md:w-6 h-6", platform.color)} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 text-slate-500 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-slate-800">
                  Ready to Sync
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight">{platform.name}</h3>
                <div className="mt-3 md:mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => setConsultingPlatform(platform.id)}
                    className="w-full py-2.5 md:py-3 px-4 bg-primary/10 text-primary rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-slate-900 transition-all flex items-center justify-center gap-2 group/btn border border-primary/20"
                  >
                    <Zap className="w-3 md:w-3.5 h-3 md:h-3.5 fill-current" />
                    View Strategy
                    <ChevronRight className="w-3 md:w-3.5 h-3 md:h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Background Glow */}
              <div className={cn(
                "absolute -right-8 -bottom-8 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity rounded-full",
                platform.color.replace('text-', 'bg-')
              )} />
            </motion.div>
          );
        })}

        {/* "And Many More" Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 rounded-[32px] border-2 border-dashed border-slate-800 bg-slate-900/50 flex flex-col justify-center items-center h-64 text-center space-y-4 group transition-colors hover:border-primary/40"
        >
          <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-sm group-hover:border-primary transition-colors">
            <Plus className="w-8 h-8 text-slate-700 group-hover:text-primary transition-colors" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase italic">And Many More.</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Your AI can adapt to any marketplace.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
