import API from "./Api";

// Customer Dashboard APIs
export const getDashboardStats = () => API.get("/customer/dashboard/stats");
export const getAllAppointments = () =>
  API.get("/customer/dashboard/appointments");
export const getActiveAppointments = () =>
  API.get("/customer/dashboard/appointments/active");
export const getAppointmentProgress = (appointmentId) =>
  API.get(`/customer/dashboard/appointments/${appointmentId}/progress`);

// Customer Profile APIs
export const getCustomerProfile = () => API.get("/customer/profile");
export const updateCustomerProfile = (data) =>
  API.put("/customer/profile", data);

// Vehicle APIs
export const getAllVehicles = () => API.get("/customer/vehicles");
export const getVehicleById = (vehicleId) =>
  API.get(`/customer/vehicles/${vehicleId}`);
export const addVehicle = (data) => API.post("/customer/vehicles", data);
export const updateVehicle = (vehicleId, data) =>
  API.put(`/customer/vehicles/${vehicleId}`, data);
export const deleteVehicle = (vehicleId) =>
  API.delete(`/customer/vehicles/${vehicleId}`);
