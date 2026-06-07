import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { OnboardingTour } from "@/components/Dashboard/OnboardingTour";
import { NotificationBell } from "@/components/Dashboard/NotificationBell";
import { GlobalEmpireHeader } from "@/components/Dashboard/GlobalEmpireHeader";
import { SlotGuard } from "@/components/SlotGuard";
import { Suspense } from "react";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SubscriptionGuard>
      <div className="flex bg-theme-background min-h-screen relative overflow-x-hidden max-w-full">
        <Sidebar />
        <Suspense fallback={null}>
          <OnboardingTour />
        </Suspense>
        <main className="flex-1 bg-theme-surface border-l border-theme relative transition-all duration-300 lg:ml-[256px]">
          <div className="absolute top-8 right-8 z-[60] hidden lg:flex items-center gap-3">
            <NotificationBell id="notification-bell-desktop" />
          </div>
          <div className="min-h-[calc(100vh-80px)]">
            <GlobalEmpireHeader />
            <SlotGuard>
              {children}
            </SlotGuard>
          </div>
        </main>
        <div className="fixed top-4 right-4 z-[100] lg:hidden flex items-center gap-2">
          <NotificationBell id="notification-bell-mobile" />
        </div>
        <MobileNav />
      </div>
    </SubscriptionGuard>
  );
}
