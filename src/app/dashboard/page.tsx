'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { dashboardService, DashboardStats, adminService, AdminUser } from '@/services';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    ShoppingBag, 
    Layers, 
    IndianRupee, 
    Calendar,
    MoreVertical,
    TrendingUp,
    ArrowUpRight,
    RefreshCw,
    Settings,
    Activity
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const RealTimeClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-right">
            <p className="text-[10px] font-black tracking-widest text-white/60 mb-1 leading-none">
                {time.toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-sm font-black text-white leading-none">
                {time.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
            </p>
        </div>
    );
};

const CountUp = ({ value, isCurrency = false }: { value: number; isCurrency?: boolean }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let start = 0;
        const duration = 1000;
        const steps = 60;
        const increment = value / steps;
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, duration / steps);
        
        return () => clearInterval(timer);
    }, [value]);
    
    return <span>{isCurrency ? '₹' : ''}{count.toLocaleString('en-IN')}</span>;
};

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('7days');
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        setAdminUser(adminService.getCurrentUser());
        handleFilterChange('7days');
    }, []);

    const fetchStats = async (start?: string, end?: string) => {
        try {
            setLoading(true);
            const response = await dashboardService.getStats(start, end);
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (type: string) => {
        setFilterType(type);
        let start, end;
        const today = new Date();
        const endDateStr = today.toISOString().split('T')[0];
        
        if (type === '7days') {
            const date = new Date();
            date.setDate(date.getDate() - 7);
            start = date.toISOString().split('T')[0];
            end = endDateStr;
            fetchStats(start, end);
        } else if (type === 'month') {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            start = date.toISOString().split('T')[0];
            end = endDateStr;
            fetchStats(start, end);
        } else if (type === 'year') {
            const date = new Date();
            date.setFullYear(date.getFullYear() - 1);
            start = date.toISOString().split('T')[0];
            end = endDateStr;
            fetchStats(start, end);
        }
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const newStatCards = [
        { 
            title: 'Purchase Orders', 
            value: stats?.totalOrders || 0, 
            subValue: 'Orders Overview',
            icon: ShoppingBag, 
            color: 'from-blue-500/10 to-blue-600/5 text-blue-600 border-blue-100',
            iconBg: 'bg-blue-50',
            isCurrency: false,
            dot: 'bg-emerald-500'
        },
        { 
            title: 'Return Orders', 
            value: 0, 
            subValue: 'Returns Overview',
            icon: ArrowUpRight, 
            color: 'from-orange-500/10 to-orange-600/5 text-orange-600 border-orange-100',
            iconBg: 'bg-orange-50',
            isCurrency: false,
            dot: 'bg-gray-400'
        },
        { 
            title: 'Total Revenue', 
            value: stats?.totalRevenue || 0, 
            subValue: 'Revenue Overview',
            icon: IndianRupee, 
            color: 'from-emerald-500/10 to-emerald-600/5 text-emerald-600 border-emerald-100',
            iconBg: 'bg-emerald-50',
            isCurrency: true,
            dot: 'bg-emerald-500'
        },
        { 
            title: 'Inventory', 
            value: stats?.totalProducts || 0, 
            subValue: 'Products Count',
            icon: Layers, 
            color: 'from-rose-500/10 to-rose-600/5 text-rose-600 border-rose-100',
            iconBg: 'bg-rose-50',
            isCurrency: false,
            dot: 'bg-blue-500'
        },
    ];

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <div className="flex items-center justify-center h-96">
                    <div className="relative w-12 h-12">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard">
            {/* Greeting Header Section */}
            <div className="relative overflow-hidden mb-8 rounded-[2.5rem] bg-[#111827] p-8 shadow-2xl shadow-gray-200">
                {/* Background Pattern/Video Effect */}
                <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 rotate-12"></div>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                             <h1 className="text-2xl md:text-3xl font-black text-white">
                                {greeting()}, <span className="text-primary-400">{adminUser?.name || 'Admin'}</span>
                            </h1>
                        </div>
                        <p className="text-sm text-white/50 font-bold uppercase tracking-[0.2em]">Welcome back to your control center</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
                        <div className="relative group">
                            <select 
                                value={filterType}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="appearance-none pl-6 pr-10 py-2 bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white shadow-lg hover:bg-white/20 transition-all outline-none cursor-pointer min-w-[150px]"
                            >
                                <option value="7days" className="text-gray-900">Last Week</option>
                                <option value="month" className="text-gray-900">Last Month</option>
                                <option value="year" className="text-gray-900">Last Year</option>
                            </select>
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-primary-400 pointer-events-none" />
                        </div>
                        <div className="w-px h-8 bg-white/10 mx-2 hidden md:block"></div>
                        <RealTimeClock />
                        <button 
                            onClick={() => handleFilterChange(filterType)}
                            className="p-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all group"
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Premium Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {newStatCards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative overflow-hidden group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer`}
                    >
                        {/* Decorative Background Element */}
                        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${card.color} opacity-40 group-hover:scale-150 transition-transform duration-700`}></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{card.title}</span>
                                <div className={`p-3 rounded-2xl ${card.iconBg} ${card.color.split(' ')[2]} shadow-inner`}>
                                    <card.icon className="w-5 h-5" />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                    <CountUp value={card.value} isCurrency={card.isCurrency} />
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${card.dot} animate-pulse`}></div>
                                    <span className="text-xs font-black text-gray-600">{card.subValue}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>


            {/* Production Process Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-emerald-100 shadow-xl shadow-emerald-50/50 flex flex-col items-center justify-between text-center relative overflow-hidden group min-h-[300px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mb-32 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                    
                    <div className="relative z-10 w-full mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-800">Total Active Storefront Analytics</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 relative z-10 w-full">
                        <div className="flex flex-col items-center">
                            <div className="bg-white shadow-2xl shadow-emerald-200/50 p-6 rounded-[2.5rem] mb-6">
                                <Settings className="w-12 h-12 text-emerald-500 animate-[spin_4s_linear_infinite]" />
                            </div>
                            <h2 className="text-7xl font-black text-gray-900 mb-2">{stats?.totalCustomers || 0}</h2>
                            <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Registered Customers</p>
                        </div>

                        <div className="hidden md:block w-px h-32 bg-gray-100"></div>

                        <div className="flex flex-col items-center">
                            <div className="bg-white shadow-2xl shadow-blue-200/50 p-6 rounded-[2.5rem] mb-6">
                                <Activity className="w-12 h-12 text-blue-500 animate-pulse" />
                            </div>
                            <h2 className="text-7xl font-black text-gray-900 mb-2">{stats?.totalCategories || 0}</h2>
                            <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Active Categories</p>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full px-8 opacity-5 pointer-events-none">
                        <div className="flex justify-between items-end gap-1 h-24">
                            {[40, 70, 45, 90, 65, 80, 50, 85, 40, 60, 75, 95].map((h, i) => (
                                <div key={i} className="flex-1 bg-emerald-500 rounded-t-lg" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-indigo-100 shadow-xl shadow-indigo-50/50 relative overflow-hidden group"
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-50 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>

                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Analysis</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Daily sales performance</p>
                        </div>
                    </div>
                    <div className="relative z-10 h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.dailyStats || []}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="_id" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 700}}
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                                    }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 700}}
                                    tickFormatter={(val) => `₹${val}`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '24px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: 900,
                                        padding: '16px'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#6366f1" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorRev)"
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-[3rem] border border-rose-100 shadow-xl shadow-rose-50/50 relative overflow-hidden group"
                >
                    {/* Decorative Background Element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-30"></div>

                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Order Volume</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Weekly activity</p>
                        </div>
                        <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="relative z-10 h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.dailyStats?.slice(-7) || []}>
                                <XAxis 
                                    dataKey="_id" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 700}}
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return date.toLocaleDateString('en-IN', { weekday: 'short' });
                                    }}
                                />
                                <Tooltip 
                                    cursor={{fill: '#f9fafb', radius: 10}}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                                />
                                <Bar 
                                    dataKey="orders" 
                                    radius={[10, 10, 10, 10]} 
                                    barSize={24}
                                >
                                    {(stats?.dailyStats?.slice(-7) || []).map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={index % 2 === 0 ? '#111827' : '#f43f5e'} 
                                            fillOpacity={0.9}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Orders Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] border border-blue-100 shadow-xl shadow-blue-50/50 overflow-hidden mb-12 relative group"
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full -ml-32 -mb-32 group-hover:scale-110 transition-transform duration-700 opacity-50"></div>

                <div className="relative z-10 px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Transactions</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Latest storefront activity</p>
                    </div>
                    <button className="px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-[10px] font-black text-gray-600 transition-all uppercase tracking-widest shadow-sm">
                        View All Activity
                    </button>
                </div>
                <div className="relative z-10 overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/30">
                            <tr>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction ID</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {stats?.recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-blue-50/20 transition-all duration-300 group/row">
                                    <td className="px-10 py-6">
                                        <span className="text-xs font-black text-gray-900 group-hover/row:text-blue-600 transition-colors">#{order.orderNumber.slice(-8)}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase shadow-inner border border-white">
                                                {order.customer?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900">{order.customer?.name || 'Guest Customer'}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{order.customer?.email || 'No email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <p className="text-xs font-bold text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                                            order.orderStatus === 'Delivered' 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                : order.orderStatus === 'Cancelled'
                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <p className="text-sm font-black text-gray-900 tracking-tight">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
