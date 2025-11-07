import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const PasswordChanged = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/login"), 10000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-16 sm:mt-24 bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[#14274E]">
        Password changed
      </h1>
      <p className="text-xs sm:text-sm text-[#394867] mb-4 sm:mb-6">
        Your password has been updated successfully. Please sign in with your
        new password.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:space-x-3">
        <Link
          to="/login"
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#14274E] text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-[#394867] transition-colors"
        >
          Sign in
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto px-4 py-2 border rounded-lg text-[#394867] text-sm sm:text-base hover:bg-gray-50 transition-colors"
        >
          Go back
        </button>
      </div>

      <p className="mt-4 sm:mt-6 text-xs text-gray-500">
        You will be redirected to sign in automatically.
      </p>
    </div>
  );
};

export default PasswordChanged;
