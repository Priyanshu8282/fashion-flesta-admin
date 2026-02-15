'use client';

import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/ProductForm';

export default function AddProductPage() {
    return (
        <AdminLayout title="Add New Product">
            <div className="max-w-5xl mx-auto">
                <ProductForm />
            </div>
        </AdminLayout>
    );
}
