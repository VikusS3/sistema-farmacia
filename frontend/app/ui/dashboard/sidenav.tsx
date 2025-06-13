import NavLinks from "./nav-links";
import Image from "next/image";
export default function SideNav() {
  return (
    <nav className="bg-background-200 w-64 h-screen border-r border-background-300">
      <div className="flex items-center justify-center h-16 shadow-lg border-b border-background-300">
        <Image
          src="/logofarmacia.webp"
          alt="Logo"
          width={150}
          height={150}
          className="w-48 h-16"
        />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks />
      </div>
    </nav>
  );
}
