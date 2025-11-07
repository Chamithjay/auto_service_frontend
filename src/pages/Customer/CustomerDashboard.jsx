import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerDashboardLayout from "../../components/Customer/CustomerDashboardLayout";
import { getDashboardStats, getActiveAppointments } from "../../api/endpoints";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsResponse, appointmentsResponse] = await Promise.all([
        getDashboardStats(),
        getActiveAppointments(),
      ]);

      setStats(statsResponse.data);
      setAppointments(appointmentsResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "ONGOING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressPercentage = (totalJobs, completedJobs) => {
    if (!totalJobs || totalJobs === 0) return 0;
    return Math.round((completedJobs / totalJobs) * 100);
  };

  if (isLoading) {
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E]">
            Dashboard
          </h1>
          <p className="text-[#9BA4B4] mt-1">
            Overview of your vehicles and service appointments
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
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                    My Vehicles
                  </p>
                  <h3 className="text-3xl font-bold text-[#14274E] mt-2">
                    {stats.totalVehicles}
                  </h3>
                </div>
                <div className="bg-[#14274E]/10 p-3 rounded-xl">
                  <svg
                    className="w-8 h-8 text-[#14274E]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                    Total Appointments
                  </p>
                  <h3 className="text-3xl font-bold text-[#14274E] mt-2">
                    {stats.totalAppointments}
                  </h3>
                </div>
                <div className="bg-[#394867]/10 p-3 rounded-xl">
                  <svg
                    className="w-8 h-8 text-[#394867]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                    Active Services
                  </p>
                  <h3 className="text-3xl font-bold text-[#14274E] mt-2">
                    {stats.activeAppointments}
                  </h3>
                </div>
                <div className="bg-yellow-500/10 p-3 rounded-xl">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                    Completed
                  </p>
                  <h3 className="text-3xl font-bold text-[#14274E] mt-2">
                    {stats.completedAppointments}
                  </h3>
                </div>
                <div className="bg-green-500/10 p-3 rounded-xl">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#14274E]">
              Active Service Appointments
            </h2>
            <button
              onClick={() => navigate("/customer/appointments")}
              className="text-[#394867] hover:text-[#14274E] font-semibold text-sm transition-colors"
            >
              View All →
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-[#9BA4B4] mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-[#9BA4B4] text-lg">No active appointments</p>
              <p className="text-[#9BA4B4] text-sm mt-2">
                Book a service to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const progress = getProgressPercentage(
                  appointment.totalJobs,
                  appointment.completedJobs
                );

                return (
                  <div
                    key={appointment.appointmentId}
                    className="border-2 border-[#9BA4B4]/30 rounded-xl p-4 hover:border-[#394867] transition-all duration-200 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/customer/appointments/${appointment.appointmentId}`
                      )
                    }
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-[#14274E]">
                            {appointment.vehicle.vehicleName}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#9BA4B4]">
                          {appointment.vehicle.registrationNo} |{" "}
                          {appointment.appointmentDate} |{" "}
                          {appointment.startTime} - {appointment.endTime}
                        </p>
                        <p className="text-sm text-[#394867] font-semibold mt-1">
                          {appointment.totalJobs} Jobs |{" "}
                          {appointment.completedJobs} Completed
                          {appointment.totalCost && (
                            <span className="ml-2">
                              | Rs. {appointment.totalCost.toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-[#F1F6F9] rounded-full h-2">
                        <div
                          className="bg-[#394867] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-[#394867] min-w-[3rem] text-right">
                        {progress}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#14274E] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/customer/vehicles")}
              className="p-4 border-2 border-[#9BA4B4]/30 rounded-xl hover:border-[#394867] hover:bg-[#F1F6F9] transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-[#14274E]/10 p-2 rounded-lg group-hover:bg-[#14274E]/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-[#14274E]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-[#14274E]">
                  Add Vehicle
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate("/customer/book-appointment")}
              className="p-4 border-2 border-[#9BA4B4]/30 rounded-xl hover:border-[#394867] hover:bg-[#F1F6F9] transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-[#394867]/10 p-2 rounded-lg group-hover:bg-[#394867]/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-[#394867]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-[#14274E]">
                  Book Appointment
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate("/customer/profile")}
              className="p-4 border-2 border-[#9BA4B4]/30 rounded-xl hover:border-[#394867] hover:bg-[#F1F6F9] transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-[#14274E]/10 p-2 rounded-lg group-hover:bg-[#14274E]/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-[#14274E]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-[#14274E]">
                  Edit Profile
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerDashboard;
