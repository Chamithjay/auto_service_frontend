import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/Api";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import FormSelect from "../../components/FormSelect";
import Toast from "../../components/Toast";

const AdminEditService = () => {
  const { id } = useParams(); // Gets the ':id' from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceItemName: "",
    vehicleType: "CAR",
    requiredEmployeeCount: 1,
    serviceItemCost: "",
    serviceItemType: "SERVICE",
    estimatedDuration: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the service data when the page loads
    const fetchService = async () => {
      try {
        const response = await API.get(`/admin/services/${id}`);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        setMessage(`Error: Failed to fetch service data.`);
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.put(`/admin/services/${id}`, formData);
      setMessage("Success! Service updated.");
      setToast({ isOpen: true, message: "Service updated", type: "success" });
      setTimeout(() => navigate("/admin/services"), 700);
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
        to="/admin/services"
        aria-label="Back to Services"
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

      <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E] mb-4 sm:mb-6">
          Edit Service
        </h1>
        <p className="text-primary-light mb-6 sm:mb-8 text-sm sm:text-base">
          Update the details for "{formData.serviceItemName}".
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <FormInput
            label="Service/Modification Name"
            id="serviceItemName"
            name="serviceItemName"
            value={formData.serviceItemName}
            onChange={handleChange}
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
              required
            />
            <FormInput
              label="Est. Duration (mins)"
              id="estimatedDuration"
              name="estimatedDuration"
              type="number"
              value={formData.estimatedDuration}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Req. Employees"
              id="requiredEmployeeCount"
              name="requiredEmployeeCount"
              type="number"
              value={formData.requiredEmployeeCount}
              onChange={handleChange}
              required
            />
          </div>

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

export default AdminEditService;
