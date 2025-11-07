import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import companyLogo from "../../assets/company_logo.png";
import NotificationBell from "../Notification/NotificationBell";

const CustomerNavbar = ({ user, onMenuToggle, isSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-[#14274E] shadow-lg fixed w-full top-0 z-50 border-b border-[#394867]/20">
      <div className="w-full px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="lg:hidden mr-3 sm:mr-4 text-white hover:text-[#9BA4B4] transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <Link to="/customer/dashboard" className="flex items-center">
              <img
                src={companyLogo}
                alt="AutoService Logo"
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="notification-bell-wrapper">
              <NotificationBell userRole={user?.role} />
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-white font-semibold text-sm">
                {user?.username}
              </p>
              <p className="text-[#9BA4B4] text-xs">Customer</p>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 sm:px-6 py-2 sm:py-2.5 bg-[#394867] hover:bg-[#9BA4B4] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center space-x-1 sm:space-x-2 text-xs sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
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
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
