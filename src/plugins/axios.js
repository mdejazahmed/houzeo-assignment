import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useSnackbarStore } from "@/stores/app";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.getToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(new Error("Network error. Please check your internet connection."));
    }

    const { status, data } = error.response;
    const errorMessage = data?.message || error.message || "An error occurred";
    const snackbarStore = useSnackbarStore();
    snackbarStore.showSnackbar({ msg: errorMessage ,color:"error"});

    // Handle specific status codes
    switch (status) {
      case 401: // Unauthorized
        try {
          const authStore = useAuthStore();
          await authStore.logout();
          window.location.href = "/login";
        } catch (err) {
          console.error("Logout failed:", err);
        }
        break;
      case 403: // Forbidden
        console.error("Access Denied:", errorMessage);
        break;
      case 404: // Not Found
        console.error("Resource not found:", error.config?.url);
        break;
      case 429: // Too Many Requests
        console.error("Rate limit exceeded. Please try again later.");
        break;
      case 500: // Internal Server Error
        console.error("Server error occurred. Please try again later.");
        break;
      default:
        console.error(`Error ${status}:`, errorMessage);
    }

    return Promise.reject({
      message: errorMessage,
      status,
      data: data || null,
      originalError: error,
    });
  }
);

export default axiosInstance;