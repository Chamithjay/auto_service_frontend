import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/Api";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import ListFilter from "../../components/ListFilter";
import PaginationControls from "../../components/PaginationControls";
import { TableSkeleton, LoadingSpinner } from "../../components/LoadingStates";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("username"); // 'username', 'email', 'role'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Safe formatters to avoid runtime crashes when backend returns null/undefined
  const safeString = (v) => (v === null || v === undefined ? "-" : String(v));

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle sorting by clicking headers
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Get sort icon for headers
  const getSortIcon = (column) => {
    if (sortBy !== column) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("admin/employees");
      const payload = response.data;
      let list = [];
      if (Array.isArray(payload)) list = payload;
      else if (Array.isArray(payload?.data)) list = payload.data;
      else if (Array.isArray(payload?.items)) list = payload.items;
      else if (Array.isArray(payload?.content)) list = payload.content;
      else list = [];
      setUsers(list);
      setLoading(false);
    } catch (err) {
      console.error("GET /admin/employees failed:", err?.response || err);
      setError("Failed to fetch users. Please try again.");
      setUsers([]);
      setLoading(false);
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user?.role === roleFilter;
      // Exclude CUSTOMER role
      const isNotCustomer = user?.role !== "CUSTOMER";
      return matchesSearch && matchesRole && isNotCustomer;
    })
    .sort((a, b) => {
      let aVal = a?.[sortBy] || "";
      let bVal = b?.[sortBy] || "";
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Count users by role
  const roleCounts = {
    ALL: users.filter((u) => u?.role !== "CUSTOMER").length,
    ADMIN: users.filter((u) => u?.role === "ADMIN").length,
    EMPLOYEE: users.filter((u) => u?.role === "EMPLOYEE").length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id) => {
    // show confirm modal instead
    setConfirmState({ isOpen: true, id });
  };

  const [confirmState, setConfirmState] = useState({ isOpen: false, id: null });

  const confirmDelete = async () => {
    const id = confirmState.id;
    try {
      await API.delete(`admin/employees/${id}`);
      setConfirmState({ isOpen: false, id: null });
      fetchUsers(); // Refresh the list
      // show success toast
      setToast({
        isOpen: true,
        message: "User deleted successfully",
        type: "success",
      });
    } catch (err) {
      console.error(
        "DELETE /admin/employees/{id} failed:",
        err?.response || err
      );
      setError("Failed to delete user. Please try again.");
      setConfirmState({ isOpen: false, id: null });
    }
  };

  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  // Role filter options
  const roleFilters = [
    {
      id: "ALL",
      label: "All Roles",
      active: roleFilter === "ALL",
      count: roleCounts.ALL,
    },
    {
      id: "ADMIN",
      label: "Admin",
      active: roleFilter === "ADMIN",
      count: roleCounts.ADMIN,
    },
    {
      id: "EMPLOYEE",
      label: "Employee",
      active: roleFilter === "EMPLOYEE",
      count: roleCounts.EMPLOYEE,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#14274E] mb-8">
        Employee Management
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#14274E]">All Employees</h2>
          <Link
            to="/admin/add-employee"
            className="px-6 py-2.5 bg-[#394867] hover:bg-[#14274E] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center space-x-2"
          >
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
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <ListFilter
          searchTerm={searchTerm}
          onSearchChange={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          filters={roleFilters}
          onFilterChange={(filterId) => {
            setRoleFilter(filterId);
            setCurrentPage(1);
          }}
          placeholder="Search by username or email..."
        />

        {/* Results count */}
        <p className="text-sm text-gray-600 mb-4">
          Found {filteredUsers.length} employee(s)
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F1F6F9]">
              <tr>
                <th
                  onClick={() => handleSort("username")}
                  className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider cursor-pointer hover:bg-[#E8EDF1] transition-colors"
                >
                  Username {getSortIcon("username")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider cursor-pointer hover:bg-[#E8EDF1] transition-colors"
                >
                  Email {getSortIcon("email")}
                </th>
                <th
                  onClick={() => handleSort("role")}
                  className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider cursor-pointer hover:bg-[#E8EDF1] transition-colors"
                >
                  Role {getSortIcon("role")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <TableSkeleton rows={5} cols={4} />
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      {users.length === 0 ? (
                        <>
                          <p className="font-medium">No employees yet</p>
                          <p className="text-sm mt-1">
                            Click "Add Employee" to get started
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">
                            No employees match your search
                          </p>
                          <p className="text-sm mt-1">
                            Try adjusting your filters
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => (
                  <tr key={user?.id ?? idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#14274E]">
                      {safeString(user?.username)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {safeString(user?.email)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${user?.role === "ADMIN" ? "bg-red-100 text-red-800" : ""}
                    ${
                      user?.role === "EMPLOYEE"
                        ? "bg-blue-100 text-blue-800"
                        : ""
                    }
                    ${
                      user?.role === "CUSTOMER"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  `}
                      >
                        {safeString(user?.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <Link
                        to={`/admin/employee/edit/${user?.id ?? ""}`}
                        className="text-[#394867] hover:text-[#14274E]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(user?.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && paginatedUsers.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title="Delete user"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, id: null })}
      />
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ isOpen: false, message: "", type: "success" })
        }
      />
    </div>
  );
};

export default AdminManageUsers;
