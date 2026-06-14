"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Settings, 
  Stars, 
  ClipboardCheck,
  Video
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
    { id: 'nav-ec', href: '/empire-center', label: 'OB', icon: ClipboardCheck },
    { id: 'nav-studio', href: '/studio', label: 'Studio', icon: Video, color: 'text-blue-400' },
    { id: 'nav-lc', href: '/link-center', label: 'LC', icon: Stars },
    { id: 'nav-settings', href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[999999] pointer-events-none flex justify-center"
      style={{ isolation: 'isolate' }}
    >
      <nav 
        className="bg-slate-900/98 backdrop-blur-3xl border-t-2 border-white/10 rounded-t-[40px] p-2 pb-8 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] flex items-center justify-around pointer-events-auto w-full max-w-full overflow-hidden transition-all duration-500"
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
                "flex flex-col items-center justify-center gap-1.5 transition-all relative cursor-pointer active:scale-75 outline-none flex-1 py-2",
                isActive ? "scale-100" : (item.color || "text-slate-500")
              )}
            >
              <div className={cn(
                "p-2.5 rounded-2xl transition-all relative",
                isActive 
                  ? "bg-primary text-white shadow-[0_0_25px_rgba(var(--primary-rgb),0.5)] border border-white/20" 
                  : "bg-white/5 text-inherit border border-transparent"
              )}>
                <Icon className={cn("w-5 h-5", isActive ? "scale-110" : "")} />
                
                {/* Notification indicator for Studio (Auto-Pilot) */}
                {item.id === 'nav-studio' && !isActive && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse border-2 border-slate-900" />
                )}
              </div>
              
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest transition-opacity",
                isActive ? "text-white opacity-100" : "opacity-40"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute -bottom-1 w-6 h-1 bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary-rgb),1)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
