import axiosInstance from './axiosConfig';

export interface Customer {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    createdAt: string;
}

export interface CustomersResponse {
    success: boolean;
    count: number;
    pagination?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    data: Customer[];
}

class CustomerService {
    async getAllCustomers(params?: any): Promise<CustomersResponse> {
        try {
            const response = await axiosInstance.get<CustomersResponse>('admin/customers', { params });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to fetch customers' };
        }
    }

    async getCustomerById(id: string): Promise<{ success: boolean; data: Customer & { orderCount: number } }> {
        try {
            const response = await axiosInstance.get(`admin/customers/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to fetch customer details' };
        }
    }
}

export const customerService = new CustomerService();
