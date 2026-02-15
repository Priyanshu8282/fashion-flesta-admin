import axiosInstance from './axiosConfig';

export interface Banner {
    _id: string;
    title: string;
    description?: string;
    image: string;
    link?: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BannersResponse {
    success: boolean;
    count: number;
    pagination?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    data: Banner[];
}

class BannerService {
    async getAllBanners(params?: any): Promise<BannersResponse> {
        try {
            const response = await axiosInstance.get<BannersResponse>('admin/banners', { params });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to fetch banners' };
        }
    }

    async addBanner(formData: FormData): Promise<{ success: boolean; data: Banner }> {
        try {
            const response = await axiosInstance.post('admin/banners', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to add banner' };
        }
    }

    async updateBanner(id: string, formData: FormData): Promise<{ success: boolean; data: Banner }> {
        try {
            const response = await axiosInstance.put(`admin/banners/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to update banner' };
        }
    }

    async deleteBanner(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await axiosInstance.delete(`admin/banners/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to delete banner' };
        }
    }

    async toggleBannerStatus(id: string, isActive: boolean): Promise<{ success: boolean; data: Banner }> {
        try {
            const response = await axiosInstance.patch(`admin/banners/${id}/status`, { isActive });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to toggle banner status' };
        }
    }
}

export const bannerService = new BannerService();
