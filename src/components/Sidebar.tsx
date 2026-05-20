"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Inbox, 
  UserPlus, 
  TrendingUp, 
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Review Queue', href: '/review', icon: Inbox },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white text-slate-900 h-screen fixed left-[72px] top-0 border-r border-slate-100 shadow-sm">
      <div className="p-6 flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-black tracking-tight text-slate-900 uppercase italic">Empire.</span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                isActive 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
            <span className="text-xs font-black text-white">JD</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-900">John Doe</span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Founder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
