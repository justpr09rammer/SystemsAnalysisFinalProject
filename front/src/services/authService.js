import api from '../api/axios';

export const authService = {
  // Corresponds to @PostMapping("/signup")
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Corresponds to @PostMapping("/login")
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // credentials = { email, password }
    
    if (response.data.token) {
      // Save the token so our axios interceptor can use it
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Simple redirect
  }
};