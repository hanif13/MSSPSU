// ============================================
// app/admin/users/page.tsx
// หน้าจัดการผู้ใช้ - เชื่อมต่อ API จริง
// ============================================

"use client";

import { useState, useEffect } from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Modal, ConfirmModal } from "@/components/admin/Modal";
import { Plus, Edit, Trash2, User as UserIcon, Search, CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const roleOptions = [
    { value: "admin", label: "ผู้ดูแลระบบ" },
    { value: "editor", label: "บรรณาธิการ" },
    { value: "writer", label: "นักเขียน" },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentUserRole, setCurrentUserRole] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        isActive: true,
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch users from API
    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role) setCurrentUserRole(role);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/users`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                setError("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && user.isActive) ||
            (statusFilter === "inactive" && !user.isActive);
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadge = (role: string) => {
        const roleConfig: Record<string, { bg: string; text: string; label: string }> = {
            admin: { bg: "bg-red-100", text: "text-red-700", label: "ผู้ดูแลระบบ" },
            editor: { bg: "bg-blue-100", text: "text-blue-700", label: "บรรณาธิการ" },
            writer: { bg: "bg-green-100", text: "text-green-700", label: "นักเขียน" },
            user: { bg: "bg-gray-100", text: "text-gray-700", label: "ผู้ใช้ทั่วไป" },
        };
        const config = roleConfig[role] || roleConfig.user;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleAdd = async () => {
        try {
            setIsSubmitting(true);

            if (formData.password !== formData.confirmPassword) {
                alert("รหัสผ่านไม่ตรงกัน");
                setIsSubmitting(false);
                return;
            }

            const res = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }),
            });

            if (res.ok) {
                await fetchUsers();
                setIsAddModalOpen(false);
                resetForm();
            } else {
                const data = await res.json();
                alert(data.message || "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้");
            }
        } catch (err) {
            console.error("Error adding user:", err);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async () => {
        if (!selectedUser) return;
        try {
            setIsSubmitting(true);
            const res = await fetch(`${API_BASE_URL}/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    isActive: formData.isActive,
                    ...(formData.password ? { password: formData.password } : {}),
                }),
            });

            if (res.ok) {
                await fetchUsers();
                setIsEditModalOpen(false);
                setSelectedUser(null);
                resetForm();
            } else {
                const data = await res.json();
                alert(data.message || "เกิดข้อผิดพลาดในการแก้ไขผู้ใช้");
            }
        } catch (err) {
            console.error("Error editing user:", err);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            setIsSubmitting(true);
            const res = await fetch(`${API_BASE_URL}/users/${selectedUser._id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchUsers();
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
            } else {
                alert("เกิดข้อผิดพลาดในการลบผู้ใช้");
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleStatus = async (user: User) => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isActive: !user.isActive,
                }),
            });

            if (res.ok) {
                await fetchUsers();
            }
        } catch (err) {
            console.error("Error toggling status:", err);
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            password: "",
            confirmPassword: "",
        });
        setShowPassword(false);
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: "", email: "", role: "", isActive: true, password: "", confirmPassword: "" });
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const activeCount = users.filter(u => u.isActive).length;
    const adminCount = users.filter(u => u.role === "admin").length;

    if (loading) {
        return (
            <AdminLayoutWrapper title="จัดการผู้ใช้" description="กำลังโหลด...">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </AdminLayoutWrapper>
        );
    }

    if (error) {
        return (
            <AdminLayoutWrapper title="จัดการผู้ใช้" description="เกิดข้อผิดพลาด">
                <div className="text-center py-20">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={fetchUsers} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        ลองใหม่
                    </button>
                </div>
            </AdminLayoutWrapper>
        );
    }

    return (
        <AdminLayoutWrapper
            title="จัดการผู้ใช้"
            description="จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง"
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
                    {currentUserRole === "admin" && (
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
                    )}
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
                                {currentUserRole === "admin" && (
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">จัดการ</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition">
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
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${user.isActive
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {user.isActive ? (
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
                                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>

                                    {currentUserRole === "admin" && (
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
                                    )}
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
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="กรอกรหัสผ่าน"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน *</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="กรอกรหัสผ่านอีกครั้ง"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">บทบาท *</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">เลือกบทบาท</option>
                            {roleOptions.map((role) => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
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
                            disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role || isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">เปลี่ยนรหัสผ่าน (ถ้ามี)</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="กรอกรหัสผ่านใหม่"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
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
                                value={formData.isActive ? "active" : "inactive"}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
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
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
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
