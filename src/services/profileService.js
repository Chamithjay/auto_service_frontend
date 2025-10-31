import api from './api';

export const profileService = {
  // Get profile
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/api/v1/profile/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  // Update profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/api/v1/profile/${userId}`, profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  }
};
