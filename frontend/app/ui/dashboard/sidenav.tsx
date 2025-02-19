import NavLinks from "./nav-links";
export default function SideNav() {
  return (
    <div className="bg-background w-64 h-full">
      <div className="flex items-center justify-center h-16 bg-primary text-white">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <NavLinks />
    </div>
  );
}
