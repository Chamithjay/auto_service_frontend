import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in and has employee role
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "EMPLOYEE") {
      // Redirect to appropriate dashboard based on role
      if (parsedUser.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F1F6F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#14274E]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F6F9]">
      {/* Header */}
      <header className="bg-[#14274E] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Employee Dashboard
              </h1>
              <p className="text-[#9BA4B4] text-sm mt-1">
                Welcome back, {user.username}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-[#394867] hover:bg-[#9BA4B4] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                  Today's Tasks
                </p>
                <h3 className="text-3xl font-bold text-[#14274E] mt-2">8</h3>
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                  Completed
                </p>
                <h3 className="text-3xl font-bold text-[#14274E] mt-2">5</h3>
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

          {/* Pending */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                  Pending
                </p>
                <h3 className="text-3xl font-bold text-[#14274E] mt-2">3</h3>
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

          {/* Hours Worked */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                  Hours Today
                </p>
                <h3 className="text-3xl font-bold text-[#14274E] mt-2">6.5</h3>
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Current Tasks */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#14274E] mb-4">
            Current Tasks
          </h2>
          <div className="space-y-4">
            {/* Task 1 */}
            <div className="border-2 border-[#9BA4B4]/30 rounded-xl p-4 hover:border-[#394867] transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-[#14274E] mb-1">
                    Oil Change - Vehicle #1234
                  </h3>
                  <p className="text-sm text-[#9BA4B4]">
                    Customer: John Doe | Appointment: 10:00 AM
                  </p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                  In Progress
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-[#F1F6F9] rounded-full h-2">
                  <div
                    className="bg-[#394867] h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-[#394867]">
                  60%
                </span>
              </div>
            </div>

            {/* Task 2 */}
            <div className="border-2 border-[#9BA4B4]/30 rounded-xl p-4 hover:border-[#394867] transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-[#14274E] mb-1">
                    Brake Inspection - Vehicle #5678
                  </h3>
                  <p className="text-sm text-[#9BA4B4]">
                    Customer: Jane Smith | Appointment: 2:00 PM
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Scheduled
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-[#F1F6F9] rounded-full h-2">
                  <div
                    className="bg-[#14274E] h-2 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-[#9BA4B4]">0%</span>
              </div>
            </div>

            {/* Task 3 */}
            <div className="border-2 border-[#9BA4B4]/30 rounded-xl p-4 hover:border-[#394867] transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-[#14274E] mb-1">
                    Tire Rotation - Vehicle #9101
                  </h3>
                  <p className="text-sm text-[#9BA4B4]">
                    Customer: Mike Johnson | Appointment: 4:00 PM
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Scheduled
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-[#F1F6F9] rounded-full h-2">
                  <div
                    className="bg-[#14274E] h-2 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-[#9BA4B4]">0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#14274E] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-[#9BA4B4]/30 rounded-xl hover:border-[#394867] hover:bg-[#F1F6F9] transition-all duration-200 text-left group">
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
                  Start New Task
                </span>
              </div>
            </button>

            <button className="p-4 border-2 border-[#9BA4B4]/30 rounded-xl hover:border-[#394867] hover:bg-[#F1F6F9] transition-all duration-200 text-left group">
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
                  View Schedule
                </span>
              </div>
            </button>

            <button className="p-4 border-2 border-[#9BA4B4]/30 rounded-xl hover:border-[#394867] hover:bg-[#F1F6F9] transition-all duration-200 text-left group">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-[#14274E]">
                  Submit Report
                </span>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
