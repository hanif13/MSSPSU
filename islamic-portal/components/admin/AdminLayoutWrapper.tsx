"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";

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

interface AdminLayoutWrapperProps {
    children: React.ReactNode;
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export function AdminLayoutWrapper({ children, title, description, icon }: AdminLayoutWrapperProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "Admin", role: "Administrator" });
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const name = localStorage.getItem("userName");
        const role = localStorage.getItem("userRole");

        if (name) {
            setUserInfo({
                name: name,
                role: role === "admin" ? "ผู้ดูแลระบบ" : role === "editor" ? "บรรณาธิการ" : "ผู้ใช้งาน"
            });
        }
    }, []);

    const handleLogout = () => {
        // Clear login state
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        // Redirect to homepage
        router.push("/");
    };

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
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.href
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
                            {userInfo.name.charAt(0).toUpperCase()}
                        </div>
                        {!sidebarCollapsed && (
                            <div className="overflow-hidden">
                                <p className="font-medium text-sm truncate">{userInfo.name}</p>
                                <p className="text-xs text-slate-400">{userInfo.role}</p>
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
                            {icon || <LayoutGrid className="text-blue-600" size={24} />}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                            <p className="text-gray-500">{description}</p>
                        </div>
                    </div>

                    {/* Page Content */}
                    {children}
                </div>
            </main>
        </div>
    );
}
