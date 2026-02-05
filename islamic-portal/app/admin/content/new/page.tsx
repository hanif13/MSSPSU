// ============================================
// app/admin/content/new/page.tsx
// หน้าเพิ่มเนื้อหาใหม่ - เชื่อมต่อ API จริง
// ============================================

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ArrowLeft, Save, Youtube, FileText, Video, BookOpen, Heart, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { contentTypes, statusOptions } from "@/lib/adminStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Category {
    _id: string;
    name: string;
    type: string;
}

export default function NewContentPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        type: "article",
        category: "",
        author: "",
        status: "draft",
        content: "",
        youtubeUrl: "",
        duration: "",
        excerpt: "",
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [coverImageName, setCoverImageName] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
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
        fetchCategories();
    }, []);

    // Get categories filtered by content type
    const filteredCategories = useMemo(() => {
        return categories.filter(cat => cat.type === formData.type);
    }, [formData.type, categories]);

    // Handle type change - reset category when type changes
    const handleTypeChange = (newType: string) => {
        setFormData({ ...formData, type: newType, category: "" });
    };

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImageName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove cover image
    const removeCoverImage = () => {
        setCoverImage(null);
        setCoverImageName("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const generateSlug = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\u0E00-\u0E7F-]+/g, '') // Remove all non-word chars (support Thai)
            .replace(/--+/g, '-')           // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '')             // Trim - from end of text
            + '-' + Math.random().toString(36).substring(2, 7);
    };

    // Extract YouTube video ID from URL
    const getYoutubeVideoId = (url: string) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/);
        return match ? match[1] : null;
    };

    const youtubeVideoId = getYoutubeVideoId(formData.youtubeUrl);

    // Get type icon
    const getTypeIcon = (type: string) => {
        switch (type) {
            case "article": return <FileText size={20} className="text-blue-600" />;
            case "video": return <Video size={20} className="text-purple-600" />;
            case "journal": return <BookOpen size={20} className="text-green-600" />;
            case "salam": return <Heart size={20} className="text-orange-600" />;
            default: return <FileText size={20} />;
        }
    };

    // Get recommended cover dimensions based on content type
    const getCoverDimensions = (type: string) => {
        switch (type) {
            case "video":
                return { width: 1920, height: 1080, ratio: "16:9" };
            case "article":
            case "journal":
            case "salam":
            default:
                return { width: 1080, height: 1080, ratio: "1:1" };
        }
    };

    // Handle Submit
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const slug = generateSlug(formData.title);
            const endpointMap: Record<string, string> = {
                article: 'articles',
                video: 'videos',
                journal: 'journals',
                salam: 'salam-articles',
            };

            const endpoint = endpointMap[formData.type];

            // Prepare payload based on backend schema
            const payload: any = {
                title: formData.title,
                excerpt: formData.excerpt || formData.title,
                category: formData.category,
                author: formData.author,
                slug: slug,
                status: formData.status,
                coverImage: coverImage || "", // In real app, this would be an uploaded file URL
            };

            if (formData.type === "video") {
                payload.youtubeUrl = formData.youtubeUrl;
                payload.duration = formData.duration;
                payload.description = formData.content;
            } else {
                payload.content = formData.content;
            }

            const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/admin/content");
            } else {
                const data = await res.json();
                alert(data.message || "เกิดข้อผิดพลาดในการบันทึกเนื้อหา");
            }
        } catch (err) {
            console.error("Error saving content:", err);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.title && formData.category && formData.author &&
        (formData.type !== "video" || formData.youtubeUrl);

    return (
        <AdminLayoutWrapper
            title="เพิ่มเนื้อหาใหม่"
            description="สร้างเนื้อหาใหม่สำหรับเผยแพร่"
        >
            {/* Back Link */}
            <Link
                href="/admin/content"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
            >
                <ArrowLeft size={20} />
                กลับไปหน้าจัดการเนื้อหา
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">ข้อมูลพื้นฐาน</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเนื้อหา *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="กรอกชื่อเนื้อหา"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายสั้น</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="คำอธิบายสั้นๆ สำหรับแสดงในหน้ารายการ"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท *</label>
                                    <div className="relative">
                                        <select
                                            value={formData.type}
                                            onChange={(e) => handleTypeChange(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                                        >
                                            {contentTypes.map((type) => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            {getTypeIcon(formData.type)}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">เลือกหมวดหมู่</option>
                                        {filteredCategories.map((cat) => (
                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {filteredCategories.length === 0 && !loading && (
                                        <p className="text-xs text-amber-600 mt-1">⚠️ ไม่มีหมวดหมู่สำหรับประเภทนี้</p>
                                    )}
                                    {loading && <p className="text-xs text-blue-500 mt-1 animate-pulse">กำลังโหลดหมวดหมู่...</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ผู้เขียน/ผู้บรรยาย *</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="ชื่อผู้เขียนหรือผู้บรรยาย"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cover Image Upload */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <ImageIcon size={20} className="text-blue-600" />
                            รูปปก
                        </h2>

                        <div className="space-y-4">
                            {coverImage ? (
                                <div className="relative">
                                    <img
                                        src={coverImage}
                                        alt="Cover preview"
                                        className={`w-full object-cover rounded-lg ${formData.type === "video" ? "aspect-video" : "aspect-square"
                                            }`}
                                    />
                                    <button
                                        onClick={removeCoverImage}
                                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                                        title="ลบรูปปก"
                                    >
                                        <X size={20} />
                                    </button>
                                    <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
                                        {coverImageName}
                                    </div>
                                </div>
                            ) : (
                                <label className="block cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium mb-1">คลิกเพื่ออัพโหลดรูปปก</p>
                                        <p className="text-sm text-gray-500">
                                            แนะนำ: {getCoverDimensions(formData.type).width}×{getCoverDimensions(formData.type).height} px ({getCoverDimensions(formData.type).ratio})
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">รองรับไฟล์ JPG, PNG, GIF, WebP</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Content Type Specific Card */}
                    {formData.type === "video" ? (
                        // Video: YouTube URL Input
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Youtube className="text-red-600" size={24} />
                                ลิงก์ YouTube
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL วิดีโอ YouTube *</label>
                                    <input
                                        type="url"
                                        value={formData.youtubeUrl}
                                        onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        รองรับ: youtube.com/watch?v=..., youtu.be/...
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ความยาววิดีโอ</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="เช่น 15:30"
                                    />
                                </div>

                                {/* YouTube Preview */}
                                {youtubeVideoId && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ตัวอย่างวิดีโอ</label>
                                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายวิดีโอ</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="คำอธิบายเพิ่มเติมเกี่ยวกับวิดีโอ..."
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Other types: Rich Text Editor
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">เนื้อหา</h2>

                            <RichTextEditor
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                placeholder={
                                    formData.type === "article" ? "เขียนเนื้อหาบทความ..." :
                                        formData.type === "journal" ? "เนื้อหาวารสาร..." :
                                            "เนื้อหาสำหรับผู้เริ่มต้นเรียนรู้อิสลาม..."
                                }
                                height={450}
                            />
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Cover Preview (Sidebar) */}
                    {coverImage && (
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">ตัวอย่างรูปปก</h3>
                            <img
                                src={coverImage}
                                alt="Cover thumbnail"
                                className={`w-full object-cover rounded-lg ${formData.type === "video" ? "aspect-video" : "aspect-square"
                                    }`}
                            />
                        </div>
                    )}

                    {/* Publish Settings */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">ตั้งค่าการเผยแพร่</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isFormValid || isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    {isSubmitting ? "กำลังบันทึก..." : "บันทึกเนื้อหา"}
                                </button>
                            </div>

                            <Link
                                href="/admin/content"
                                className="block w-full text-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                                ยกเลิก
                            </Link>
                        </div>
                    </div>

                    {/* Type Info */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            {getTypeIcon(formData.type)}
                            <h3 className="font-bold text-gray-800">
                                {contentTypes.find(t => t.value === formData.type)?.label}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            {formData.type === "article" && "บทความวิชาการและความรู้อิสลาม"}
                            {formData.type === "video" && "วิดีโอจาก YouTube สำหรับการเรียนรู้"}
                            {formData.type === "journal" && "บทความวารสารวิชาการอิสลามศึกษา"}
                            {formData.type === "salam" && "เนื้อหาสำหรับผู้เริ่มต้นเรียนรู้อิสลาม"}
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayoutWrapper>
    );
}
