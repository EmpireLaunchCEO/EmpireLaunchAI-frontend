"use client";

import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { OnboardingTour } from "@/components/Dashboard/OnboardingTour";
import { NotificationBell } from "@/components/Dashboard/NotificationBell";
import { GlobalEmpireHeader } from "@/components/Dashboard/GlobalEmpireHeader";
import { SlotGuard } from "@/components/SlotGuard";
import { Suspense } from "react";
import { PullToRefresh } from "@/components/Dashboard/PullToRefresh";
import { useEmpire } from "@/lib/EmpireContext";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { triggerRefresh } = useEmpire();

  return (
    <>
      <div className="flex bg-theme-background min-h-screen relative max-w-full overflow-x-hidden">
        {/* Sidebar - Desktop Only */}
        <Sidebar />

        {/* Content Stack */}
        <main className="flex-1 bg-theme-surface relative transition-all duration-300 lg:ml-[256px] max-w-full flex flex-col z-[1]">
            <div className="absolute top-8 right-8 z-[60] hidden lg:flex items-center gap-3">
              <NotificationBell id="notification-bell-desktop" />
            </div>

            <SubscriptionGuard>
              <PullToRefresh onRefresh={triggerRefresh}>
                <div className="flex-1 flex flex-col min-h-screen">
                  <GlobalEmpireHeader />
                  <div className="flex-1 pb-32 relative z-[2]">
                    <SlotGuard>
                      {children}
                    </SlotGuard>
                  </div>
                </div>
              </PullToRefresh>
            </SubscriptionGuard>
        </main>

        {/* Floating elements - High Z-Index */}
        <div className="fixed top-4 right-4 z-[1000] lg:hidden flex items-center gap-2 pointer-events-auto">
          <NotificationBell id="notification-bell-mobile" />
        </div>

        {/* TOUR - ONLY OVER CONTENT */}
        <Suspense fallback={null}>
          <OnboardingTour />
        </Suspense>
      </div>

      {/* 
         NAVIGATION - MOVED OUTSIDE GUARD 
         Absolute highest priority.
      */}
      <MobileNav />
    </>
  );
}
