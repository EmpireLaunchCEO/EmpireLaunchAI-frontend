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
    <div 
      className="fixed bottom-0 left-0 right-0 lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-fit lg:min-w-[500px] bg-theme-surface/90 lg:bg-slate-900/95 backdrop-blur-2xl border-t lg:border border-theme lg:border-white/10 px-6 py-3 lg:px-8 lg:py-4 z-[999999] flex justify-between items-center shadow-[0_-10px_60px_rgba(0,0,0,0.3)] lg:shadow-2xl lg:rounded-full pointer-events-auto"
      style={{ touchAction: 'manipulation' }}
    >
        {/* Home */}
        <Link
          href="/dashboard"
          id="nav-home"
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative z-[10010] cursor-pointer pointer-events-auto",
            pathname === '/dashboard' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl",
            pathname === '/dashboard'
              ? "bg-primary text-white shadow-primary/20"
              : "bg-transparent text-white/40"
          )}>
            <Home className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/dashboard' ? "text-white" : "text-white/40"
          )}>Home</span>
        </Link>

        {/* EC: Empire Center */}
        <Link
          href="/empire-center"
          id="nav-ec"
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative z-[10010] cursor-pointer pointer-events-auto",
            pathname === '/empire-center' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl",
            pathname === '/empire-center'
              ? "bg-primary text-white shadow-primary/20"
              : "bg-transparent text-white/40"
          )}>
            <ClipboardList className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/empire-center' ? "text-white" : "text-white/40"
          )}>EC</span>
        </Link>

        {/* Studio — Now Direct Link */}
        <Link
          href="/studio"
          id="nav-studio"
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative group z-[10010] cursor-pointer pointer-events-auto",
            pathname === '/studio' ? "scale-110" : "text-blue-400 hover:text-blue-300"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl",
            pathname === '/studio'
              ? "bg-primary text-white shadow-primary/20"
              : "bg-blue-900/30 text-blue-400 shadow-xl shadow-blue-500/10"
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
            "flex flex-col items-center gap-1 transition-all relative z-[10010] cursor-pointer pointer-events-auto",
            pathname === '/link-center' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl",
            pathname === '/link-center'
              ? "bg-primary text-white shadow-primary/20"
              : "bg-transparent text-white/40"
          )}>
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/link-center' ? "text-white" : "text-white/40"
          )}>LC</span>
        </Link>

        {/* COG: Settings */}
        <Link
          href="/settings"
          id="nav-settings"
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative z-[10010] cursor-pointer pointer-events-auto",
            pathname === '/settings' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl",
            pathname === '/settings'
              ? "bg-primary text-white shadow-primary/20"
              : "bg-transparent text-white/40"
          )}>
            <Settings className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/settings' ? "text-white" : "text-white/40"
          )}>Settings</span>
        </Link>
    </div>
  );
}
