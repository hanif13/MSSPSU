// ============================================
// app/admin/categories/page.tsx
// หน้าจัดการหมวดหมู่ - เชื่อมต่อ API จริง
// ============================================

"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Modal, ConfirmModal } from "@/components/admin/Modal";
import { Plus, Edit, Trash2, FolderOpen, FileText, Video, BookOpen, Heart, Loader2 } from "lucide-react";
import { contentTypes } from "@/lib/adminStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Category {
    _id: string;
    name: string;
    description: string;
    contentCount?: number;
    type: string; // article, video, journal, salam
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string>("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "article",
    });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Filter categories by type
    const filteredCategories = useMemo(() => {
        if (selectedType === "all") return categories;
        return categories.filter(cat => cat.type === selectedType);
    }, [categories, selectedType]);

    // Group categories by type for display
    const categoriesByType = useMemo(() => {
        const grouped: Record<string, Category[]> = {};
        contentTypes.forEach(type => {
            grouped[type.value] = categories.filter(cat => cat.type === type.value);
        });
        return grouped;
    }, [categories]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "article": return <FileText size={16} className="text-blue-600" />;
            case "video": return <Video size={16} className="text-purple-600" />;
            case "journal": return <BookOpen size={16} className="text-green-600" />;
            case "salam": return <Heart size={16} className="text-orange-600" />;
            default: return <FileText size={16} />;
        }
    };

    const getTypeLabel = (type: string) => {
        return contentTypes.find(t => t.value === type)?.label || type;
    };

    const handleAdd = async () => {
        if (!formData.name) return;
        try {
            setIsSubmitting(true);
            const res = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    type: formData.type,
                    slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
                }),
            });

            if (res.ok) {
                await fetchCategories();
                setIsAddModalOpen(false);
                resetForm();
            } else {
                const errorData = await res.json();
                console.error("Add category failed:", errorData);
                alert(`เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่: ${errorData.message || res.statusText}`);
            }
        } catch (err) {
            console.error("Error adding category:", err);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async () => {
        if (!selectedCategory || !formData.name) return;
        try {
            setIsSubmitting(true);
            const res = await fetch(`${API_BASE_URL}/categories/${selectedCategory._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    type: formData.type,
                }),
            });

            if (res.ok) {
                await fetchCategories();
                setIsEditModalOpen(false);
                setSelectedCategory(null);
                resetForm();
            }
        } catch (err) {
            console.error("Error editing category:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        try {
            setIsSubmitting(true);
            const res = await fetch(`${API_BASE_URL}/categories/${selectedCategory._id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchCategories();
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
            }
        } catch (err) {
            console.error("Error deleting category:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description,
            type: category.type,
        });
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: "", description: "", type: "article" });
    };

    const totalContent = categories.reduce((sum, cat) => sum + (cat.contentCount || 0), 0);

    return (
        <AdminLayoutWrapper
            title="จัดการหมวดหมู่"
            description="จัดการหมวดหมู่ตามประเภทเนื้อหา"
        >
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">จำนวนหมวดหมู่</p>
                    <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">เนื้อหาทั้งหมด</p>
                    <p className="text-2xl font-bold text-gray-800">{totalContent}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">ประเภทเนื้อหา</p>
                    <p className="text-2xl font-bold text-gray-800">{contentTypes.length}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-center">
                    <button
                        onClick={() => {
                            resetForm();
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full justify-center"
                    >
                        <Plus size={20} />
                        เพิ่มหมวดหมู่ใหม่
                    </button>
                </div>
            </div>

            {/* Type Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedType("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${selectedType === "all"
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    ทั้งหมด ({categories.length})
                </button>
                {contentTypes.map((type) => (
                    <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${selectedType === type.value
                            ? "bg-gray-800 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {getTypeIcon(type.value)}
                        {type.label} ({categoriesByType[type.value]?.length || 0})
                    </button>
                ))}
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                    <div
                        key={category._id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border-t-4 border-blue-500"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <FolderOpen className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{category.name}</h3>
                                        <p className="text-sm text-gray-500">{category.contentCount || 0} เนื้อหา</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content Type Badge */}
                            <div className="flex items-center gap-2 mb-3">
                                {getTypeIcon(category.type)}
                                <span className="text-sm text-gray-600">{getTypeLabel(category.type)}</span>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(category)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition text-sm"
                                >
                                    <Edit size={16} />
                                    แก้ไข
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition text-sm"
                                >
                                    <Trash2 size={16} />
                                    ลบ
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {!loading && filteredCategories.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm col-span-full">
                        <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">ไม่มีหมวดหมู่ในประเภทนี้</p>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center py-20 col-span-full">
                        <Loader2 size={32} className="animate-spin text-blue-600" />
                    </div>
                )}
            </div>

            {/* Add Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="เพิ่มหมวดหมู่ใหม่"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทเนื้อหา *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            {contentTypes.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหมวดหมู่ *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="เช่น อากีดะห์, ฟิกห์"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="คำอธิบายหมวดหมู่"
                        />
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
                            disabled={!formData.name || isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                            เพิ่มหมวดหมู่
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="แก้ไขหมวดหมู่"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทเนื้อหา *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            {contentTypes.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหมวดหมู่ *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
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
                title="ยืนยันการลบหมวดหมู่"
                message={`คุณต้องการลบหมวดหมู่ "${selectedCategory?.name}" หรือไม่? เนื้อหาในหมวดหมู่นี้จะไม่ถูกลบ`}
                confirmText={isSubmitting ? "กำลังลบ..." : "ลบ"}
                confirmColor="red"
            />
        </AdminLayoutWrapper>
    );
}
