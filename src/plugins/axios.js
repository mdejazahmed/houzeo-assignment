import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// Create axios instance
 const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore();
    const token = authStore.getToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add any other request-specific headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const formatErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return error.message || 'An error occurred';
};


// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    try {
    
    } catch (err) {
      // Log the error for debugging
      console.error('API Error:', err);
      
      // If it's an authentication error
      if (error.response?.status === 401) {
        const authStore = useAuthStore();
        authStore.logout();
        window.location.href = '/login';
      }// Response interceptor
      axiosInstance.interceptors.response.use(
        (response) => {
          return response;
        },
        async (error) => {
          // If there's no response from the server
          if (!error.response) {
            console.error('Network Error:', error.message);
            throw new Error('Network error. Please check your internet connection and try again.');
          }
      
          const { status, data } = error.response;
          const errorMessage = data?.message || error.message || 'An error occurred';
          
          // Handle specific status codes
          switch (status) {
            case 401: // Unauthorized
              try {
                const authStore = useAuthStore();
                await authStore.logout();
                // Use router.push instead of window.location for SPA navigation
                window.location.href = '/login';
              } catch (err) {
                console.error('Logout failed:', err);
              }
              break;
              
            case 403: // Forbidden
              console.error('Access Denied:', errorMessage);
              break;
              
            case 404: // Not Found
              console.error('Resource not found:', error.config.url);
              break;
              
            case 429: // Too Many Requests
              console.error('Rate limit exceeded. Please try again later.');
              break;
              
            case 500: // Internal Server Error
              console.error('Server error occurred. Please try again later.');
              break;
              
            default:
              console.error(`Error ${status}:`, errorMessage);
          }
          
          // Return a rejected promise with the error
          return Promise.reject({
            message: errorMessage,
            status,
            data: data || null,
            originalError: error
          });
        }
      );
      
      // Throw the formatted error message
      throw new Error(formatErrorMessage(error));
    }
  }
);


export default axiosInstance
