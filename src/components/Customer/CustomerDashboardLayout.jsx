import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar";
import CustomerSidebar from "./CustomerSidebar";

const CustomerDashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "CUSTOMER") {
      if (parsedUser.role === "ADMIN") navigate("/admin/dashboard");
      else if (parsedUser.role === "EMPLOYEE") navigate("/employee/dashboard");
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);
  const handleSidebarClose = () => setIsSidebarOpen(false);

  if (!user)
    return (
      <div className="min-h-screen bg-[#F1F6F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14274E]"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F1F6F9]">
      <CustomerNavbar
        user={user}
        onMenuToggle={handleSidebarToggle}
        isSidebarOpen={isSidebarOpen}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleSidebarClose}
        ></div>
      )}

      <CustomerSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

      {/* This is the key: render the child pages here */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboardLayout;
