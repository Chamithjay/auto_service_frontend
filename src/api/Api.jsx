import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const employeeAPI = {
  getDashboard: (employeeId) => API.get(`/employee/${employeeId}/dashboard`),

  getProfile: (employeeId) => API.get(`/employee/${employeeId}/profile`),

  updateProfile: (employeeId, profileData) =>
    API.put(`/employee/${employeeId}/profile`, profileData),

  updateAssignmentStatus: (assignmentId, status) =>
    API.put(`/assignments/${assignmentId}/status`, { status }),
};

export const appointmentAPI = {
  getUserVehicles: () => API.get("/appointments/vehicles"),

  getServicesAndModifications: (vehicleId) =>
    API.post("/appointments/services", { vehicleId }),

  calculateAppointment: (calculationRequest) =>
    API.post("/appointments/calculate", calculationRequest),

  createAppointment: (createRequest) =>
    API.post("/appointments/create", createRequest),

  getCustomerAppointments: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const q = params.toString();
    return API.get(`/appointments/history${q ? `?${q}` : ""}`);
  },

  getUserAppointments: (userId) => API.get(`/appointments/user/${userId}`),
};

export const serviceAPI = {
  // Public endpoint for fetching all services (no authentication required)
  getAllServices: () => API.get("/services"),

  getServiceById: (id) => API.get(`/services/${id}`),

  // Admin endpoints (require authentication)
  getAllServicesAdmin: () => API.get("/admin/services"),

  getServiceByIdAdmin: (id) => API.get(`/admin/services/${id}`),
};

export default API;
