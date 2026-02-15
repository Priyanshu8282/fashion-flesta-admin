// Export all services and types
export { default as axiosInstance } from './axiosConfig';
export { adminService } from './admin.service';
export { productService } from './product.service';
export { categoryService } from './category.service';
export type { LoginCredentials, AdminUser, LoginResponse } from './admin.service';
export type { Product, ProductResponse, ProductsResponse } from './product.service';
export type { Category, CategoriesResponse } from './category.service';
export { orderService } from './order.service';
export * from './customer.service';
export * from './banner.service';
export * from './dashboard.service';
export type { Order, OrdersResponse, OrderItem, ShippingAddress } from './order.service';
