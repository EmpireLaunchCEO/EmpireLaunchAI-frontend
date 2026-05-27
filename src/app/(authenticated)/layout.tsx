import { Sidebar } from "@/components/Sidebar";
import { EmpireSwitcher } from "@/components/EmpireSwitcher";
import { MobileNav } from "@/components/MobileNav";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { OnboardingTour } from "@/components/Dashboard/OnboardingTour";
import { NotificationBell } from "@/components/Dashboard/NotificationBell";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SubscriptionGuard>
      <div className="flex bg-[var(--background)] h-[100dvh] relative overflow-hidden transition-colors duration-500">
        <OnboardingTour />
        <EmpireSwitcher />
        <Sidebar />
        <main className="flex-1 lg:ml-[328px] h-full bg-[var(--background)] lg:rounded-l-[48px] shadow-2xl shadow-slate-200/20 border-l border-slate-100/10 overflow-y-auto relative lg:pb-0 transition-colors duration-500 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
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
