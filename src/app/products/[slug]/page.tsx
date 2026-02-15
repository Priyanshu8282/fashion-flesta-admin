'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { productService, Product } from '@/services';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ProductViewPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productService.getProductBySlug(slug);
            if (response.success) {
                setProduct(response.data);
                if (response.data.coverImage) {
                    setActiveImage(response.data.coverImage);
                } else if (response.data.images && response.data.images.length > 0) {
                    setActiveImage(response.data.images[0]);
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch product details');
            router.push('/products');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Loading Product...">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!product) return null;

    const allImages = [
        ...(product.coverImage ? [product.coverImage] : []),
        ...(product.images || [])
    ].filter((img, index, self) => self.indexOf(img) === index); // Unique images

    const imageBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

    return (
        <AdminLayout title={product.name}>
            <div className="max-w-6xl mx-auto">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <Link 
                        href="/products"
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Products
                    </Link>
                    <div className="flex gap-3">
                        <Link
                            href={`/products/edit/${product._id}`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Product
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    {/* Left: Image Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative group">
                            <img 
                                src={activeImage ? `${imageBase}${activeImage}` : 'https://placehold.co/800x800/ffe4e6/9f1239?text=No+Image'} 
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x800/ffe4e6/9f1239?text=No+Image';
                                }}
                            />
                            {!product.isActive && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Inactive
                                </div>
                            )}
                        </div>
                        
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                            activeImage === img ? 'border-primary-500 ring-2 ring-primary-100' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img 
                                            src={`${imageBase}${img}`} 
                                            alt={`${product.name} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col h-full">
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                    {product.category?.name || 'General'}
                                </span>
                                {product.isFeatured && (
                                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                        Featured
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-end gap-3 font-bold">
                                <span className="text-3xl text-gray-900">₹{product.price}</span>
                                <span className="text-sm text-gray-400 mb-1 font-medium">Inclusive of all taxes</span>
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {product.description || 'No description provided for this product.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Stock Status</h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-xl font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.stock} Units
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">Available</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Slug</h4>
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        {product.slug}
                                    </div>
                                </div>
                            </div>

                            {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Available Sizes</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(size => (
                                            <span 
                                                key={size}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700"
                                            >
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-xs text-gray-400 font-medium">
                                Created on {new Date(product.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`h-2.5 w-2.5 rounded-full ${product.isActive ? 'bg-green-500 ring-4 ring-green-50' : 'bg-red-500 ring-4 ring-red-50'}`}></div>
                                <span className={`text-sm font-bold ${product.isActive ? 'text-green-700' : 'text-red-700'}`}>
                                    {product.isActive ? 'Publicly Visible' : 'Hidden from Shop'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
