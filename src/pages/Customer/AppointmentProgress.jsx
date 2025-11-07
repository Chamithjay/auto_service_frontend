import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerDashboardLayout from "../../components/Customer/CustomerDashboardLayout";
import { getAppointmentProgress } from "../../api/endpoints";

const AppointmentProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointmentProgress();
  }, [id]);

  const fetchAppointmentProgress = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAppointmentProgress(id);
      setAppointment(response.data);
    } catch (error) {
      console.error("Error fetching appointment progress:", error);
      setError("Failed to load appointment details. Please try again.");
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

  if (isLoading) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#14274E]"></div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  if (error || !appointment) {
    return (
      <CustomerDashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-800 font-semibold">
            {error || "Appointment not found"}
          </p>
          <button
            onClick={() => navigate("/customer/dashboard")}
            className="mt-4 text-[#394867] hover:text-[#14274E] font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate("/customer/dashboard")}
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
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-[#14274E]">
                  Appointment #{appointment.appointmentId}
                </h1>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </div>
              <p className="text-[#9BA4B4]">
                {appointment.appointmentDate} | {appointment.startTime} -{" "}
                {appointment.endTime}
              </p>
            </div>
            {appointment.totalCost && (
              <div className="text-left lg:text-right">
                <p className="text-sm text-[#9BA4B4] mb-1">Total Cost</p>
                <p className="text-2xl font-bold text-[#14274E]">
                  Rs. {appointment.totalCost.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#14274E] mb-4">
            Vehicle Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#9BA4B4] mb-1">Vehicle Name</p>
              <p className="font-semibold text-[#14274E]">
                {appointment.vehicle.vehicleName}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#9BA4B4] mb-1">Registration Number</p>
              <p className="font-semibold text-[#14274E]">
                {appointment.vehicle.registrationNo}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#9BA4B4] mb-1">Vehicle Type</p>
              <p className="font-semibold text-[#14274E]">
                {appointment.vehicle.vehicleType}
              </p>
            </div>
            {appointment.vehicle.model && (
              <div>
                <p className="text-sm text-[#9BA4B4] mb-1">Model</p>
                <p className="font-semibold text-[#14274E]">
                  {appointment.vehicle.model}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#14274E] mb-4">
            Service/Project Progress
          </h2>

          {appointment.jobs && appointment.jobs.length > 0 ? (
            <div className="space-y-4">
              {appointment.jobs.map((job, index) => (
                <div
                  key={job.appointmentJobId}
                  className="border-2 border-[#9BA4B4]/30 rounded-xl p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-[#14274E] text-white text-sm font-bold px-3 py-1 rounded-full">
                          {index + 1}
                        </span>
                        <h3 className="font-bold text-[#14274E]">
                          {job.serviceItemName}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-[#9BA4B4]">
                        <span className="bg-[#F1F6F9] px-3 py-1 rounded-full">
                          {job.serviceItemType}
                        </span>
                        {job.assignedEmployees > 0 && (
                          <span className="bg-[#F1F6F9] px-3 py-1 rounded-full">
                            {job.assignedEmployees} Employees Assigned
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full mt-2 sm:mt-0 ${getStatusColor(
                        job.jobStatus
                      )}`}
                    >
                      {job.jobStatus}
                    </span>
                  </div>

                  {(job.startTime || job.endTime) && (
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      {job.startTime && (
                        <div>
                          <span className="text-[#9BA4B4]">Started: </span>
                          <span className="font-semibold text-[#14274E]">
                            {job.startTime}
                          </span>
                        </div>
                      )}
                      {job.endTime && (
                        <div>
                          <span className="text-[#9BA4B4]">Completed: </span>
                          <span className="font-semibold text-[#14274E]">
                            {job.endTime}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {job.additionalCost && job.additionalCost > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-800">
                        <span className="font-semibold">Additional Cost: </span>
                        Rs. {job.additionalCost.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {job.jobNote && (
                    <div className="bg-[#F1F6F9] rounded-lg p-3">
                      <p className="text-sm text-[#394867]">
                        <span className="font-semibold">Note: </span>
                        {job.jobNote}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#9BA4B4] text-center py-8">
              No jobs assigned yet.
            </p>
          )}
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default AppointmentProgress;
