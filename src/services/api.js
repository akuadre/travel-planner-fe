import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    // Better error messages
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.code === 'NETWORK_ERROR') {
      error.message = 'Network error. Please check your connection.';
    } else if (error.code === 'TIMEOUT_ERROR') {
      error.message = 'Request timeout. Please try again.';
    }
    
    return Promise.reject(error);
  }
);

export default api;