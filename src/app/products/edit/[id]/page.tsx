'use client';

import AdminLayout from '@/components/AdminLayout';
import ProductForm from '@/components/ProductForm';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <AdminLayout title="Edit Product">
            <div className="max-w-5xl mx-auto">
                <ProductForm productId={id} isEdit={true} />
            </div>
        </AdminLayout>
    );
}
