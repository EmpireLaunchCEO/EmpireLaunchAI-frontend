"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { isLinkingComplete } = useEmpire();

  const handleNav = (e: React.MouseEvent | React.TouchEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-fit lg:min-w-[500px] bg-theme-surface/90 lg:bg-slate-900/95 backdrop-blur-2xl border-t lg:border border-theme lg:border-white/10 px-6 py-3 lg:px-8 lg:py-4 z-[999999999] flex justify-between items-center shadow-[0_-10px_60px_rgba(0,0,0,0.3)] lg:shadow-2xl lg:rounded-full pointer-events-auto cursor-default"
      style={{ 
        touchAction: 'manipulation',
      }}
    >
        {/* Home */}
        <button
          onClick={(e) => handleNav(e, '/dashboard')}
          onTouchEnd={(e) => handleNav(e, '/dashboard')}
          id="nav-home"
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative cursor-pointer pointer-events-auto outline-none border-none bg-transparent p-0",
            pathname === '/dashboard' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl pointer-events-none",
            pathname === '/dashboard'
              ? "bg-primary text-white shadow-primary/20"
              : "bg-transparent text-white/40"
          )}>
            <Home className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter pointer-events-none",
            pathname === '/dashboard' ? "text-white" : "text-white/40"
          )}>Home</span>
        </button>

        {/* EC: Empire Center */}
        <button
          onClick={(e) => handleNav(e, '/empire-center')}
          onTouchEnd={(e) => handleNav(e, '/empire-center')}
          id="nav-ec"
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative cursor-pointer pointer-events-auto outline-none border-none bg-transparent p-0",
            pathname === '/empire-center' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl pointer-events-none",
            pathname === '/empire-center'
              ? "bg-primary text-white shadow-primary/20"
              : "bg-transparent text-white/40"
          )}>
            <ClipboardList className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter pointer-events-none",
            pathname === '/empire-center' ? "text-white" : "text-white/40"
          )}>EC</span>
        </button>

        {/* Studio — Now Direct Link */}
        <button
          onClick={(e) => handleNav(e, '/studio')}
          onTouchEnd={(e) => handleNav(e, '/studio')}
          id="nav-studio"
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative group cursor-pointer pointer-events-auto outline-none border-none bg-transparent p-0",
            pathname === '/studio' ? "scale-110" : "text-blue-400 hover:text-blue-300"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl pointer-events-none",
            pathname === '/studio'
              ? "bg-primary text-white shadow-primary/20"
              : "bg-blue-900/30 text-blue-400 shadow-xl shadow-blue-500/10"
          )}>
            <Video className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter pointer-events-none",
            pathname === '/studio' ? "text-white" : "text-blue-400"
          )}>Studio</span>
          {pathname !== '/studio' && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse border-2 border-slate-900 pointer-events-none" />
          )}
        </button>

        {/* LC: Link Center */}
        <button
          onClick={(e) => handleNav(e, '/link-center')}
          onTouchEnd={(e) => handleNav(e, '/link-center')}
          id="nav-lc"
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative cursor-pointer pointer-events-auto outline-none border-none bg-transparent p-0",
            pathname === '/link-center' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl pointer-events-none",
            pathname === '/link-center'
              ? "bg-primary text-white shadow-primary/20"
              : "bg-transparent text-white/40"
          )}>
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter pointer-events-none",
            pathname === '/link-center' ? "text-white" : "text-white/40"
          )}>LC</span>
        </button>

        {/* COG: Settings */}
        <button
          onClick={(e) => handleNav(e, '/settings')}
          onTouchEnd={(e) => handleNav(e, '/settings')}
          id="nav-settings"
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative cursor-pointer pointer-events-auto outline-none border-none bg-transparent p-0",
            pathname === '/settings' ? "scale-110" : "text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all shadow-2xl pointer-events-none",
            pathname === '/settings'
              ? "bg-primary text-white shadow-primary/20"
              : "bg-transparent text-white/40"
          )}>
            <Settings className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter pointer-events-none",
            pathname === '/settings' ? "text-white" : "text-white/40"
          )}>Settings</span>
        </button>
    </div>
  );
}
