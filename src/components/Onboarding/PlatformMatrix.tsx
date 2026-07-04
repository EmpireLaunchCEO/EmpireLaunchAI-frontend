"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const platformData: Record<string, { name: string; icon: any; color: string }> = {
  tiktok: { name: 'TikTok', icon: null, color: 'text-pink-500' },
  instagram: { name: 'Instagram', icon: null, color: 'text-purple-500' },
  youtube: { name: 'YouTube', icon: null, color: 'text-red-500' },
  facebook: { name: 'Facebook', icon: null, color: 'text-blue-500' },
  pinterest: { name: 'Pinterest', icon: null, color: 'text-rose-500' },
  shopify: { name: 'Shopify', icon: null, color: 'text-green-500' },
  etsy: { name: 'Etsy', icon: null, color: 'text-orange-500' },
  amazon: { name: 'Amazon', icon: null, color: 'text-yellow-500' },
  fiverr: { name: 'Fiverr', icon: null, color: 'text-emerald-500' },
  gmail: { name: 'Gmail', icon: null, color: 'text-cyan-500' },
};

interface PlatformMatrixProps {
  selectedPlatforms: string[];
}

export function PlatformMatrix({ selectedPlatforms }: PlatformMatrixProps) {
  const hasPlatforms = selectedPlatforms && selectedPlatforms.length > 0;
  const items = hasPlatforms ? selectedPlatforms.map(function(id: string) {
    const platform = platformData[id];
    return platform;
  }).filter(Boolean) : [];

  if (!hasPlatforms) {
    return (
      <div className="space-y-10 max-w-md mx-auto pb-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-theme-gradient tracking-tight uppercase italic">Platforms Selected.</h2>
          <p className="text-muted-foreground text-sm md:text-lg font-medium italic">You can link your accounts in the Link Center from your Dashboard.</p>
        </div>
        <div className="text-center py-12">
          <p className="text-sm text-slate-500 font-medium">No platforms selected yet.</p>
          <p className="text-xs text-slate-600 mt-1">Go back to the previous step to choose your platforms.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-md mx-auto pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-black text-theme-gradient tracking-tight uppercase italic">Platforms Selected.</h2>
        <p className="text-muted-foreground text-sm md:text-lg font-medium italic">You can link your accounts in the Link Center from your Dashboard.</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        {items.map(function(item: any) {
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl border border-primary/20 bg-slate-900 flex items-center gap-4 w-full max-w-sm"
            >
              <div className={cn('p-3 rounded-xl shrink-0', (item.color || '').replace('text-', 'bg-') + '/10')}>
                <div className={cn('w-5 h-5', item.color)} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-white uppercase">{item.name}</h3>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Ready to link</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            </motion.div>
          );
        })}
        <p className="text-[9px] text-slate-500 font-medium mt-2">Manage connections later in your Dashboard Link Center.</p>
      </div>
    </div>
  );
}