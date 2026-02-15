'use client';

import { usePathname } from 'next/navigation';
import { adminService } from '@/services';
import type { AdminUser } from '@/services/admin.service';
import { useEffect, useState } from 'react';

import { 
    LayoutDashboard, 
    ShoppingBag, 
    Layers, 
    ClipboardList, 
    Users, 
    Image,
    LogOut,
    X
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [user, setUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        const currentUser = adminService.getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        adminService.logout();
    };

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
        { name: 'Products', href: '/products', icon: <ShoppingBag className="w-5 h-5 mr-3" /> },
        { name: 'Categories', href: '/categories', icon: <Layers className="w-5 h-5 mr-3" /> },
        { name: 'Orders', href: '/orders', icon: <ClipboardList className="w-5 h-5 mr-3" /> },
        { name: 'Customers', href: '/customers', icon: <Users className="w-5 h-5 mr-3" /> },
        { name: 'Banners', href: '/banners', icon: <Image className="w-5 h-5 mr-3" /> },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 bg-white">
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">Fashion <span className="text-primary-600">Flesta</span></h1>
                        <button onClick={onClose} className="md:hidden p-2 -mr-2 text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => {
                                        if (window.innerWidth < 768) onClose();
                                    }}
                                    className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group ${
                                        isActive 
                                            ? 'text-gray-900 bg-primary-50 font-bold shadow-sm shadow-primary-100/50' 
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'
                                    }`}
                                >
                                    <span className={`${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-900'} transition-colors`}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </a>
                            );
                        })}
                    </nav>

                    {/* Profile & Logout */}
                    <div className="p-4 border-t border-gray-50 bg-gray-50/30">
                        <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center min-w-0">
                                <div className="flex-shrink-0">
                                    <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold text-sm border border-primary-200">
                                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                </div>
                                <div className="ml-3 min-w-0">
                                    <p className="text-xs font-black text-gray-900 truncate uppercase tracking-wider">{user?.name || 'Admin'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{user?.role || 'Admin'}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group shrink-0"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 group-hover:animate-pulse" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
