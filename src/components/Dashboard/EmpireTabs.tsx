"use client";

import React, { useState } from 'react';
import { Building2, TrendingUp, Layout, Stars } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmpireIdentityCard } from '@/components/Dashboard/EmpireIdentityCard';
import { IntelTab } from '@/components/Dashboard/IntelTab';
import { LibraryTab } from '@/components/Dashboard/LibraryTab';
import { useEmpire } from '@/lib/EmpireContext';
import { motion } from 'framer-motion';

interface EmpireTabsProps {
  empireData: any;
  onDataUpdate: () => void;
}

export function EmpireTabs({ empireData, onDataUpdate }: EmpireTabsProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'intel' | 'library'>('business');
  const { isAdmin, userEmail } = useEmpire();
  const isOwner = isAdmin || userEmail?.toLowerCase() === 'stacipeabody@gmail.com';

  const tabs = [
    { id: 'business' as const, label: 'Business Info', icon: Building2 },
    { id: 'intel' as const, label: 'Intel', icon: TrendingUp },
    { id: 'library' as const, label: 'Library', icon: Layout },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex bg-theme-background p-1.5 rounded-[24px] border-2 border-theme w-full max-w-md mx-auto gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[18px] font-black text-[9px] uppercase tracking-tighter transition-all",
                isActive
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] border-white/20"
                  : "text-foreground/40 hover:text-foreground hover:bg-theme-surface/50"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-foreground/40")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'business' && (
          <>
            <EmpireIdentityCard
              empireData={empireData}
              onUpdate={onDataUpdate}
            />
            {isOwner && (
            <div className="max-w-4xl mx-auto mt-6 bg-theme-surface border-2 border-theme rounded-[32px] p-8 space-y-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] -z-10" />
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                  <Stars className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Active Subscribers</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-5xl font-black text-foreground bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">0</p>
                    <p className="text-sm font-black text-emerald-500 uppercase tracking-widest italic">Growing</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium italic">Live recurring revenue stream tracking enabled for EmpireLaunch AI.</p>
            </div>
            )}
          </>
        )}
        {activeTab === 'intel' && (
          <IntelTab empireData={empireData} />
        )}
        {activeTab === 'library' && (
          <LibraryTab />
        )}
      </motion.div>
    </div>
  );
}
