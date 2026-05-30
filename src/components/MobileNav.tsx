"use client";

import React, { useState } from 'react';
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
import { StudioTeaserModal } from './Studio/StudioTeaserModal';

export function MobileNav() {
  const pathname = usePathname();
  const { isLinkingComplete } = useEmpire();
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-fit lg:min-w-[500px] bg-theme-surface/80 lg:bg-slate-900/90 backdrop-blur-xl border-t lg:border border-theme lg:border-white/10 px-6 py-3 lg:px-8 lg:py-4 z-[100] flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:shadow-2xl lg:rounded-full">
        {/* Home */}
        <Link
          href="/dashboard"
          id="nav-home"
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            pathname === '/dashboard' ? "text-primary scale-110" : "text-slate-400 lg:text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            pathname === '/dashboard' ? "bg-primary/10 lg:bg-primary/20" : "bg-transparent"
          )}>
            <Home className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </Link>

        {/* EC: Empire Center */}
        <Link
          href="/empire-center"
          id="nav-ec"
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            pathname === '/empire-center' ? "text-primary scale-110" : "text-slate-400 lg:text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            pathname === '/empire-center' ? "bg-primary/10 lg:bg-primary/20" : "bg-transparent"
          )}>
            <ClipboardList className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">EC</span>
        </Link>

        {/* Studio (Hype) */}
        <button
          onClick={() => setIsStudioOpen(true)}
          className="flex flex-col items-center gap-1 transition-all text-blue-500 hover:text-blue-400 relative"
        >
          <div className="p-2 rounded-xl bg-blue-50 lg:bg-blue-900/30">
            <Video className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Studio</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse border-2 border-white lg:border-slate-900" />
        </button>

        {/* LC: Link Center */}
        <Link
          href="/link-center"
          id="nav-lc"
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            pathname === '/link-center' ? "text-primary scale-110" : "text-slate-400 lg:text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            pathname === '/link-center' ? "bg-primary/10 lg:bg-primary/20" : "bg-transparent"
          )}>
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">LC</span>
        </Link>

        {/* COG: Settings */}
        <Link
          href="/settings"
          id="nav-settings"
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            pathname === '/settings' ? "text-primary scale-110" : "text-slate-400 lg:text-slate-500 hover:text-white"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            pathname === '/settings' ? "bg-primary/10 lg:bg-primary/20" : "bg-transparent"
          )}>
            <Settings className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Settings</span>
        </Link>
      </div>

      <StudioTeaserModal 
        isOpen={isStudioOpen} 
        onClose={() => setIsStudioOpen(false)} 
      />
    </>
  );
}
