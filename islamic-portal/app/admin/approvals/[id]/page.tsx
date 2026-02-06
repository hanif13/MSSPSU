// ============================================
// app/admin/approvals/[id]/page.tsx
// หน้าตรวจสอบเนื้อหาเพื่ออนุมัติ/ปฏิเสธ
// ============================================

"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { ConfirmModal } from "@/components/admin/Modal";
import {
    ArrowLeft,
    Check,
    X,
    FileText,
    Video,
    BookOpen,
    Heart,
    Calendar,
    User,
    Eye,
    Tag,
    Clock,
    Youtube,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const endpointMap: Record<string, string> = {
    article: "articles",
    video: "videos",
    journal: "journals",
    salam: "salam-articles",
};

// Get content type icon
const getTypeIcon = (type: string) => {
    switch (type) {
        case "article": return <FileText size={20} className="text-blue-600" />;
        case "video": return <Video size={20} className="text-purple-600" />;
        case "journal": return <BookOpen size={20} className="text-green-600" />;
        case "salam": return <Heart size={20} className="text-orange-600" />;
        default: return <FileText size={20} />;
    }
};

const getTypeLabel = (type: string) => {
    switch (type) {
        case "article": return "บทความ";
        case "video": return "วิดีโอ";
        case "journal": return "วารสาร";
        case "salam": return "สวัสดีอิสลาม";
        default: return type;
    }
};

// Extract YouTube video ID
const getYoutubeVideoId = (url: string) => {
    const match = url?.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/\&\?]{10,12})/);
    return match ? match[1] : null;
};

export default function ApprovalReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const contentId = resolvedParams.id;

    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchContent() {
            try {
                setLoading(true);
                // Try to fetch from all endpoints
                const types = ['article', 'video', 'journal', 'salam'];
                let found = false;

                for (const type of types) {
                    const endpoint = endpointMap[type];
                    const res = await fetch(`${API_BASE_URL}/${endpoint}/${contentId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setContent({ ...data, type });
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    setError("ไม่พบเนื้อหาที่ต้องการตรวจสอบ");
                }
            } catch (err) {
                console.error("Error fetching content:", err);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [contentId]);

    // Handle Approve
    const handleApprove = async () => {
        if (!content) return;
        setSubmitting(true);
        try {
            const endpoint = endpointMap[content.type];
            const res = await fetch(`${API_BASE_URL}/${endpoint}/${contentId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'published' }),
            });

            if (res.ok) {
                router.push("/admin/approvals");
            }
        } catch (err) {
            console.error("Error approving content:", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Reject
    const handleReject = async () => {
        if (!content) return;
        setSubmitting(true);
        try {
            const endpoint = endpointMap[content.type];
            const res = await fetch(`${API_BASE_URL}/${endpoint}/${contentId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'rejected' }),
            });

            if (res.ok) {
                router.push("/admin/approvals");
            }
        } catch (err) {
            console.error("Error rejecting content:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AdminLayoutWrapper title="กำลังโหลด..." description="กำลังโหลดข้อมูลเนื้อหา">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayoutWrapper>
        );
    }

    if (error || !content) {
        return (
            <AdminLayoutWrapper title="ไม่พบเนื้อหา" description="ไม่พบข้อมูลเนื้อหาที่ต้องการตรวจสอบ">
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">{error || "ไม่พบเนื้อหาที่ต้องการตรวจสอบ"}</p>
                    <Link href="/admin/approvals" className="text-blue-600 hover:underline">
                        กลับไปหน้าอนุมัติ
                    </Link>
                </div>
            </AdminLayoutWrapper>
        );
    }

    return (
        <AdminLayoutWrapper title="ตรวจสอบเนื้อหา" description="ตรวจสอบและพิจารณาอนุมัติหรือปฏิเสธเนื้อหา">
            {/* Back Link */}
            <Link
                href="/admin/approvals"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
            >
                <ArrowLeft size={20} />
                กลับไปหน้าอนุมัติ/ปฏิเสธ
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Preview */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Cover Image */}
                    {content.coverImage && (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <img
                                src={content.coverImage}
                                alt={content.title}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    )}

                    {/* Content Header */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            {getTypeIcon(content.type)}
                            <span className="text-sm font-medium text-gray-500">{getTypeLabel(content.type)}</span>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                                รออนุมัติ
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 mb-4">{content.title}</h1>

                        {content.excerpt && (
                            <p className="text-gray-600 mb-4 leading-relaxed">{content.excerpt}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>{content.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{new Date(content.createdAt || content.publishedAt || Date.now()).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag size={16} />
                                <span>{content.category}</span>
                            </div>
                        </div>
                    </div>

                    {/* Video Preview (for video type) */}
                    {content.type === "video" && content.youtubeUrl && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Youtube className="text-red-600" size={24} />
                                วิดีโอ YouTube
                            </h2>
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${getYoutubeVideoId(content.youtubeUrl)}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <a
                                href={content.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-3"
                            >
                                เปิดใน YouTube <ExternalLink size={14} />
                            </a>
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">เนื้อหา</h2>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: content.content }}
                            style={{
                                fontFamily: "'IBM Plex Sans Thai', sans-serif",
                                lineHeight: 1.8,
                            }}
                        />
                    </div>
                </div>

                {/* Sidebar - Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Action Buttons */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">ดำเนินการ</h2>

                        <div className="space-y-3">
                            <button
                                onClick={() => setIsApproveModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                            >
                                <Check size={20} />
                                อนุมัติเนื้อหา
                            </button>

                            <button
                                onClick={() => setIsRejectModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                                <X size={20} />
                                ปฏิเสธเนื้อหา
                            </button>

                            <Link
                                href="/admin/approvals"
                                className="block w-full text-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                                กลับ
                            </Link>
                        </div>
                    </div>

                    {/* Content Info Summary */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                        <h3 className="font-bold text-gray-800 mb-4">ข้อมูลเนื้อหา</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">ประเภท:</span>
                                <span className="font-medium text-gray-800">{getTypeLabel(content.type)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">หมวดหมู่:</span>
                                <span className="font-medium text-gray-800">{content.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">ผู้เขียน:</span>
                                <span className="font-medium text-gray-800">{content.author}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">วันที่ส่ง:</span>
                                <span className="font-medium text-gray-800">{content.submittedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Guidelines */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <h3 className="font-bold text-amber-800 mb-3">📋 แนวทางการตรวจสอบ</h3>
                        <ul className="text-sm text-amber-700 space-y-2">
                            <li>• ตรวจสอบความถูกต้องของเนื้อหา</li>
                            <li>• ตรวจสอบแหล่งอ้างอิง</li>
                            <li>• ตรวจสอบการสะกดและไวยากรณ์</li>
                            <li>• ตรวจสอบความเหมาะสมของภาพ</li>
                            <li>• ตรวจสอบลิขสิทธิ์เนื้อหา</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            <ConfirmModal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleApprove}
                title="ยืนยันการอนุมัติ"
                message={`คุณต้องการอนุมัติเนื้อหา "${content.title}" หรือไม่? เนื้อหานี้จะถูกเผยแพร่ทันที`}
                confirmText="อนุมัติ"
                confirmColor="green"
            />

            {/* Reject Modal */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsRejectModalOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">ปฏิเสธเนื้อหา</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                เหตุผลในการปฏิเสธ *
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
                                placeholder="กรุณาระบุเหตุผลในการปฏิเสธ..."
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectReason.trim()}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                ปฏิเสธ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayoutWrapper>
    );
}
