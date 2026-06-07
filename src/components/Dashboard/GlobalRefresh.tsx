"use client";

import React, { useState } from 'react';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { cn } from '@/lib/utils';

export function GlobalRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Use a small delay to show the animation before reload
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="p-2.5 rounded-2xl bg-theme-surface border-2 border-theme hover:border-primary transition-all group shadow-sm flex items-center justify-center active:scale-95"
      title="Neural Sync"
    >
      <BrandedGlobe 
        size="sm" 
        animate={isRefreshing} 
        className={cn(isRefreshing ? "opacity-100" : "opacity-40 group-hover:opacity-100")} 
      />
    </button>
  );
}
