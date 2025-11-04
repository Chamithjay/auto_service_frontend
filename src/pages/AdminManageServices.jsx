import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllServices, deleteService } from "../api/Api";

const AdminManageServices = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getAllServices();
      setServices(response.data);
    } catch (err) {
      setError("Failed to fetch services. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
        fetchServices(); // Refresh the list
      } catch (err) {
        setError("Failed to delete service. It may be in use.");
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#14274E]">Manage Services</h1>
        <Link
          to="/admin/add-service"
          className="px-6 py-2.5 bg-[#14274E] hover:bg-[#394867] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg"
        >
          + Add New Service
        </Link>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F1F6F9]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                Cost (LKR)
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#394867] uppercase tracking-wider">
                Duration (Mins)
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-[#394867] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.serviceItemId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#14274E]">
                  {service.serviceItemName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.serviceItemType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.serviceItemCost.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.estimatedDuration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <Link
                    to={`/admin/service/edit/${service.serviceItemId}`}
                    className="text-[#394867] hover:text-[#14274E]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(service.serviceItemId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageServices;
