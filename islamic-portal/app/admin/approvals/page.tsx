// ============================================
// app/admin/approvals/page.tsx
// หน้าอนุมัติ/ปฏิเสธเนื้อหา - พร้อมฟังก์ชันครบ
// ============================================

"use client";

import { useState } from "react";
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
} from "lucide-react";

interface PendingItem {
    id: string;
    title: string;
    type: string;
    category: string;
    author: string;
    authorEmail: string;
    submittedAt: string;
    excerpt: string;
    status: "pending" | "approved" | "rejected";
}

const initialPendingItems: PendingItem[] = [
    {
        id: "1",
        title: "จริยธรรมอิสลามในชีวิตประจำวัน",
        type: "article",
        category: "อัคลาก",
        author: "ดร.ไอซะห์ นูรี",
        authorEmail: "aisah@islamic.edu",
        submittedAt: "20 ม.ค. 2567, 14:30",
        excerpt: "บทความเกี่ยวกับการนำหลักจริยธรรมอิสลามมาประยุกต์ใช้ในชีวิตประจำวัน...",
        status: "pending",
    },
    {
        id: "2",
        title: "การถือศีลอด: หลักการและประโยชน์",
        type: "article",
        category: "ฟิกห์",
        author: "อ.มุฮัมมัด อาลี",
        authorEmail: "muhammad@islamic.edu",
        submittedAt: "19 ม.ค. 2567, 09:15",
        excerpt: "บทความอธิบายหลักการถือศีลอดในเดือนรอมฎอนและประโยชน์ต่อร่างกายและจิตใจ...",
        status: "pending",
    },
    {
        id: "3",
        title: "ประวัติศาสตร์อิสลามในเอเชียตะวันออกเฉียงใต้",
        type: "video",
        category: "ซีเราะห์",
        author: "อ.อิสมาอีล",
        authorEmail: "ismail@islamic.edu",
        submittedAt: "18 ม.ค. 2567, 16:45",
        excerpt: "วิดีโอสารคดีเกี่ยวกับการเข้ามาของอิสลามในภูมิภาคเอเชียตะวันออกเฉียงใต้...",
        status: "pending",
    },
    {
        id: "4",
        title: "การดูแลครอบครัวในอิสลาม",
        type: "salam",
        category: "การปฏิบัติ",
        author: "ทีมบรรณาธิการ",
        authorEmail: "editor@islamic.edu",
        submittedAt: "17 ม.ค. 2567, 11:20",
        excerpt: "บทความสำหรับผู้เริ่มต้นเกี่ยวกับบทบาทของครอบครัวในอิสลาม...",
        status: "pending",
    },
];

export default function ApprovalsPage() {
    const [items, setItems] = useState<PendingItem[]>(initialPendingItems);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const filteredItems = items.filter((item) => {
        if (filter === "all") return true;
        return item.status === filter;
    });

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
            approved: { bg: "bg-green-100", text: "text-green-700", label: "อนุมัติแล้ว", icon: <CheckCircle size={14} /> },
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

    const handleApprove = () => {
        if (!selectedItem) return;
        setItems(items.map((item) =>
            item.id === selectedItem.id ? { ...item, status: "approved" as const } : item
        ));
        setIsApproveModalOpen(false);
        setSelectedItem(null);
    };

    const handleReject = () => {
        if (!selectedItem) return;
        setItems(items.map((item) =>
            item.id === selectedItem.id ? { ...item, status: "rejected" as const } : item
        ));
        setIsRejectModalOpen(false);
        setSelectedItem(null);
        setRejectReason("");
    };

    const pendingCount = items.filter(i => i.status === "pending").length;
    const approvedCount = items.filter(i => i.status === "approved").length;
    const rejectedCount = items.filter(i => i.status === "rejected").length;

    return (
        <AdminLayoutWrapper
            title="อนุมัติ/ปฏิเสธเนื้อหา"
            subtitle="ตรวจสอบและอนุมัติเนื้อหาที่รอการพิจารณา"
        >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">ทั้งหมด</p>
                    <p className="text-2xl font-bold text-gray-800">{items.length}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-5 shadow-sm border border-yellow-100">
                    <p className="text-sm text-yellow-600 mb-1">รออนุมัติ</p>
                    <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-5 shadow-sm border border-green-100">
                    <p className="text-sm text-green-600 mb-1">อนุมัติแล้ว</p>
                    <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 shadow-sm border border-red-100">
                    <p className="text-sm text-red-600 mb-1">ปฏิเสธแล้ว</p>
                    <p className="text-2xl font-bold text-red-700">{rejectedCount}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {[
                    { value: "pending", label: "รออนุมัติ", count: pendingCount },
                    { value: "approved", label: "อนุมัติแล้ว", count: approvedCount },
                    { value: "rejected", label: "ปฏิเสธแล้ว", count: rejectedCount },
                    { value: "all", label: "ทั้งหมด", count: items.length },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value as typeof filter)}
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
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
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
                                        <span>{item.submittedAt}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/approvals/${item.id}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                                >
                                    <Eye size={18} />
                                    ดูรายละเอียด
                                </Link>

                                {item.status === "pending" && (
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
                            </div>
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">ไม่มีเนื้อหาในหมวดนี้</p>
                    </div>
                )}
            </div>

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
                            <span className="text-sm text-gray-500">{getTypeLabel(selectedItem.type)}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{selectedItem.category}</span>
                            {getStatusBadge(selectedItem.status)}
                        </div>

                        <h3 className="text-xl font-bold text-gray-800">{selectedItem.title}</h3>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-600">{selectedItem.excerpt}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">ผู้ส่ง:</span>
                                <span className="ml-2 text-gray-800">{selectedItem.author}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">อีเมล:</span>
                                <span className="ml-2 text-gray-800">{selectedItem.authorEmail}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">วันที่ส่ง:</span>
                                <span className="ml-2 text-gray-800">{selectedItem.submittedAt}</span>
                            </div>
                        </div>

                        {selectedItem.status === "pending" && (
                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setIsViewModalOpen(false);
                                        setIsRejectModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    ปฏิเสธ
                                </button>
                                <button
                                    onClick={() => {
                                        setIsViewModalOpen(false);
                                        setIsApproveModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    อนุมัติ
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Approve Confirmation */}
            <ConfirmModal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleApprove}
                title="ยืนยันการอนุมัติ"
                message={`คุณต้องการอนุมัติ "${selectedItem?.title}" หรือไม่? เนื้อหานี้จะถูกเผยแพร่สู่สาธารณะ`}
                confirmText="อนุมัติ"
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
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleReject}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            ปฏิเสธ
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayoutWrapper>
    );
}
