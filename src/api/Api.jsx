import axios from "axios";

// Use localhost for local development, relative URL for production (K8s)
const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:8080/api' 
  : '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export default API;