"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { libraryService } from '@/lib/api-service';
import { AssetDetailModal } from '@/components/Library/AssetDetailModal';

interface CategoryViewProps {
  type: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  onBack: () => void;
}

export function CategoryView({ type, label, icon: Icon, color, bgColor, onBack }: CategoryViewProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchAssets = useCallback(async (pageNum: number, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const data = await libraryService.getAssets(type, pageNum, 20);
      if (append) {
        setAssets(prev => [...prev, ...data.assets]);
      } else {
        setAssets(data.assets);
      }
      setTotal(data.total);
    } catch (e) {
      console.error('Failed to fetch assets', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [type]);

  useEffect(() => {
    fetchAssets(1);
  }, [fetchAssets]);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current || loading || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && assets.length < total) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchAssets(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, loadingMore, assets.length, total, page, fetchAssets]);

  const handleRename = async (id: string, name: string) => {
    const ok = await libraryService.renameAsset(id, name);
    if (ok) setAssets(prev => prev.map(a => a.id === id ? { ...a, name } : a));
    return ok;
  };

  const handleDelete = async (id: string) => {
    const ok = await libraryService.deleteAsset(id);
    if (ok) {
      setAssets(prev => prev.filter(a => a.id !== id));
      setTotal(prev => prev - 1);
    }
    return ok;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-theme-background border-2 border-theme flex items-center justify-center hover:border-primary/30 transition-all">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bgColor)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic">{label}</h3>
          <p className="text-[10px] font-bold text-muted-foreground">{total} assets{total >= 90 && <span className="text-amber-400 ml-1">(90 days exp.)</span>}</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}

      {/* Asset Grid */}
      {!loading && assets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => {
            const isExpired = asset.expired || (asset.expiresAt && new Date(asset.expiresAt) < new Date());
            const thumbUrl = asset.thumbnailPath || asset.thumbnailUrl || '';
            return (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={cn(
                  "bg-theme-surface border-2 rounded-xl overflow-hidden group hover:border-primary/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all text-left relative",
                  isExpired ? "border-red-500/20 opacity-60" : "border-theme"
                )}
              >
                {isExpired && (
                  <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-red-500/80 text-white rounded-md text-[7px] font-black uppercase tracking-wider">
                    Expired
                  </div>
                )}
                <div className="aspect-video bg-slate-800/50 relative overflow-hidden">
                  {thumbUrl ? (
                    <img src={thumbUrl} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className={cn("w-8 h-8 opacity-30", color)} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-foreground truncate">{asset.name || 'Untitled'}</p>
                  <p className="text-[8px] font-medium text-muted-foreground mt-0.5">
                    {new Date(asset.createdAt || asset.created_at).toLocaleDateString()}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Empty */}
      {!loading && assets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4">
            <Icon className={cn("w-8 h-8", color, "opacity-50")} />
          </div>
          <p className="text-sm font-bold text-muted-foreground">No {label.toLowerCase()} found</p>
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} className="h-10 flex items-center justify-center">
        {loadingMore && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
        {!loading && !loadingMore && assets.length >= total && assets.length > 0 && (
          <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">All {total} assets loaded</span>
        )}
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          categoryIcon={Icon}
          categoryColor={color}
          onClose={() => setSelectedAsset(null)}
          onRename={handleRename}
          onDelete={handleDelete}
          onAssetUpdated={() => fetchAssets(page, page > 1)}
        />
      )}
    </div>
  );
}