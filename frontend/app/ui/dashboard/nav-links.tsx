"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  UserCog,
  PackageSearch,
  ShoppingBag,
  ClipboardCheck,
  LayoutDashboard,
  Contact,
  Truck,
  ChartColumnStacked,
  Store,
  PackageOpen,
  Boxes,
  CalendarSearch,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Caja",
    href: "/dashboard/caja",
    label: " Caja",
    icon: PackageOpen,
  },
  {
    name: "Ventas",
    href: "/dashboard/ventas",
    label: "Ventas",
    icon: Store,
  },
  {
    name: "Compras",
    href: "/dashboard/compras",
    label: "Compras",
    icon: ShoppingBag,
  },
  {
    name: "Productos",
    href: "/dashboard/productos",
    label: "Productos",
    icon: PackageSearch,
  },
  {
    name: "Clientes",
    href: "/dashboard/clientes",
    label: "Clientes",
    icon: Contact,
  },
  {
    name: "Proveedores",
    href: "/dashboard/proveedores",
    label: "Proveedores",
    icon: Truck,
  },
  {
    name: "Categorias",
    href: "/dashboard/categorias",
    label: "Categorias",
    icon: ChartColumnStacked,
  },
  {
    name: "Reportes",
    href: "/dashboard/reportes",
    label: "Reportes",
    icon: ClipboardCheck,
  },
  {
    name: "Gestion de Cajas",
    href: "/dashboard/gestion-cajas",
    label: "Gestion de Cajas",
    icon: Boxes,
  },
  {
    name: "Productos Vencidos",
    href: "/dashboard/vencimiento",
    label: "Productos Vencidos",
    icon: CalendarSearch,
  },
  {
    name: "Usuarios",
    href: "/dashboard/usuarios",
    label: "Usuarios",
    icon: UserCog,
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
              ? "bg-primary-100 text-primary-300"
              : "text-text-200 hover:bg-primary-200 hover:text-text-100"
          }`}
          aria-label={link.label}
        >
          <link.icon
            className={`h-6 w-6 transition-transform ${
              pathname === link.href && "text-primary-300 scale-110"
            }`}
          />
          <span className="hidden md:block text-sm font-medium">
            {link.name}
          </span>
        </Link>
      ))}
    </nav>
  );
}
