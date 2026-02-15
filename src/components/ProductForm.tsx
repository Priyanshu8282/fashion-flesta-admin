'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productService, categoryService, Category, Product } from '@/services';
import { toast } from 'react-hot-toast';

interface ProductFormProps {
    productId?: string;
    isEdit?: boolean;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function ProductForm({ productId, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        sizes: [] as string[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<{ cover: string; images: string[] }>({ cover: '', images: [] });

    useEffect(() => {
        fetchCategories();
        if (isEdit && productId) {
            fetchProductDetails();
        }
    }, [productId, isEdit]);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAllCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error: any) {
            toast.error('Failed to fetch categories');
        }
    };

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await productService.getProductById(productId!);
            if (response.success) {
                const p = response.data;
                setFormData({
                    name: p.name,
                    description: p.description,
                    price: p.price.toString(),
                    category: typeof p.category === 'object' ? p.category._id : p.category,
                    stock: p.stock.toString(),
                    sizes: p.sizes || [],
                });
                setPreviews({
                    cover: p.coverImage ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${p.coverImage}` : 'https://placehold.co/400x400/ffe4e6/9f1239?text=Product',
                    images: (p.images || []).map(img => `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${img}`),
                });
            }
        } catch (error: any) {
            toast.error('Failed to fetch product details');
        } finally {
            setLoading(false);
        }
    };

    const validateField = (name: string, value: any) => {
        let error = '';
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else if ((name === 'price' || name === 'stock') && Number(value) < 0) {
            error = `${name.charAt(0).toUpperCase() + name.slice(1)} cannot be negative`;
        }
        
        setErrors(prev => ({ ...prev, [name]: error }));
        return error === '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error as user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSizeToggle = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (isCover) {
                setCoverImage(files[0]);
                setPreviews(prev => ({ ...prev, cover: URL.createObjectURL(files[0]) }));
                if (errors.coverImage) {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.coverImage;
                        return newErrors;
                    });
                }
            } else {
                setImages(prev => [...prev, ...files]);
                const newPreviews = files.map(file => URL.createObjectURL(file));
                setPreviews(prev => ({ ...prev, images: [...prev.images, ...newPreviews] }));
            }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) newErrors.name = 'Product Name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.stock) newErrors.stock = 'Stock is required';
        if (!formData.category) newErrors.category = 'Category is required';
        
        if (!isEdit && !coverImage) {
            newErrors.coverImage = 'Cover Image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            setLoading(true);
            const submissionData = new FormData();
            
            // Append basic fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'sizes') {
                    submissionData.append(key, JSON.stringify(value));
                } else {
                    submissionData.append(key, value.toString());
                }
            });

            // Append images
            if (coverImage) {
                submissionData.append('coverImage', coverImage);
            }
            images.forEach(img => {
                submissionData.append('images', img);
            });

            let response;
            if (isEdit && productId) {
                response = await productService.updateProduct(productId, submissionData);
            } else {
                response = await productService.addProduct(submissionData);
            }

            if (response.success) {
                toast.success(isEdit ? 'Product updated successfully' : 'Product added successfully');
                router.push('/products');
            }
        } catch (error: any) {
            toast.error(error.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const Label = ({ text, required = false }: { text: string; required?: boolean }) => (
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {text}{required && <span className="text-red-500">*</span>}
        </label>
    );

    const ErrorMsg = ({ error }: { error?: string }) => (
        error ? <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p> : null
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                    
                    <div>
                        <Label text="Product Name" required />
                        <input
                            type="text"
                            name="name"
                            className={`block w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors ${
                                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                        />
                        <ErrorMsg error={errors.name} />
                    </div>

                    <div>
                        <Label text="Description" required />
                        <textarea
                            name="description"
                            rows={4}
                            className={`block w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors ${
                                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter product description"
                        />
                        <ErrorMsg error={errors.description} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label text="Price (₹)" required />
                            <input
                                type="number"
                                name="price"
                                min="0"
                                className={`block w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors ${
                                    errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0"
                            />
                            <ErrorMsg error={errors.price} />
                        </div>
                        <div>
                            <Label text="Stock Quantity" required />
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                className={`block w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors ${
                                    errors.stock ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="0"
                            />
                            <ErrorMsg error={errors.stock} />
                        </div>
                    </div>

                    <div>
                        <Label text="Category" required />
                        <select
                            name="category"
                            className={`block w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors text-gray-900 ${
                                errors.category ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-300'
                            }`}
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            <option value="" className="text-gray-500">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id} className="text-gray-900 bg-white">
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <ErrorMsg error={errors.category} />
                    </div>
                </div>

                {/* Media & Options */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Media & Options</h3>

                    <div>
                        <Label text="Available Sizes" />
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_SIZES.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeToggle(size)}
                                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                                        formData.sizes.includes(size)
                                            ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                            : 'bg-white border-gray-300 text-gray-700 hover:border-primary-500'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Uploads */}
                    <div className="space-y-4">
                        <div>
                            <Label text="Cover Image" required={!isEdit} />
                            <input
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                                onChange={(e) => handleFileChange(e, true)}
                            />
                            <ErrorMsg error={errors.coverImage} />
                            {previews.cover && (
                                <div className="mt-2 h-32 w-32 relative group">
                                    <img src={previews.cover} alt="Cover preview" className="h-full w-full object-cover rounded-lg border shadow-sm transition-transform group-hover:scale-105" />
                                </div>
                            )}
                        </div>

                        <div>
                            <Label text="Other Images" />
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                                onChange={(e) => handleFileChange(e, false)}
                            />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {previews.images.map((src, idx) => (
                                    <div key={idx} className="h-20 w-20 relative group">
                                        <img src={src} alt={`Preview ${idx}`} className="h-full w-full object-cover rounded-lg border shadow-sm transition-transform group-hover:scale-105" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : isEdit ? 'Update Product' : 'Add Product'}
                </button>
            </div>
        </form>
    );
}
