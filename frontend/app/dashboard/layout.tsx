import { ReactNode } from "react";
import SideNav from "../ui/dashboard/sidenav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideNav />

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-4">{children}</main>
    </div>
  );
}
