import { useState } from "react";
// Import from your team's Api.jsx file
import { createServiceItem } from "../../api/Api";
import { Link } from "react-router-dom";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import FormSelect from "../../components/FormSelect";
import Toast from "../../components/Toast";

const AdminAddService = () => {
  const [formData, setFormData] = useState({
    serviceItemName: "",
    vehicleType: "CAR",
    requiredEmployeeCount: 1,
    serviceItemCost: "",
    serviceItemType: "SERVICE",
    estimatedDuration: "",
  });
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // client-side validation
    if (!formData.serviceItemName.trim()) {
      setToast({
        isOpen: true,
        message: "Please enter a service name.",
        type: "error",
      });
      return;
    }
    const cost = parseFloat(formData.serviceItemCost);
    const duration = parseInt(formData.estimatedDuration, 10);
    const reqEmp = parseInt(formData.requiredEmployeeCount, 10);
    if (isNaN(cost) || cost <= 0) {
      setToast({
        isOpen: true,
        message: "Please enter a valid cost greater than 0.",
        type: "error",
      });
      return;
    }
    if (isNaN(duration) || duration <= 0) {
      setToast({
        isOpen: true,
        message: "Please enter a valid estimated duration.",
        type: "error",
      });
      return;
    }
    if (isNaN(reqEmp) || reqEmp < 1) {
      setToast({
        isOpen: true,
        message: "Please enter required employee count (>= 1).",
        type: "error",
      });
      return;
    }

    try {
      const response = await createServiceItem(formData);
      setMessage(
        `Success! Service "${response.data.serviceItemName}" created.`
      );
      setToast({
        isOpen: true,
        message: `Service "${response.data.serviceItemName}" created`,
        type: "success",
      });
      setFormData({
        serviceItemName: "",
        vehicleType: "CAR",
        requiredEmployeeCount: 1,
        serviceItemCost: "",
        serviceItemType: "SERVICE",
        estimatedDuration: "",
      });
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to create service";
      setMessage(`Error: ${errMsg}`);
      setToast({ isOpen: true, message: `Error: ${errMsg}`, type: "error" });
    }
  };

  // place a compact back icon near the navbar/sidebar corner
  const backButtonStyle = {
    position: "fixed",
    top: "4.5rem", // slightly below the navbar (navbar height is 4rem)
    left: "17rem", // just right of the sidebar (sidebar width is 16rem)
    zIndex: 40,
  };

  return (
    <>
      <Link
        to="/admin/services"
        aria-label="Back to Services"
        style={backButtonStyle}
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
          Create New Service
        </h1>
        <p className="text-[#9BA4B4] mb-8">
          Add a new service or modification to the list of available options.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Service/Modification Name"
            id="serviceItemName"
            name="serviceItemName"
            value={formData.serviceItemName}
            onChange={handleChange}
            placeholder="e.g., Premium Oil Change"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <FormButton type="submit">Create Service</FormButton>
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

export default AdminAddService;
