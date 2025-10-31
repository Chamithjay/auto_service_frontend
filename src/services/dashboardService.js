import api from './api';

export const dashboardService = {
  // Get dashboard data for a specific vehicle
  getDashboardForVehicle: async (vehicleId) => {
    try {
      const response = await api.get(`/api/v1/dashboard/vehicle/${vehicleId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard data'
      };
    }
  },

  // Get all dashboard appointments
  getAllAppointments: async () => {
    try {
      const response = await api.get('/api/v1/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch appointments'
      };
    }
  }
};
