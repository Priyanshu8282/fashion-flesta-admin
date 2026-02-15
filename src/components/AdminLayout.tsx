'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import ProtectedRoute from './ProtectedRoute';
import { useState } from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex flex-col flex-1 w-0 overflow-hidden">
                    <Header title={title} onToggleSidebar={() => setIsSidebarOpen(true)} />
                    <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6 bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
