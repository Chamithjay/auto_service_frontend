import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { employeeAPI } from "../../api/Api";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  // Get employee ID from logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Decode JWT token to get uid (employee ID)
  let employeeId = user.id || user.employeeId || user.userId;

  if (!employeeId && user.token) {
    try {
      // Decode JWT token (format: header.payload.signature)
      const payload = JSON.parse(atob(user.token.split(".")[1]));
      employeeId = payload.uid;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const [dashboardData, setDashboardData] = useState({
    todayAssignments: [],
    upcomingAssignments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Statistics calculation
  const stats = useMemo(() => {
    const allAssignments = [
      ...dashboardData.todayAssignments,
      ...dashboardData.upcomingAssignments,
    ];

    return {
      total: allAssignments.length,
      completed: allAssignments.filter((a) => a.jobStatus === "COMPLETED")
        .length,
      inProgress: allAssignments.filter((a) => a.jobStatus === "ONGOING")
        .length,
      pending: allAssignments.filter((a) => a.jobStatus === "NEW").length,
      today: dashboardData.todayAssignments.length,
    };
  }, [dashboardData]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    const assignments =
      activeTab === "today"
        ? dashboardData.todayAssignments
        : dashboardData.upcomingAssignments;

    return assignments.filter((assignment) => {
      const matchesSearch =
        assignment.serviceName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.customerName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.vehicleInfo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || assignment.jobStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [dashboardData, activeTab, searchTerm, statusFilter]);

  useEffect(() => {
    const initializeDashboard = async () => {
      // Check if employee ID exists
      if (!employeeId) {
        setError("User information not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [profileResponse, dashboardResponse] = await Promise.all([
          employeeAPI.getProfile(employeeId),
          employeeAPI.getDashboard(employeeId),
        ]);

        setEmployee(profileResponse.data);
        setDashboardData(dashboardResponse.data);
        setError(null); // Clear any previous errors
        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard:", err);

        // More detailed error message
        if (err.response?.status === 500) {
          setError(
            "Server error. The backend may not have data for this employee ID. Please contact support."
          );
        } else if (err.response?.status === 404) {
          setError("Employee profile not found. Please contact support.");
        } else if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError("Failed to load dashboard data. Please try again.");
        }
        setLoading(false);
      }
    };

    initializeDashboard();

    // Auto-refresh only if no error
    const interval = setInterval(() => {
      if (!error) initializeDashboard();
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [employeeId, refreshInterval]);

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      return timeString;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      NEW: { bg: "bg-red-100", text: "text-red-800", label: "New" },
      ONGOING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "In Progress",
      },
      COMPLETED: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Completed",
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };
    return (
      <span
        className={`${config.bg} ${config.text} px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide`}
      >
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (assignment) => {
    // Simple priority calculation based on time and status
    const now = new Date();
    const assignmentDate = new Date(assignment.appointmentDate);
    const isToday = assignmentDate.toDateString() === now.toDateString();
    const isUrgent = isToday && assignment.jobStatus === "NEW";

    if (isUrgent) {
      return (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-xl text-xs font-bold uppercase tracking-wide animate-pulse">
          URGENT
        </span>
      );
    }
    return null;
  };

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      // Here you would call your API to update the status
      console.log(`Updating assignment ${assignmentId} to ${newStatus}`);
      // await employeeAPI.updateAssignmentStatus(assignmentId, newStatus);

      // Optimistic update
      setDashboardData((prev) => ({
        ...prev,
        todayAssignments: prev.todayAssignments.map((assignment) =>
          assignment.assignmentId === assignmentId
            ? { ...assignment, jobStatus: newStatus }
            : assignment
        ),
        upcomingAssignments: prev.upcomingAssignments.map((assignment) =>
          assignment.assignmentId === assignmentId
            ? { ...assignment, jobStatus: newStatus }
            : assignment
        ),
      }));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-lg text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Unable to Load Dashboard
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-[#14274E] text-white rounded-lg font-semibold hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-white rounded-xl shadow-lg mb-6 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#14274E] m-0">
              Service Dashboard
            </h1>
            {employee && (
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="font-medium">Welcome back,</span>
                <span className="font-semibold text-[#14274E]">
                  {employee.username}
                </span>
                <span className="bg-[#F1F6F9] px-3 py-1 rounded-full text-xs font-medium text-[#394867]">
                  {employee.position}
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Statistics Overview */}
      <section className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:-translate-y-1 transition-all hover:shadow-xl">
            <div className="text-4xl p-4 rounded-xl bg-[#14274E] text-white">
              📊
            </div>
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-800 leading-none">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 font-medium mt-2">
                Total Assignments
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:-translate-y-1 transition-all hover:shadow-xl">
            <div className="text-4xl p-4 rounded-xl bg-[#14274E] text-white">
              📅
            </div>
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-800 leading-none">
                {stats.today}
              </div>
              <div className="text-sm text-gray-600 font-medium mt-2">
                Today's Tasks
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:-translate-y-1 transition-all hover:shadow-xl">
            <div className="text-4xl p-4 rounded-xl bg-[#14274E] text-white">
              ⚡
            </div>
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-800 leading-none">
                {stats.inProgress}
              </div>
              <div className="text-sm text-gray-600 font-medium mt-2">
                In Progress
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:-translate-y-1 transition-all hover:shadow-xl">
            <div className="text-4xl p-4 rounded-xl bg-[#14274E] text-white">
              ✅
            </div>
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-800 leading-none">
                {stats.completed}
              </div>
              <div className="text-sm text-gray-600 font-medium mt-2">
                Completed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="pb-8">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex bg-white rounded-xl p-2 shadow-lg">
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "today"
                  ? "bg-[#14274E] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("today")}
            >
              Today's Assignments ({dashboardData.todayAssignments.length})
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "upcoming"
                  ? "bg-[#14274E] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming ({dashboardData.upcomingAssignments.length})
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm w-64 bg-white"
              />
              <span className="absolute left-3 text-gray-600">🔍</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="ONGOING">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>{" "}
        {/* Assignments List */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <p>Loading assignments...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <div className="text-6xl mb-4 opacity-50">📋</div>
              <h3 className="text-xl font-semibold mb-2">
                No assignments found
              </h3>
              <p>
                {searchTerm || statusFilter !== "ALL"
                  ? "Try adjusting your search or filters"
                  : "No assignments scheduled for this period"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.assignmentId}
                  className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:-translate-y-1 transition-all hover:shadow-xl flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {assignment.serviceName}
                      </h3>
                      {getPriorityBadge(assignment)}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(assignment.jobStatus)}
                      <div className="text-xs text-gray-600 font-medium">
                        {formatTime(assignment.startTime)} -{" "}
                        {formatTime(assignment.endTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 mb-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700 text-sm">
                          Customer:
                        </span>
                        <span className="text-gray-800 font-medium">
                          {assignment.customerName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700 text-sm">
                          Vehicle:
                        </span>
                        <span className="text-gray-800 font-medium">
                          {assignment.vehicleInfo}
                        </span>
                      </div>
                      {assignment.appointmentDate && (
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700 text-sm">
                            Date:
                          </span>
                          <span className="text-gray-800 font-medium">
                            {new Date(
                              assignment.appointmentDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {assignment.jobNote && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="font-semibold text-gray-700 text-sm block mb-2">
                          Notes:
                        </span>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {assignment.jobNote}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      className="flex-1 min-w-[100px] px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={() =>
                        handleStatusUpdate(assignment.assignmentId, "ONGOING")
                      }
                      disabled={assignment.jobStatus === "ONGOING"}
                    >
                      Start Work
                    </button>
                    <button
                      className="flex-1 min-w-[100px] px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={() =>
                        handleStatusUpdate(assignment.assignmentId, "COMPLETED")
                      }
                      disabled={assignment.jobStatus === "COMPLETED"}
                    >
                      Mark Complete
                    </button>
                    <button className="flex-1 min-w-[100px] px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Quick Actions Footer */}
      <footer className="py-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md hover:border-[#14274E] hover:text-[#14274E]">
            <span className="text-xl">📋</span>
            Daily Report
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md hover:border-[#14274E] hover:text-[#14274E]"
          >
            <span className="text-xl">🔄</span>
            Refresh Data
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md hover:border-[#14274E] hover:text-[#14274E]">
            <span className="text-xl">📧</span>
            Message Team
          </button>
        </div>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;
