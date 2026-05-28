"use client";

import React from 'react';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { useEmpire } from '@/lib/EmpireContext';
import { motion } from 'framer-motion';
import { Share2, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';


export default function LinkCenterPage() {
  const { isLinkingComplete } = useEmpire();

  const handleRefresh = async () => {
    // Simulate refresh logic
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="p-4 md:p-8 pb-40 max-w-7xl mx-auto space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
            <Share2 className="w-3 h-3" />
            Link Center
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Neural Sync.
            </h1>
            <button 
              onClick={handleRefresh}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors"
            >
              <Zap className="w-5 h-5 text-primary" />
            </button>
          </div>
          <p className="text-sm md:text-base text-theme-background0 font-medium">
            Connect and manage your empire's high-velocity channels.
          </p>
        </div>

        {isLinkingComplete && (
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 bg-theme-surface text-foreground px-6 py-3 rounded-2xl border-2 border-theme font-bold text-sm shadow-sm hover:bg-theme-background transition-all group"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            Return to Dashboard
          </Link>
        )}
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GuidedLinking isReturning={isLinkingComplete} />
      </motion.div>
    </div>
    
  );
}
