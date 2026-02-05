// ============================================
// app/admin/users/page.tsx
// หน้าจัดการผู้ใช้ - พร้อม CRUD ครบ
// ============================================

"use client";

import { useState } from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Modal, ConfirmModal } from "@/components/admin/Modal";
import { Plus, Edit, Trash2, User as UserIcon, Search, Shield, CheckCircle, XCircle } from "lucide-react";
import { generateId, roleOptions, formatDate } from "@/lib/adminStore";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    createdAt: string;
    lastLogin: string;
}

const initialUsers: User[] = [
    { id: "1", name: "อ.ดร. อับดุลเลาะ สะอะดี", email: "abdullah@islamic.edu", role: "admin", status: "active", createdAt: "1 ม.ค. 2567", lastLogin: "วันนี้" },
    { id: "2", name: "อ.ซอลิห์ มะห์มูด", email: "solih@islamic.edu", role: "editor", status: "active", createdAt: "15 ม.ค. 2567", lastLogin: "เมื่อวาน" },
    { id: "3", name: "นางสาว ฟาติมะห์ ยูซุฟ", email: "fatimah@islamic.edu", role: "author", status: "active", createdAt: "1 ก.พ. 2567", lastLogin: "3 วันที่แล้ว" },
    { id: "4", name: "นาย อิบรอฮีม อาลี", email: "ibrahim@islamic.edu", role: "viewer", status: "inactive", createdAt: "10 ก.พ. 2567", lastLogin: "1 สัปดาห์ที่แล้ว" },
    { id: "5", name: "ดร. ยูซุฟ อัลมุสลิม", email: "yusuf@islamic.edu", role: "editor", status: "active", createdAt: "20 ก.พ. 2567", lastLogin: "2 วันที่แล้ว" },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "viewer",
        status: "active" as "active" | "inactive",
        password: "",
    });

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadge = (role: string) => {
        const roleConfig: Record<string, { bg: string; text: string; label: string }> = {
            admin: { bg: "bg-red-100", text: "text-red-700", label: "ผู้ดูแลระบบ" },
            editor: { bg: "bg-blue-100", text: "text-blue-700", label: "บรรณาธิการ" },
            author: { bg: "bg-green-100", text: "text-green-700", label: "ผู้เขียน" },
            viewer: { bg: "bg-gray-100", text: "text-gray-700", label: "ผู้อ่าน" },
        };
        const config = roleConfig[role] || roleConfig.viewer;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const handleAdd = () => {
        const newUser: User = {
            id: generateId(),
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            createdAt: formatDate(new Date()),
            lastLogin: "-",
        };
        setUsers([newUser, ...users]);
        setIsAddModalOpen(false);
        resetForm();
    };

    const handleEdit = () => {
        if (!selectedUser) return;
        setUsers(users.map((user) =>
            user.id === selectedUser.id
                ? { ...user, name: formData.name, email: formData.email, role: formData.role, status: formData.status }
                : user
        ));
        setIsEditModalOpen(false);
        setSelectedUser(null);
        resetForm();
    };

    const handleDelete = () => {
        if (!selectedUser) return;
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setSelectedUser(null);
    };

    const toggleStatus = (user: User) => {
        setUsers(users.map((u) =>
            u.id === user.id
                ? { ...u, status: u.status === "active" ? "inactive" : "active" }
                : u
        ));
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            password: "",
        });
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: "", email: "", role: "viewer", status: "active", password: "" });
    };

    const activeCount = users.filter(u => u.status === "active").length;
    const adminCount = users.filter(u => u.role === "admin").length;

    return (
        <AdminLayoutWrapper
            title="จัดการผู้ใช้"
            subtitle="จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง"
        >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">ผู้ใช้ทั้งหมด</p>
                    <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">ใช้งานอยู่</p>
                    <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">ผู้ดูแลระบบ</p>
                    <p className="text-2xl font-bold text-red-600">{adminCount}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm flex items-center">
                    <button
                        onClick={() => {
                            resetForm();
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full justify-center"
                    >
                        <Plus size={20} />
                        เพิ่มผู้ใช้ใหม่
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหาผู้ใช้..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">บทบาททั้งหมด</option>
                    {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="active">ใช้งานอยู่</option>
                    <option value="inactive">ไม่ใช้งาน</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ผู้ใช้</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">บทบาท</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สถานะ</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">วันที่สร้าง</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">เข้าสู่ระบบล่าสุด</th>
                                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                <UserIcon className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(user)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${user.status === "active"
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {user.status === "active" ? (
                                                <>
                                                    <CheckCircle size={14} />
                                                    ใช้งานอยู่
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={14} />
                                                    ไม่ใช้งาน
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.createdAt}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                                title="แก้ไข"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="ลบ"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">ไม่พบผู้ใช้ที่ค้นหา</p>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="เพิ่มผู้ใช้ใหม่"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="กรอกชื่อผู้ใช้"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="example@domain.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน *</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="กรอกรหัสผ่าน"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">บทบาท *</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {roleOptions.map((role) => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">ใช้งานอยู่</option>
                                <option value="inactive">ไม่ใช้งาน</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={!formData.name || !formData.email || !formData.password}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            เพิ่มผู้ใช้
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="แก้ไขข้อมูลผู้ใช้"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">บทบาท *</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {roleOptions.map((role) => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">ใช้งานอยู่</option>
                                <option value="inactive">ไม่ใช้งาน</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleEdit}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            บันทึก
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="ยืนยันการลบผู้ใช้"
                message={`คุณต้องการลบผู้ใช้ "${selectedUser?.name}" หรือไม่?`}
                confirmText="ลบ"
                confirmColor="red"
            />
        </AdminLayoutWrapper>
    );
}
