import { useNavigate } from "react-router-dom";
import companyLogo from "../../assets/company_logo.png";
import NotificationBell from "../Notification/NotificationBell.jsx";

const AdminNavbar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="bg-[#14274E] shadow-lg fixed w-full top-0 z-50 border-b border-[#394867]/20">
            <div className="w-full px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img
                            src={companyLogo}
                            alt="AutoService Logo"
                            className="h-20 w-auto object-contain"
                        />
                        <span className="ml-4 text-white text-xl font-bold">
                            Admin Panel
                        </span>
                    </div>

                    {/* Right Side: Notifications, User Info & Logout */}
                    <div className="flex items-center space-x-6">
                        {/* Notification Bell */}
                        <div className="notification-bell-wrapper">
                            <NotificationBell userRole={user?.role} />
                        </div>

                        {/* User Info */}
                        <div className="text-right">
                            <p className="text-white font-semibold">{user?.username}</p>
                            <p className="text-[#9BA4B4] text-sm">{user?.role}</p>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2.5 bg-[#394867] hover:bg-[#9BA4B4] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center space-x-2"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;