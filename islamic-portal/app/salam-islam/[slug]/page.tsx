// ============================================
// app/salam-islam/[slug]/page.tsx
// หน้ารายละเอียดบทความสวัสดีอิสลาม พร้อมรูปปก
// ============================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Share2, ArrowRight } from "lucide-react";
import { getSalamBySlug, salamArticles } from "@/lib/mockData";

interface SalamPageProps {
    params: Promise<{ slug: string }>;
}

export default async function SalamDetailPage({ params }: SalamPageProps) {
    const { slug } = await params;
    const article = getSalamBySlug(slug);

    if (!article) {
        notFound();
    }

    // Get other articles
    const otherArticles = salamArticles.filter(a => a.id !== article.id);

    return (
        <div className="pt-24 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/salam-islam"
                        className="inline-flex items-center gap-2 !text-white/80 hover:!text-white mb-6 transition"
                    >
                        <ArrowLeft size={20} />
                        กลับไปหน้าสวัสดีอิสลาม
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{article.icon}</span>
                        <span className="px-4 py-1 bg-white/20 rounded-full text-sm text-white">
                            {article.category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span className="flex items-center gap-1">
                            <User size={16} />
                            {article.author}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={16} />
                            {article.publishedAt}
                        </span>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            {article.coverImage && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-64 md:h-80 object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    {/* Share Button Only */}
                    <div className="flex gap-3 mb-8">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition">
                            <Share2 size={18} />
                            แชร์
                        </button>
                    </div>

                    {/* Article Content */}
                    <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-800">
                        <div dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />
                    </article>
                </div>

                {/* More to Learn */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">เรียนรู้เพิ่มเติม</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherArticles.map((other) => (
                            <Link key={other.id} href={`/salam-islam/${other.slug}`}>
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
                                    {other.coverImage && (
                                        <div className="relative">
                                            <img
                                                src={other.coverImage}
                                                alt={other.title}
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow">
                                                <span className="text-xl">{other.icon}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <span className="text-xs text-orange-600 font-medium">{other.category}</span>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{other.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">{other.excerpt}</p>
                                        <span className="text-orange-600 text-sm font-medium inline-flex items-center gap-1 mt-2">
                                            อ่านเพิ่มเติม
                                            <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-12 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">ต้องการความช่วยเหลือ?</h3>
                    <p className="text-gray-600 mb-6">
                        หากคุณมีคำถามเกี่ยวกับอิสลาม หรือต้องการพูดคุยกับผู้รู้ สามารถติดต่อได้
                    </p>
                    <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
                        ติดต่อทีมงาน
                    </button>
                </div>
            </div>
        </div>
    );
}

function formatContent(content: string): string {
    return content
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br />');
}
