import axiosInstance from './axiosConfig';

// Type definitions
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: AdminUser;
        token: string;
    };
}

// Admin Authentication Service
class AdminService {
    // Admin login - calls baseURL/admin/login
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await axiosInstance.post<LoginResponse>(
                'auth/admin/login',
                credentials
            );

            // Store token and user data in localStorage
            if (response.data.success && response.data.data.token) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('adminToken', response.data.data.token);
                    localStorage.setItem('adminUser', JSON.stringify(response.data.data.user));
                }
            }

            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Logout - clear localStorage
    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/login';
        }
    }

    // Get current admin user from localStorage
    getCurrentUser(): AdminUser | null {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('adminUser');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    }

    // Check if admin is authenticated
    isAuthenticated(): boolean {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('adminToken');
        }
        return false;
    }

    // Get token from localStorage
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('adminToken');
        }
        return null;
    }
}

export const adminService = new AdminService();
