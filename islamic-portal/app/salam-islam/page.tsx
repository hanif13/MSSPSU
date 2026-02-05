// ============================================
// app/salam-islam/page.tsx
// หน้ารายการบทความสวัสดีอิสลาม - ดึงข้อมูลจาก API จริง
// ============================================

"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface SalamArticle {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    slug: string;
    icon?: string;
    publishedAt?: string;
    coverImage?: string;
}

export default function SalamIslamPage() {
    const [articles, setArticles] = useState<SalamArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    useEffect(() => {
        async function fetchArticles() {
            try {
                const res = await fetch(`${API_BASE_URL}/salam-articles/published`);
                if (res.ok) {
                    const data = await res.json();
                    setArticles(data);
                }
            } catch (error) {
                console.error('Error fetching salam articles:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchArticles();
    }, []);

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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">กำลังโหลดบทความ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            สวัสดีอิสลาม
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            ยินดีต้อนรับสู่โลกแห่งอิสลาม เรียนรู้หลักการพื้นฐานของศาสนาแห่งสันติภาพ
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
                                ? "bg-orange-600 text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200"
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
                        <Link key={article._id} href={`/salam-islam/${article.slug}`}>
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
                                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                                            <span className="text-6xl">{article.icon}</span>
                                        </div>
                                    )}
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-orange-700">
                                        {article.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                        {article.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                                        {article.excerpt}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar size={14} />
                                            <span className="text-xs">{article.publishedAt}</span>
                                        </div>
                                        <span className="text-orange-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                            อ่านเพิ่มเติม
                                            <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {filteredArticles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">ไม่พบบทความในหมวดหมู่นี้</p>
                    </div>
                )}
            </div>
        </div>
    );
}
