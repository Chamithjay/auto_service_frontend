import api from './api';

export const vehicleService = {
  // Get all vehicles
  getAll: async () => {
    try {
      const response = await api.get('/api/v1/vehicles');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch vehicles'
      };
    }
  },

  // Get vehicle by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/v1/vehicles/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch vehicle'
      };
    }
  },

  // Create vehicle
  create: async (vehicleData) => {
    try {
      const response = await api.post('/api/v1/vehicles', vehicleData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create vehicle'
      };
    }
  },

  // Update vehicle
  update: async (id, vehicleData) => {
    try {
      const response = await api.put(`/api/v1/vehicles/${id}`, vehicleData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update vehicle'
      };
    }
  },

  // Delete vehicle
  delete: async (id) => {
    try {
      await api.delete(`/api/v1/vehicles/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete vehicle'
      };
    }
  }
};
