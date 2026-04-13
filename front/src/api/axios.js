import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Standard Spring Boot port
});

// This "interceptor" adds the JWT token to headers if it exists in local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;