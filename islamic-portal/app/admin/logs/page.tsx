"use client";

import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Activity, Search, Filter, User, FileText, CheckCircle, XCircle, Edit, Trash2, LogIn, LogOut } from "lucide-react";
import { useState } from "react";

// Mock audit logs data
const mockLogs = [
    {
        id: 1,
        action: "create",
        resource: "article",
        resourceTitle: "หลักการถือศีลอดในเดือนรอมฎอน",
        user: "อ.มุหัมมัด อาลี",
        userAvatar: "M",
        timestamp: "วันนี้ 14:32",
        ip: "192.168.1.45",
    },
    {
        id: 2,
        action: "approve",
        resource: "video",
        resourceTitle: "การละหมาดสุนัตตะรอวีห์",
        user: "Hanif Tuanmiden",
        userAvatar: "H",
        timestamp: "วันนี้ 13:15",
        ip: "192.168.1.100",
    },
    {
        id: 3,
        action: "login",
        resource: "system",
        resourceTitle: "เข้าสู่ระบบ",
        user: "ผศ.ดร. มุหัมมัด อาลี",
        userAvatar: "ม",
        timestamp: "วันนี้ 12:00",
        ip: "192.168.1.50",
    },
    {
        id: 4,
        action: "edit",
        resource: "article",
        resourceTitle: "บทบาทของซะกาตในสังคม",
        user: "ผศ.ดร. มุหัมมัด อาลี",
        userAvatar: "ม",
        timestamp: "วันนี้ 11:45",
        ip: "192.168.1.50",
    },
    {
        id: 5,
        action: "reject",
        resource: "article",
        resourceTitle: "บทความทดสอบระบบ",
        user: "Hanif Tuanmiden",
        userAvatar: "H",
        timestamp: "เมื่อวาน 16:20",
        ip: "192.168.1.100",
    },
    {
        id: 6,
        action: "delete",
        resource: "video",
        resourceTitle: "วิดีโอทดสอบ #123",
        user: "Hanif Tuanmiden",
        userAvatar: "H",
        timestamp: "เมื่อวาน 15:00",
        ip: "192.168.1.100",
    },
    {
        id: 7,
        action: "create",
        resource: "category",
        resourceTitle: "หมวดหมู่: การศึกษา",
        user: "Hanif Tuanmiden",
        userAvatar: "H",
        timestamp: "เมื่อวาน 14:30",
        ip: "192.168.1.100",
    },
    {
        id: 8,
        action: "logout",
        resource: "system",
        resourceTitle: "ออกจากระบบ",
        user: "อ.ฟาฏิมะห์ ฮุสเซน",
        userAvatar: "ฟ",
        timestamp: "เมื่อวาน 12:00",
        ip: "192.168.1.75",
    },
];

type ActionType = "all" | "create" | "edit" | "delete" | "approve" | "reject" | "login" | "logout";

export default function LogsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState<ActionType>("all");

    const filteredLogs = mockLogs.filter(log => {
        const matchesSearch =
            log.resourceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = actionFilter === "all" || log.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    const getActionIcon = (action: string) => {
        const icons: Record<string, React.ReactNode> = {
            create: <FileText size={16} className="text-blue-600" />,
            edit: <Edit size={16} className="text-yellow-600" />,
            delete: <Trash2 size={16} className="text-red-600" />,
            approve: <CheckCircle size={16} className="text-green-600" />,
            reject: <XCircle size={16} className="text-red-600" />,
            login: <LogIn size={16} className="text-purple-600" />,
            logout: <LogOut size={16} className="text-gray-600" />,
        };
        return icons[action] || <Activity size={16} />;
    };

    const getActionBadge = (action: string) => {
        const styles: Record<string, string> = {
            create: "bg-blue-100 text-blue-700",
            edit: "bg-yellow-100 text-yellow-700",
            delete: "bg-red-100 text-red-700",
            approve: "bg-green-100 text-green-700",
            reject: "bg-red-100 text-red-700",
            login: "bg-purple-100 text-purple-700",
            logout: "bg-gray-100 text-gray-700",
        };
        const labels: Record<string, string> = {
            create: "สร้าง",
            edit: "แก้ไข",
            delete: "ลบ",
            approve: "อนุมัติ",
            reject: "ปฏิเสธ",
            login: "เข้าสู่ระบบ",
            logout: "ออกจากระบบ",
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[action]}`}>
                {labels[action]}
            </span>
        );
    };

    return (
        <AdminLayoutWrapper
            title="Audit Logs"
            description="ประวัติการใช้งานและการดำเนินการในระบบ"
            icon={<Activity className="text-blue-600" size={24} />}
        >
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="ค้นหาประวัติ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value as ActionType)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="all">ทุกการดำเนินการ</option>
                    <option value="create">สร้าง</option>
                    <option value="edit">แก้ไข</option>
                    <option value="delete">ลบ</option>
                    <option value="approve">อนุมัติ</option>
                    <option value="reject">ปฏิเสธ</option>
                    <option value="login">เข้าสู่ระบบ</option>
                    <option value="logout">ออกจากระบบ</option>
                </select>
            </div>

            {/* Logs Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {filteredLogs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
                                {/* User Avatar */}
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {log.userAvatar}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-800">{log.user}</span>
                                        {getActionBadge(log.action)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        {getActionIcon(log.action)}
                                        <span className="truncate">{log.resourceTitle}</span>
                                    </div>
                                </div>

                                {/* Meta */}
                                <div className="text-right text-sm text-gray-500 flex-shrink-0">
                                    <p>{log.timestamp}</p>
                                    <p className="text-xs text-gray-400">{log.ip}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-blue-600 font-semibold text-2xl">
                        {mockLogs.filter(l => l.action === "create").length}
                    </p>
                    <p className="text-blue-700 text-sm">สร้างใหม่</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-green-600 font-semibold text-2xl">
                        {mockLogs.filter(l => l.action === "approve").length}
                    </p>
                    <p className="text-green-700 text-sm">อนุมัติ</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <p className="text-yellow-600 font-semibold text-2xl">
                        {mockLogs.filter(l => l.action === "edit").length}
                    </p>
                    <p className="text-yellow-700 text-sm">แก้ไข</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                    <p className="text-red-600 font-semibold text-2xl">
                        {mockLogs.filter(l => l.action === "delete" || l.action === "reject").length}
                    </p>
                    <p className="text-red-700 text-sm">ลบ/ปฏิเสธ</p>
                </div>
            </div>
        </AdminLayoutWrapper>
    );
}
