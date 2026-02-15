import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token to requests
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage (only on client side)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('adminToken');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            // Don't redirect if we are already on the login attempt itself
            // to allow the login page to handle the error (e.g., show a toast)
            const isLoginRequest = error.config?.url?.includes('auth/admin/login');

            if (!isLoginRequest && typeof window !== 'undefined') {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
