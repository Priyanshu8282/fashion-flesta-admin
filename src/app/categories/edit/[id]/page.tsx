'use client';

import { use } from 'react';
import AdminLayout from '@/components/AdminLayout';
import CategoryForm from '@/components/CategoryForm';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <AdminLayout title="Edit Category">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Category</h2>
                    <p className="text-gray-500">Update category information and visibility</p>
                </div>
                <CategoryForm categoryId={id} isEdit />
            </div>
        </AdminLayout>
    );
}
