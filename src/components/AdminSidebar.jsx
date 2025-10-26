import { useNavigate } from "react-router-dom";  // For potential sub-routes later

const AdminSidebar = ({ activePage, onPageChange }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "employees", label: "Employees", icon: "👥" },
    { id: "services", label: "Services", icon: "🔧" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  const handleSignOut = () => {
    localStorage.clear();  // Clear token/role/etc.
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#14274E] text-white shadow-lg z-40">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-[#394867]">
        <h2 className="text-xl font-bold">Admin Portal</h2>
      </div>

      {/* Nav Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              activePage === item.id
                ? "bg-[#394867] text-white shadow-md"
                : "text-[#9BA4B4] hover:bg-[#394867]/50 hover:text-white"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 text-[#9BA4B4] hover:bg-[#394867] hover:text-white rounded-lg transition-all duration-200"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;