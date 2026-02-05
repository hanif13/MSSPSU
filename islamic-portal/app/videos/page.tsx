// ============================================
// app/videos/page.tsx
// หน้ารายการวิดีโอทั้งหมด พร้อมรูปปก
// ============================================

"use client";

import Link from "next/link";
import { Play, User, Clock, Eye, Calendar } from "lucide-react";
import { videos } from "@/lib/mockData";
import { useState, useMemo } from "react";

// Get unique categories from videos
const categories = ["ทั้งหมด", ...Array.from(new Set(videos.map(v => v.category)))];

export default function VideosPage() {
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    const filteredVideos = useMemo(() => {
        if (selectedCategory === "ทั้งหมด") {
            return videos;
        }
        return videos.filter(v => v.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <div className="pt-24 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            วิดีโอ
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            บรรยายธรรม การบรรยายพิเศษ และเนื้อหาวิดีโออิสลามคุณภาพ
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
                                ? "bg-purple-600 text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Videos Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVideos.map((video) => (
                        <Link key={video.id} href={`/videos/${video.slug}`}>
                            <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
                                {/* Thumbnail with Cover Image */}
                                <div className="relative aspect-video overflow-hidden">
                                    {video.coverImage ? (
                                        <img
                                            src={video.coverImage}
                                            alt={video.title}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700" />
                                    )}

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                            <Play className="w-7 h-7 text-purple-600 ml-1" fill="currentColor" />
                                        </div>
                                    </div>

                                    {/* Duration Badge */}
                                    <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-xs text-white font-medium">
                                        {video.duration}
                                    </span>

                                    {/* Category Badge */}
                                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-purple-700">
                                        {video.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                        {video.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                        {video.excerpt}
                                    </p>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{video.author}</p>
                                            <p className="text-xs text-gray-500 truncate">{video.authorTitle}</p>
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {video.publishedAt}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {video.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={14} />
                                                {video.views}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {/* No Results */}
                {filteredVideos.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">ไม่พบวิดีโอในหมวดหมู่นี้</p>
                    </div>
                )}
            </div>
        </div>
    );
}
