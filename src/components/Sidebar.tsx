"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
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
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Empire Center', href: '/empire-center', icon: ClipboardCheck },
  { name: 'Empire Studio', href: '/studio', icon: Video },
  { name: 'Neural Link', href: '/link-center', icon: Stars },
  { name: 'Control Gates', href: '/review', icon: ShieldCheck },
  { name: 'Empire Ledger', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeEmpire } = useEmpire();

  return (
    <>
      <div className="hidden lg:flex flex-col w-64 bg-theme-surface text-foreground h-screen fixed left-0 top-0 border-r border-theme shadow-sm transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
             <Stars className="w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-foreground uppercase italic truncate">
            {activeEmpire?.name || "Empire"}.
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                  isActive
                  ? "bg-primary text-white shadow-xl shadow-primary/10"
                  : "text-slate-400 hover:text-foreground hover:bg-theme-background"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
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
               "Analyzing TikTok market trends for 'Boho Luxe'... I'll suggest new content soon."
             </p>
          </div>
        </div>
      </nav>

        <div className="p-6 border-t border-theme">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-theme flex items-center justify-center shadow-lg overflow-hidden">
               <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-[10px]">
                 {String(activeEmpire?.name || 'E').substring(0, 1).toUpperCase()}
               </div>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-black text-foreground truncate">Founder</span>
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
