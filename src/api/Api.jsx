import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// This interceptor adds the auth token to every request
// (from your teammate's EmployeeDashboard)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Service CRUD Functions ---

export const createServiceItem = (serviceData) => {
  return API.post("/admin/services", serviceData);
};

export const getAllServices = () => {
  return API.get("/admin/services");
};

export const getServiceById = (id) => {
  return API.get(`/admin/services/${id}`);
};

export const updateService = (id, serviceData) => {
  return API.put(`/admin/services/${id}`, serviceData);
};

export const deleteService = (id) => {
  return API.delete(`/admin/services/${id}`);
};

// --- User (Employee/Admin) CRUD Functions ---

export const createUser = (userData) => {
  return API.post("/admin/users", userData);
};

export const getAllUsers = () => {
  return API.get("/admin/users");
};

export const getUserById = (id) => {
  return API.get(`/admin/users/${id}`);
};

// Note: This needs a separate DTO on the backend (UserUpdateRequest)
// that does not require a password.
export const updateUser = (id, userData) => {
  return API.put(`/admin/users/${id}`, userData);
};

export const deleteUser = (id) => {
  return API.delete(`/admin/users/${id}`);
};

export default API;
