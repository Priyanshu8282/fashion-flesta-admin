'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categoryService, Category } from '@/services';
import { toast } from 'react-hot-toast';

interface CategoryFormProps {
    categoryId?: string;
    isEdit?: boolean;
}

export default function CategoryForm({ categoryId, isEdit = false }: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');

    useEffect(() => {
        if (isEdit && categoryId) {
            fetchCategoryDetails();
        }
    }, [categoryId, isEdit]);

    const fetchCategoryDetails = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getCategoryById(categoryId!);
            if (response.success) {
                const c = response.data;
                setFormData({
                    name: c.name,
                    description: c.description,
                });
                setPreview(c.image ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${c.image}` : '');
            }
        } catch (error: any) {
            toast.error('Failed to fetch category details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
            if (errors.image) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.image;
                    return newErrors;
                });
            }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) newErrors.name = 'Category Name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        if (!isEdit && !imageFile) {
            newErrors.image = 'Category Image is required';
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
            submissionData.append('name', formData.name);
            submissionData.append('description', formData.description);

            if (imageFile) {
                submissionData.append('image', imageFile);
            }

            let response;
            if (isEdit && categoryId) {
                response = await categoryService.updateCategory(categoryId, submissionData);
            } else {
                response = await categoryService.addCategory(submissionData);
            }

            if (response.success) {
                toast.success(isEdit ? 'Category updated successfully' : 'Category added successfully');
                router.push('/categories');
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
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-4">Category Details</h3>
                
                <div>
                    <Label text="Category Name" required />
                    <input
                        type="text"
                        name="name"
                        className={`block w-full px-4 py-3 border rounded-xl focus:ring-primary-500 focus:border-primary-500 text-sm transition-all text-gray-900 ${
                            errors.name ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-200'
                        }`}
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Western Wear"
                    />
                    <ErrorMsg error={errors.name} />
                </div>

                <div>
                    <Label text="Description" required />
                    <textarea
                        name="description"
                        rows={4}
                        className={`block w-full px-4 py-3 border rounded-xl focus:ring-primary-500 focus:border-primary-500 text-sm transition-all text-gray-900 ${
                            errors.description ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-200'
                        }`}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe what categories/products fall into this group..."
                    />
                    <ErrorMsg error={errors.description} />
                </div>

                {/* Image Upload */}
                <div className="space-y-4 pt-4">
                    <Label text="Category Image" required={!isEdit} />
                    <div className="flex items-center space-x-6">
                        <div className="relative group h-32 w-32 flex-shrink-0">
                            <div className={`h-full w-full rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
                                preview ? 'border-primary-500' : 'border-gray-200 hover:border-primary-300'
                            }`}>
                                {preview ? (
                                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="text-center p-4">
                                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-2">Upload a high-quality thumbnail for this category. Square images work best.</p>
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                            >
                                Change Image
                            </button>
                        </div>
                    </div>
                    <ErrorMsg error={errors.image} />
                </div>
            </div>

            <div className="pt-8 border-t flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 bg-primary-600 border border-transparent rounded-xl shadow-lg shadow-primary-500/30 text-sm font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : isEdit ? 'Update Category' : 'Create Category'}
                </button>
            </div>
        </form>
    );
}
