import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9091/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach latest JWT token from localStorage
API.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore localStorage errors
  }
  return config;
});

// Appointment API methods
export const appointmentAPI = {
  // Get user vehicles (JWT in Authorization header)
  getUserVehicles: () => API.get('/appointments/vehicles'),

  // Get services and modifications for a vehicle
  getServicesAndModifications: (vehicleId) =>
    API.post('/appointments/services', { vehicleId }),

  // Calculate appointment cost and duration
  calculateAppointment: (calculationRequest) =>
    API.post('/appointments/calculate', calculationRequest),

  // Create appointment (userId resolved server-side from JWT)
  createAppointment: (createRequest) => API.post('/appointments/create', createRequest),

  // Get customer appointments (JWT used to identify user). Supports optional startDate and endDate.
  getCustomerAppointments: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const q = params.toString();
    return API.get(`/appointments/history${q ? `?${q}` : ''}`);
  },

  // Get user appointments (optional, alternate endpoint)
  getUserAppointments: (userId) => API.get(`/appointments/user/${userId}`),
};
// Add request interceptor to include JWT token
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

export default API;
