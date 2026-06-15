"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { alertasService } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  Banknote,
  Users,
  Truck,
  Tags,
  Package,
  Bell,
  BarChart3,
  UserCircle,
  LogOut,
  PillBottle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/productos", icon: Pill },
  { name: "Ventas", href: "/ventas", icon: ShoppingCart },
  { name: "Caja", href: "/caja", icon: Banknote },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Proveedores", href: "/proveedores", icon: Truck },
  { name: "Categorías", href: "/categorias", icon: Tags },
  { name: "Compras", href: "/compras", icon: Package },
  { name: "Alertas", href: "/alertas", icon: Bell },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
  { name: "Usuarios", href: "/usuarios", icon: UserCircle },
];

export default function Sidebar({ isOpen = true, onToggle }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [alertasCount, setAlertasCount] = useState(0);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const res = await alertasService.getContador();
        setAlertasCount(res.data.count);
      } catch (e) {
        console.error("Error fetching alertas:", e);
      }
    };
    fetchAlertas();
    const interval = setInterval(fetchAlertas, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all duration-200"
          title="Abrir menú"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      )}

      <aside
        className={`
          w-64 bg-zinc-900/95 border-r border-zinc-800/50 h-screen flex flex-col
          fixed left-0 top-0 z-50 backdrop-blur-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-64"}
        `}
      >
        <div className="px-5 py-5 border-b border-zinc-800/50 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <PillBottle className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Farmacia
            </span>
          </Link>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-200 hidden lg:block"
            title="Cerrar menú"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const showBadge = item.name === "Alertas" && alertasCount > 0;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 font-medium shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                    isActive
                      ? "text-emerald-400"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                />
                <span className="text-sm">{item.name}</span>
              </span>
              {showBadge && (
                <span className="bg-red-500/10 text-red-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-500/20 min-w-[20px] text-center">
                  {alertasCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
            <UserCircle className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">
              {user?.nombre || user?.email}
            </p>
            <p className="text-[11px] text-zinc-500 truncate capitalize">
              {user?.rol || "Usuario"}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-200"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
