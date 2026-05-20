import { Sidebar } from "@/components/Sidebar";
import { EmpireSwitcher } from "@/components/EmpireSwitcher";
import { EmpireProvider } from "@/lib/EmpireContext";
import { MobileNav } from "@/components/MobileNav";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EmpireProvider>
      <div className="flex bg-slate-50 min-h-screen">
        <EmpireSwitcher />
        <Sidebar />
        <main className="flex-1 lg:ml-[328px] min-h-screen bg-white lg:rounded-l-[48px] shadow-2xl shadow-slate-200 border-l border-slate-100 overflow-hidden relative pb-20 lg:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
    </EmpireProvider>
  );
}
