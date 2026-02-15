'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { bannerService, Banner } from '@/services';
import { toast } from 'react-hot-toast';
import BannerModal from '@/components/BannerModal';
import DeleteModal from '@/components/DeleteModal';

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchBanners();
    }, [currentPage]);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await bannerService.getAllBanners({
                page: currentPage,
                limit
            });
            if (response.success) {
                setBanners(response.data);
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages);
                    setTotalItems(response.pagination.totalItems);
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch banners');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (banner: Banner) => {
        try {
            const response = await bannerService.toggleBannerStatus(banner._id, !banner.isActive);
            if (response.success) {
                toast.success(`Banner ${!banner.isActive ? 'activated' : 'deactivated'} successfully`);
                fetchBanners();
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to toggle banner status');
        }
    };

    const handleDelete = (banner: Banner) => {
        setBannerToDelete(banner);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!bannerToDelete) return;
        
        try {
            setIsDeleting(true);
            const response = await bannerService.deleteBanner(bannerToDelete._id);
            if (response.success) {
                toast.success('Banner deleted successfully');
                fetchBanners();
                setIsDeleteModalOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete banner');
        } finally {
            setIsDeleting(false);
            setBannerToDelete(null);
        }
    };

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const cleanBasePath = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanImagePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `${cleanBasePath}/${cleanImagePath}`;
    };

    return (
        <AdminLayout title="Banners">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Banner Management</h1>
                    <p className="text-gray-500 text-sm font-medium">Control the visual identity and promotions of your homepage.</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedBanner(null);
                        setIsModalOpen(true);
                    }}
                    className="px-6 py-3 bg-gray-900 border border-black hover:bg-black text-white rounded-2xl text-sm font-bold shadow-xl shadow-gray-200 transition-all flex items-center gap-2 group"
                >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Banner
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Preview & Info</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Display Order</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6 flex gap-4">
                                            <div className="h-20 w-32 bg-gray-100 rounded-xl"></div>
                                            <div className="space-y-2 mt-2">
                                                <div className="h-4 w-40 bg-gray-100 rounded"></div>
                                                <div className="h-3 w-60 bg-gray-100 rounded"></div>
                                            </div>
                                        </td>
                                        <td colSpan={3} className="px-8 py-6">
                                            <div className="h-4 w-full bg-gray-50 rounded"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : banners.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <svg className="h-10 w-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-black text-gray-900">No Banners Found</h3>
                                            <p className="text-gray-500 text-sm mt-1 mb-6">Create your first banner to liven up your storefront.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                banners.map((banner) => (
                                    <tr key={banner._id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-start gap-5">
                                                <div className="relative h-24 w-44 rounded-2xl border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow shrink-0">
                                                    <img 
                                                        src={getImageUrl(banner.image)} 
                                                        alt={banner.title} 
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0 py-1">
                                                    <h3 className="text-sm font-black text-gray-900 truncate">{banner.title}</h3>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{banner.description || 'No description'}</p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" />
                                                            </svg>
                                                            {banner.link || 'Internal Link'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                                                    <span className="text-xs font-black text-gray-900 font-mono">{banner.displayOrder}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <button 
                                                onClick={() => handleToggleStatus(banner)}
                                                className={`group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    banner.isActive ? 'bg-emerald-500' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span className="sr-only">Toggle status</span>
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        banner.isActive ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                            <span className={`ml-3 text-[10px] font-black uppercase tracking-wider ${
                                                banner.isActive ? 'text-emerald-600' : 'text-gray-400'
                                            }`}>
                                                {banner.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedBanner(banner);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-100"
                                                    title="Edit Banner"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.123 3.897a2 2 0 012.827 0l1.05 1.05a2 2 0 010 2.828L10.999 18H9v-1.999l7.123-7.124z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(banner)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                    title="Delete Banner"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
           
                <div className="mt-8 flex items-center justify-between px-8 py-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Showing <span className="text-gray-900">{(currentPage - 1) * limit + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * limit, totalItems)}</span> of <span className="text-gray-900">{totalItems}</span> Banners
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`h-10 w-10 rounded-xl text-xs font-black transition-all ${
                                    currentPage === page 
                                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' 
                                        : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            

            <BannerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchBanners}
                banner={selectedBanner}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Banner"
                description="Are you sure you want to permanently remove this banner"
                itemName={bannerToDelete?.title}
                loading={isDeleting}
            />
        </AdminLayout>
    );
}
