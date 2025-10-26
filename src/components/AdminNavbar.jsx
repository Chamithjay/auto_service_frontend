import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ pageTitle, username }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-30 flex items-center justify-between px-6 border-b border-[#9BA4B4]/30">
      {/* Left: Page Title */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate("/home")}  // Back to public home (or customize)
          className="text-[#394867] hover:text-[#14274E] transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-[#14274E]">{pageTitle}</h1>
      </div>

      {/* Right: User Profile */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-[#394867] font-semibold">{username}</span>
        <div className="w-8 h-8 bg-[#9BA4B4] rounded-full flex items-center justify-center text-white font-bold text-sm">
          {username ? username.charAt(0).toUpperCase() : "A"}  {/* Initials fallback */}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;