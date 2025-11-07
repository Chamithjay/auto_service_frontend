import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import EmployeeNavbar from "./EmployeeNavbar";
import EmployeeSidebar from "./EmployeeSidebar";

const EmployeeLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "EMPLOYEE") {
        navigate("/login");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F6F9]">
      <EmployeeNavbar user={user} />
      <EmployeeSidebar />
      <main className="ml-64 mt-16 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
