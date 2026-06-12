"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  Film, 
  Settings,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Empire", href: "/dashboard", icon: LayoutDashboard },
  { label: "Intel", href: "/intel", icon: BrainCircuit },
  { label: "Finances", href: "/finances", icon: Wallet },
  { label: "Studio", href: "/studio", icon: Film },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 w-full bg-slate-900 border-t border-white/20 flex justify-around items-stretch h-[72px] z-[50000] pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
        touchAction: 'manipulation'
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            id={`nav-${item.label.toLowerCase()}`}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 relative transition-all active:scale-95 cursor-pointer",
              isActive ? "text-primary" : "text-white/40"
            )}
            style={{ pointerEvents: 'auto' }}
          >
            <item.icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]")} />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {item.label}
            </span>
            {isActive && (
              <div className="absolute top-1 right-1/2 translate-x-4 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
