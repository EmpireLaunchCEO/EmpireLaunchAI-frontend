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
        <EmpireSwitcher />
        <Sidebar />
        <main className="flex-1 lg:ml-[328px] h-full bg-theme-surface lg:rounded-l-[48px] shadow-2xl shadow-slate-200 border-l border-theme overflow-y-auto relative lg:pb-0">
          <div className="absolute top-8 right-8 z-[60] hidden lg:block">
            <NotificationBell />
          </div>
          {children}
        </main>
        <div className="fixed top-4 right-4 z-[100] lg:hidden">
          <NotificationBell />
        </div>
        <MobileNav />
      </div>
    </SubscriptionGuard>
  );
}
