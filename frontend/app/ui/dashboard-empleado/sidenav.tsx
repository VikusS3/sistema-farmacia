"use client";
import NavLinks from "./nav-links";
import Image from "next/image";
import { useAuth } from "@/app/hooks/auth/useAuth";
import { LogOutIcon } from "lucide-react";
export default function SideNav() {
  const { handleLogout } = useAuth();
  return (
    <nav className="flex flex-col bg-background-200 w-64 h-screen border-r border-background-300 overflow-y-auto">
      <div className="flex items-center justify-center h-16 shadow-lg border-b border-background-300">
        <Image
          src="/logofarmacia.webp"
          alt="Logo"
          className="w-48 h-16"
          width={150}
          height={150}
          priority={false}
          loading="lazy"
        />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks />
      </div>
      <div className="flex items-center justify-center h-16 shadow-lg border-b border-background-300">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOutIcon className="w-4 h-4" /> Salir
        </button>
      </div>
    </nav>
  );
}
