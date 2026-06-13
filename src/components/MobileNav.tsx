"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  PlusCircle, 
  ClipboardList,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    console.log("[EmpireNav] MobileNav Mounted. Path:", pathname);
  }, [pathname]);

  if (!mounted) return null;

  const navItems = [
    { id: 'nav-home', href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'nav-ec', href: '/empire-center', label: 'EC', icon: ClipboardList },
    { id: 'nav-studio', href: '/studio', label: 'Studio', icon: Video, color: 'text-blue-400' },
    { id: 'nav-lc', href: '/link-center', label: 'LC', icon: PlusCircle },
    { id: 'nav-settings', href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (href: string, id: string) => {
    console.log(`[EmpireNav] Navigating to: ${href} (ID: ${id})`);
    setActiveTab(id);
    
    // Immediate visual feedback
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }

    try {
      router.push(href);
    } catch (e) {
      console.error("[EmpireNav] Router push failed, falling back to window.location", e);
      window.location.href = href;
    }

    // Reset active tab after a short delay if navigation is slow
    setTimeout(() => setActiveTab(null), 1000);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[999999] px-4 pb-6 pointer-events-none flex justify-center"
      style={{ isolation: 'isolate' }}
    >
      <nav 
        className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-[32px] px-6 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-8 pointer-events-auto touch-manipulation"
        onClick={(e) => e.stopPropagation()}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              id={item.id}
              type="button"
              onPointerDown={() => handleNav(item.href, item.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all relative cursor-pointer active:scale-90 touch-manipulation outline-none",
                isActive ? "scale-110" : (item.color || "text-slate-500")
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all pointer-events-none",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/40" 
                  : "bg-white/5 text-inherit"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tighter pointer-events-none",
                isActive ? "text-white" : "opacity-40"
              )}>
                {item.label}
              </span>
              {item.id === 'nav-studio' && !isActive && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse border-2 border-slate-900" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
