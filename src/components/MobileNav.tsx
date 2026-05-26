"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Settings,
  PlusCircle,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmpire } from '@/lib/EmpireContext';

export function MobileNav() {
  const pathname = usePathname();
  const { isLinkingComplete } = useEmpire();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-10 py-3 z-[100] flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {/* Home */}
      <Link
        href="/dashboard"
        className={cn(
          "flex flex-col items-center gap-1 transition-all",
          pathname === '/dashboard' ? "text-primary scale-110" : "text-slate-400"
        )}
      >
        <div className={cn(
          "p-2 rounded-xl transition-all",
          pathname === '/dashboard' ? "bg-primary/10" : "bg-transparent"
        )}>
          <Home className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
      </Link>

      {/* EC: Empire Center */}
      <Link
        href="/empire-center"
        className={cn(
          "flex flex-col items-center gap-1 transition-all",
          pathname === '/empire-center' ? "text-primary scale-110" : "text-slate-400"
        )}
      >
        <div className={cn(
          "p-2 rounded-xl transition-all",
          pathname === '/empire-center' ? "bg-primary/10" : "bg-transparent"
        )}>
          <ClipboardList className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-tighter">EC</span>
      </Link>

      {/* LC: Link Center */}
      <Link
        href="/link-center"
        className={cn(
          "flex flex-col items-center gap-1 transition-all",
          pathname === '/link-center' ? "text-primary scale-110" : "text-slate-400"
        )}
      >
        <div className={cn(
          "p-2 rounded-xl transition-all",
          pathname === '/link-center' ? "bg-primary/10" : "bg-transparent"
        )}>
          <PlusCircle className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-tighter">LC</span>
      </Link>

      {/* COG: Settings */}
      <Link
        href="/settings"
        className={cn(
          "flex flex-col items-center gap-1 transition-all",
          pathname === '/settings' ? "text-primary scale-110" : "text-slate-400"
        )}
      >
        <div className={cn(
          "p-2 rounded-xl transition-all",
          pathname === '/settings' ? "bg-primary/10" : "bg-transparent"
        )}>
          <Settings className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-tighter">Settings</span>
      </Link>
    </div>
  );
}
