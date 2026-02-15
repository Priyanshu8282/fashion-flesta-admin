import axiosInstance from './axiosConfig';

export interface OrderItem {
    product: { _id: string; name: string };
    name: string;
    price: number;
    quantity: number;
    size: string;
}

export interface ShippingAddress {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface Order {
    _id: string;
    orderNumber: string;
    customer: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: ShippingAddress;
    paymentMethod: 'UPI' | 'COD';
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    upiTransactionId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrdersResponse {
    success: boolean;
    count: number;
    pagination?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    data: Order[];
}

class OrderService {
    // Get all orders
    async getAllOrders(params?: any): Promise<OrdersResponse> {
        try {
            const response = await axiosInstance.get<OrdersResponse>('admin/orders', { params });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Update order status
    async updateOrderStatus(id: string, orderStatus: string): Promise<any> {
        try {
            const response = await axiosInstance.patch(`admin/orders/${id}/status`, { orderStatus });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get order by ID
    async getOrderById(id: string): Promise<{ success: boolean; data: Order }> {
        try {
            // Note: Currently backend doesn't have a direct admin/orders/:id, 
            // but we can filter getAllOrders or implement one if needed.
            // For now, let's assume we fetch all and find, or use a general endpoint if it exists.
            const response = await axiosInstance.get<{ success: boolean; data: Order }>(`orders/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}

export const orderService = new OrderService();
export default orderService;
