"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Settings,
  Stars,
  ClipboardCheck,
  BarChart3,
  ShieldCheck,
  Video,
  Sparkles
} from 'lucide-react';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { cn } from '@/lib/utils';

import { useEmpire } from '@/lib/EmpireContext';
import { analyticsService, empireService } from '@/lib/api-service';

const navItems = [
  { name: 'HOME', href: '/dashboard', icon: Home },
  { name: 'OB', href: '/empire-center', icon: ClipboardCheck },
  { name: 'EMPIRE STUDIO', href: '/studio', icon: Video },
  { name: 'LC', href: '/link-center', icon: Stars },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeEmpire, isAdmin } = useEmpire();
  const displayNiche = (isAdmin && (!activeEmpire?.niche || activeEmpire?.niche === 'Niche Pending')) ? "AI Business Automation" : (activeEmpire?.niche || "your niche");

  return (
    <>
      <div className="hidden lg:flex flex-col w-64 bg-theme-surface text-foreground h-screen fixed left-0 top-0 border-r border-theme shadow-sm transition-all duration-300 z-[10005] pointer-events-auto pt-6">
        <div className="p-6 pt-0 flex items-center gap-3">
          <BrandedGlobe size="md" spinning />
          <span className="text-lg font-black tracking-tight text-theme-gradient uppercase italic truncate">
            EmpireLaunch AI
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar relative z-[5001]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm cursor-pointer select-none relative z-[5002]",
                  isActive
                  ? "bg-primary text-white shadow-xl shadow-primary/20 pointer-events-auto"
                  : "text-white/40 hover:text-white hover:bg-theme-background pointer-events-auto"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-primary/60")} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}

          <div className="mt-8 px-4 pt-6 border-t border-theme">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Brain Live</span>
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
               <p className="text-[11px] font-bold text-primary leading-relaxed italic">
                 "Analyzing market trends for '{displayNiche}'... I'll suggest new content soon."
               </p>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-theme bg-theme-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-theme flex items-center justify-center shadow-lg overflow-hidden group hover:border-white/50 transition-colors">
               <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-[10px] group-hover:bg-primary group-hover:text-white transition-all">
                 {String(activeEmpire?.name || 'E').substring(0, 1).toUpperCase()}
               </div>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-black text-white truncate">Founder</span>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest truncate">
                {activeEmpire?.name || "Empire Owner"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
