"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

  const navigate = (href: string) => {
    console.log(`[Nav] Navigating to ${href}`);
    router.push(href);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-3xl border-t border-white/10 px-4 pt-3 pb-8 z-[999999] flex justify-between items-center shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pointer-events-auto touch-manipulation select-none"
      style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
    >
        {/* Home */}
        <button
          onClick={() => navigate('/dashboard')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative flex-1 py-2",
            pathname === '/dashboard' ? "scale-110" : "text-slate-500 opacity-60"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            pathname === '/dashboard' 
              ? "bg-primary text-white shadow-lg shadow-primary/40" 
              : "bg-transparent text-white"
          )}>
            <Home className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/dashboard' ? "text-primary" : "text-white/40"
          )}>Home</span>
        </button>

        {/* EC: Empire Center */}
        <button
          onClick={() => navigate('/empire-center')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative flex-1 py-2",
            pathname === '/empire-center' ? "scale-110" : "text-slate-500 opacity-60"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            pathname === '/empire-center' 
              ? "bg-primary text-white shadow-lg shadow-primary/40" 
              : "bg-transparent text-white"
          )}>
            <ClipboardList className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/empire-center' ? "text-primary" : "text-white/40"
          )}>OB</span>
        </button>

        {/* Studio */}
        <button
          onClick={() => navigate('/studio')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative flex-1 py-2",
            pathname === '/studio' ? "scale-110" : "text-blue-400 opacity-60"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            pathname === '/studio'
              ? "bg-primary text-white shadow-lg shadow-primary/40"
              : "bg-blue-900/30 text-blue-400"
          )}>
            <Video className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/studio' ? "text-primary" : "text-blue-400"
          )}>Studio</span>
        </button>

        {/* LC: Link Center */}
        <button
          onClick={() => navigate('/link-center')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative flex-1 py-2",
            pathname === '/link-center' ? "scale-110" : "text-slate-500 opacity-60"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            pathname === '/link-center' 
              ? "bg-primary text-white shadow-lg shadow-primary/40" 
              : "bg-transparent text-white"
          )}>
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/link-center' ? "text-primary" : "text-white/40"
          )}>LC</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative flex-1 py-2",
            pathname === '/settings' ? "scale-110" : "text-slate-500 opacity-60"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            pathname === '/settings' 
              ? "bg-primary text-white shadow-lg shadow-primary/40" 
              : "bg-transparent text-white"
          )}>
            <Settings className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter",
            pathname === '/settings' ? "text-primary" : "text-white/40"
          )}>Settings</span>
        </button>
      </div>
  );
}
