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

      <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl shadow-lg relative">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E] mb-4 sm:mb-6">
          Create New Service
        </h1>
        <p className="text-[#9BA4B4] mb-6 sm:mb-8 text-sm sm:text-base">
          Add a new service or modification to the list of available options.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <FormInput
            label="Username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="e.g., jsmith"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormSelect
              label="Type"
              id="serviceItemType"
              name="serviceItemType"
              value={formData.serviceItemType}
              onChange={handleChange}
            >
              <option value="SERVICE">Service</option>
              <option value="MODIFICATION">Modification</option>
            </FormSelect>

            <FormSelect
              label="Vehicle Type"
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <option value="CAR">Car</option>
              <option value="VAN">Van</option>
              <option value="BUS">Bus</option>
            </FormSelect>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <FormInput
              label="Cost (LKR)"
              id="serviceItemCost"
              name="serviceItemCost"
              type="number"
              step="0.01"
              value={formData.serviceItemCost}
              onChange={handleChange}
              placeholder="e.g., 5000.00"
              required
            />
            <FormInput
              label="Est. Duration (mins)"
              id="estimatedDuration"
              name="estimatedDuration"
              type="number"
              value={formData.estimatedDuration}
              onChange={handleChange}
              placeholder="e.g., 45"
              required
            />
            <FormInput
              label="Req. Employees"
              id="requiredEmployeeCount"
              name="requiredEmployeeCount"
              type="number"
              value={formData.requiredEmployeeCount}
              onChange={handleChange}
              placeholder="e.g., 1"
              required
            />
          </div>

          <div className="pt-4">
            <FormButton type="submit">Create User Account</FormButton>
          </div>
        </form>

        {message && (
          <p
            className={`mt-4 sm:mt-6 text-center text-xs sm:text-sm font-medium ${
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
