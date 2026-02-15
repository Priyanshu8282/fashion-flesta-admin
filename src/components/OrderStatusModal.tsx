'use client';

import React, { useState } from 'react';

interface OrderStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (status: string) => void;
    currentStatus: string;
    orderNumber: string;
    loading?: boolean;
}

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderStatusModal({
    isOpen,
    onClose,
    onConfirm,
    currentStatus,
    orderNumber,
    loading = false
}: OrderStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);

    if (!isOpen) return null;

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'Pending': return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' };
            case 'Processing': return { color: 'text-blue-600', bg: 'bg-blue-50', icon: 'M5 13l4 4L19 7' };
            case 'Shipped': return { color: 'text-purple-600', bg: 'bg-purple-50', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' };
            case 'Delivered': return { color: 'text-green-600', bg: 'bg-green-50', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' };
            case 'Cancelled': return { color: 'text-red-600', bg: 'bg-red-50', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' };
            default: return { color: 'text-gray-600', bg: 'bg-gray-50', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100">
                    <div className="bg-white px-6 pb-6 pt-8 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Update Order Status</h3>
                                <p className="text-sm text-gray-500 mt-1 font-mono">Order #{orderNumber}</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {statuses.map((status) => {
                                const info = getStatusInfo(status);
                                const isSelected = selectedStatus === status;
                                return (
                                    <button
                                        key={status}
                                        onClick={() => setSelectedStatus(status)}
                                        className={`flex items-center p-4 rounded-xl border-2 transition-all text-left group ${
                                            isSelected 
                                                ? 'border-primary-600 bg-primary-50/30 ring-1 ring-primary-600' 
                                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg ${info.bg} ${info.color}`}>
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d={info.icon} />
                                            </svg>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className={`text-sm font-bold ${isSelected ? 'text-primary-700' : 'text-gray-900'}`}>{status}</div>
                                            {status === 'Pending' && <p className="text-xs text-gray-500">Order received, awaiting processing</p>}
                                            {status === 'Processing' && <p className="text-xs text-gray-500">Order is being prepared and packed</p>}
                                            {status === 'Shipped' && <p className="text-xs text-gray-500">Handed over to delivery partner</p>}
                                            {status === 'Delivered' && <p className="text-xs text-gray-500">Successfully received by customer</p>}
                                            {status === 'Cancelled' && <p className="text-xs text-gray-500">Order has been voided</p>}
                                        </div>
                                        {isSelected && (
                                            <div className="h-6 w-6 text-primary-600">
                                                <svg fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-gray-50/50 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-8 gap-3">
                        <button
                            type="button"
                            disabled={loading || selectedStatus === currentStatus}
                            className="inline-flex w-full justify-center rounded-xl bg-primary-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-500 transition-all sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => onConfirm(selectedStatus)}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-8 py-2.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-all sm:mt-0 sm:w-auto"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
