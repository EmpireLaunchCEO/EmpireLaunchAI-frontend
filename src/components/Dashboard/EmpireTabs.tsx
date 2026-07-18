"use client";

import React, { useState } from 'react';
import { Building2, TrendingUp, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmpireIdentityCard } from '@/components/Dashboard/EmpireIdentityCard';
import { IntelTab } from '@/components/Dashboard/IntelTab';
import { LibraryTab } from '@/components/Library/LibraryTab';
import { motion } from 'framer-motion';

interface EmpireTabsProps {
  empireData: any;
  onDataUpdate: () => void;
}

export function EmpireTabs({ empireData, onDataUpdate }: EmpireTabsProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'intel' | 'library'>('business');

  const tabs = [
    { id: 'business' as const, label: 'Business Info', icon: Building2 },
    { id: 'intel' as const, label: 'Intel', icon: TrendingUp },
    { id: 'library' as const, label: 'Library', icon: Library },
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
          <EmpireIdentityCard
            empireData={empireData}
            onUpdate={onDataUpdate}
          />
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