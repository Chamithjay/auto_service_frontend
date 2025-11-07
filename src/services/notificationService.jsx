import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/notifications';

// Get token from localStorage (adjust based on your auth implementation)
const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // or however you store the JWT
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Get all notifications
export const getAllNotifications = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

// Get notifications by role
export const getNotificationsByRole = async (role) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/role/${role}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications by role:', error);
        throw error;
    }
};

// Get unread notifications by role
export const getUnreadNotificationsByRole = async (role) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/role/${role}/unread`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
        throw error;
    }
};

// Get unread notifications by user ID
export const getUnreadNotificationsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}/unread`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching unread notifications by user:', error);
        throw error;
    }
};

// Get unread count by role
export const getUnreadCountByRole = async (role) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/role/${role}/unread-count`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${notificationId}/read`, {}, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

// Mark all as read for a role
export const markAllAsReadByRole = async (role) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/role/${role}/read-all`, {}, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error marking all as read:', error);
        throw error;
    }
};

// Delete notification (Admin only)
export const deleteNotification = async (notificationId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${notificationId}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
};

// Create notification (Admin only)
export const createNotification = async (notificationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}`, notificationData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};