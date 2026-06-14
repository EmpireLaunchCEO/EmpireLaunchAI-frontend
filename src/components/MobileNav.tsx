"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  const handleNav = (href: string) => {
    // Force navigation as a secondary trigger in case Link is blocked
    router.push(href);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[999999] pointer-events-none flex justify-center"
      style={{ isolation: 'isolate' }}
    >
      <nav 
        className="bg-slate-900/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[32px] p-2 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-around pointer-events-auto w-full max-w-full overflow-hidden"
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
              onClick={(e) => {
                // We let the Link handle it normally, but if it fails, the router.push is here
                // We don't preventDefault so Link works, but we can log it
                console.log(`[Nav] Syncing to ${item.href}`);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all relative cursor-pointer active:scale-90 outline-none flex-1 py-1",
                isActive ? "scale-105" : (item.color || "text-slate-500")
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/40" 
                  : "bg-white/5 text-inherit"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-tighter",
                isActive ? "text-white" : "opacity-40"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
