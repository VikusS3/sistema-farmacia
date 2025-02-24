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
    name: "Ventas",
    href: "/dashboard/ventas",
    label: "Ventas",
    icon: ShoppingBag,
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
    name: "Usuarios",
    href: "/dashboard/usuarios",
    label: "Usuarios",
    icon: UserCog,
  },
];
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col space-y-4">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={
            pathname === link.href
              ? "bg-gray-900 text-white flex items-center space-x-2 p-2 rounded"
              : "text-gray-300 hover:bg-gray-700 flex items-center space-x-2 p-2 rounded"
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
