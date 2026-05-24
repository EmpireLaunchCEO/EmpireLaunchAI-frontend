"use client";

import React from 'react';
import { GuidedLinking } from '@/components/Dashboard/GuidedLinking';
import { useEmpire } from '@/lib/EmpireContext';
import { motion } from 'framer-motion';
import { Share2, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function LinkCenterPage() {
  const { isLinkingComplete } = useEmpire();

  return (
    <div className="p-4 md:p-8 pb-40 max-w-7xl mx-auto space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <Share2 className="w-3 h-3" />
            Link Center
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Neural Sync.
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            Connect and manage your empire's high-velocity channels.
          </p>
        </div>

        {isLinkingComplete && (
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl border-2 border-slate-100 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all group"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
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
