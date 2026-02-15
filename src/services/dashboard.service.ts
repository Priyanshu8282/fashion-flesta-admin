import axiosInstance from './axiosConfig';

export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalCategories: number;
    totalCustomers: number;
    totalRevenue: number;
    statusCounts: { [key: string]: number };
    dailyStats: Array<{
        _id: string; // Date string YYYY-MM-DD
        revenue: number;
        orders: number;
    }>;
    recentOrders: any[];
}

export interface DashboardResponse {
    success: boolean;
    data: DashboardStats;
}

class DashboardService {
    async getStats(startDate?: string, endDate?: string): Promise<DashboardResponse> {
        try {
            const response = await axiosInstance.get<DashboardResponse>('admin/dashboard', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
        }
    }
}

export const dashboardService = new DashboardService();
