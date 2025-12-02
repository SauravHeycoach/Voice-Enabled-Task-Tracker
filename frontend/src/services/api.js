import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Task API
export const taskAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data.data;
  },

  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/tasks/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  }
};

// Voice API
export const voiceAPI = {
  parse: async (transcript) => {
    const response = await api.post('/voice/parse', { transcript });
    return response.data;
  }
};

export default api;

