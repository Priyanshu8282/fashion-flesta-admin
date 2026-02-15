'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { categoryService, Category } from '@/services';
import { toast } from 'react-hot-toast';
import DeleteModal from '@/components/DeleteModal';
import ImagePreviewModal from '@/components/ImagePreviewModal';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });
    
    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Image Preview State
    const [previewImage, setPreviewImage] = useState<{ url: string; alt: string } | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCategories();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [search, page]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getAllCategories({
                search,
                page,
                limit: 10
            });
            if (response.success) {
                setCategories(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const response = await categoryService.toggleStatus(id, !currentStatus);
            if (response.success) {
                setCategories(prev => prev.map(cat => 
                    cat._id === id ? { ...cat, isActive: !currentStatus } : cat
                ));
                toast.success('Status updated successfully');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status');
        }
    };

    const openDeleteModal = (id: string, name: string) => {
        setCategoryToDelete({ id, name });
        setIsDeleteModalOpen(true);
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            setIsDeleting(true);
            const response = await categoryService.deleteCategory(categoryToDelete.id);
            if (response.success) {
                setCategories(prev => prev.filter(cat => cat._id !== categoryToDelete.id));
                toast.success('Category deleted successfully');
                setIsDeleteModalOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete category');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AdminLayout title="Categories">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <div>
                    <p className="text-gray-600">Manage your product categories</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm outline-none transition-all"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1); // Reset to first page on search
                            }}
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <Link
                        href="/categories/add"
                        className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Category
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-200 rounded"></div></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                                                <div className="ml-4 h-4 w-24 bg-gray-200 rounded"></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-48 bg-gray-200 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-12 bg-gray-200 rounded-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category, index) => (
                                    <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {(page - 1) * pagination.limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div 
                                                    className="h-10 w-10 flex-shrink-0 cursor-zoom-in group relative"
                                                    onClick={() => setPreviewImage({ 
                                                        url: category.image ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${category.image}` : 'https://placehold.co/400x400/ffe4e6/9f1239?text=Category',
                                                        alt: category.name 
                                                    })}
                                                >
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover border border-gray-100 shadow-sm transition-transform group-hover:scale-110"
                                                        src={category.image ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${category.image}` : 'https://placehold.co/100x100/ffe4e6/9f1239?text=CAT'}
                                                        alt={category.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <Link 
                                                        href={`/categories/edit/${category._id}`}
                                                        className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                                                    >
                                                        {category.name}
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                {category.productCount || 0} Items
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 line-clamp-1 max-w-xs">{category.description}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleToggleStatus(category._id, category.isActive)}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                                                        category.isActive ? 'bg-primary-600' : 'bg-gray-200'
                                                    }`}
                                                    role="switch"
                                                    aria-checked={category.isActive}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                            category.isActive ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                                <span className={`ml-3 text-xs font-semibold ${
                                                    category.isActive ? 'text-primary-700' : 'text-gray-500'
                                                }`}>
                                                    {category.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <Link
                                                    href={`/categories/edit/${category._id}`}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Category"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => openDeleteModal(category._id, category.name)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Category"
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
            
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-bold text-gray-800">{(page - 1) * pagination.limit + 1}</span> to <span className="font-bold text-gray-800">{Math.min(page * pagination.limit, pagination.totalItems)}</span> of <span className="font-bold text-gray-800">{pagination.totalItems}</span> categories
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                                    page === i + 1 
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                            disabled={page === pagination.totalPages}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
        

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteCategory}
                title="Delete Category"
                description="Are you sure you want to delete the category"
                itemName={categoryToDelete?.name || ''}
                loading={isDeleting}
            />

            <ImagePreviewModal
                isOpen={!!previewImage}
                onClose={() => setPreviewImage(null)}
                imageUrl={previewImage?.url || ''}
                imageAlt={previewImage?.alt || ''}
            />
        </AdminLayout>
    );
}
