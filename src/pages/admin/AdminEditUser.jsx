import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserById, updateUser } from "../../api/Api";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import FormSelect from "../../components/FormSelect";
import Toast from "../../components/Toast";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "EMPLOYEE",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(id);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        setMessage(`Error: Failed to fetch user data.`);
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Note: This API call should *not* send a password
      await updateUser(id, formData);
      setMessage("Success! User updated.");
      setToast({ isOpen: true, message: "User updated", type: "success" });
      // give a brief moment for the toast to be noticed before navigating
      setTimeout(() => navigate("/admin/employees"), 700);
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "Failed to update";
      setMessage(`Error: ${errMsg}`);
      setToast({ isOpen: true, message: `Error: ${errMsg}`, type: "error" });
    }
  };

  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  if (loading) {
    return <div className="text-center p-12">Loading...</div>;
  }

  return (
    <>
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

      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-[#14274E] mb-6">Edit User</h1>
        <p className="text-primary-light mb-8">
          Update details for user: {formData.username}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
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
            <FormButton type="submit">Save Changes</FormButton>
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
        <Toast
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast({ isOpen: false, message: "", type: "success" })
          }
        />
      </div>
    </>
  );
};

export default AdminEditUser;
