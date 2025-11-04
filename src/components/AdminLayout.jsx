import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import companyLogo from "../assets/company_logo.png"; // Use your team's logo

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkClass = (path) => {
    // This will highlight "Manage Services" even if you are on "Add Service"
    const isActive = location.pathname.startsWith(path);
    return isActive
      ? "block py-3 px-4 rounded-lg bg-[#394867] text-white"
      : "block py-3 px-4 rounded-lg text-[#9BA4B4] hover:bg-[#394867]/50 hover:text-white";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#F1F6F9]">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col flex-shrink-0 bg-[#14274E] text-white shadow-2xl">
        {/* Logo and Title */}
        <div className="p-6">
          <Link
            to="/admin/dashboard"
            className="flex items-center space-x-2 mb-2"
          >
            <img
              src={companyLogo}
              alt="AutoService Logo"
              className="h-10 w-auto"
            />
          </Link>
          <span className="text-xs text-[#9BA4B4] uppercase tracking-wider">
            Admin Panel
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className={getLinkClass("/admin/dashboard")}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/services" // Links to the "Manage" page
            className={getLinkClass("/admin/services")}
          >
            Manage Services
          </Link>
          <Link
            to="/admin/users" // Links to the "Manage" page
            className={getLinkClass("/admin/users")}
          >
            Manage Users
          </Link>
          <Link to="/admin/reports" className={getLinkClass("/admin/reports")}>
            Generate Reports
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-[#394867]/20">
          <button
            onClick={handleLogout}
            className="w-full text-left py-3 px-4 rounded-lg text-[#9BA4B4] hover:bg-[#394867]/50 hover:text-white transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
