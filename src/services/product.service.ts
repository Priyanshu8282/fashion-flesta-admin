import axiosInstance from './axiosConfig';

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    category: any; // Can be ID or populated object
    sizes: string[];
    images: string[];
    coverImage: string;
    stock: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductResponse {
    success: boolean;
    data: Product;
    message?: string;
}

export interface ProductsResponse {
    success: boolean;
    count: number;
    pagination?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    data: Product[];
}

class ProductService {
    // Get all products with pagination and search
    async getAllProducts(params?: any): Promise<ProductsResponse> {
        try {
            const response = await axiosInstance.get<ProductsResponse>('admin/products', { params });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get single product by ID
    async getProductById(id: string): Promise<ProductResponse> {
        try {
            const response = await axiosInstance.get<ProductResponse>(`products/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get single product by slug
    async getProductBySlug(slug: string): Promise<ProductResponse> {
        try {
            const response = await axiosInstance.get<ProductResponse>(`products/slug/${slug}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Add product (Admin) - Uses FormData for image uploads
    async addProduct(formData: FormData): Promise<ProductResponse> {
        try {
            const response = await axiosInstance.post<ProductResponse>(
                'admin/products',
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

    // Update product (Admin) - Uses FormData
    async updateProduct(id: string, formData: FormData): Promise<ProductResponse> {
        try {
            const response = await axiosInstance.put<ProductResponse>(
                `admin/products/${id}`,
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

    // Delete product (Admin)
    async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await axiosInstance.delete<{ success: boolean; message: string }>(
                `admin/products/${id}`
            );
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Toggle product status (Admin)
    async toggleStatus(id: string, isActive: boolean): Promise<ProductResponse> {
        try {
            const response = await axiosInstance.patch<ProductResponse>(
                `admin/products/${id}/status`,
                { isActive }
            );
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}

export const productService = new ProductService();
