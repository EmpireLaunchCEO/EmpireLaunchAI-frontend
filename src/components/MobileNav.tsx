"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Settings, 
  Stars, 
  ClipboardCheck,
  Video,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { id: 'nav-home', href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'nav-ec', href: '/empire-center', label: 'EC', icon: ClipboardCheck },
    { id: 'nav-studio', href: '/studio', label: 'Studio', icon: Video, color: 'text-blue-400' },
    { id: 'nav-lc', href: '/link-center', label: 'LC', icon: Stars },
    { id: 'nav-review', href: '/review', label: 'Gates', icon: ShieldCheck },
    { id: 'nav-analytics', href: '/analytics', label: 'Ledger', icon: BarChart3 },
    { id: 'nav-settings', href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[999999] px-2 pb-4 pointer-events-none flex justify-center"
      style={{ isolation: 'isolate' }}
    >
      <nav 
        className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[28px] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-1 pointer-events-auto touch-manipulation overflow-x-auto no-scrollbar max-w-[95vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex flex-col items-center gap-1 transition-all relative cursor-pointer active:scale-95 touch-manipulation outline-none min-w-[56px] py-2 px-1 rounded-2xl",
                isActive ? "scale-105" : (item.color || "text-slate-500")
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all pointer-events-none",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/40" 
                  : "bg-white/5 text-inherit"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-tighter pointer-events-none",
                isActive ? "text-white" : "opacity-40"
              )}>
                {item.label}
              </span>
              {item.id === 'nav-studio' && !isActive && (
                <div className="absolute top-1 right-2 w-2 h-2 bg-primary rounded-full animate-pulse border-2 border-slate-900" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
