import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/Api";
import Toast from "../../components/Toast";

const ResetInitialPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");
    let user = null;
    try {
      user = raw ? JSON.parse(raw) : null;
    } catch (e) {
      user = null;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    if (!user?.requiresPasswordChange) {
      const role = user?.role;
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "EMPLOYEE") navigate("/employee/dashboard");
      else navigate("/home");
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.newPassword || form.newPassword.length < 6)
      e.newPassword = "Password must be at least 6 characters";
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await API.post(`/employees/me/force-reset-password`, {
        newPassword: form.newPassword,
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToast({
        isOpen: true,
        message: "Password updated. Please sign in with your new password.",
        type: "success",
      });
      setTimeout(() => navigate("/password-changed"), 900);
    } catch (error) {
      const status = error?.response?.status;
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to reset password";

      if (status === 401 || status === 403) {
        setToast({
          isOpen: true,
          message:
            "Session invalid or you do not have permission. Please sign in again.",
          type: "error",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setToast({ isOpen: true, message: `Error: ${msg}`, type: "error" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-[#14274E]">
        Reset Your Password
      </h1>
      <p className="text-sm text-[#394867] mb-6">
        Your account requires a password reset. Please choose a new password to
        continue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#14274E] mb-2">
            New Password
          </label>
          <input
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            className={`w-full p-3 rounded-xl border ${
              errors.newPassword ? "border-red-400" : "border-[#E6EDF3]"
            } bg-[#F8FAFB]`}
          />
          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-2">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#14274E] mb-2">
            Confirm New Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full p-3 rounded-xl border ${
              errors.confirmPassword ? "border-red-400" : "border-[#E6EDF3]"
            } bg-[#F8FAFB]`}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-2">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white font-bold ${
              isSubmitting ? "bg-gray-400" : "bg-[#14274E] hover:bg-[#394867]"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ isOpen: false, message: "", type: "success" })
        }
      />
    </div>
  );
};

export default ResetInitialPassword;
