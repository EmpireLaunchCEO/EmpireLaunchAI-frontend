"use client";

import React from 'react';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { Globe, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';
import { usePathname } from 'next/navigation';

export function GlobalEmpireHeader() {
  const pathname = usePathname();
  const { activeEmpireId, setActiveEmpireId, isAdmin, activeEmpire, isInitialized } = useEmpire();
  const activeBusinessIndex = activeEmpireId === '1' ? 0 : (activeEmpireId === '2' ? 1 : (activeEmpireId === '3' ? 2 : 0));

  if (!isInitialized) return null;

  const getPageTitle = () => {
    if (pathname === '/dashboard') {
      return 'HOME BASE';
    }
    switch (pathname) {
      case '/empire-center': return 'Approval Center';
      case '/studio': return 'Empire Studio';
      case '/link-center': return 'Neural Sync';
      case '/review': return 'Control Gates';
      case '/analytics': return 'Empire Ledger';
      case '/settings': return 'Settings';
      default: return 'HOME BASE';
    }
  };

  return (
    <div className="flex flex-col items-center pt-6 pb-2">
      <div className="flex flex-col items-center">
        <BrandedGlobe 
          size="xl" 
          animate={false}
          className="shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        />
        <h2 className="mt-4 text-xl md:text-3xl lg:text-4xl font-black tracking-tight md:tracking-[0.1em] lg:tracking-[0.15em] uppercase italic text-theme-gradient leading-none text-center px-4 max-w-full drop-shadow-[0_2px_10px_rgba(var(--primary-rgb),0.3)]">
          {getPageTitle()}
        </h2>
      </div>

      <div className="mt-6 flex bg-theme-background/60 p-1.5 rounded-[24px] border border-theme w-fit max-w-[calc(100%-2rem)] overflow-x-auto scrollbar-hide gap-1.5 mx-auto shadow-2xl backdrop-blur-xl px-2 flex-nowrap relative z-50">
        {[0, 1, 2].map((idx) => {
          const empireId = (idx + 1).toString();
          const isActive = activeBusinessIndex === idx;

          let label = `Business ${idx + 1}`;
          if (isActive && (activeEmpire?.name || activeEmpire?.title)) {
            label = activeEmpire.name || activeEmpire.title;
          }

          return (
            <button
              key={idx}
              onClick={() => {
                if (activeBusinessIndex === idx) return;
                setActiveEmpireId(empireId);
              }}
              className={cn(
                "px-5 md:px-10 py-3 md:py-4 rounded-[18px] font-black text-[10px] md:text-[11px] uppercase tracking-tighter transition-all flex items-center gap-2.5 whitespace-nowrap min-w-fit border",
                isActive
                  ? "bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] border-white/20 scale-105"
                  : "text-white/40 border-transparent hover:text-white hover:bg-theme-surface/40 hover:border-theme/30"
              )}
            >
              {isActive ? (
                <Globe className="w-3.5 h-3.5 text-primary animate-pulse" />
              ) : (
                <Briefcase className="w-3.5 h-3.5 opacity-40" />
              )}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
