import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // Increase timeout
});

// Add request logger
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
    data: config.data,
    headers: config.headers
  });
  
  return config;
});

// Add response logger
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('🛑 Unauthorized, clearing auth data');
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.code === 'NETWORK_ERROR') {
      error.message = 'Network error. Please check your connection and make sure the backend server is running.';
    } else if (error.code === 'TIMEOUT_ERROR') {
      error.message = 'Request timeout. The server is taking too long to respond.';
    } else if (error.response?.status === 500) {
      error.message = 'Server error. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

export default api;