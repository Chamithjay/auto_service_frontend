import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomerDashboardLayout from "../../components/Customer/CustomerDashboardLayout";
import { addVehicle, updateVehicle, getVehicleById } from "../../api/endpoints";

const VehicleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    vehicleName: "",
    registrationNo: "",
    vehicleType: "CAR",
    model: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    setIsFetching(true);
    try {
      const response = await getVehicleById(id);
      setFormData({
        vehicleName: response.data.vehicleName,
        registrationNo: response.data.registrationNo,
        vehicleType: response.data.vehicleType,
        model: response.data.model || "",
      });
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      setErrors({ general: "Failed to load vehicle details." });
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleName.trim()) {
      newErrors.vehicleName = "Vehicle name is required";
    } else if (formData.vehicleName.length > 255) {
      newErrors.vehicleName = "Vehicle name must not exceed 255 characters";
    }

    if (!formData.registrationNo.trim()) {
      newErrors.registrationNo = "Registration number is required";
    } else if (formData.registrationNo.length > 255) {
      newErrors.registrationNo =
        "Registration number must not exceed 255 characters";
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = "Vehicle type is required";
    }

    if (formData.model && formData.model.length > 255) {
      newErrors.model = "Model must not exceed 255 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isEditMode) {
        await updateVehicle(id, formData);
      } else {
        await addVehicle(formData);
      }
      navigate("/customer/vehicles");
    } catch (error) {
      console.error("Error saving vehicle:", error);
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setErrors({ general: error.response.data.message });
        } else if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      } else {
        setErrors({
          general: `Failed to ${
            isEditMode ? "update" : "add"
          } vehicle. Please try again.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#14274E]"></div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/customer/vehicles")}
          className="flex items-center text-[#394867] hover:text-[#14274E] font-semibold transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Vehicles
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-[#14274E] mb-6">
            {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Vehicle Name */}
            <div>
              <label
                htmlFor="vehicleName"
                className="block text-sm font-semibold text-[#14274E] mb-2"
              >
                Vehicle Name <span className="text-red-500">*</span>
              </label>
              <input
                id="vehicleName"
                name="vehicleName"
                type="text"
                value={formData.vehicleName}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-3 border ${
                  errors.vehicleName ? "border-red-400" : "border-[#9BA4B4]/30"
                } rounded-xl bg-[#F1F6F9] text-[#14274E] placeholder-[#9BA4B4] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300`}
                placeholder="e.g., Toyota Corolla, Honda CR-V"
              />
              {errors.vehicleName && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.vehicleName}
                </p>
              )}
            </div>

            {/* Registration Number */}
            <div>
              <label
                htmlFor="registrationNo"
                className="block text-sm font-semibold text-[#14274E] mb-2"
              >
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                id="registrationNo"
                name="registrationNo"
                type="text"
                value={formData.registrationNo}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-3 border ${
                  errors.registrationNo
                    ? "border-red-400"
                    : "border-[#9BA4B4]/30"
                } rounded-xl bg-[#F1F6F9] text-[#14274E] placeholder-[#9BA4B4] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300`}
                placeholder="e.g., ABC-1234"
              />
              {errors.registrationNo && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.registrationNo}
                </p>
              )}
            </div>

            {/* Vehicle Type */}
            <div>
              <label
                htmlFor="vehicleType"
                className="block text-sm font-semibold text-[#14274E] mb-2"
              >
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-3 border ${
                  errors.vehicleType ? "border-red-400" : "border-[#9BA4B4]/30"
                } rounded-xl bg-[#F1F6F9] text-[#14274E] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300`}
              >
                <option value="CAR">Car</option>
                <option value="VAN">Van</option>
                <option value="BUS">Bus</option>
              </select>
              {errors.vehicleType && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.vehicleType}
                </p>
              )}
            </div>

            {/* Model */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-semibold text-[#14274E] mb-2"
              >
                Model (Optional)
              </label>
              <input
                id="model"
                name="model"
                type="text"
                value={formData.model}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-3 border ${
                  errors.model ? "border-red-400" : "border-[#9BA4B4]/30"
                } rounded-xl bg-[#F1F6F9] text-[#14274E] placeholder-[#9BA4B4] focus:outline-none focus:ring-2 focus:ring-[#394867] focus:border-transparent transition-all duration-300`}
                placeholder="e.g., 2020, XLE, Sport"
              />
              {errors.model && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.model}
                </p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/customer/vehicles")}
                className="flex-1 px-6 py-3 border-2 border-[#9BA4B4] text-[#394867] rounded-lg font-semibold hover:bg-[#F1F6F9] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center ${
                  isLoading
                    ? "bg-[#9BA4B4] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#14274E] to-[#394867] hover:from-[#394867] hover:to-[#14274E] text-white"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditMode ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{isEditMode ? "Update Vehicle" : "Add Vehicle"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default VehicleForm;
