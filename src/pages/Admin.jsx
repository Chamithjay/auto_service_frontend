import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/Api";  // For future fetches
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const Admin = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");  // Default to dashboard
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");  // From localStorage

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username") || "Admin";

    setUsername(storedUsername);

    if (!token || role !== "ADMIN") {
      setIsAuthorized(false);
      navigate("/login");
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F6F9] flex items-center justify-center">
        <div className="text-[#394867]">Loading Admin Portal...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  // Dynamic content based on active page
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold text-[#14274E]">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stat Cards - Reuse style from Home.jsx */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-[#14274E]">250</h3>
                <p className="text-[#394867] mt-2">Active Services</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-[#14274E]">15</h3>
                <p className="text-[#394867] mt-2">Employees</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-[#14274E]">98%</h3>
                <p className="text-[#394867] mt-2">Satisfaction Rate</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-[#14274E]">12</h3>
                <p className="text-[#394867] mt-2">Pending Bookings</p>
              </div>
            </div>
          </div>
        );
      case "employees":
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-[#14274E]">Employees Management</h2>
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <p className="text-[#394867]">Placeholder: Employee list table (fetch from API later).</p>
              {/* Example: <table>...</table> */}
            </div>
          </div>
        );
      case "services":
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-[#14274E]">Services Management</h2>
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <p className="text-[#394867]">Placeholder: Services CRUD (add/edit/delete).</p>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-[#14274E]">Profile Settings</h2>
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <p className="text-[#394867]">Placeholder: Update username/email/password.</p>
            </div>
          </div>
        );
      default:
        return <div className="p-6 text-[#394867]">Select a page from the sidebar.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F6F9]">
      {/* Sidebar */}
      <AdminSidebar activePage={activePage} onPageChange={setActivePage} />

      <div className="ml-64">  {/* Offset for sidebar */}
        {/* Navbar */}
        <AdminNavbar pageTitle={activePage.charAt(0).toUpperCase() + activePage.slice(1)} username={username} />

        {/* Main Content - Offset for navbar */}
        <main className="pt-16 min-h-screen">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Admin;