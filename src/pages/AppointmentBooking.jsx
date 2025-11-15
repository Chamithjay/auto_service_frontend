import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/Api";
import CustomerDashboardLayout from "../components/Customer/CustomerDashboardLayout";

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentStep, setCurrentStep] = useState(1);

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [servicesAndModifications, setServicesAndModifications] = useState({
    services: [],
    modifications: [],
  });
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [sessionType, setSessionType] = useState("");

  const [calculationResult, setCalculationResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    fetchUserVehicles();
  }, []);

  const fetchUserVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/appointments/vehicles");
      setVehicles(response.data);

      if (response.data.length === 0) {
        setError(
          "You have no registered vehicles. Please register a vehicle first."
        );
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      setError(sanitizeServerMessage(serverMsg) || "Failed to fetch vehicles");
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = async (vehicle) => {
    try {
      setLoading(true);
      setError("");
      setSelectedVehicle(vehicle);

      const response = await API.post("/appointments/services", {
        vehicleId: vehicle.vehicleId,
      });

      setServicesAndModifications(response.data);
      setCurrentStep(2);
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      setError(
        sanitizeServerMessage(serverMsg) ||
          "Failed to fetch services and modifications"
      );
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
    setCalculationResult(null);
  };

  const handleCalculate = async () => {
    if (!appointmentDate || !sessionType) {
      setError("Please select both date and session");
      return;
    }

    if (selectedServiceIds.length === 0) {
      setError("Please select at least one service or modification");
      return;
    }

    try {
      setIsCalculating(true);
      setError("");

      const calculationRequest = {
        vehicleId: selectedVehicle.vehicleId,
        selectedServiceItemIds: selectedServiceIds,
        appointmentDate: appointmentDate,
        sessionType: sessionType,
      };

      const response = await API.post(
        "/appointments/calculate",
        calculationRequest
      );
      setCalculationResult(response.data);
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      setError(
        sanitizeServerMessage(serverMsg) ||
          "Failed to calculate appointment details"
      );
      console.error("Error calculating:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (!calculationResult) {
      setError("Please calculate the appointment details first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const createRequest = {
        vehicleId: selectedVehicle.vehicleId,
        selectedServiceItemIds: selectedServiceIds,
        appointmentDate: appointmentDate,
        sessionType: sessionType,
      };
      const response = await API.post("/appointments/create", createRequest);
      setSuccess(response.data.message || "Appointment created successfully!");

      setTimeout(() => {
        navigate("/appointments/history");
      }, 2000);
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      setError(
        sanitizeServerMessage(serverMsg) || "Failed to create appointment"
      );
      console.error("Error creating appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  const sanitizeServerMessage = (msg) => {
    if (!msg) return "";

    const lower = msg.toLowerCase();

    const patterns = [
      "no available employees",
      "no available staff",
      "cannot take the service item",
      "cannot take the service",
      "no available employee",
    ];

    for (const p of patterns) {
      if (lower.includes(p)) {
        return "This session is not available for the selected services.";
      }
    }

    return msg;
  };

  const handleBack = () => {
    setCurrentStep(1);
    setSelectedVehicle(null);
    setServicesAndModifications({ services: [], modifications: [] });
    setSelectedServiceIds([]);
    setAppointmentDate("");
    setSessionType("");
    setCalculationResult(null);
    setError("");
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const calcMessage =
    calculationResult && calculationResult.message
      ? sanitizeServerMessage(calculationResult.message)
      : "";
  const calcIsPositive = (() => {
    if (!calcMessage) return false;
    const lower = calcMessage.toLowerCase();
    return lower.includes("available") && !lower.includes("not available");
  })();

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E]">
            Book an Appointment
          </h1>
          <p className="text-[#9BA4B4] mt-1">
            Schedule your vehicle service or modifications
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#14274E] mb-4">
            Select Vehicle
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#14274E]"></div>
            </div>
          ) : (
            <div className="flex items-center gap-3 overflow-x-auto py-2">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <button
                    key={vehicle.vehicleId}
                    onClick={() => handleVehicleSelect(vehicle)}
                    className={`flex-shrink-0 p-4 w-48 text-left border-2 rounded-xl transition-all ${
                      selectedVehicle?.vehicleId === vehicle.vehicleId
                        ? "border-[#14274E] bg-[#F1F6F9] shadow-sm"
                        : "border-gray-200 hover:border-[#14274E] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="text-sm font-semibold text-[#14274E] truncate">
                      {vehicle.vehicleName}
                    </div>
                    <div className="text-xs text-[#9BA4B4] mt-1 capitalize truncate">
                      {vehicle.vehicleType?.toLowerCase().replace("_", " ")}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-[#9BA4B4]">No vehicles found.</div>
              )}

              <button
                onClick={() => navigate("/vehicles")}
                title="Add vehicle"
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl rounded-xl border-2 border-dashed border-gray-300 text-[#14274E] hover:bg-[#F1F6F9] hover:border-[#14274E] transition-all"
              >
                +
              </button>
            </div>
          )}

          {!selectedVehicle && (
            <p className="text-[#9BA4B4] mt-3 text-sm">
              Select a vehicle to continue with booking.
            </p>
          )}
        </div>

        {currentStep === 2 && selectedVehicle && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#394867] mb-2">
                    Selected Vehicle
                  </label>
                  <input
                    type="text"
                    value={selectedVehicle.vehicleName}
                    disabled
                    className="w-full px-4 py-3 bg-[#F1F6F9] text-[#14274E] rounded-lg font-semibold cursor-not-allowed"
                  />
                </div>
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-[#394867] hover:text-[#14274E] hover:bg-[#F1F6F9] rounded-lg transition-colors border border-gray-200"
                >
                  Change Vehicle
                </button>
              </div>
            </div>

            {servicesAndModifications.services.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#14274E] mb-4">
                  Select Services
                </h2>
                <div className="space-y-3">
                  {servicesAndModifications.services.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:bg-[#F1F6F9] hover:border-[#14274E] cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServiceIds.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="w-5 h-5 text-[#14274E] border-gray-300 rounded focus:ring-[#14274E] focus:ring-2"
                      />
                      <span className="ml-3 text-[#14274E] font-medium">
                        {service.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {servicesAndModifications.modifications.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#14274E] mb-4">
                  Select Modifications
                </h2>
                <div className="space-y-3">
                  {servicesAndModifications.modifications.map(
                    (modification) => (
                      <label
                        key={modification.id}
                        className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:bg-[#F1F6F9] hover:border-[#14274E] cursor-pointer transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={selectedServiceIds.includes(modification.id)}
                          onChange={() => handleServiceToggle(modification.id)}
                          className="w-5 h-5 text-[#14274E] border-gray-300 rounded focus:ring-[#14274E] focus:ring-2"
                        />
                        <span className="ml-3 text-[#14274E] font-medium">
                          {modification.name}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#14274E] mb-4">
                Select Date & Session
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#394867] mb-2">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => {
                      setAppointmentDate(e.target.value);
                      setCalculationResult(null);
                    }}
                    min={getTodayDate()}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#14274E] focus:outline-none text-[#14274E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#394867] mb-2">
                    Session
                  </label>
                  <select
                    value={sessionType}
                    onChange={(e) => {
                      setSessionType(e.target.value);
                      setCalculationResult(null);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#14274E] focus:outline-none text-[#14274E] bg-white"
                  >
                    <option value="">Select Session</option>
                    <option value="MORNING">Morning</option>
                    <option value="EVENING">Evening</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={
                  isCalculating ||
                  selectedServiceIds.length === 0 ||
                  !appointmentDate ||
                  !sessionType
                }
                className="mt-6 w-full bg-[#14274E] text-white py-3 rounded-lg font-semibold hover:bg-[#394867] transition-colors disabled:bg-[#9BA4B4] disabled:cursor-not-allowed"
              >
                {isCalculating ? "Calculating..." : "Calculate Cost"}
              </button>
            </div>

            {calculationResult && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#14274E] mb-4">
                  Appointment Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-[#F1F6F9] rounded-xl">
                    <span className="text-[#394867] font-medium">
                      Total Cost
                    </span>
                    <span className="text-2xl font-bold text-[#14274E]">
                      ${calculationResult.totalCost?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  {calcMessage && (
                    <div
                      className={`p-4 border-2 rounded-xl ${
                        calcIsPositive
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <p
                        className={`font-medium text-sm ${
                          calcIsPositive ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {calcIsPositive ? "✓ " : "⚠️ "}
                        {calcMessage}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-4 bg-[#F1F6F9] rounded-xl">
                    <span className="text-[#394867] font-medium">
                      Selected Items
                    </span>
                    <span className="text-lg font-semibold text-[#14274E]">
                      {selectedServiceIds.length} item(s)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCreateAppointment}
                  disabled={loading}
                  className="mt-6 w-full bg-[#14274E] text-white py-4 rounded-xl font-semibold text-base hover:bg-[#394867] transition-colors disabled:bg-[#9BA4B4] disabled:cursor-not-allowed shadow-sm"
                >
                  {loading
                    ? "Creating Appointment..."
                    : "Confirm & Book Appointment"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </CustomerDashboardLayout>
  );
};

export default AppointmentBooking;
