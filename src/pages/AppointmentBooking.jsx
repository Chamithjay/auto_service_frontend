import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/Api";
import CustomerNavbar from "../components/Customer/CustomerNavbar";
import CustomerSidebar from "../components/Customer/CustomerSidebar";

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Step state management
  const [currentStep, setCurrentStep] = useState(1); // 1: vehicle selection, 2: service selection & details

  // Vehicle selection state
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Services and modifications state
  const [servicesAndModifications, setServicesAndModifications] = useState({
    services: [],
    modifications: [],
  });
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  // Appointment details state
  const [appointmentDate, setAppointmentDate] = useState("");
  const [sessionType, setSessionType] = useState(""); // MORNING or EVENING

  // Calculation result state
  const [calculationResult, setCalculationResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Fetch user vehicles on component mount
  useEffect(() => {
    fetchUserVehicles();
  }, []);

  const fetchUserVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      // Vehicles endpoint now reads the user from the Authorization JWT header
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

      // Fetch services and modifications for the selected vehicle
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
    // Reset calculation when selection changes
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
      // create endpoint now reads the user from the Authorization JWT header
      const response = await API.post("/appointments/create", createRequest);
      setSuccess(response.data.message || "Appointment created successfully!");

      // Show success message for 2 seconds then redirect
      setTimeout(() => {
        navigate("/appointments/history"); // Adjust route as needed
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

  // Sanitize server messages before showing to users.
  // Replace verbose/internal messages with a single friendly message when appropriate.
  const sanitizeServerMessage = (msg) => {
    if (!msg) return "";

    const lower = msg.toLowerCase();

    // Map backend internal staffing/unavailability messages to a single user-facing message.
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

    // Default: return the original message unchanged
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

  // Get today's date for min date attribute
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
    <div className="min-h-screen bg-[#F1F6F9]">
      <CustomerNavbar
        user={user}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <CustomerSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="container mx-auto px-4 py-8 lg:ml-64 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-[#14274E] mb-2">
              Book an Appointment
            </h1>
            <p className="text-[#394867]">
              Schedule your vehicle service or modifications
            </p>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Vehicle selector: compact cards on top of the form (includes Add button) */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold text-[#14274E] mb-3">
              Select Vehicle
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14274E]"></div>
              </div>
            ) : (
              <div className="flex items-center gap-3 overflow-x-auto py-2">
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <button
                      key={vehicle.vehicleId}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className={`flex-shrink-0 p-3 w-44 text-left border-2 rounded-lg transition-colors ${
                        selectedVehicle?.vehicleId === vehicle.vehicleId
                          ? "border-[#14274E] bg-[#F1F6F9]"
                          : "border-[#9BA4B4] hover:border-[#14274E] hover:bg-[#F8FAFC]"
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
                  <div className="text-sm text-[#9BA4B4]">
                    No vehicles found.
                  </div>
                )}

                {/* Add vehicle button (simple +) - placed after vehicles */}
                <button
                  onClick={() => navigate("/vehicles")}
                  title="Add vehicle"
                  className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl rounded-lg border-2 border-dashed border-[#9BA4B4] text-[#14274E] hover:bg-[#F1F6F9]"
                >
                  +
                </button>
              </div>
            )}

            {!selectedVehicle && (
              <p className="text-[#9BA4B4] mt-3">
                Select a vehicle to continue with booking.
              </p>
            )}
          </div>

          {/* Step 2: Service Selection and Appointment Details */}
          {currentStep === 2 && selectedVehicle && (
            <div className="space-y-6">
              {/* Selected Vehicle Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-[#394867] mb-1">
                      Selected Vehicle
                    </label>
                    <input
                      type="text"
                      value={selectedVehicle.vehicleName}
                      disabled
                      className="w-full px-4 py-2 bg-[#F1F6F9] text-[#14274E] rounded-lg font-semibold cursor-not-allowed"
                    />
                  </div>
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 text-[#394867] hover:text-[#14274E] hover:bg-[#F1F6F9] rounded-lg transition-colors"
                  >
                    Change Vehicle
                  </button>
                </div>
              </div>

              {/* Services Selection */}
              {servicesAndModifications.services.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-[#14274E] mb-4">
                    Select Services
                  </h2>
                  <div className="space-y-3">
                    {servicesAndModifications.services.map((service) => (
                      <label
                        key={service.id}
                        className="flex items-center p-4 border-2 border-[#9BA4B4] rounded-lg hover:bg-[#F1F6F9] cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedServiceIds.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="w-5 h-5 text-[#14274E] border-[#9BA4B4] rounded focus:ring-[#14274E] focus:ring-2"
                        />
                        <span className="ml-3 text-[#14274E] font-semibold">
                          {service.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Modifications Selection */}
              {servicesAndModifications.modifications.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-[#14274E] mb-4">
                    Select Modifications
                  </h2>
                  <div className="space-y-3">
                    {servicesAndModifications.modifications.map(
                      (modification) => (
                        <label
                          key={modification.id}
                          className="flex items-center p-4 border-2 border-[#9BA4B4] rounded-lg hover:bg-[#F1F6F9] cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedServiceIds.includes(
                              modification.id
                            )}
                            onChange={() =>
                              handleServiceToggle(modification.id)
                            }
                            className="w-5 h-5 text-[#14274E] border-[#9BA4B4] rounded focus:ring-[#14274E] focus:ring-2"
                          />
                          <span className="ml-3 text-[#14274E] font-semibold">
                            {modification.name}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Date and Session Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#14274E] mb-4">
                  Select Date & Session
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#394867] mb-2">
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
                      className="w-full px-4 py-3 border-2 border-[#9BA4B4] rounded-lg focus:border-[#14274E] focus:outline-none text-[#14274E]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#394867] mb-2">
                      Session
                    </label>
                    <select
                      value={sessionType}
                      onChange={(e) => {
                        setSessionType(e.target.value);
                        setCalculationResult(null);
                      }}
                      className="w-full px-4 py-3 border-2 border-[#9BA4B4] rounded-lg focus:border-[#14274E] focus:outline-none text-[#14274E] bg-white"
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
                  className="mt-4 w-full bg-[#394867] text-white py-3 rounded-lg font-semibold hover:bg-[#14274E] transition-colors disabled:bg-[#9BA4B4] disabled:cursor-not-allowed"
                >
                  {isCalculating ? "Calculating..." : "Calculate Cost"}
                </button>
              </div>

              {/* Calculation Results */}
              {calculationResult && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-[#14274E] mb-4">
                    Appointment Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-[#F1F6F9] rounded-lg">
                      <span className="text-[#394867] font-semibold">
                        Total Cost
                      </span>
                      <span className="text-2xl font-bold text-[#14274E]">
                        ${calculationResult.totalCost?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {calcMessage && (
                      <div
                        className={`p-4 border-2 rounded-lg ${
                          calcIsPositive
                            ? "bg-green-50 border-green-400"
                            : "bg-red-50 border-red-400"
                        }`}
                      >
                        <p
                          className={`font-semibold ${
                            calcIsPositive ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {calcIsPositive ? "✓ " : "⚠️ "}
                          {calcMessage}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-4 bg-[#F1F6F9] rounded-lg">
                      <span className="text-[#394867] font-semibold">
                        Selected Items
                      </span>
                      <span className="text-lg font-bold text-[#14274E]">
                        {selectedServiceIds.length} item(s)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateAppointment}
                    disabled={loading}
                    className="mt-6 w-full bg-[#14274E] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#394867] transition-colors disabled:bg-[#9BA4B4] disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
};

export default AppointmentBooking;
