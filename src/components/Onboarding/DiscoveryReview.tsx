"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  Mail,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { discoveryService, DiscoveryResult } from '@/lib/api-service';

interface DiscoveryReviewProps {
  onComplete: () => void;
}

export function DiscoveryReview({ onComplete }: DiscoveryReviewProps) {
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await discoveryService.getPendingResults();
      setResults(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await discoveryService.approveResult(id);
    setResults(prev => prev.filter(r => r.id !== id));
    setProcessingId(null);

    if (results.length === 1) {
      onComplete();
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    await discoveryService.rejectResult(id);
    setResults(prev => prev.filter(r => r.id !== id));
    setProcessingId(null);

    if (results.length === 1) {
      onComplete();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6">
        <BrandedGlobe size="xl" className="shadow-[0_0_60px_rgba(176,38,255,0.4)]" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Neural Discovery in Progress...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-[32px] border border-primary/20">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-amber-900/20">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-foreground leading-tight uppercase italic">Neural Scan Findings.</h3>
          <p className="text-sm text-muted-foreground font-medium italic">"I've identified potential assets in your ecosystem. Authorize the ones I should integrate into your empire."</p>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {results.map((result) => (
            <motion.div
              key={result.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-theme-surface border-2 border-theme rounded-[32px] p-6 shadow-sm hover:border-blue-100 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-theme-background rounded-xl text-slate-400">
                    {result.type === 'credential' ? <Lock className="w-5 h-5" /> :
                     result.type === 'invoice' ? <Mail className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{result.source}</span>
                       <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-green-100">
                         {Math.round(result.confidence * 100)}% Match
                       </span>
                    </div>
                    <h4 className="font-bold text-foreground">{result.maskedKey}</h4>
                    <p className="text-sm text-muted-foreground bg-theme-background p-3 rounded-xl border border-theme font-mono">
                      "{result.maskedSnippet}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={processingId === result.id}
                    onClick={() => handleReject(result.id)}
                    className="flex-1 md:flex-none px-6 py-3 border-2 border-theme text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Ignore
                  </button>
                  <button
                    disabled={processingId === result.id}
                    onClick={() => handleApprove(result.id)}
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {processingId === result.id ? (
                      <BrandedGlobe size="sm" animate={true} />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Approve
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {results.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 space-y-4"
          >
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
               <Zap className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-foreground">Neural Scan Complete.</h4>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">All assets have been processed and integrated into your dashboard.</p>
            <button
              onClick={onComplete}
              className="mt-4 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200"
            >
              Continue
            </button>
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-400 p-4">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Protected: Original emails are never stored.</span>
      </div>
    </div>
  );
}
