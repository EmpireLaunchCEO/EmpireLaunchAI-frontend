"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Settings,
  PlusCircle,
  ClipboardList,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';

export function MobileNav() {
  const pathname = usePathname();
  const { isLinkingComplete } = useEmpire();

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-fit lg:min-w-[500px] bg-theme-surface/80 lg:bg-slate-900/90 backdrop-blur-xl border-t lg:border border-theme lg:border-white/10 px-6 py-3 lg:px-8 lg:py-4 z-[100] flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:shadow-2xl lg:rounded-full">
        {/* Home */}
        <Link
          href="/dashboard"
          id="nav-home"
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            pathname === '/dashboard' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl",
            pathname === '/dashboard' 
              ? "bg-white text-slate-900 shadow-white/20" 
              : "bg-transparent text-slate-400"
          )}>
            <Home className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/dashboard' ? "text-white" : "text-slate-500"
          )}>Home</span>
        </Link>

        {/* EC: Empire Center */}
        <Link
          href="/empire-center"
          id="nav-ec"
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            pathname === '/empire-center' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl",
            pathname === '/empire-center' 
              ? "bg-white text-slate-900 shadow-white/20" 
              : "bg-transparent text-slate-400"
          )}>
            <ClipboardList className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/empire-center' ? "text-white" : "text-slate-500"
          )}>EC</span>
        </Link>

        {/* Studio — Now Direct Link */}
        <Link
          href="/studio"
          id="nav-studio"
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative group",
            pathname === '/studio' ? "scale-110" : "text-blue-400 hover:text-blue-300"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl",
            pathname === '/studio'
              ? "bg-white text-slate-900 shadow-white/20"
              : "bg-blue-500 text-white shadow-xl shadow-blue-500/40 lg:bg-blue-900/30"
          )}>
            <Video className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/studio' ? "text-white" : "text-blue-400"
          )}>Studio</span>
          {pathname !== '/studio' && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse border-2 border-slate-900" />
          )}
        </Link>

        {/* LC: Link Center */}
        <Link
          href="/link-center"
          id="nav-lc"
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            pathname === '/link-center' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl",
            pathname === '/link-center' 
              ? "bg-white text-slate-900 shadow-white/20" 
              : "bg-transparent text-slate-400"
          )}>
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/link-center' ? "text-white" : "text-slate-500"
          )}>LC</span>
        </Link>

        {/* COG: Settings */}
        <Link
          href="/settings"
          id="nav-settings"
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            pathname === '/settings' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl",
            pathname === '/settings' 
              ? "bg-white text-slate-900 shadow-white/20" 
              : "bg-transparent text-slate-400"
          )}>
            <Settings className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/settings' ? "text-white" : "text-slate-500"
          )}>Settings</span>
        </Link>
      </div>
  );
}