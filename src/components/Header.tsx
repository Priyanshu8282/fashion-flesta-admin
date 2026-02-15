'use client';

import { adminService } from '@/services';
import type { AdminUser } from '@/services/admin.service';
import { useEffect, useState } from 'react';

interface HeaderProps {
    title: string;
    onToggleSidebar: () => void;
}

export default function Header({ title, onToggleSidebar }: HeaderProps) {
    const [user, setUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        const currentUser = adminService.getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        adminService.logout();
    };

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center">
                    <button 
                        onClick={onToggleSidebar}
                        className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h2 className="ml-4 text-xl font-semibold text-gray-800">{title}</h2>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-2 text-gray-400 hover:text-gray-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    
                    <div className="flex items-center border-l pl-4 ml-2 border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="flex flex-col text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-500 font-medium">{user?.role || 'Administrator'}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                                title="Logout"
                            >
                                <svg className="w-5 h-5 group-hover:animate-[spin_1s_linear_infinite] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
