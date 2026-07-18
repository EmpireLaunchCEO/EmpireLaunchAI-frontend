"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Video, UserSquare2, Edit3, Palette, Layout, Search, X, ChevronLeft, ChevronRight, ExternalLink, FileText, Image, Film, PenSquare, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { libraryService } from '@/lib/api-service';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 8;

const CATEGORIES = [
  { id: 'video', label: 'Videos', icon: Video, color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderExpired: 'border-purple-500/30' },
  { id: 'neural_twin', label: 'Neural Twins', icon: UserSquare2, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderExpired: 'border-cyan-500/30' },
  { id: 'edit', label: 'Edits', icon: Edit3, color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderExpired: 'border-amber-500/30' },
  { id: 'design', label: 'Designs', icon: Palette, color: 'text-pink-400', bgColor: 'bg-pink-500/10', borderExpired: 'border-pink-500/30' },
  { id: 'template', label: 'Templates', icon: Layout, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderExpired: 'border-emerald-500/30' },
];

export function LibraryTab() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [renameAssetId, setRenameAssetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [expirationCounts, setExpirationCounts] = useState<Record<string, { expired: number; expiringSoon: number }>>({});
  const [counts, setCounts] = useState<Record<string, number>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [countData, expData] = await Promise.all([
        libraryService.getCounts(),
        libraryService.getExpirationCounts(),
      ]);
      setCounts(countData);
      setExpirationCounts(expData);
    } catch (e) {
      console.error('Failed to fetch library data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getAssetType = (asset: any): string => {
    const type = (asset.assetType || asset.type || '').toLowerCase();
    if (type.includes('video') || type.includes('film') || type === 'raw_video' || type === 'enhanced_video') return 'video';
    if (type.includes('twin') || type.includes('neural') || type === 'facial_dna') return 'neural_twin';
    if (type.includes('edit')) return 'edit';
    if (type.includes('design') || type.includes('image') || type.includes('palette')) return 'design';
    return 'template';
  };

  const getCategoryCount = (catId: string) => assets.filter(a => getAssetType(a) === catId).length;

  const filteredAssets = selectedCategory
    ? assets.filter(a => getAssetType(a) === selectedCategory)
    : [];

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / ITEMS_PER_PAGE));
  const paginatedAssets = filteredAssets.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setPage(1);
    setSelectedAsset(null);
  };

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset);
    setRenameAssetId(null);
    setRenameValue('');
  };

  const handleRename = async () => {
    if (!renameAssetId || !renameValue.trim()) return;
    await libraryService.renameAsset(renameAssetId, renameValue.trim());
    setAssets(prev => prev.map(a => a.id === renameAssetId ? { ...a, title: renameValue.trim() } : a));
    if (selectedAsset?.id === renameAssetId) {
      setSelectedAsset({ ...selectedAsset, title: renameValue.trim() });
    }
    setRenameAssetId(null);
    setRenameValue('');
  };

  // Category selection view
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Layout className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic">Library</h3>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Your Created Assets</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex gap-1.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const count = counts[cat.id] || 0;
              const exp = expirationCounts[cat.id];
              const hasExpired = exp?.expired > 0;
              const hasExpiringSoon = exp?.expiringSoon > 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="bg-theme-surface border-2 border-theme rounded-2xl p-6 space-y-4 relative overflow-hidden hover:border-primary/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all text-left group"
                >
                  <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] -z-10 opacity-20", cat.bgColor)} />

                  {/* Expiration badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                    {hasExpired && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/40 rounded-md">
                        <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                        <span className="text-[7px] font-black text-red-400 uppercase tracking-wider">{exp!.expired} expired</span>
                      </div>
                    )}
                    {hasExpiringSoon && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-md">
                        <Clock className="w-2.5 h-2.5 text-amber-400" />
                        <span className="text-[7px] font-black text-amber-400 uppercase tracking-wider">{exp!.expiringSoon} expiring</span>
                      </div>
                    )}
                  </div>

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

        {!loading && Object.values(counts).reduce((sum, c) => sum + c, 0) === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4">
              <FileText className="w-8 h-8 text-primary/50" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">No assets yet. Create something in Empire Studio!</p>
          </div>
        )}
      </div>
    );
  }

  // Category grid view
  const cat = CATEGORIES.find(c => c.id === selectedCategory);
  const Icon = cat?.icon || Layout;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => { setSelectedCategory(null); setSelectedAsset(null); }}
          className="w-10 h-10 rounded-xl bg-theme-background border-2 border-theme flex items-center justify-center hover:border-primary/30 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", cat?.bgColor)}>
          <Icon className={cn("w-5 h-5", cat?.color)} />
        </div>
        <div>
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight italic">{cat?.label}</h3>
          <p className="text-[10px] font-bold text-muted-foreground">{filteredAssets.length} assets</p>
        </div>
      </div>

      {/* Asset Grid */}
      {paginatedAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedAssets.map((asset) => {
            const thumbUrl = asset.thumbnailUrl || asset.masterImageUrl || asset.masterVideoUrl || '';
            return (
              <button
                key={asset.id}
                onClick={() => handleAssetClick(asset)}
                className="bg-theme-surface border-2 border-theme rounded-xl overflow-hidden group hover:border-primary/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all text-left"
              >
                <div className="aspect-video bg-slate-800/50 relative overflow-hidden">
                  {thumbUrl ? (
                    <img src={thumbUrl} alt={asset.title || 'Asset'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className={cn("w-8 h-8 opacity-30", cat?.color)} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-foreground truncate">{asset.title || 'Untitled'}</p>
                  <p className="text-[8px] font-medium text-muted-foreground mt-0.5">
                    {new Date(asset.createdAt || asset.created_at).toLocaleDateString()}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4">
            <Search className="w-8 h-8 text-primary/50" />
          </div>
          <p className="text-sm font-bold text-muted-foreground">No {cat?.label?.toLowerCase()} found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 rounded-xl bg-theme-background border-2 border-theme flex items-center justify-center disabled:opacity-30 hover:border-primary/30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl bg-theme-background border-2 border-theme flex items-center justify-center disabled:opacity-30 hover:border-primary/30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Asset Detail Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedAsset(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-theme-surface border-2 border-theme rounded-[32px] p-6 md:p-8 max-w-lg w-full space-y-5 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] -z-10" />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", cat?.bgColor)}>
                    <Icon className={cn("w-5 h-5", cat?.color)} />
                  </div>
                  <div className="min-w-0">
                    {renameAssetId === selectedAsset.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenameAssetId(null); }}
                          className="bg-theme-background border border-theme rounded-lg px-2 py-1 text-sm font-bold text-foreground outline-none focus:border-primary"
                          autoFocus
                          placeholder="Asset name"
                        />
                        <button onClick={handleRename} className="text-[10px] font-black text-primary uppercase tracking-wider hover:opacity-80">Save</button>
                      </div>
                    ) : (
                      <h3 className="text-sm font-black text-foreground truncate max-w-[200px]">{selectedAsset.title || 'Untitled'}</h3>
                    )}
                    <p className="text-[9px] font-medium text-muted-foreground">
                      {new Date(selectedAsset.createdAt || selectedAsset.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setRenameAssetId(selectedAsset.id); setRenameValue(selectedAsset.title || ''); }}
                    className="w-8 h-8 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all"
                    title="Rename"
                  >
                    <PenSquare className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="w-8 h-8 rounded-lg bg-slate-800/50 text-slate-400 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="aspect-video bg-slate-800/50 rounded-xl overflow-hidden flex items-center justify-center">
                {(selectedAsset.masterVideoUrl || selectedAsset.fileUrl) ? (
                  <video
                    src={selectedAsset.masterVideoUrl || selectedAsset.fileUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (selectedAsset.masterImageUrl || selectedAsset.thumbnailUrl) ? (
                  <img
                    src={selectedAsset.masterImageUrl || selectedAsset.thumbnailUrl}
                    alt={selectedAsset.title || 'Asset'}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Icon className={cn("w-12 h-12 opacity-20", cat?.color)} />
                )}
              </div>

              {/* Asset details */}
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="p-3 bg-theme-background rounded-xl border border-theme">
                  <p className="font-black uppercase tracking-wider text-muted-foreground mb-0.5">Type</p>
                  <p className="font-bold text-foreground capitalize">{selectedAsset.assetType || selectedAsset.type || 'Unknown'}</p>
                </div>
                <div className="p-3 bg-theme-background rounded-xl border border-theme">
                  <p className="font-black uppercase tracking-wider text-muted-foreground mb-0.5">Status</p>
                  <p className="font-bold text-foreground capitalize">{selectedAsset.status || 'Unknown'}</p>
                </div>
              </div>

              {/* URL links */}
              {(selectedAsset.masterVideoUrl || selectedAsset.fileUrl || selectedAsset.masterImageUrl) && (
                <a
                  href={selectedAsset.masterVideoUrl || selectedAsset.fileUrl || selectedAsset.masterImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 border border-primary/30 rounded-xl font-black text-[9px] uppercase tracking-widest text-primary hover:bg-primary/20 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Asset
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}