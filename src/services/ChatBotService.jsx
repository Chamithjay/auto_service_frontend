import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/chatbot';

// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Send message to chatbot
export const sendChatMessage = async (message, userId = null) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/chat`,
            {
                message: message,
                userId: userId
            },
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};

// Check chatbot health
export const checkChatbotHealth = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/health`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error checking chatbot health:', error);
        throw error;
    }
};