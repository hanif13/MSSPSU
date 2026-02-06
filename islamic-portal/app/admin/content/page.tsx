// ============================================
// app/admin/content/page.tsx
// หน้าจัดการเนื้อหา - เชื่อมต่อ API จริง
// ============================================

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Modal, ConfirmModal } from "@/components/admin/Modal";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    FileText,
    Video,
    BookOpen,
    Heart,
    Youtube,
    ExternalLink,
    Loader2,
} from "lucide-react";
import {
    contentTypes,
    statusOptions,
} from "@/lib/adminStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Content item type matched with backend
interface ContentItem {
    _id: string;
    title: string;
    type: string;
    category: string;
    author: string;
    status: string;
    createdAt: string;
    views: number;
    content?: string;
    youtubeUrl?: string;
}

interface Category {
    _id: string;
    name: string;
    type: string;
}

export default function ContentManagementPage() {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state for editing
    const [formData, setFormData] = useState({
        title: "",
        type: "article",
        category: "",
        author: "",
        status: "draft",
        content: "",
        youtubeUrl: "",
    });

    // Fetch all content types
    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [articlesRes, videosRes, journalsRes, salamRes, categoriesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/articles`),
                fetch(`${API_BASE_URL}/videos`),
                fetch(`${API_BASE_URL}/journals`),
                fetch(`${API_BASE_URL}/salam-articles`),
                fetch(`${API_BASE_URL}/categories`),
            ]);

            const [articles, videos, journals, salam, cats] = await Promise.all([
                articlesRes.ok ? articlesRes.json() : [],
                videosRes.ok ? videosRes.json() : [],
                journalsRes.ok ? journalsRes.json() : [],
                salamRes.ok ? salamRes.json() : [],
                categoriesRes.ok ? categoriesRes.json() : [],
            ]);

            // Add type property to each item for identification
            const unifiedContent: ContentItem[] = [
                ...articles.map((item: any) => ({ ...item, type: 'article' })),
                ...videos.map((item: any) => ({ ...item, type: 'video' })),
                ...journals.map((item: any) => ({ ...item, type: 'journal' })),
                ...salam.map((item: any) => ({ ...item, type: 'salam' })),
            ];

            // Sort by createdAt descending
            unifiedContent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setContent(unifiedContent);
            setCategories(cats);
            setError("");
        } catch (err) {
            console.error("Error fetching content:", err);
            setError("ไม่สามารถโหลดข้อมูลเนื้อหาได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Get categories filtered by content type
    const filteredCategoriesForModal = useMemo(() => {
        return categories.filter(cat => cat.type === formData.type);
    }, [formData.type, categories]);

    // Filter content for display
    const filteredContent = content.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all" || item.type === typeFilter;
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    // Get type icon
    const getTypeIcon = (type: string) => {
        switch (type) {
            case "article": return <FileText size={16} className="text-blue-600" />;
            case "video": return <Video size={16} className="text-purple-600" />;
            case "journal": return <BookOpen size={16} className="text-green-600" />;
            case "salam": return <Heart size={16} className="text-orange-600" />;
            default: return <FileText size={16} />;
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
            draft: { bg: "bg-gray-100", text: "text-gray-600", label: "แบบร่าง" },
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "รออนุมัติ" },
            published: { bg: "bg-green-100", text: "text-green-700", label: "เผยแพร่แล้ว" },
            rejected: { bg: "bg-red-100", text: "text-red-700", label: "ถูกปฏิเสธ" },
        };
        const config = statusConfig[status] || statusConfig.draft;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Handle Edit
    const handleEdit = async () => {
        if (!selectedItem) return;
        try {
            setIsSubmitting(true);
            const endpointMap: Record<string, string> = {
                article: 'articles',
                video: 'videos',
                journal: 'journals',
                salam: 'salam-articles',
            };

            const endpoint = endpointMap[selectedItem.type];

            // Build type-specific payload
            const payload: any = {
                title: formData.title,
                category: formData.category,
                author: formData.author,
                status: formData.status,
            };

            if (selectedItem.type === 'video') {
                payload.description = formData.content; // Videos use 'description' instead of 'content'
                payload.youtubeUrl = formData.youtubeUrl;
            } else {
                payload.content = formData.content;
                // No youtubeUrl for non-video types
            }

            const res = await fetch(`${API_BASE_URL}/${endpoint}/${selectedItem._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                await fetchAllData();
                setIsEditModalOpen(false);
                setSelectedItem(null);
            } else {
                const errorData = await res.json();
                console.error("Update failed:", errorData);
                alert(`เกิดข้อผิดพลาดในการแก้ไขเนื้อหา: ${errorData.message || res.statusText}`);
            }
        } catch (err) {
            console.error("Error editing content:", err);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Delete
    const handleDelete = async () => {
        if (!selectedItem) return;
        try {
            setIsSubmitting(true);
            const endpointMap: Record<string, string> = {
                article: 'articles',
                video: 'videos',
                journal: 'journals',
                salam: 'salam-articles',
            };

            const endpoint = endpointMap[selectedItem.type];
            const res = await fetch(`${API_BASE_URL}/${endpoint}/${selectedItem._id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchAllData();
                setIsDeleteModalOpen(false);
                setSelectedItem(null);
            } else {
                alert("เกิดข้อผิดพลาดในการลบเนื้อหา");
            }
        } catch (err) {
            console.error("Error deleting content:", err);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open Edit Modal
    const openEditModal = (item: ContentItem) => {
        setSelectedItem(item);
        setFormData({
            title: item.title,
            type: item.type,
            category: item.category,
            author: item.author,
            status: item.status,
            content: item.content || "",
            youtubeUrl: item.youtubeUrl || "",
        });
        setIsEditModalOpen(true);
    };

    // Get YouTube video ID
    const getYoutubeVideoId = (url: string) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/);
        return match ? match[1] : null;
    };

    if (loading) {
        return (
            <AdminLayoutWrapper title="จัดการเนื้อหา" description="กำลังโหลด...">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </AdminLayoutWrapper>
        );
    }

    if (error) {
        return (
            <AdminLayoutWrapper title="จัดการเนื้อหา" description="เกิดข้อผิดพลาด">
                <div className="text-center py-20">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={fetchAllData} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        ลองใหม่
                    </button>
                </div>
            </AdminLayoutWrapper>
        );
    }

    return (
        <AdminLayoutWrapper
            title="จัดการเนื้อหา"
            description="ดูแลและจัดการเนื้อหาทั้งหมดในระบบ (บทความ, วิดีโอ, วารสาร, สวัสดีอิสลาม)"
        >
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหาตามชื่อเรื่องหรือผู้เขียน..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">ประเภททั้งหมด</option>
                        {contentTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">สถานะทั้งหมด</option>
                        {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select>

                    <Link
                        href="/admin/content/new"
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={20} className="text-white" />
                        <span className="hidden sm:inline text-white">เพิ่มเนื้อหา</span>
                    </Link>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ชื่อเนื้อหา</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ประเภท</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">หมวดหมู่</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ผู้เขียน</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">สถานะ</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">วันที่สร้าง</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">การดู</th>
                                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredContent.map((item) => (
                                <tr key={`${item.type}-${item._id}`} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800 line-clamp-1">{item.title}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(item.type)}
                                            <span className="text-sm text-gray-600">
                                                {contentTypes.find(t => t.value === item.type)?.label}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.author}</td>
                                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.views?.toLocaleString() || 0}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setIsViewModalOpen(true);
                                                }}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="ดูรายละเอียด"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                                title="แก้ไข"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
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

                {filteredContent.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">ไม่พบเนื้อหาที่ค้นหา</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={`แก้ไข ${contentTypes.find(t => t.value === formData.type)?.label}`}
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเนื้อหา *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
                            <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 flex items-center gap-2">
                                {getTypeIcon(formData.type)}
                                {contentTypes.find(t => t.value === formData.type)?.label}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">เลือกหมวดหมู่</option>
                                {filteredCategoriesForModal.map((cat) => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ผู้เขียน *</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Video: YouTube URL */}
                    {formData.type === "video" ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Youtube size={16} className="text-red-600" />
                                ลิงก์ YouTube *
                            </label>
                            <input
                                type="url"
                                value={formData.youtubeUrl}
                                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            {formData.youtubeUrl && getYoutubeVideoId(formData.youtubeUrl) && (
                                <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(formData.youtubeUrl)}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">เนื้อหา</label>
                            <RichTextEditor
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                placeholder="แก้ไขเนื้อหา..."
                                height={300}
                            />
                        </div>
                    )}

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
                            บันทึกการแก้ไข
                        </button>
                    </div>
                </div>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="รายละเอียดเนื้อหา"
                size="lg"
            >
                {selectedItem && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {getTypeIcon(selectedItem.type)}
                            <span className="text-sm text-gray-500">
                                {contentTypes.find(t => t.value === selectedItem.type)?.label}
                            </span>
                            {getStatusBadge(selectedItem.status)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{selectedItem.title}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">หมวดหมู่:</span>
                                <span className="ml-2 text-gray-800">{selectedItem.category}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">ผู้เขียน:</span>
                                <span className="ml-2 text-gray-800">{selectedItem.author}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">วันที่สร้าง:</span>
                                <span className="ml-2 text-gray-800">{formatDate(selectedItem.createdAt)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">การเข้าชม:</span>
                                <span className="ml-2 text-gray-800">{selectedItem.views?.toLocaleString() || 0} ครั้ง</span>
                            </div>
                        </div>

                        {/* Video Preview */}
                        {selectedItem.type === "video" && selectedItem.youtubeUrl && (
                            <div>
                                <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                    <Youtube size={16} className="text-red-600" />
                                    วิดีโอ YouTube
                                </p>
                                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(selectedItem.youtubeUrl)}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <a
                                    href={selectedItem.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
                                >
                                    เปิดใน YouTube <ExternalLink size={14} />
                                </a>
                            </div>
                        )}

                        {/* Content Preview */}
                        {selectedItem.type !== "video" && selectedItem.content && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500 mb-2">เนื้อหา:</p>
                                <div
                                    className="text-gray-700 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: selectedItem.content }}
                                />
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setIsViewModalOpen(false);
                                    openEditModal(selectedItem);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                แก้ไข
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="ยืนยันการลบ"
                message={`คุณต้องการลบ "${selectedItem?.title}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
                confirmText={isSubmitting ? "กำลังลบ..." : "ลบ"}
                confirmColor="red"
            />
        </AdminLayoutWrapper>
    );
}
