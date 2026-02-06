"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Modal, ConfirmModal } from "@/components/admin/Modal";
import {
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    FileText,
    Video,
    BookOpen,
    Heart,
    User,
    Loader2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3001/api";

interface PendingItem {
    _id: string;
    title: string;
    type: string;
    category: string;
    author: string;
    authorEmail?: string;
    submittedAt: string;
    excerpt: string;
    status: "pending" | "published" | "rejected";
}

const endpointMap: Record<string, string> = {
    article: "articles",
    video: "videos",
    journal: "journals",
    salam: "salam-articles",
};

export default function ApprovalsPage() {
    const [items, setItems] = useState<PendingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "published" | "rejected">("pending");
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState("");

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role) setCurrentUserRole(role);
        fetchAllPending();
    }, []);

    const fetchAllPending = async () => {
        setLoading(true);
        try {
            const types = ['article', 'video', 'journal', 'salam'];
            const allResults = await Promise.all(
                types.map(async (type) => {
                    const endpoint = endpointMap[type];
                    const res = await fetch(`${API_BASE_URL}/${endpoint}`);
                    if (res.ok) {
                        const data = await res.json();
                        return data.map((item: any) => ({
                            ...item,
                            type,
                            submittedAt: item.createdAt,
                        }));
                    }
                    return [];
                })
            );

            const combined = allResults.flat().sort((a, b) =>
                new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
            );
            setItems(combined);
        } catch (err) {
            console.error("Error fetching pending items:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = useMemo(() => {
        if (filter === "all") return items;
        return items.filter((item) => item.status === (filter === "published" ? "published" : filter));
    }, [items, filter]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "article": return <FileText size={18} className="text-blue-600" />;
            case "video": return <Video size={18} className="text-purple-600" />;
            case "journal": return <BookOpen size={18} className="text-green-600" />;
            case "salam": return <Heart size={18} className="text-orange-600" />;
            default: return <FileText size={18} />;
        }
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            article: "บทความ",
            video: "วิดีโอ",
            journal: "วารสาร",
            salam: "สวัสดีอิสลาม",
        };
        return labels[type] || type;
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "รออนุมัติ", icon: <Clock size={14} /> },
            published: { bg: "bg-green-100", text: "text-green-700", label: "อนุมัติแล้ว", icon: <CheckCircle size={14} /> },
            rejected: { bg: "bg-red-100", text: "text-red-700", label: "ปฏิเสธแล้ว", icon: <XCircle size={14} /> },
        };
        const c = config[status] || config.pending;
        return (
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
                {c.icon}
                {c.label}
            </span>
        );
    };

    const handleAction = async (status: "published" | "rejected") => {
        if (!selectedItem) return;
        setSubmitting(true);
        try {
            const endpoint = endpointMap[selectedItem.type];
            const res = await fetch(`${API_BASE_URL}/${endpoint}/${selectedItem._id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                setItems(items.map(item =>
                    item._id === selectedItem._id ? { ...item, status } : item
                ));
                setIsApproveModalOpen(false);
                setIsRejectModalOpen(false);
                setSelectedItem(null);
                setRejectReason("");
            }
        } catch (err) {
            console.error(`Error updating status to ${status}:`, err);
        } finally {
            setSubmitting(false);
        }
    };

    const stats = useMemo(() => {
        return {
            total: items.length,
            pending: items.filter(i => i.status === "pending").length,
            published: items.filter(i => i.status === "published").length,
            rejected: items.filter(i => i.status === "rejected").length,
        };
    }, [items]);

    return (
        <AdminLayoutWrapper
            title="อนุมัติ/ปฏิเสธเนื้อหา"
            description="ตรวจสอบและอนุมัติเนื้อหาที่รอการพิจารณา"
        >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">ทั้งหมด</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-5 shadow-sm border border-yellow-100">
                    <p className="text-sm text-yellow-600 mb-1">รออนุมัติ</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-5 shadow-sm border border-green-100">
                    <p className="text-sm text-green-600 mb-1">อนุมัติแล้ว</p>
                    <p className="text-2xl font-bold text-green-700">{stats.published}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 shadow-sm border border-red-100">
                    <p className="text-sm text-red-600 mb-1">ปฏิเสธแล้ว</p>
                    <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { value: "pending", label: "รออนุมัติ", count: stats.pending },
                    { value: "published", label: "อนุมัติแล้ว", count: stats.published },
                    { value: "rejected", label: "ปฏิเสธแล้ว", count: stats.rejected },
                    { value: "all", label: "ทั้งหมด", count: stats.total },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value as any)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === tab.value
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Items List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                    </div>
                ) : filteredItems.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    {getTypeIcon(item.type)}
                                    <span className="text-sm text-gray-500">{getTypeLabel(item.type)}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-sm text-gray-500">{item.category}</span>
                                    {getStatusBadge(item.status)}
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.excerpt}</p>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>{item.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{new Date(item.submittedAt).toLocaleDateString("th-TH", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {item.status === "pending" && currentUserRole !== "writer" && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setIsApproveModalOpen(true);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                        >
                                            <CheckCircle size={18} />
                                            อนุมัติ
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setIsRejectModalOpen(true);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            <XCircle size={18} />
                                            ปฏิเสธ
                                        </button>
                                    </>
                                )}
                                <Link
                                    href={`/admin/content`}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                >
                                    <Eye size={18} />
                                    ดูรายละเอียด
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {!loading && filteredItems.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">ไม่มีเนื้อหาในหมวดนี้</p>
                    </div>
                )}
            </div>

            {/* Approve Confirmation */}
            <ConfirmModal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={() => handleAction("published")}
                title="ยืนยันการอนุมัติ"
                message={`คุณต้องการอนุมัติ "${selectedItem?.title}" หรือไม่? เนื้อหานี้จะถูกเผยแพร่สู่สาธารณะ`}
                confirmText={submitting ? "กำลังดำเนินการ..." : "อนุมัติ"}
                confirmColor="green"
            />

            {/* Reject Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="ปฏิเสธเนื้อหา"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        คุณกำลังปฏิเสธ: <strong>{selectedItem?.title}</strong>
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">เหตุผลในการปฏิเสธ</label>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
                            placeholder="กรุณาระบุเหตุผล (ไม่บังคับ)"
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setIsRejectModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            disabled={submitting}
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={() => handleAction("rejected")}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            disabled={submitting}
                        >
                            {submitting ? "กำลังดำเนินการ..." : "ปฏิเสธ"}
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayoutWrapper>
    );
}
