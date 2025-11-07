import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerDashboardLayout from "../../components/Customer/CustomerDashboardLayout";
import { getAllVehicles, deleteVehicle } from "../../api/endpoints";

const Vehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    vehicle: null,
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllVehicles();
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to load vehicles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.vehicle) return;

    try {
      await deleteVehicle(deleteModal.vehicle.vehicleId);
      setVehicles(
        vehicles.filter((v) => v.vehicleId !== deleteModal.vehicle.vehicleId)
      );
      setDeleteModal({ isOpen: false, vehicle: null });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setError("Failed to delete vehicle. Please try again.");
    }
  };

  const openDeleteModal = (vehicle) => {
    setDeleteModal({ isOpen: true, vehicle });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, vehicle: null });
  };

  const getVehicleTypeIcon = (type) => {
    switch (type) {
      case "CAR":
        return (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            />
          </svg>
        );
      case "VAN":
        return (
          <svg
            className="w-8 h-8"
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
      case "BUS":
        return (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#14274E]"></div>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14274E]">
              My Vehicles
            </h1>
            <p className="text-[#9BA4B4] mt-1">
              Manage your registered vehicles
            </p>
          </div>
          <button
            onClick={() => navigate("/customer/vehicles/add")}
            className="mt-4 sm:mt-0 px-6 py-3 bg-[#14274E] hover:bg-[#394867] text-white rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Add Vehicle
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg
              className="w-20 h-20 text-[#9BA4B4] mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
              />
            </svg>
            <p className="text-[#9BA4B4] text-lg mb-4">
              No vehicles registered yet
            </p>
            <button
              onClick={() => navigate("/customer/vehicles/add")}
              className="px-6 py-3 bg-[#14274E] hover:bg-[#394867] text-white rounded-lg font-semibold transition-all duration-200"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.vehicleId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#9BA4B4]/20"
              >
                <div className="bg-gradient-to-br from-[#14274E] to-[#394867] p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                      {getVehicleTypeIcon(vehicle.vehicleType)}
                    </div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                      {vehicle.vehicleType}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">
                    {vehicle.vehicleName}
                  </h3>
                  <p className="text-[#9BA4B4] text-sm">
                    {vehicle.registrationNo}
                  </p>
                </div>

                <div className="p-6">
                  {vehicle.model && (
                    <div className="mb-4">
                      <p className="text-sm text-[#9BA4B4] mb-1">Model</p>
                      <p className="font-semibold text-[#14274E]">
                        {vehicle.model}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#9BA4B4]">Added</p>
                      <p className="font-semibold text-[#14274E]">
                        {vehicle.createdAt.split(" ")[0]}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#9BA4B4]">Updated</p>
                      <p className="font-semibold text-[#14274E]">
                        {vehicle.updatedAt.split(" ")[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/customer/vehicles/edit/${vehicle.vehicleId}`)
                      }
                      className="flex-1 px-4 py-2 bg-[#394867] hover:bg-[#14274E] text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(vehicle)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold text-[#14274E] mb-4">
                Delete Vehicle
              </h3>
              <p className="text-[#394867] mb-6">
                Are you sure you want to delete{" "}
                <span className="font-bold">
                  {deleteModal.vehicle?.vehicleName}
                </span>{" "}
                ({deleteModal.vehicle?.registrationNo})? This action cannot be
                undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border-2 border-[#9BA4B4] text-[#394867] rounded-lg font-semibold hover:bg-[#F1F6F9] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerDashboardLayout>
  );
};

export default Vehicles;
