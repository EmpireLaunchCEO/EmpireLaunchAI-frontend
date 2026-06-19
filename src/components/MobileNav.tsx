"use client";

import { usePathname, useRouter } from "next/navigation";
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
  { label: "Intel", href: "/empire-center", icon: BrainCircuit },
  { label: "Finances", href: "/analytics", icon: Wallet },
  { label: "Studio", href: "/studio", icon: Film },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (href: string) => {
    console.log(`[MobileNav] Clicked: ${href}`);
    try {
      router.push(href);
    } catch (e) {
      console.error("[MobileNav] Router failed, using window.location", e);
      window.location.href = href;
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 w-full bg-slate-900 border-t border-white/20 flex justify-around items-stretch z-[9999999] pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      style={{ 
        height: 'calc(72px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        touchAction: 'manipulation'
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <button
            key={item.href}
            id={`nav-${item.label.toLowerCase()}`}
            onClick={() => handleNavigate(item.href)}
            onPointerDown={(e) => e.currentTarget.classList.add('bg-white/10')}
            onPointerUp={(e) => e.currentTarget.classList.remove('bg-white/10')}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 relative transition-all active:scale-95",
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
          </button>
        );
      })}
    </div>
  );
}
