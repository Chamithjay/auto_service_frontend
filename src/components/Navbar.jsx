import { Link, useLocation } from "react-router-dom";
import companyLogo from "../assets/company_logo.png";

const Navbar = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <nav className="bg-[#14274E]/95 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 border-b border-[#394867]/20">
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <div className="flex items-center cursor-pointer">
              <img
                src={companyLogo}
                alt="AutoService Logo"
                className="h-23 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Navigation Links & Buttons */}
          <div className="flex items-center space-x-3">
            {isLoginPage ? (
              <button
                disabled
                className="w-28 px-6 py-2.5 text-white/50 border-2 border-[#394867]/50 rounded-lg font-semibold cursor-not-allowed"
              >
                Login
              </button>
            ) : (
              <Link
                to="/login"
                className="w-28 px-6 py-2.5 text-white hover:text-[#394867] border-2 border-[#394867] hover:bg-white rounded-lg font-semibold transition-all duration-200 text-center"
              >
                Login
              </Link>
            )}
            {isRegisterPage ? (
              <button
                disabled
                className="w-28 px-6 py-2.5 text-white/50 bg-[#394867]/50 rounded-lg font-semibold cursor-not-allowed shadow-lg"
              >
                Sign Up
              </button>
            ) : (
              <Link
                to="/register"
                className="w-28 px-6 py-2.5 bg-[#394867] hover:bg-[#9BA4B4] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg text-center"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
