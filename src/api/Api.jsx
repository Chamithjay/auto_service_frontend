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