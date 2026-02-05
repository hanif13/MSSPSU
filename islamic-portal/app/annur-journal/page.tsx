// ============================================
// app/annur-journal/page.tsx
// หน้ารายการวารสารทั้งหมด - ดึงข้อมูลจาก API จริง
// ============================================

"use client";

import Link from "next/link";
import { FileText, Calendar } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Journal {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    slug: string;
    date?: string;
    issue?: string;
    coverImage?: string;
}

export default function JournalPage() {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    useEffect(() => {
        async function fetchJournals() {
            try {
                const res = await fetch(`${API_BASE_URL}/journals/published`);
                if (res.ok) {
                    const data = await res.json();
                    setJournals(data);
                }
            } catch (error) {
                console.error('Error fetching journals:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchJournals();
    }, []);

    const categories = useMemo(() => {
        return ["ทั้งหมด", ...Array.from(new Set(journals.map(j => j.category)))];
    }, [journals]);

    const filteredJournals = useMemo(() => {
        if (selectedCategory === "ทั้งหมด") {
            return journals;
        }
        return journals.filter(j => j.category === selectedCategory);
    }, [selectedCategory, journals]);

    if (loading) {
        return (
            <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">กำลังโหลดวารสาร...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            วารสารอันนูร
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            วารสารวิชาการอิสลามศึกษา เผยแพร่บทความวิจัยและบทความทางวิชาการ
                        </p>
                    </div>
                </div>
            </div>

            {/* Issue Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2.5 rounded-full font-medium transition ${selectedCategory === category
                                ? "bg-green-600 text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Journals Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredJournals.map((journal) => (
                        <Link key={journal._id} href={`/annur-journal/${journal.slug}`}>
                            <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
                                {/* Cover Image */}
                                <div className="aspect-square relative overflow-hidden">
                                    {journal.coverImage ? (
                                        <img
                                            src={journal.coverImage}
                                            alt={journal.title}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                                            <FileText className="w-16 h-16 text-white opacity-50" />
                                        </div>
                                    )}
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-green-700">
                                        {journal.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                        {journal.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                        {journal.excerpt}
                                    </p>

                                    {/* Issue Info */}
                                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                                        <p className="text-sm font-medium text-green-700">{journal.issue}</p>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {journal.date}
                                        </span>
                                        <span className="text-gray-500">
                                            {journal.author}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {filteredJournals.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">ไม่พบวารสารในฉบับนี้</p>
                    </div>
                )}
            </div>
        </div>
    );
}
