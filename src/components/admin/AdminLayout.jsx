import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in and has admin role
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== "ADMIN") {
            // Redirect to appropriate dashboard based on role
            if (parsedUser.role === "EMPLOYEE") {
                navigate("/employee/dashboard");
            } else {
                navigate("/home");
            }
            return;
        }

        setUser(parsedUser);
        setIsLoading(false);
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F1F6F9] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#14274E]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F6F9]">
            <AdminNavbar user={user} />
            <AdminSidebar />
            <main className="ml-64 mt-16 p-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;