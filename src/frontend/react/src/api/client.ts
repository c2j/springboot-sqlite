import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to inject JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An error occurred',
      status: error.response?.status || 500,
    };

    if (error.response) {
      apiError.status = error.response.status;
      
      switch (error.response.status) {
        case 401:
          apiError.message = 'Unauthorized. Please login again.';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          apiError.message = 'Forbidden. You do not have permission to access this resource.';
          break;
        case 404:
          apiError.message = 'Resource not found.';
          break;
        case 422:
          apiError.message = 'Validation error. Please check your input.';
          break;
        default:
          apiError.message = (error.response.data as { message?: string })?.message || 'Server error';
      }
    } else if (error.request) {
      apiError.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
