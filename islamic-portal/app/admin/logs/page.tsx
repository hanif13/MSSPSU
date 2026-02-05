"use client";

import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Activity, Search, Filter, User, FileText, CheckCircle, XCircle, Edit, Trash2, LogIn, LogOut, Loader2, Video, BookOpen, Heart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const API_BASE_URL = "http://localhost:3001/api";

interface AuditLog {
    _id: string;
    action: string;
    module: string;
    user: string;
    role?: string;
    details: string;
    metadata?: string;
    createdAt: string;
}

type ActionFilterType = "all" | "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT" | "LOGIN" | "LOGOUT";

export default function LogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState<ActionFilterType>("all");

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/logs`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (err) {
            console.error("Error fetching logs:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch =
                log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.module.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesAction = actionFilter === "all" || log.action.includes(actionFilter);
            return matchesSearch && matchesAction;
        });
    }, [logs, searchTerm, actionFilter]);

    const getActionIcon = (action: string) => {
        if (action.includes("CREATE")) return <FileText size={16} className="text-blue-600" />;
        if (action.includes("UPDATE")) return <Edit size={16} className="text-yellow-600" />;
        if (action.includes("DELETE")) return <Trash2 size={16} className="text-red-600" />;
        if (action.includes("APPROVE")) return <CheckCircle size={16} className="text-green-600" />;
        if (action.includes("REJECT")) return <XCircle size={16} className="text-red-600" />;
        if (action.includes("LOGIN")) return <LogIn size={16} className="text-purple-600" />;
        if (action.includes("LOGOUT")) return <LogOut size={16} className="text-gray-600" />;

        return <Activity size={16} />;
    };

    const getActionStyle = (action: string) => {
        if (action.includes("CREATE")) return { bg: "bg-blue-100", text: "text-blue-700", label: "สร้าง" };
        if (action.includes("UPDATE")) return { bg: "bg-yellow-100", text: "text-yellow-700", label: "แก้ไข" };
        if (action.includes("DELETE")) return { bg: "bg-red-100", text: "text-red-700", label: "ลบ" };
        if (action.includes("APPROVE")) return { bg: "bg-green-100", text: "text-green-700", label: "อนุมัติ" };
        if (action.includes("REJECT")) return { bg: "bg-red-100", text: "text-red-700", label: "ปฏิเสธ" };
        if (action.includes("LOGIN")) return { bg: "bg-purple-100", text: "text-purple-700", label: "เข้าสู่ระบบ" };
        if (action.includes("LOGOUT")) return { bg: "bg-gray-100", text: "text-gray-700", label: "ออกจากระบบ" };

        return { bg: "bg-gray-100", text: "text-gray-700", label: action };
    };

    const getModuleIcon = (module: string) => {
        const m = module.toLowerCase();
        if (m.includes("article")) return <FileText size={14} />;
        if (m.includes("video")) return <Video size={14} />;
        if (m.includes("journal")) return <BookOpen size={14} />;
        if (m.includes("salam")) return <Heart size={14} />;
        if (m.includes("user")) return <User size={14} />;
        return <Activity size={14} />;
    };

    const stats = useMemo(() => {
        return {
            create: logs.filter(l => l.action.includes("CREATE")).length,
            approve: logs.filter(l => l.action.includes("APPROVE")).length,
            update: logs.filter(l => l.action.includes("UPDATE")).length,
            delete: logs.filter(l => l.action.includes("DELETE") || l.action.includes("REJECT")).length,
        };
    }, [logs]);

    return (
        <AdminLayoutWrapper
            title="Audit Logs"
            description="ประวัติการใช้งานและการดำเนินการในระบบจริง"
            icon={<Activity className="text-blue-600" size={24} />}
        >
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="ค้นหาประวัติ (ชื่อผู้ใช้, กิจกรรม, หมวดหมู่)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value as ActionFilterType)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="all">ทุกการดำเนินการ</option>
                    <option value="CREATE">สร้าง</option>
                    <option value="UPDATE">แก้ไข</option>
                    <option value="DELETE">ลบ</option>
                    <option value="APPROVE">อนุมัติ</option>
                    <option value="REJECT">ปฏิเสธ</option>
                    <option value="LOGIN">เข้าสู่ระบบ</option>
                    <option value="LOGOUT">ออกจากระบบ</option>
                </select>
                <button
                    onClick={fetchLogs}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
                >
                    <Activity size={18} />
                    รีเฟรช
                </button>
            </div>

            {/* Logs Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-500">กำลังโหลดประวัติการใช้งาน...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredLogs.map((log) => {
                            const style = getActionStyle(log.action);
                            return (
                                <div key={log._id} className="p-4 hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        {/* User Avatar */}
                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {log.user.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-gray-800">{log.user}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${style.bg} ${style.text}`}>
                                                    {style.label}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <div className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                    {getModuleIcon(log.module)}
                                                    {log.module}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                {getActionIcon(log.action)}
                                                <span className="truncate">{log.details}</span>
                                            </div>
                                        </div>

                                        {/* Meta */}
                                        <div className="text-right text-xs text-gray-500 flex-shrink-0">
                                            <p className="font-medium">
                                                {new Date(log.createdAt).toLocaleTimeString("th-TH", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })} น.
                                            </p>
                                            <p className="text-gray-400">
                                                {new Date(log.createdAt).toLocaleDateString("th-TH", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredLogs.length === 0 && (
                            <div className="text-center py-20">
                                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">ไม่พบประวัติการใช้งานที่ค้นหา</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                    <p className="text-blue-600 font-bold text-2xl">{stats.create}</p>
                    <p className="text-blue-700 text-xs font-medium">กิจกรรมการสร้าง</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                    <p className="text-green-600 font-bold text-2xl">{stats.approve}</p>
                    <p className="text-green-700 text-xs font-medium">กิจกรรมการอนุมัติ</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-100">
                    <p className="text-yellow-600 font-bold text-2xl">{stats.update}</p>
                    <p className="text-yellow-700 text-xs font-medium">กิจกรรมการแก้ไข</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                    <p className="text-red-600 font-bold text-2xl">{stats.delete}</p>
                    <p className="text-red-700 text-xs font-medium">การลบ/ปฏิเสธ</p>
                </div>
            </div>
        </AdminLayoutWrapper>
    );
}
