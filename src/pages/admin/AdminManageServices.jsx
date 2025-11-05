import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllServices, deleteService } from "../../api/Api";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";

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
    setConfirmState({ isOpen: true, id });
  };

  const [confirmState, setConfirmState] = useState({ isOpen: false, id: null });

  const confirmDelete = async () => {
    const id = confirmState.id;
    try {
      await deleteService(id);
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
