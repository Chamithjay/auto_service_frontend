import { useState, useEffect } from "react";
// Layout provided by route-level AdminLayout in App.jsx
import API from "../../api/Api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [vehicleDistribution, setVehicleDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activitiesRes, revenueRes, vehiclesRes] =
        await Promise.all([
          API.get("admin/dashboard/stats"),
          API.get("admin/dashboard/recent-activities"),
          API.get("admin/dashboard/monthly-revenue"),
          API.get("admin/dashboard/vehicle-distribution"),
        ]);

      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
      setMonthlyRevenue(revenueRes.data);
      setVehicleDistribution(vehiclesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getActivityBadgeColor = (status) => {
    const colors = {
      NEW: "bg-blue-500",
      ONGOING: "bg-yellow-500",
      COMPLETED: "bg-green-500",
      PENDING: "bg-orange-500",
      CUSTOMER: "bg-purple-500",
      EMPLOYEE: "bg-indigo-500",
      ADMIN: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "APPOINTMENT":
        return (
          <svg
            className="w-6 h-6"
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
        );
      case "LEAVE":
        return (
          <svg
            className="w-6 h-6"
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
        );
      case "REGISTRATION":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        );
      case "VEHICLE":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getMaxRevenue = () => {
    if (monthlyRevenue.length === 0) return 0;
    return Math.max(...monthlyRevenue.map((item) => parseFloat(item.revenue)));
  };

  const getVehicleColor = (type) => {
    const colors = {
      CAR: "#14274E",
      VAN: "#394867",
      BUS: "#9BA4B4",
    };
    return colors[type] || "#14274E";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14274E]"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#14274E] mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                Total Users
              </p>
              <h3 className="text-3xl font-bold text-[#14274E] mt-2">
                {stats?.totalUsers || 0}
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                Appointments
              </p>
              <h3 className="text-3xl font-bold text-[#14274E] mt-2">
                {stats?.totalAppointments || 0}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Employees */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                Employees
              </p>
              <h3 className="text-3xl font-bold text-[#14274E] mt-2">
                {stats?.totalEmployees || 0}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Vehicles */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                Vehicles
              </p>
              <h3 className="text-3xl font-bold text-[#14274E] mt-2">
                {stats?.totalVehicles || 0}
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
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                Revenue
              </p>
              <h3 className="text-2xl font-bold text-[#14274E] mt-2">
                {formatCurrency(stats?.totalRevenue)}
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#14274E] mb-6">
            Monthly Revenue (Current Year)
          </h2>
          <div className="space-y-3">
            {monthlyRevenue.map((item, index) => {
              const maxRevenue = getMaxRevenue();
              const percentage =
                maxRevenue > 0
                  ? (parseFloat(item.revenue) / maxRevenue) * 100
                  : 0;

              return (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-[#394867] w-12">
                    {item.month}
                  </span>
                  <div className="flex-1">
                    <div className="bg-[#F1F6F9] rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#14274E] to-[#394867] h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 15 && (
                          <span className="text-xs font-bold text-white">
                            {formatCurrency(item.revenue)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {percentage <= 15 && (
                    <span className="text-sm font-semibold text-[#394867] w-24 text-right">
                      {formatCurrency(item.revenue)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Vehicle Type Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#14274E] mb-6">
            Vehicle Type Distribution
          </h2>
          <div className="space-y-4">
            {vehicleDistribution.map((item, index) => {
              const total = vehicleDistribution.reduce(
                (sum, v) => sum + v.count,
                0
              );
              const percentage = total > 0 ? (item.count / total) * 100 : 0;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: getVehicleColor(item.vehicleType),
                        }}
                      ></div>
                      <span className="text-sm font-semibold text-[#394867]">
                        {item.vehicleType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-[#9BA4B4]">
                        {percentage.toFixed(1)}%
                      </span>
                      <span className="text-lg font-bold text-[#14274E]">
                        {item.count}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#F1F6F9] rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getVehicleColor(item.vehicleType),
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {vehicleDistribution.length === 0 && (
              <div className="text-center py-8 text-[#9BA4B4]">
                No vehicle data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-[#14274E] mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#F1F6F9] rounded-xl hover:bg-[#E8EDF1] transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`${getActivityBadgeColor(
                      activity.status
                    )} text-white w-10 h-10 rounded-full flex items-center justify-center`}
                  >
                    {getActivityIcon(activity.activityType)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#14274E]">
                      {activity.description}
                    </p>
                    <p className="text-sm text-[#9BA4B4]">
                      {activity.userName} - {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs ${getActivityBadgeColor(
                    activity.status
                  )} text-white px-3 py-1 rounded-full font-semibold`}
                >
                  {activity.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#9BA4B4]">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
