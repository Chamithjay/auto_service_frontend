// notificationService.jsx
import API from "../api/Api"; // import your pre-configured axios instance

// Employee / Role-based notifications
export const getAllNotifications = async () => {
  try {
    const response = await API.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const getNotificationsByRole = async (role) => {
  try {
    const response = await API.get(`/notifications/role/${role}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications by role:", error);
    throw error;
  }
};

export const getUnreadNotificationsByRole = async (role) => {
  try {
    const response = await API.get(`/notifications/role/${role}/unread`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    throw error;
  }
};

export const getUnreadNotificationsByUserId = async (userId) => {
  try {
    const response = await API.get(`/notifications/user/${userId}/unread`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notifications by user:", error);
    throw error;
  }
};

export const getUnreadCountByRole = async (role) => {
  try {
    const response = await API.get(`/notifications/role/${role}/unread-count`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await API.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllAsReadByRole = async (role) => {
  try {
    const response = await API.put(`/notifications/role/${role}/read-all`);
    return response.data;
  } catch (error) {
    console.error("Error marking all as read:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await API.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

export const createNotification = async (notificationData) => {
  try {
    const response = await API.post(`/notifications`, notificationData);
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
