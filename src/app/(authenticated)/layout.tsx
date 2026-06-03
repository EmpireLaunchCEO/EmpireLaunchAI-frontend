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
      <div className="flex bg-theme-background h-screen relative overflow-hidden">
        <OnboardingTour />
        <main className="flex-1 bg-theme-surface shadow-2xl shadow-slate-200 border-l border-theme overflow-y-auto relative pb-80 md:pb-40">
          <div className="absolute top-8 right-8 z-[60] hidden lg:block">
            <NotificationBell id="notification-bell-desktop" />
          </div>
          <div className="min-h-full">
            {children}
          </div>
        </main>
        <div className="fixed top-4 right-4 z-[100] lg:hidden">
          <NotificationBell id="notification-bell-mobile" />
        </div>
        <MobileNav />
      </div>
    </SubscriptionGuard>
  );
}
