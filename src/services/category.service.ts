import axiosInstance from './axiosConfig';

export interface Category {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
    image?: string;
    productCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryResponse {
    success: boolean;
    data: Category;
    message?: string;
}

export interface CategoriesResponse {
    success: boolean;
    count: number;
    pagination?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    data: Category[];
}

class CategoryService {
    // Get all categories (Admin uses the admin endpoint to see all)
    async getAllCategories(params?: any): Promise<CategoriesResponse> {
        try {
            const response = await axiosInstance.get<CategoriesResponse>('admin/categories', { params });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get single category by ID
    async getCategoryById(id: string): Promise<CategoryResponse> {
        try {
            const response = await axiosInstance.get<CategoryResponse>(`categories/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Add category (Admin)
    async addCategory(formData: FormData): Promise<CategoryResponse> {
        try {
            const response = await axiosInstance.post<CategoryResponse>(
                'admin/categories',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Update category (Admin)
    async updateCategory(id: string, formData: FormData): Promise<CategoryResponse> {
        try {
            const response = await axiosInstance.put<CategoryResponse>(
                `admin/categories/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Delete category (Admin)
    async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await axiosInstance.delete<{ success: boolean; message: string }>(
                `admin/categories/${id}`
            );
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Toggle category status (Admin)
    async toggleStatus(id: string, isActive: boolean): Promise<CategoryResponse> {
        try {
            const response = await axiosInstance.patch<CategoryResponse>(
                `admin/categories/${id}/status`,
                { isActive }
            );
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}

export const categoryService = new CategoryService();
