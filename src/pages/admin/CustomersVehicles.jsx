import { useState, useEffect } from "react";
import { format } from "date-fns";
import Toast from "../../components/Toast";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../api/Api";

const CustomersVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [errorVehicles, setErrorVehicles] = useState(null);
  const [errorCustomers, setErrorCustomers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    fetchVehicles();
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterAndSortVehicles();
  }, [vehicles, searchTerm, typeFilter, sortConfig]);

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const response = await API.get("/vehicles");
      setVehicles(response.data);
      setErrorVehicles(null);
      setLoadingVehicles(false);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      showToast("Failed to fetch vehicles", "error");
      setErrorVehicles("Failed to fetch vehicles");
      setLoadingVehicles(false);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await API.get("/users/customers");
      setCustomers(response.data);
      setErrorCustomers(null);
      setLoadingCustomers(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      showToast("Failed to fetch customers", "error");
      setErrorCustomers("Failed to fetch customers");
      setLoadingCustomers(false);
    }
  };

  const filterAndSortVehicles = () => {
    let filtered = [...vehicles];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.vehicleName.toLowerCase().includes(searchLower) ||
          vehicle.registrationNo.toLowerCase().includes(searchLower) ||
          vehicle.model.toLowerCase().includes(searchLower)
      );
    }

    if (typeFilter !== "ALL") {
      filtered = filtered.filter(
        (vehicle) => vehicle.vehicleType === typeFilter
      );
    }

    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (["createdAt", "updatedAt"].includes(sortConfig.key)) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredVehicles(filtered);
  };

  const handleSort = (key) => {
    if (key === "customerId") return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatDate = (dateString) =>
    format(new Date(dateString), "MMM dd, yyyy HH:mm");

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  if (loadingVehicles || loadingCustomers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E] mb-6 sm:mb-8 flex-shrink-0">
        Vehicles & Customers
      </h1>

      {/* Vehicles Section */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 flex-1 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#14274E]">
            All Vehicles
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, registration, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 sm:min-w-[300px] border border-gray-300 rounded-lg px-3 sm:px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#394867] transition duration-200 text-sm"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#394867] transition duration-200 text-sm"
            >
              <option value="ALL">All Types</option>
              <option value="CAR">Car</option>
              <option value="VAN">Van</option>
              <option value="BUS">Bus</option>
            </select>
          </div>
        </div>

        {errorVehicles && (
          <p className="text-red-500 mb-4 text-sm flex-shrink-0">
            {errorVehicles}
          </p>
        )}

        <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F1F6F9] sticky top-0 z-10">
              <tr>
                {[
                  { key: "vehicleName", label: "Vehicle Name" },
                  { key: "registrationNo", label: "Registration No" },
                  { key: "vehicleType", label: "Type" },
                  { key: "model", label: "Model" },
                  { key: "createdAt", label: "Added Date" },
                  { key: "customerId", label: "Customer ID" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`px-3 sm:px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider ${
                      key === "customerId"
                        ? "cursor-default"
                        : "cursor-pointer hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 select-none">
                      <span>{label}</span>
                      {key !== "customerId" && (
                        <span className="text-sm">{getSortIcon(key)}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 sm:px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    No vehicles found
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.vehicleId}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-[#14274E]">
                      {vehicle.vehicleName}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {vehicle.registrationNo}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          vehicle.vehicleType === "CAR"
                            ? "bg-blue-100 text-blue-800"
                            : vehicle.vehicleType === "VAN"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {vehicle.vehicleType}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {vehicle.model}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {formatDate(vehicle.createdAt)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-indigo-700 font-semibold">
                      #{vehicle.customerId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customers Section */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex-1 flex flex-col min-h-0">
        <h2 className="text-lg sm:text-xl font-bold text-[#14274E] mb-6 flex-shrink-0">
          All Customers
        </h2>

        {errorCustomers && (
          <p className="text-red-500 mb-4 text-sm flex-shrink-0">
            {errorCustomers}
          </p>
        )}

        <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F1F6F9] sticky top-0 z-10">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                  Mobile
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-3 sm:px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.customerId}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-indigo-700 font-semibold">
                      #{customer.customerId}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {customer.mobile}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: "", type: "" })}
      />
    </div>
  );
};

export default CustomersVehicles;
