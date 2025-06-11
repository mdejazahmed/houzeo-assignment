import axios from 'axios';
import { useSnackbarStore } from "@/stores/app";

// Create axios instance
 const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token="token"
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
    console.log("Response:", response);
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(new Error("Network error. Please check your internet connection."));
    }
    const { status, data } = error.response;
    const errorMessage = data?.message || error.message || "An error occurred";
    const snackbarStore = useSnackbarStore();
  switch (status) {
    case 404:
      snackbarStore.showSnackbar({ msg: "Url is wrong" ,color:"error"});
      break;
    case 500:
      snackbarStore.showSnackbar({ msg: errorMessage ,color:"error"});
      break;
    case 401:
      snackbarStore.showSnackbar({ msg: errorMessage ,color:"error"});
      break;
    case 403:
      snackbarStore.showSnackbar({ msg: errorMessage ,color:"error"});
      break;
    case 429:
      snackbarStore.showSnackbar({ msg: errorMessage ,color:"error"});
      break;
    default:
      snackbarStore.showSnackbar({ msg: errorMessage ,color:"error"});
      break;
  }
 
    
    throw new Error(formatErrorMessage(error));
  }
);


export default axiosInstance
