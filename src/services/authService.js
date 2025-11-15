import api from './api';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Login service error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register user  
  register: async (name, email, password) => {
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: password
      });
      return response.data;
    } catch (error) {
      console.error('Register service error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Get current user
  getUser: async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Get user service error:', error);
      throw new Error('Failed to get user data');
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      console.error('Logout service error:', error);
      throw new Error('Logout failed');
    }
  }
};