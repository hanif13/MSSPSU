"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LayoutGrid,
    Home,
    CheckCircle,
    FileText,
    Tag,
    Activity,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Loader2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3001/api";

interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { icon: <Home size={20} />, label: "หน้าหลัก", href: "/admin" },
    { icon: <CheckCircle size={20} />, label: "อนุมัติ/ปฏิเสธ", href: "/admin/approvals" },
    { icon: <FileText size={20} />, label: "จัดการเนื้อหา", href: "/admin/content" },
    { icon: <Tag size={20} />, label: "จัดการหมวดหมู่", href: "/admin/categories" },
    { icon: <Activity size={20} />, label: "Audit Logs", href: "/admin/logs" },
    { icon: <Users size={20} />, label: "จัดการผู้ใช้", href: "/admin/users" },
];

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    loading?: boolean;
}

function StatCard({ title, value, icon, color, loading }: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">{title}</p>
                    {loading ? (
                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    ) : (
                        <p className="text-3xl font-bold text-gray-800">{value}</p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export function AdminDashboard() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("/admin");
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch all content types directly
                const [articlesRes, videosRes, journalsRes, salamRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/articles`),
                    fetch(`${API_BASE_URL}/videos`),
                    fetch(`${API_BASE_URL}/journals`),
                    fetch(`${API_BASE_URL}/salam-articles`),
                ]);

                const [articles, videos, journals, salam] = await Promise.all([
                    articlesRes.ok ? articlesRes.json() : [],
                    videosRes.ok ? videosRes.json() : [],
                    journalsRes.ok ? journalsRes.json() : [],
                    salamRes.ok ? salamRes.json() : [],
                ]);

                // Calculate stats
                const totalContent = articles.length + videos.length + journals.length + salam.length;
                const pendingCount = [
                    ...articles.filter((a: any) => a.status === 'pending'),
                    ...videos.filter((v: any) => v.status === 'pending'),
                    ...journals.filter((j: any) => j.status === 'pending'),
                    ...salam.filter((s: any) => s.status === 'pending'),
                ].length;

                setStatsData({
                    totalContent,
                    counts: {
                        articles: articles.length,
                        videos: videos.length,
                        journals: journals.length,
                        salam: salam.length,
                    },
                    pending: {
                        total: pendingCount,
                    },
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        router.push("/");
    };

    const stats = [
        {
            title: "ทั้งหมด (4)",
            value: statsData?.totalContent ?? 0,
            icon: <Activity className="text-white" size={24} />,
            color: "bg-gray-600"
        },
        {
            title: "บทความ (1)",
            value: statsData?.counts?.articles ?? 0,
            icon: <FileText className="text-white" size={24} />,
            color: "bg-blue-500"
        },
        {
            title: "วิดีโอ (1)",
            value: statsData?.counts?.videos ?? 0,
            icon: <BookOpen className="text-white" size={24} />,
            color: "bg-purple-500"
        },
        {
            title: "วารสาร (1)",
            value: statsData?.counts?.journals ?? 0,
            icon: <BookOpen className="text-white" size={24} />,
            color: "bg-green-500"
        },
        {
            title: "สวัสดีอิสลาม (1)",
            value: statsData?.counts?.salam ?? 0,
            icon: <BookOpen className="text-white" size={24} />,
            color: "bg-orange-500"
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-50 flex flex-col ${sidebarCollapsed ? "w-20" : "w-64"
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <BookOpen size={22} className="text-white" />
                        </div>
                        {!sidebarCollapsed && (
                            <div className="overflow-hidden">
                                <h1 className="font-bold text-lg leading-tight">Admin Panel</h1>
                                <p className="text-xs text-slate-400">Islamic Portal</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="absolute -right-3 top-7 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                    >
                        {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setActiveItem(item.href)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeItem === item.href
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                        >
                            {item.icon}
                            {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            H
                        </div>
                        {!sidebarCollapsed && (
                            <div className="overflow-hidden">
                                <p className="font-medium text-sm truncate">Hanif Tuanmiden</p>
                                <p className="text-xs text-slate-400">Admin</p>
                            </div>
                        )}
                    </div>
                    {!sidebarCollapsed && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition w-full px-2"
                        >
                            <LogOut size={18} />
                            <span>ออกจากระบบ</span>
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"
                    }`}
            >
                <div className="p-8">
                    {/* Page Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <LayoutGrid className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                            <p className="text-gray-500">ภาพรวมของระบบ Islamic Portal</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} loading={loading} />
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">การดำเนินการด่วน</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link
                                href="/admin/content/new"
                                className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition group"
                            >
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                                    <FileText className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">เพิ่มบทความใหม่</p>
                                    <p className="text-sm text-gray-500">สร้างเนื้อหาใหม่</p>
                                </div>
                            </Link>
                            <Link
                                href="/admin/approvals"
                                className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition group"
                            >
                                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                                    <CheckCircle className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">ตรวจสอบเนื้อหา</p>
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                    ) : (
                                        <p className="text-sm text-gray-500">{statsData?.pending?.total ?? 0} รายการรอดำเนินการ</p>
                                    )}
                                </div>
                            </Link>
                            <Link
                                href="/admin/users"
                                className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition group"
                            >
                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                                    <Users className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">จัดการผู้ใช้</p>
                                    <p className="text-sm text-gray-500">ดูรายชื่อผู้ใช้งาน</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
