"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Video, UserSquare2, Edit3, UserX, Palette, Layout, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { libraryService } from '@/lib/api-service';
import { CategoryView } from '@/components/Library/CategoryView';

const CATEGORIES = [
  { id: 'video', label: 'Videos', icon: Video, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  { id: 'twin_video', label: 'Twin Videos', icon: UserSquare2, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  { id: 'edit', label: 'Edits', icon: Edit3, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { id: 'faceless', label: 'Faceless', icon: UserX, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
  { id: 'design', label: 'Designs', icon: Palette, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
];

export function LibraryTab() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await libraryService.getCounts();
      setCounts(data);
    } catch (e) {
      console.error('Failed to fetch counts', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // If a category is active, show its view
  if (activeCategory) {
    const cat = CATEGORIES.find(c => c.id === activeCategory);
    if (cat) {
      return (
        <CategoryView
          type={cat.id}
          label={cat.label}
          icon={cat.icon}
          color={cat.color}
          bgColor={cat.bgColor}
          onBack={() => setActiveCategory(null)}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Layout className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic">Library</h3>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Your Created Assets</p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : (
        /* Category Boxes */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = counts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="bg-theme-surface border-2 border-theme rounded-2xl p-6 space-y-4 relative overflow-hidden hover:border-primary/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all text-left group"
              >
                <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] -z-10 opacity-20", cat.bgColor)} />
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", cat.bgColor)}>
                  <Icon className={cn("w-6 h-6", cat.color)} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{cat.label}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
                    {count} {count === 1 ? 'asset' : 'assets'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}