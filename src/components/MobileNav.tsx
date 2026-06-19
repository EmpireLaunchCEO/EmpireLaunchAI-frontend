"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Film, 
  Settings,
  Stars
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", id: "home", href: "/dashboard", icon: LayoutDashboard },
  { label: "OB-Operations Base", id: "ec", href: "/empire-center", icon: ClipboardCheck },
  { label: "Studio", id: "studio", href: "/studio", icon: Film },
  { label: "LC-Link Center", id: "lc", href: "/link-center", icon: Stars },
  { label: "Settings", id: "settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`[MobileNav] Force navigating to: ${href}`);
    router.push(href);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 w-full bg-slate-900 border-t border-white/20 flex justify-around items-stretch z-[10000000] pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      style={{ 
        height: 'calc(72px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        touchAction: 'manipulation'
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            id={`nav-${item.id}`}
            onClick={(e) => handleNavigate(e, item.href)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 relative transition-all active:scale-95 touch-manipulation",
              isActive ? "text-primary" : "text-white/40"
            )}
            style={{ pointerEvents: 'auto', WebkitTapHighlightColor: 'transparent' }}
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
