import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/Api";
import CustomerNavbar from "../components/Customer/CustomerNavbar";
import CustomerSidebar from "../components/Customer/CustomerSidebar";

const AppointmentHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    // initial load: no dates -> backend returns last 15
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAppointments = async (opts = {}) => {
    try {
      setLoading(true);
      setError("");

      // Backend uses Authorization JWT to identify user. Build optional date params.
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
      // backend may return LocalDate (yyyy-MM-dd) or LocalDateTime (yyyy-MM-dd HH:mm)
      // new Date() expects a 'T' between date and time, so replace space with 'T' when present
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

  // (No client-side filtering/sorting — simple listing)

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
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:ml-64 pt-20">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#14274E]">
            Appointment History
          </h1>
          <p className="text-[#394867] text-sm sm:text-base">
            Customer appointments and details
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Date range filter: optional — if empty backend returns last 15 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 sm:mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-1/3">
            <label className="text-sm text-[#394867] whitespace-nowrap">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="sm:ml-2 px-3 py-2 border-2 border-[#9BA4B4] rounded-lg text-[#14274E] w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-1/3">
            <label className="text-sm text-[#394867] whitespace-nowrap">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="sm:ml-2 px-3 py-2 border-2 border-[#9BA4B4] rounded-lg text-[#14274E] w-full"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-1/3 md:justify-end">
            <button
              onClick={() => {
                // validate date range
                if (startDate && endDate && startDate > endDate) {
                  setError("Start date cannot be later than end date");
                  return;
                }
                setError("");
                fetchAppointments({ startDate, endDate });
              }}
              className="sm:ml-2 px-4 py-2 bg-[#14274E] text-white rounded-lg hover:bg-[#394867] text-sm sm:text-base flex-1 sm:flex-none"
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
              className="sm:ml-2 px-4 py-2 bg-white border border-[#9BA4B4] text-[#14274E] rounded-lg hover:bg-[#F1F6F9] text-sm sm:text-base flex-1 sm:flex-none"
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14274E]"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-[#9BA4B4]">
              No appointments found for this user.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left border-b">
                    <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#394867] whitespace-nowrap">
                      ID
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#394867] whitespace-nowrap">
                      Created At
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#394867] whitespace-nowrap">
                      Appointment Date
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#394867] whitespace-nowrap">
                      Vehicle
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#394867] whitespace-nowrap">
                      Selected Services
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#394867] whitespace-nowrap">
                      Session
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#394867] whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#394867] whitespace-nowrap">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr
                      key={a.appointmentId}
                      className="border-b hover:bg-[#F1F6F9]"
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

        <div className="mt-4 sm:mt-6 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#14274E] text-white rounded-lg hover:bg-[#394867] text-sm sm:text-base"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistory;
