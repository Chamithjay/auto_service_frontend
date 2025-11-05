import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Appointment API methods
export const appointmentAPI = {
  // Get user vehicles
  getUserVehicles: (userId) => API.get(`/appointments/vehicles?userId=${userId}`),

  // Get services and modifications for a vehicle
  getServicesAndModifications: (vehicleId) =>
    API.post('/appointments/services', { vehicleId }),

  // Calculate appointment cost and duration
  calculateAppointment: (calculationRequest) =>
    API.post('/appointments/calculate', calculationRequest),

  // Create appointment
  // createAppointment now requires userId as a query param (temporary backend change)
  createAppointment: (createRequest, userId) =>
    API.post(`/appointments/create?userId=${userId}`, createRequest),

  // Get customer appointments (by userId query param)
  getCustomerAppointments: (userId) =>
    API.get(`/appointments/my-appointments?userId=${userId}`),

  // Get user appointments (optional, alternate endpoint)
  getUserAppointments: (userId) =>
    API.get(`/appointments/user/${userId}`),
};

export default API;
