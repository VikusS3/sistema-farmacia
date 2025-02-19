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
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clientes",
    href: "/dashboard/clientes",
    label: "Clientes",
    icon: Contact,
  },
  {
    name: "Categorias",
    href: "/dashboard/categorias",
    label: "Categorias",
    icon: ChartColumnStacked,
  },
  {
    name: "Proveedores",
    href: "/dashboard/proveedores",
    label: "Proveedores",
    icon: Truck,
  },
  {
    name: "usuarios",
    href: "/dashboard/usuarios",
    label: "Usuarios",
    icon: UserCog,
  },
  {
    name: "Ventas",
    href: "/dashboard/ventas",
    label: "Ventas",
    icon: ShoppingBag,
  },
  {
    name: "Reportes",
    href: "/dashboard/reportes",
    label: "Reportes",
    icon: ClipboardCheck,
  },
  {
    name: "Productos",
    href: "/dashboard/productos",
    label: "Productos",
    icon: PackageSearch,
  },
];
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col space-x-4">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={
            pathname === link.href
              ? "bg-gray-900 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }
          aria-label={link.label}
        >
          <link.icon className="w-6 h-6" />
          <p className="hidden md:block">{link.name}</p>
        </Link>
      ))}
    </nav>
  );
}
