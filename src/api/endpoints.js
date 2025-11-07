import API from "./Api";

// Customer Dashboard APIs
export const getDashboardStats = () => API.get("/v1/customer/dashboard/stats");
export const getAllAppointments = () => API.get("/v1/customer/dashboard/appointments");
export const getActiveAppointments = () => API.get("/v1/customer/dashboard/appointments/active");
export const getAppointmentProgress = (appointmentId) => API.get(`/v1/customer/dashboard/appointments/${appointmentId}/progress`);

// Customer Profile APIs
export const getCustomerProfile = () => API.get("/v1/customer/profile");
export const updateCustomerProfile = (data) => API.put("/v1/customer/profile", data);

// Vehicle APIs
export const getAllVehicles = () => API.get("/v1/customer/vehicles");
export const getVehicleById = (vehicleId) => API.get(`/v1/customer/vehicles/${vehicleId}`);
export const addVehicle = (data) => API.post("/v1/customer/vehicles", data);
export const updateVehicle = (vehicleId, data) => API.put(`/v1/customer/vehicles/${vehicleId}`, data);
export const deleteVehicle = (vehicleId) => API.delete(`/v1/customer/vehicles/${vehicleId}`);
