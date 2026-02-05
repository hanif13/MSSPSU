// ============================================
// app/admin/categories/page.tsx
// หน้าจัดการหมวดหมู่ - แยกตามประเภทเนื้อหา
// ============================================

"use client";

import { useState, useMemo } from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Modal, ConfirmModal } from "@/components/admin/Modal";
import { Plus, Edit, Trash2, FolderOpen, FileText, Video, BookOpen, Heart } from "lucide-react";
import { generateId, contentTypes } from "@/lib/adminStore";

interface Category {
    id: string;
    name: string;
    description: string;
    contentCount: number;
    color: string;
    contentType: string; // article, video, journal, salam
}

const colorOptions = [
    { value: "blue", label: "น้ำเงิน", class: "bg-blue-500" },
    { value: "green", label: "เขียว", class: "bg-green-500" },
    { value: "purple", label: "ม่วง", class: "bg-purple-500" },
    { value: "orange", label: "ส้ม", class: "bg-orange-500" },
    { value: "pink", label: "ชมพู", class: "bg-pink-500" },
    { value: "red", label: "แดง", class: "bg-red-500" },
    { value: "yellow", label: "เหลือง", class: "bg-yellow-500" },
    { value: "teal", label: "เขียวน้ำเงิน", class: "bg-teal-500" },
];

// หมวดหมู่แยกตามประเภทเนื้อหา
const initialCategories: Category[] = [
    // บทความ
    { id: "1", name: "อากีดะห์", description: "หลักความเชื่อและศรัทธาในอิสลาม", contentCount: 12, color: "blue", contentType: "article" },
    { id: "2", name: "ฟิกห์", description: "นิติศาสตร์อิสลามและหลักปฏิบัติ", contentCount: 8, color: "green", contentType: "article" },
    { id: "3", name: "อัคลาก", description: "จริยธรรมและมารยาทในอิสลาม", contentCount: 15, color: "purple", contentType: "article" },
    { id: "4", name: "ซีเราะห์", description: "ประวัติศาสตร์อิสลามและชีวประวัติ", contentCount: 10, color: "orange", contentType: "article" },
    { id: "5", name: "ตัฟซีร", description: "อรรถาธิบายอัลกุรอาน", contentCount: 6, color: "pink", contentType: "article" },
    // วิดีโอ
    { id: "6", name: "บรรยายพิเศษ", description: "วิดีโอบรรยายพิเศษจากนักวิชาการ", contentCount: 5, color: "purple", contentType: "video" },
    { id: "7", name: "สารคดี", description: "สารคดีอิสลาม", contentCount: 3, color: "teal", contentType: "video" },
    { id: "8", name: "อบรม", description: "วิดีโอการอบรมและสัมมนา", contentCount: 7, color: "blue", contentType: "video" },
    // วารสาร
    { id: "9", name: "ฉบับที่ 15", description: "วารสารฉบับที่ 15 ปี 2567", contentCount: 4, color: "green", contentType: "journal" },
    { id: "10", name: "ฉบับที่ 14", description: "วารสารฉบับที่ 14 ปี 2566", contentCount: 6, color: "green", contentType: "journal" },
    { id: "11", name: "ฉบับที่ 13", description: "วารสารฉบับที่ 13 ปี 2566", contentCount: 5, color: "green", contentType: "journal" },
    // สวัสดีอิสลาม
    { id: "12", name: "พื้นฐาน", description: "ความรู้เบื้องต้นเกี่ยวกับอิสลาม", contentCount: 8, color: "orange", contentType: "salam" },
    { id: "13", name: "การปฏิบัติ", description: "หลักปฏิบัติสำหรับมุสลิมใหม่", contentCount: 6, color: "orange", contentType: "salam" },
    { id: "14", name: "คำถามที่พบบ่อย", description: "คำถามที่พบบ่อยเกี่ยวกับอิสลาม", contentCount: 10, color: "yellow", contentType: "salam" },
];

// Export for use in content page
export { initialCategories };
export type { Category };

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [selectedType, setSelectedType] = useState<string>("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "blue",
        contentType: "article",
    });

    // Filter categories by type
    const filteredCategories = useMemo(() => {
        if (selectedType === "all") return categories;
        return categories.filter(cat => cat.contentType === selectedType);
    }, [categories, selectedType]);

    // Group categories by type for display
    const categoriesByType = useMemo(() => {
        const grouped: Record<string, Category[]> = {};
        contentTypes.forEach(type => {
            grouped[type.value] = categories.filter(cat => cat.contentType === type.value);
        });
        return grouped;
    }, [categories]);

    const getColorClass = (color: string) => {
        return colorOptions.find(c => c.value === color)?.class || "bg-gray-500";
    };

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

    const handleAdd = () => {
        const newCategory: Category = {
            id: generateId(),
            name: formData.name,
            description: formData.description,
            color: formData.color,
            contentType: formData.contentType,
            contentCount: 0,
        };
        setCategories([...categories, newCategory]);
        setIsAddModalOpen(false);
        resetForm();
    };

    const handleEdit = () => {
        if (!selectedCategory) return;
        setCategories(categories.map((cat) =>
            cat.id === selectedCategory.id
                ? { ...cat, name: formData.name, description: formData.description, color: formData.color, contentType: formData.contentType }
                : cat
        ));
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        resetForm();
    };

    const handleDelete = () => {
        if (!selectedCategory) return;
        setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
        setSelectedCategory(null);
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description,
            color: category.color,
            contentType: category.contentType,
        });
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: "", description: "", color: "blue", contentType: "article" });
    };

    const totalContent = categories.reduce((sum, cat) => sum + cat.contentCount, 0);

    return (
        <AdminLayoutWrapper
            title="จัดการหมวดหมู่"
            subtitle="จัดการหมวดหมู่ตามประเภทเนื้อหา"
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
                        key={category.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
                    >
                        {/* Color Header */}
                        <div className={`h-2 ${getColorClass(category.color)}`} />

                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${getColorClass(category.color)} rounded-lg flex items-center justify-center`}>
                                        <FolderOpen className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{category.name}</h3>
                                        <p className="text-sm text-gray-500">{category.contentCount} เนื้อหา</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content Type Badge */}
                            <div className="flex items-center gap-2 mb-3">
                                {getTypeIcon(category.contentType)}
                                <span className="text-sm text-gray-600">{getTypeLabel(category.contentType)}</span>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">{category.description}</p>

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
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">ไม่มีหมวดหมู่ในประเภทนี้</p>
                </div>
            )}

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
                            value={formData.contentType}
                            onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">สี</label>
                        <div className="flex flex-wrap gap-2">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                    className={`w-10 h-10 rounded-lg ${color.class} ${formData.color === color.value ? "ring-2 ring-offset-2 ring-gray-400" : ""
                                        } transition`}
                                    title={color.label}
                                />
                            ))}
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
                            disabled={!formData.name}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
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
                            value={formData.contentType}
                            onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">สี</label>
                        <div className="flex flex-wrap gap-2">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                    className={`w-10 h-10 rounded-lg ${color.class} ${formData.color === color.value ? "ring-2 ring-offset-2 ring-gray-400" : ""
                                        } transition`}
                                    title={color.label}
                                />
                            ))}
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
                title="ยืนยันการลบหมวดหมู่"
                message={`คุณต้องการลบหมวดหมู่ "${selectedCategory?.name}" หรือไม่? เนื้อหาในหมวดหมู่นี้จะไม่ถูกลบ`}
                confirmText="ลบ"
                confirmColor="red"
            />
        </AdminLayoutWrapper>
    );
}
