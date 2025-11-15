import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/Api";
import CustomerDashboardLayout from "../components/Customer/CustomerDashboardLayout";

const AppointmentHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async (opts = {}) => {
    try {
      setLoading(true);
      setError("");

      const s = opts.startDate ?? startDate;
      const e = opts.endDate ?? endDate;
      const params = new URLSearchParams();
      if (s) params.set("startDate", s);
      if (e) params.set("endDate", e);
      const q = params.toString();
      const res = await API.get(`/appointments/history${q ? `?${q}` : ""}`);
      setAppointments(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch appointments");
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d, withTime = false) => {
    if (!d) return "-";
    try {
      let ds = String(d);
      if (ds.includes(" ")) ds = ds.replace(" ", "T");
      const date = new Date(ds);

      if (withTime) {
        return date.toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      return date.toLocaleDateString();
    } catch {
      return d;
    }
  };

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E]">
            Appointment History
          </h1>
          <p className="text-[#9BA4B4] mt-1">
            View your past and upcoming appointments
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-1/3">
            <label className="text-sm font-medium text-[#394867] whitespace-nowrap">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="sm:ml-2 px-3 py-2 border-2 border-gray-200 rounded-lg text-[#14274E] w-full focus:border-[#14274E] focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-1/3">
            <label className="text-sm font-medium text-[#394867] whitespace-nowrap">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="sm:ml-2 px-3 py-2 border-2 border-gray-200 rounded-lg text-[#14274E] w-full focus:border-[#14274E] focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-1/3 md:justify-end">
            <button
              onClick={() => {
                if (startDate && endDate && startDate > endDate) {
                  setError("Start date cannot be later than end date");
                  return;
                }
                setError("");
                fetchAppointments({ startDate, endDate });
              }}
              className="sm:ml-2 px-4 py-2 bg-[#14274E] text-white rounded-lg hover:bg-[#394867] transition-colors text-sm sm:text-base flex-1 sm:flex-none font-medium"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setError("");
                fetchAppointments({ startDate: "", endDate: "" });
              }}
              className="sm:ml-2 px-4 py-2 bg-white border border-gray-200 text-[#14274E] rounded-lg hover:bg-[#F1F6F9] transition-colors text-sm sm:text-base flex-1 sm:flex-none font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14274E]"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-[#9BA4B4] text-center">
              No appointments found for this user.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-[#F1F6F9]">
                  <tr className="text-left">
                    <th className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-[#394867] whitespace-nowrap">
                      ID
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-[#394867] whitespace-nowrap">
                      Created At
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-[#394867] whitespace-nowrap">
                      Appointment Date
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-[#394867] whitespace-nowrap">
                      Vehicle
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-[#394867] whitespace-nowrap">
                      Selected Services
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-[#394867] whitespace-nowrap">
                      Session
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-[#394867] whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-[#394867] whitespace-nowrap">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr
                      key={a.appointmentId}
                      className="border-b border-gray-100 hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-[#14274E]">
                        {a.appointmentId}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-[#14274E] whitespace-nowrap">
                        {formatDate(a.createdAt, true)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-[#14274E] whitespace-nowrap">
                        {formatDate(a.appointmentDate)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-[#14274E]">
                        {a.vehicleName}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-[#14274E]">
                        {(a.selectedServices || []).join(", ")}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-[#14274E]">
                        {a.sessionType || "-"}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            a.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : a.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-[#14274E] whitespace-nowrap">
                        {a.totalCost
                          ? `$${Number(a.totalCost).toFixed(2)}`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#14274E] text-white rounded-lg hover:bg-[#394867] transition-colors text-sm sm:text-base font-medium"
          >
            Back
          </button>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default AppointmentHistory;
