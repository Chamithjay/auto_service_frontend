import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const PasswordChanged = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: auto-redirect to login after 10s
    const t = setTimeout(() => navigate("/login"), 10000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-8 rounded-2xl shadow-lg text-center">
      <h1 className="text-2xl font-bold mb-4 text-[#14274E]">
        Password changed
      </h1>
      <p className="text-sm text-[#394867] mb-6">
        Your password has been updated successfully. Please sign in with your
        new password.
      </p>

      <div className="flex items-center justify-center space-x-3">
        <Link
          to="/login"
          className="px-6 py-2 bg-[#14274E] text-white rounded-lg font-semibold"
        >
          Sign in
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded-lg text-[#394867]"
        >
          Go back
        </button>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        You will be redirected to sign in automatically.
      </p>
    </div>
  );
};

export default PasswordChanged;
