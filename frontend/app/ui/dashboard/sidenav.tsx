import NavLinks from "./nav-links";
export default function SideNav() {
  return (
    <div className="bg-gray-800 w-64 h-screen">
      <div className="flex items-center justify-center h-16 bg-gray-900 text-white">
        <h1 className="text-2xl">Dashboard</h1>
      </div>
      <NavLinks />
    </div>
  );
}
