import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee-specific API calls
export const employeeAPI = {
  getDashboard: (employeeId) => 
    api.get(`/employee/${employeeId}/dashboard`),
  
  getProfile: (employeeId) => 
    api.get(`/employee/${employeeId}/profile`),
  
  updateProfile: (employeeId, profileData) => 
    api.put(`/employee/${employeeId}/profile`, profileData),
};

export default api;