import { Sidebar } from "@/components/Sidebar";
import { EmpireSwitcher } from "@/components/EmpireSwitcher";
import { MobileNav } from "@/components/MobileNav";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SubscriptionGuard>
      <div className="flex bg-slate-50 min-h-screen relative overflow-hidden">
        <EmpireSwitcher />
        <Sidebar />
        <main className="flex-1 lg:ml-[328px] min-h-screen bg-white lg:rounded-l-[48px] shadow-2xl shadow-slate-200 border-l border-slate-100 overflow-y-auto relative pb-32 lg:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
    </SubscriptionGuard>
  );
}
