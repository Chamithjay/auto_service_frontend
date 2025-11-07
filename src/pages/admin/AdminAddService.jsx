import { useState } from "react";
// Use shared API axios instance
import API from "../../api/Api";
import { Link } from "react-router-dom";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import FormSelect from "../../components/FormSelect";
import Toast from "../../components/Toast";

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // This will now use the token from localStorage automatically
    // client-side validation
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setToast({
        isOpen: true,
        message: "Please fill all required fields.",
        type: "error",
      });
      return;
    }
    // basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setToast({
        isOpen: true,
        message: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }
    if (formData.password.length < 6) {
      setToast({
        isOpen: true,
        message: "Password must be at least 6 characters.",
        type: "error",
      });
      return;
    }

    try {
      const response = await API.post("admin/employees", formData);
      setMessage(`Success! User "${response.data.username}" created.`);
      setToast({
        isOpen: true,
        message: `User "${response.data.username}" created`,
        type: "success",
      });
      setFormData({ username: "", email: "", password: "", role: "EMPLOYEE" }); // Clear form
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to create user";
      setMessage(`Error: ${errMsg}`);
      setToast({ isOpen: true, message: `Error: ${errMsg}`, type: "error" });
    }
  };

  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  return (
    <>
      {/* fixed back icon near navbar/sidebar corner */}
      <Link
        to="/admin/employees"
        aria-label="Back to Employees"
        style={{ position: "fixed", top: "4.5rem", left: "17rem", zIndex: 40 }}
        className="p-2 rounded-full bg-[#F1F6F9] hover:bg-[#E8EDF1] text-[#394867] shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>

      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg relative">
        <h1 className="text-3xl font-bold text-[#14274E] mb-6">
          Create New User
        </h1>
        <p className="text-[#9BA4B4] mb-8">
          Create a new Employee or Admin account. The user will be required to
          reset their password on first login.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="e.g., jsmith"
            required
          />
          <FormInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., john.smith@autoservice.com"
            required
          />
          <FormInput
            label="Temporary Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <FormSelect
            label="User Role"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </FormSelect>

          <div className="pt-4">
            <FormButton type="submit">Create User Account</FormButton>
          </div>
        </form>

        {message && (
          <p
            className={`mt-6 text-center text-sm font-medium ${
              message?.startsWith?.("Error")
                ? "text-red-600"
                : "text-emerald-800"
            }`}
          >
            {message}
          </p>
        )}
      </div>
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ isOpen: false, message: "", type: "success" })
        }
      />
    </>
  );
};

export default AdminAddUser;
