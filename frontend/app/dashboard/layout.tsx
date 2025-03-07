import { ReactNode } from "react";
import SideNav from "../ui/dashboard/sidenav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-100">
      {/* Sidebar */}
      <SideNav />

      {/* Contenido Principal */}
      <main className="flex-1 bg-background-300 p-6 lg:p-8 overflow-auto relative border-l border-background-300 text-text-100">
        {children}
      </main>
    </div>
  );
}
