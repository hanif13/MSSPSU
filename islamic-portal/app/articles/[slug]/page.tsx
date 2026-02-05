// ============================================
// app/articles/[slug]/page.tsx
// หน้ารายละเอียดบทความ - ดึงข้อมูลจาก API จริง
// ============================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Clock, Eye, Calendar, Share2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Article {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    authorTitle?: string;
    slug: string;
    publishedAt?: string;
    readTime?: string;
    views: number;
    coverImage?: string;
}

interface ArticlePageProps {
    params: Promise<{ slug: string }>;
}

async function getArticle(slug: string): Promise<Article | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/articles/slug/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

async function getRelatedArticles(category: string, currentId: string): Promise<Article[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/articles/published`, { cache: 'no-store' });
        if (!res.ok) return [];
        const articles = await res.json();
        return articles
            .filter((a: Article) => a.category === category && a._id !== currentId)
            .slice(0, 2);
    } catch (error) {
        return [];
    }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    const relatedArticles = await getRelatedArticles(article.category, article._id);

    return (
        <div className="pt-24 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 !text-white/80 hover:!text-white mb-6 transition"
                    >
                        <ArrowLeft size={20} />
                        กลับไปหน้าบทความ
                    </Link>

                    {/* Category Badge & Date */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium text-white">
                            {article.category}
                        </span>
                        <span className="flex items-center gap-2 text-white/90">
                            <Calendar size={16} />
                            {article.publishedAt}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        {article.title}
                    </h1>

                    {/* Author & Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-white/80">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="text-white font-medium">{article.author}</p>
                                <p className="text-sm text-white/70">{article.authorTitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                                <Clock size={16} />
                                {article.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye size={16} />
                                {article.views?.toLocaleString() || 0} ครั้ง
                            </span>
                        </div>
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
                            className="w-full aspect-square object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                    {/* Share Button */}
                    <div className="flex gap-3 mb-8">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition">
                            <Share2 size={18} />
                            แชร์
                        </button>
                    </div>

                    {/* Article Content */}
                    <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-800 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-lg">
                        <div dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />
                    </article>
                </div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">บทความที่เกี่ยวข้อง</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedArticles.map((related) => (
                                <Link key={related._id} href={`/articles/${related.slug}`}>
                                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
                                        {related.coverImage && (
                                            <img
                                                src={related.coverImage}
                                                alt={related.title}
                                                className="w-full aspect-square object-cover"
                                            />
                                        )}
                                        <div className="p-6">
                                            <span className="text-sm text-blue-600 font-medium">{related.category}</span>
                                            <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-2">{related.title}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">{related.excerpt}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper function to convert markdown-like content to HTML
function formatContent(content: string): string {
    return content
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br />');
}
