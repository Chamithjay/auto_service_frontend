import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import ChatBot from "../ChatBot/ChatBot";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "ADMIN") {
        if (parsedUser.role === "EMPLOYEE") {
          navigate("/employee/dashboard");
        } else {
          navigate("/home");
        }
        return;
      }

      setUser(parsedUser);
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F6F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-[#14274E]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F1F6F9] overflow-hidden">
      <AdminNavbar user={user} />
      <AdminSidebar />
      <main className="ml-64 mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 sm:p-8">
        {children ?? <Outlet />}
      </main>
      <ChatBot />
    </div>
  );
};

export default AdminLayout;
