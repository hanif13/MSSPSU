// ============================================
// app/articles/page.tsx
// หน้ารายการบทความทั้งหมด พร้อมรูปปกและข้อมูลครบ
// ============================================

"use client";

import Link from "next/link";
import { BookOpen, User, Clock, Eye, Calendar } from "lucide-react";
import { articles } from "@/lib/mockData";
import { useState, useMemo } from "react";

// Get unique categories from articles
const categories = ["ทั้งหมด", ...Array.from(new Set(articles.map(a => a.category)))];

export default function ArticlesPage() {
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    const filteredArticles = useMemo(() => {
        if (selectedCategory === "ทั้งหมด") {
            return articles;
        }
        return articles.filter(a => a.category === selectedCategory);
    }, [selectedCategory]);

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
                        <Link key={article.id} href={`/articles/${article.slug}`}>
                            <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
                                {/* Cover Image */}
                                <div className="h-48 relative overflow-hidden">
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
                                                {article.views.toLocaleString()}
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
