import AdminLayout from "../../components/admin/AdminLayout";

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <div>
                <h1 className="text-3xl font-bold text-[#14274E] mb-8">Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Users */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                                    Total Users
                                </p>
                                <h3 className="text-3xl font-bold text-[#14274E] mt-2">
                                    1,234
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

                    {/* Total Bookings */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                                    Total Bookings
                                </p>
                                <h3 className="text-3xl font-bold text-[#14274E] mt-2">567</h3>
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
                                <h3 className="text-3xl font-bold text-[#14274E] mt-2">42</h3>
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

                    {/* Revenue */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9BA4B4]/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#9BA4B4] text-sm font-semibold uppercase">
                                    Revenue
                                </p>
                                <h3 className="text-3xl font-bold text-[#14274E] mt-2">
                                    $45.2K
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
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-[#14274E] mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-semibold text-[#14274E]">Add User</span>
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
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-semibold text-[#14274E]">
                  View Reports
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
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-semibold text-[#14274E]">Settings</span>
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
                  Manage Schedule
                </span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-[#14274E] mb-4">
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-[#F1F6F9] rounded-xl">
                            <div className="flex items-center space-x-4">
                                <div className="bg-[#14274E] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                    JD
                                </div>
                                <div>
                                    <p className="font-semibold text-[#14274E]">
                                        New booking created
                                    </p>
                                    <p className="text-sm text-[#9BA4B4]">
                                        John Doe - 2 hours ago
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs bg-[#394867] text-white px-3 py-1 rounded-full">
                New
              </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#F1F6F9] rounded-xl">
                            <div className="flex items-center space-x-4">
                                <div className="bg-[#394867] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                    MS
                                </div>
                                <div>
                                    <p className="font-semibold text-[#14274E]">
                                        Service completed
                                    </p>
                                    <p className="text-sm text-[#9BA4B4]">
                                        Mike Smith - 4 hours ago
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full">
                Completed
              </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#F1F6F9] rounded-xl">
                            <div className="flex items-center space-x-4">
                                <div className="bg-[#9BA4B4] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                    EJ
                                </div>
                                <div>
                                    <p className="font-semibold text-[#14274E]">
                                        New employee registered
                                    </p>
                                    <p className="text-sm text-[#9BA4B4]">
                                        Emma Johnson - 1 day ago
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
                Staff
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;