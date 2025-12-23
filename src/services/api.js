import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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

  return config;
});

// Add response logger
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (error.code === 'NETWORK_ERROR') {
      // error.message = 'Network error. Please check your connection and make sure the backend server is running.';
      error.message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    } else if (error.code === 'TIMEOUT_ERROR') {
      // error.message = 'Request timeout. The server is taking too long to respond.';
      error.message = 'Server sedang sibuk. Silakan coba lagi.';
    } else if (error.response?.status === 500) {
      // error.message = 'Server error. Please try again later.';
      error.message = 'Terjadi kesalahan pada server. Silakan coba lagi.';
    } else if (error.message.includes('timeout')) {
      error.message = 'Waktu tunggu habis. Silakan coba lagi.';
    }
    
    return Promise.reject(error);
  }
);

export default api;