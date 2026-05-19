import { Sidebar } from "@/components/Sidebar";
import { EmpireSwitcher } from "@/components/EmpireSwitcher";
import { EmpireProvider } from "@/lib/EmpireContext";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EmpireProvider>
      <div className="flex">
        <EmpireSwitcher />
        <Sidebar />
        <main className="flex-1 ml-[328px] min-h-screen">
          {children}
        </main>
      </div>
    </EmpireProvider>
  );
}
