import NavLinks from "./nav-links";
export default function SideNav() {
  return (
    <nav className="bg-background-200 w-64 h-screen border-r border-background-300">
      <div className="flex items-center justify-center h-16 shadow-lg border-b border-background-300">
        <h1 className="text-xl font-semibold text-text-100 tracking-wider">
          Dashboard
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks />
      </div>
    </nav>
  );
}
