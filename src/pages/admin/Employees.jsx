import AdminLayout from "../../components/admin/AdminLayout";

const Employees = () => {
  return (
    <AdminLayout>
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E] mb-6 sm:mb-8">
          Employee Management
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#14274E]">
              All Employees
            </h2>
            <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-[#394867] hover:bg-[#14274E] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base">
              <svg
                className="w-5 h-5"
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
              <span>Add Employee</span>
            </button>
          </div>

          <p className="text-[#9BA4B4] text-center py-8 text-sm sm:text-base">
            Employee management functionality will be implemented here.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Employees;
