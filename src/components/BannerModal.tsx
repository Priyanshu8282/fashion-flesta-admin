'use client';

import { useState, useEffect, useRef } from 'react';
import { Banner } from '@/services';
import { toast } from 'react-hot-toast';

interface BannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    banner?: Banner | null;
}

export default function BannerModal({ isOpen, onClose, onSave, banner }: BannerModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [displayOrder, setDisplayOrder] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (banner) {
            setTitle(banner.title);
            setDescription(banner.description || '');
            setLink(banner.link || '');
            setDisplayOrder(banner.displayOrder);
            setImagePreview(banner.image);
            setImage(null);
        } else {
            setTitle('');
            setDescription('');
            setLink('');
            setDisplayOrder(0);
            setImagePreview(null);
            setImage(null);
        }
    }, [banner, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title) {
            toast.error('Title is required');
            return;
        }

        if (!banner && !image) {
            toast.error('Banner image is required');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('link', link);
        formData.append('displayOrder', displayOrder.toString());
        if (image) {
            formData.append('image', image);
        }

        try {
            setLoading(true);
            const { bannerService } = await import('@/services');
            
            if (banner) {
                await bannerService.updateBanner(banner._id, formData);
                toast.success('Banner updated successfully');
            } else {
                await bannerService.addBanner(formData);
                toast.success('Banner added successfully');
            }
            onSave();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save banner');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const cleanBasePath = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanImagePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `${cleanBasePath}/${cleanImagePath}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{banner ? 'Edit Banner' : 'Add New Banner'}</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Visual Promotions Management</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-600 border border-transparent hover:border-gray-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Image Upload Area */}
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Banner Image</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative h-36 w-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group
                                    ${imagePreview ? 'border-primary-200 bg-gray-50' : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50/10'}`}
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={getImageUrl(imagePreview) || undefined} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-[10px] font-bold px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="h-10 w-10 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-2 text-primary-500 group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-700">Upload Banner Image</p>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Banner Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                placeholder="Engagement Title"
                            />
                        </div>

                        {/* Link */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Link</label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm font-medium"
                                placeholder="/shop"
                            />
                        </div>

                        {/* Display Order */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Order</label>
                            <input
                                type="number"
                                value={displayOrder}
                                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm font-medium resize-none"
                                placeholder="Contextual info..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {banner ? 'Update' : 'Publish'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
