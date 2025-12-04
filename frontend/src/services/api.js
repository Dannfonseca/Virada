import axios from 'axios';

const API_URL = import.meta.env.PROD
    ? '/api'
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const itemsAPI = {
    // Get all items
    getAll: async () => {
        const response = await api.get('/items');
        return response.data;
    },

    // Create new item
    create: async (itemData) => {
        const response = await api.post('/items', itemData);
        return response.data;
    },

    // Update item (toggle done)
    update: async (id, done) => {
        const response = await api.patch(`/items/${id}`, { done });
        return response.data;
    },

    // Get single item by ID
    getById: async (id) => {
        const response = await api.get(`/items/${id}`);
        return response.data;
    },

    // Add comment to item
    addComment: async (id, text) => {
        const response = await api.post(`/items/${id}/comments`, { text });
        return response.data;
    },

    // Delete comment from item
    deleteComment: async (itemId, commentId) => {
        const response = await api.delete(`/items/${itemId}/comments/${commentId}`);
        return response.data;
    },

    // Delete item
    delete: async (id) => {
        const response = await api.delete(`/items/${id}`);
        return response.data;
    }
};

export default api;
