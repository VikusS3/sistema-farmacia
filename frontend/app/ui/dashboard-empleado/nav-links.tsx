"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  LayoutDashboard,
  Store,
  PackageOpen,
  CalendarSearch,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard-empleado",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Caja",
    href: "/dashboard-empleado/caja",
    label: " Caja",
    icon: PackageOpen,
  },
  {
    name: "Ventas",
    href: "/dashboard-empleado/ventas",
    label: "Ventas",
    icon: Store,
  },
  {
    name: "Compras",
    href: "/dashboard-empleado/compras",
    label: "Compras",
    icon: ShoppingBag,
  },

  {
    name: "Productos Vencidos",
    href: "/dashboard-empleado/vencimiento",
    label: "Productos Vencidos",
    icon: CalendarSearch,
  },
];
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col px-3 gap-1">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`group flex items-center gap-3 rounded-lg p-2 transition-all ${
            pathname === link.href
              ? "bg-primary-100 text-background-100 font-bold"
              : "text-text-200 hover:bg-primary-200 hover:text-background-100"
          }`}
          aria-label={link.label}
        >
          <link.icon
            className={`h-6 w-6 transition-transform ${
              pathname === link.href && "text-background-100 scale-110"
            }`}
          />
          <span className="hidden md:block text-sm font-bold">{link.name}</span>
        </Link>
      ))}
    </nav>
  );
}
