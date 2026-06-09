"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, XCircle, Share2, Quote, Stars, Minus, Maximize2 } from 'lucide-react';
import { socialProofService, AppRating } from '@/lib/api-service';
import { cn } from '@/lib/utils';

export function SocialProofApproval() {
  const [pendingRatings, setPendingApprovals] = useState<AppRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('minimized-social-proof');
    if (saved === 'true') setIsMinimized(true);
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('minimized-social-proof', String(newState));
  };

  useEffect(() => {
    async function loadData() {
      const data = await socialProofService.getPendingApprovals();
      setPendingApprovals(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      await socialProofService.approveForMarketing(id);
    } else {
      await socialProofService.reject(id);
    }
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
  };

  if (!mounted) return null;
  if (loading || pendingRatings.length === 0) return null;

  if (isMinimized) {
    return (
      <div className="bg-theme-surface rounded-3xl p-6 text-foreground relative overflow-hidden shadow-xl border-2 border-theme h-[80px] flex items-center justify-between group transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-lg">
            <Share2 className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Social Proof Hub</h2>
        </div>
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="absolute top-0 right-0 z-20">
        <button 
          onClick={toggleMinimize}
          className="p-3 rounded-2xl bg-theme-background border border-theme text-slate-400 hover:text-primary transition-all active:scale-95"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Share2 className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-black text-foreground tracking-tight italic uppercase">Social Proof Hub</h3>
        </div>
        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-100 animate-pulse pr-12 mr-2">
          AI Suggestion Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {pendingRatings.map((rating) => (
            <motion.div
              key={rating.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative p-6 rounded-[32px] bg-theme-surface border-2 border-theme shadow-sm hover:shadow-md transition-all space-y-4 overflow-hidden"
            >
              {/* Draft Preview Overlay */}
              <div className="absolute top-0 right-0 p-4">
                 <div className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg">
                    Ad Draft Ready
                 </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < rating.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400">— {rating.userName}</span>
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-slate-50 -z-0" />
                <p className="relative z-10 text-sm font-bold text-slate-700 leading-relaxed italic">
                  "{rating.review}"
                </p>
              </div>

              <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Stars className="w-3 h-3 text-purple-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-600">AI Marketing Hook</p>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  "See what our CEOs are saying about EmpireLaunch AI! Our autonomous engine is delivering results 24/7. 🚀"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleAction(rating.id, 'approve')}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve for Marketing
                </button>
                <button
                  onClick={() => handleAction(rating.id, 'reject')}
                  className="p-3 rounded-2xl bg-theme-background text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-theme"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
