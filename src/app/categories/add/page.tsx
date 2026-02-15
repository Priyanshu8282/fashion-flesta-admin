'use client';

import AdminLayout from '@/components/AdminLayout';
import CategoryForm from '@/components/CategoryForm';

export default function AddCategoryPage() {
    return (
        <AdminLayout title="Add Category">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Create New Category</h2>
                        <p className="text-gray-500">Add a new category to group your products</p>
                    </div>
                </div>
                <CategoryForm />
            </div>
        </AdminLayout>
    );
}
