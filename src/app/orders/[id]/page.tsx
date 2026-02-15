'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { orderService, Order } from '@/services';
import { toast } from 'react-hot-toast';

export default function OrderViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrderById(id);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <AdminLayout title="Order Details">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!order) {
        return (
            <AdminLayout title="Order Not Found">
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Order Not Found</h3>
                    <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or has been removed.</p>
                    <button onClick={() => router.back()} className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30">Go Back</button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={`Order #${order.orderNumber}`}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button onClick={() => router.back()} className="flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Orders
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 font-mono tracking-tight">Order #{order.orderNumber}</h2>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Status:</span>
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-bold border ${
                        order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        order.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-red-100 text-red-800 border-red-200'
                    }`}>
                        {order.orderStatus}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Items */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Order Items ({order.items.length})</h3>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">Total: ₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items.map((item, index) => (
                                <div key={index} className="p-6 flex items-center gap-6 group hover:bg-gray-50 transition-colors">
                                    <div className="h-20 w-16 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                        <img 
                                            src={'https://placehold.co/100x120/ffe4e6/9f1239?text=Item'} 
                                            alt={item.name} 
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform" 
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-gray-900 truncate">{item.name}</h4>
                                        <div className="mt-1 flex items-center gap-4 text-sm font-medium text-gray-500">
                                            <span>Size: <span className="text-gray-900 font-bold">{item.size}</span></span>
                                            <span>Qty: <span className="text-gray-900 font-bold">{item.quantity}</span></span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-base font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</div>
                                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">₹{item.price.toLocaleString()} each</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Method</div>
                                <div className="text-sm font-bold text-gray-900 flex items-center">
                                    <span className="mr-2">{order.paymentMethod}</span>
                                    {order.paymentMethod === 'UPI' && (
                                        <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</div>
                                <div className={`text-sm font-bold ${
                                    order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                    {order.paymentStatus}
                                </div>
                            </div>
                            {order.upiTransactionId && (
                                <div className="col-span-2 md:col-span-1">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction ID</div>
                                    <div className="text-sm font-bold text-gray-900 break-all bg-gray-50 p-2 rounded-lg border border-gray-100 font-mono">
                                        {order.upiTransactionId}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Address */}
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Customer Profile</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl uppercase">
                                    {order.customer?.name?.[0] || 'C'}
                                </div>
                                <div>
                                    <div className="text-base font-bold text-gray-900">{order.customer?.name}</div>
                                    <div className="text-xs text-gray-500 font-medium">Customer since {new Date(order.createdAt).getFullYear()}</div>
                                </div>
                            </div>
                            <div className="pt-4 space-y-3 border-t border-gray-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</span>
                                    <span className="text-sm font-bold text-gray-700">{order.customer?.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                                    <span className="text-sm font-bold text-gray-700">{order.customer?.phone || order.shippingAddress.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Shipping Details
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </h3>
                        <div className="flex flex-col space-y-3">
                            <div className="text-sm font-bold text-gray-900">{order.shippingAddress.name}</div>
                            <div className="text-sm text-gray-600 leading-relaxed">
                                {order.shippingAddress.street},<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                                {order.shippingAddress.country}
                            </div>
                            <div className="pt-3 flex items-center text-sm font-bold text-gray-700">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {order.shippingAddress.phone}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
