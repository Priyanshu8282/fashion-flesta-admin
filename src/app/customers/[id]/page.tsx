'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { customerService, Customer } from '@/services';
import { toast } from 'react-hot-toast';

export default function CustomerViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [data, setData] = useState<{ customer: Customer; orderCount: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomerDetails();
    }, [id]);

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);
            const response = await customerService.getCustomerById(id);
            if (response.success) {
                // The service returns the customer object with orderCount merged or separate?
                // Based on backend: return { ...customer.toJSON(), orderCount };
                // So it's merged.
                setData({ 
                    customer: response.data as any, 
                    orderCount: (response.data as any).orderCount 
                });
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch customer details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Customer Details">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!data) {
        return (
            <AdminLayout title="Customer Not Found">
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Not Found</h3>
                    <p className="text-gray-500 mb-6">The customer you're looking for doesn't exist or has been removed.</p>
                    <button onClick={() => router.back()} className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30">Go Back</button>
                </div>
            </AdminLayout>
        );
    }

    const { customer, orderCount } = data;

    return (
        <AdminLayout title={`Customer: ${customer.name}`}>
            <div className="mb-6">
                <button onClick={() => router.back()} className="flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Customers
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">Customer Profile</h2>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold border border-primary-100 italic">
                            Member since {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info & Stats */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                        <div className="mx-auto h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-3xl mb-4 border-2 border-primary-50 shadow-inner">
                            {customer.name?.[0].toUpperCase() || 'C'}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
                        <p className="text-gray-500 text-sm mb-6">{customer.email}</p>
                        
                        <div className="grid grid-cols-1 gap-4 pt-6 border-t border-gray-50">
                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                <div className="text-2xl font-black text-primary-600">{orderCount}</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Orders</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-l-4 border-primary-500 pl-3">Contact Information</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
                                <span className="text-sm font-bold text-gray-700">{customer.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase">Phone</span>
                                <span className="text-sm font-bold text-gray-700">{customer.phone || 'Not Provided'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase">Role</span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{customer.role}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Address Details & Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-l-4 border-primary-500 pl-3">Default Shipping Address</h4>
                        {customer.address ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Street Address</div>
                                        <div className="text-sm font-bold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            {customer.address.street}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">City</div>
                                            <div className="text-sm font-bold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{customer.address.city}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">State</div>
                                            <div className="text-sm font-bold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{customer.address.state}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Pincode</div>
                                            <div className="text-sm font-bold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono">{customer.address.pincode}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Country</div>
                                            <div className="text-sm font-bold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{customer.address.country}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">No address information available.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
