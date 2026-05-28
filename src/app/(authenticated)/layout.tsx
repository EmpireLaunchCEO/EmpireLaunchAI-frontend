import { Sidebar } from "@/components/Sidebar";
import { EmpireSwitcher } from "@/components/EmpireSwitcher";
import { MobileNav } from "@/components/MobileNav";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { NotificationBell } from "@/components/Dashboard/NotificationBell";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SubscriptionGuard>
      <div className="bg-theme-background transition-colors duration-500">
        <EmpireSwitcher />
        <Sidebar />
        <main className="lg:ml-[328px] bg-theme-background lg:rounded-l-[48px] shadow-2xl shadow-black/20 border-l border-theme relative transition-colors duration-500 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+8rem)]">
          <div className="absolute top-8 right-8 z-[60] hidden lg:block">
            <NotificationBell id="notification-bell-desktop" />
          </div>
          {children}
        </main>
        <div className="fixed top-[calc(env(safe-area-inset-top)+1rem)] right-4 z-[100] lg:hidden">
          <NotificationBell id="notification-bell-mobile" />
        </div>
        <MobileNav />
      </div>
    </SubscriptionGuard>
  );
}
