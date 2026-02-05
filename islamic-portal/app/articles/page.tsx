// ============================================
// app/articles/page.tsx
// หน้ารายการบทความทั้งหมด - ดึงข้อมูลจาก API จริง
// ============================================

"use client";

import Link from "next/link";
import { BookOpen, User, Clock, Eye, Calendar } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

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
    status: string;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    useEffect(() => {
        async function fetchArticles() {
            try {
                const res = await fetch(`${API_BASE_URL}/articles/published`);
                if (res.ok) {
                    const data = await res.json();
                    setArticles(data);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchArticles();
    }, []);

    // Get unique categories from articles
    const categories = useMemo(() => {
        return ["ทั้งหมด", ...Array.from(new Set(articles.map(a => a.category)))];
    }, [articles]);

    const filteredArticles = useMemo(() => {
        if (selectedCategory === "ทั้งหมด") {
            return articles;
        }
        return articles.filter(a => a.category === selectedCategory);
    }, [selectedCategory, articles]);

    if (loading) {
        return (
            <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">กำลังโหลดบทความ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            บทความ
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            บทความวิชาการและความรู้อิสลามจากนักวิชาการผู้ทรงคุณวุฒิ
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2.5 rounded-full font-medium transition ${selectedCategory === category
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.map((article) => (
                        <Link key={article._id} href={`/articles/${article.slug}`}>
                            <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
                                {/* Cover Image */}
                                <div className="aspect-square relative overflow-hidden">
                                    {article.coverImage ? (
                                        <img
                                            src={article.coverImage}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                                            <BookOpen className="w-16 h-16 text-white opacity-50" />
                                        </div>
                                    )}
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-blue-700">
                                        {article.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                        {article.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                        {article.excerpt}
                                    </p>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{article.author}</p>
                                            <p className="text-xs text-gray-500 truncate">{article.authorTitle}</p>
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {article.publishedAt}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {article.readTime}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={14} />
                                                {article.views?.toLocaleString() || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {/* No Results */}
                {filteredArticles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">ไม่พบบทความในหมวดหมู่นี้</p>
                    </div>
                )}
            </div>
        </div>
    );
}
