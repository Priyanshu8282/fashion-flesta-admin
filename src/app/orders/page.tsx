'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { orderService, Order } from '@/services';
import { toast } from 'react-hot-toast';
import OrderStatusModal from '@/components/OrderStatusModal';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders();
        }, 500);
        return () => clearTimeout(timer);
    }, [statusFilter, search, page]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params: any = {
                page,
                limit: 10
            };
            if (statusFilter) params.status = statusFilter;
            if (search) params.search = search;
            
            const response = await orderService.getAllOrders(params);
            if (response.success) {
                setOrders(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!selectedOrder) return;
        try {
            setIsUpdating(true);
            const response = await orderService.updateOrderStatus(selectedOrder._id, newStatus);
            if (response.success) {
                setOrders(prev => prev.map(order => 
                    order._id === selectedOrder._id ? { ...order, orderStatus: newStatus as any } : order
                ));
                toast.success('Order status updated');
                setIsModalOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <AdminLayout title="Orders">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 space-y-4 xl:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders Management</h1>
                    <p className="text-gray-600">Monitor and manage customer orders ({pagination.totalItems})</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search by Order#, Name or Email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                        <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <select
                        className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none bg-white transition-all cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="" className="text-gray-900">All Statuses</option>
                        <option value="Pending" className="text-gray-900">Pending</option>
                        <option value="Processing" className="text-gray-900">Processing</option>
                        <option value="Shipped" className="text-gray-900">Shipped</option>
                        <option value="Delivered" className="text-gray-900">Delivered</option>
                        <option value="Cancelled" className="text-gray-900">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Order Number</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Customer info</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Total Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Payment</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-40 bg-gray-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 w-24 bg-gray-100 rounded-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-12 bg-gray-100 rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 font-medium text-lg">No orders found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="text-sm font-bold text-gray-900 font-mono tracking-tight group-hover:text-primary-600 transition-colors">
                                                #{order.orderNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mr-3 border border-gray-200">
                                                    {order.customer?.name?.[0] || 'C'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{order.customer?.name || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">{order.customer?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                                            ₹{order.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-700">{order.paymentMethod}</span>
                                                <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${
                                                    order.paymentStatus === 'Paid' ? 'text-green-600' : 
                                                    order.paymentStatus === 'Failed' ? 'text-red-600' : 'text-yellow-600'
                                                }`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button 
                                                    onClick={() => handleOpenModal(order)}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all border border-gray-100"
                                                    title="Update Status"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </button>
                                                <Link
                                                    href={`/orders/${order._id}`}
                                                    className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-all border border-primary-100"
                                                    title="View Details"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
               
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">
                            Showing <span className="text-gray-900">{(page - 1) * pagination.limit + 1}</span> to <span className="text-gray-900">{Math.min(page * pagination.limit, pagination.totalItems)}</span> of <span className="text-gray-900">{pagination.totalItems}</span> orders
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                                .map((p, i, arr) => (
                                    <div key={p} className="flex items-center">
                                        {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2 text-gray-400">...</span>}
                                        <button
                                            onClick={() => setPage(p)}
                                            className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${
                                                page === p 
                                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    </div>
                                ))
                            }

                            <button
                                onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                disabled={page === pagination.totalPages}
                                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
        
            </div>

            {/* Status Update Modal */}
            <OrderStatusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleStatusUpdate}
                currentStatus={selectedOrder?.orderStatus || ''}
                orderNumber={selectedOrder?.orderNumber || ''}
                loading={isUpdating}
            />
        </AdminLayout>
    );
}
