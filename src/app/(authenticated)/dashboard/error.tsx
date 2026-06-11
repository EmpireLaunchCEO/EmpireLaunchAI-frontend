'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { BrandedGlobe } from '@/components/BrandedGlobe';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-12 rounded-[48px] border border-red-500/20 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 blur-[80px] rounded-full" />
        
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl mx-auto flex items-center justify-center relative z-10">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <div className="space-y-4 relative z-10">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Link Center Severed</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your connection to the Success Hub was interrupted by a critical runtime error. This can happen during high-velocity data synchronization.
          </p>
          
          <div className="p-4 bg-black/40 rounded-2xl font-mono text-[10px] text-red-400 overflow-hidden text-left border border-white/5 break-all">
            <span className="text-red-500 font-bold mr-2 uppercase">[Error Code: {error.digest || 'Unknown'}]</span>
            <br />
            {error.message || "Neural Hydration Exception"}
          </div>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-primary text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg shadow-primary/20"
          >
            <RefreshCw className="w-4 h-4" />
            Re-Initialize Hub
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all border border-white/5"
          >
            <Home className="w-4 h-4" />
            Return to Core
          </button>
        </div>
        
        <div className="pt-4">
           <BrandedGlobe size="sm" animate={false} className="mx-auto opacity-20 grayscale" />
        </div>
      </div>
    </div>
  );
}
