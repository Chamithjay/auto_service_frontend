import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/Api";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import ListFilter from "../../components/ListFilter";
import PaginationControls from "../../components/PaginationControls";
import { TableSkeleton } from "../../components/LoadingStates";

const AdminManageServices = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("name"); // 'name', 'cost', 'duration'
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [groupByType, setGroupByType] = useState(false); // Toggle category grouping
  const itemsPerPage = 10;

  // Safe formatters to avoid runtime crashes when backend returns null/undefined
  const formatCost = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(2) : "-";
  };

  const formatDuration = (value) =>
    value === null || value === undefined ? "-" : String(value);

  useEffect(() => {
    fetchServices();
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

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await API.get("admin/services");
      // Normalize common response shapes: array, { data: [] }, { items: [] }, pageable content
      const payload = response?.data;
      let list = [];
      if (Array.isArray(payload)) list = payload;
      else if (Array.isArray(payload?.data)) list = payload.data;
      else if (Array.isArray(payload?.items)) list = payload.items;
      else if (Array.isArray(payload?.content))
        list = payload.content; // Spring pageable
      else if (typeof payload === "string") {
        // Backend sometimes returns JSON as string; try to parse
        try {
          const parsed = JSON.parse(payload);
          if (Array.isArray(parsed)) list = parsed;
        } catch (e) {
          // ignore parse errors and leave list empty
          console.warn("Could not parse services payload string", e);
        }
      }

      setServices(list);
      setError("");
      setLoading(false);
    } catch (err) {
      console.error("Error fetching services:", err?.response || err);
      setError("Failed to fetch services. Please try again.");
      setServices([]);
      setLoading(false);
    }
  };

  // Get unique service types for filtering
  const serviceTypes = [
    "ALL",
    ...new Set(services.map((s) => s?.serviceItemType).filter(Boolean)),
  ];

  // Filter and sort services
  const filteredServices = services
    .filter((service) => {
      const matchesSearch =
        !searchTerm ||
        service?.serviceItemName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        service?.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        serviceTypeFilter === "ALL" ||
        service?.serviceItemType === serviceTypeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "name") {
        aVal = a?.serviceItemName || "";
        bVal = b?.serviceItemName || "";
      } else if (sortBy === "cost") {
        aVal = parseFloat(a?.serviceItemCost) || 0;
        bVal = parseFloat(b?.serviceItemCost) || 0;
      } else if (sortBy === "duration") {
        aVal = parseInt(a?.estimatedDuration) || 0;
        bVal = parseInt(b?.estimatedDuration) || 0;
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Group by type if enabled
  let displayServices = filteredServices;
  let groupedServices = {};
  if (groupByType) {
    groupedServices = filteredServices.reduce((acc, service) => {
      const type = service?.serviceItemType || "Uncategorized";
      if (!acc[type]) acc[type] = [];
      acc[type].push(service);
      return acc;
    }, {});
    displayServices = [];
  }

  // Pagination (only for ungrouped view)
  const totalPages = groupByType
    ? 1
    : Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = groupByType
    ? displayServices
    : filteredServices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  // Calculate average cost
  const avgCost =
    filteredServices.length > 0
      ? filteredServices.reduce(
          (sum, s) => sum + (parseFloat(s?.serviceItemCost) || 0),
          0
        ) / filteredServices.length
      : 0;

  const handleDelete = async (id) => {
    setConfirmState({ isOpen: true, id });
  };

  const [confirmState, setConfirmState] = useState({ isOpen: false, id: null });

  const confirmDelete = async () => {
    const id = confirmState.id;
    try {
      await API.delete(`admin/services/${id}`);
      setConfirmState({ isOpen: false, id: null });
      fetchServices(); // Refresh the list
      setToast({
        isOpen: true,
        message: "Service deleted successfully",
        type: "success",
      });
    } catch (err) {
      setError("Failed to delete service. It may be in use.");
      setConfirmState({ isOpen: false, id: null });
    }
  };

  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  // Service type filters
  const typeFilters = serviceTypes.map((type) => ({
    id: type,
    label: type,
    active: serviceTypeFilter === type,
    count: services.filter((s) => s?.serviceItemType === type).length,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#14274E] mb-8">
        Service Management
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#14274E]">All Services</h2>
          <Link
            to="/admin/add-service"
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
            <span>Add Services</span>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <ListFilter
          searchTerm={searchTerm}
          onSearchChange={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          filters={typeFilters}
          onFilterChange={(filterId) => {
            setServiceTypeFilter(filterId);
            setCurrentPage(1);
          }}
          placeholder="Search by service name or vehicle type..."
        />

        {/* Quick Stats and Grouping Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Total Services:</span>{" "}
              <span className="text-[#394867] font-bold">
                {filteredServices.length}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setGroupByType(!groupByType);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              groupByType
                ? "bg-[#394867] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {groupByType ? "Ungroup by Type" : "Group by Type"}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F1F6F9]">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider cursor-pointer hover:bg-[#E8EDF1] transition-colors"
                >
                  Name {getSortIcon("name")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Vehicle Type
                </th>
                <th
                  onClick={() => handleSort("cost")}
                  className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider cursor-pointer hover:bg-[#E8EDF1] transition-colors"
                >
                  Cost (LKR) {getSortIcon("cost")}
                </th>
                <th
                  onClick={() => handleSort("duration")}
                  className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider cursor-pointer hover:bg-[#E8EDF1] transition-colors"
                >
                  Duration (Mins) {getSortIcon("duration")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : groupByType ? (
                // Grouped view
                Object.entries(groupedServices).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        <p className="font-medium">
                          No services match your search
                        </p>
                        <p className="text-sm mt-1">
                          Try adjusting your filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  Object.entries(groupedServices).map(
                    ([type, typeServices]) => [
                      <tr key={`header-${type}`} className="bg-[#F1F6F9]">
                        <td colSpan={7} className="px-6 py-3">
                          <span className="font-bold text-[#394867]">
                            {type}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            ({typeServices.length})
                          </span>
                        </td>
                      </tr>,
                      ...typeServices.map((service, idx) => (
                        <tr key={service?.serviceItemId ?? `${type}-${idx}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#14274E]">
                            {service?.serviceItemName ?? "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              service?.serviceItemType === "SERVICE"
                                ? "bg-purple-100 text-purple-800"
                                : ""
                            }
                            ${
                              service?.serviceItemType === "MAINTENANCE"
                                ? "bg-orange-100 text-orange-800"
                                : ""
                            }
                          `}
                            >
                              {service?.serviceItemType ?? "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {service?.vehicleType ?? "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCost(service?.serviceItemCost)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDuration(service?.estimatedDuration)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {service?.requiredEmployeeCount ?? 1}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                            <Link
                              to={`/admin/service/edit/${
                                service?.serviceItemId ?? ""
                              }`}
                              className="text-[#394867] hover:text-[#14274E]"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(service?.serviceItemId)
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )),
                    ]
                  )
                )
              ) : paginatedServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      {services.length === 0 ? (
                        <>
                          <p className="font-medium">No services yet</p>
                          <p className="text-sm mt-1">
                            Click "Add Services" to get started
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">
                            No services match your search
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
                // Normal paginated view
                paginatedServices.map((service, idx) => (
                  <tr key={service?.serviceItemId ?? idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#14274E]">
                      {service?.serviceItemName ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          service?.serviceItemType === "SERVICE"
                            ? "bg-purple-100 text-purple-800"
                            : ""
                        }
                        ${
                          service?.serviceItemType === "MAINTENANCE"
                            ? "bg-orange-100 text-orange-800"
                            : ""
                        }
                      `}
                      >
                        {service?.serviceItemType ?? "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service?.vehicleType ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCost(service?.serviceItemCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(service?.estimatedDuration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {service?.requiredEmployeeCount ?? 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <Link
                        to={`/admin/service/edit/${
                          service?.serviceItemId ?? ""
                        }`}
                        className="text-[#394867] hover:text-[#14274E]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(service?.serviceItemId)}
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

        {/* Pagination Controls (hidden when grouped or loading) */}
        {!loading && !groupByType && paginatedServices.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredServices.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title="Delete service"
        message="Are you sure you want to delete this service? This action cannot be undone."
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

export default AdminManageServices;
