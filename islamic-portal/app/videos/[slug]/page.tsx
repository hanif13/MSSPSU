// ============================================
// app/videos/[slug]/page.tsx
// หน้ารายละเอียดวิดีโอ พร้อม YouTube embed
// ============================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Clock, Eye, Calendar, Share2 } from "lucide-react";
import { getVideoBySlug, videos, getYoutubeVideoId } from "@/lib/mockData";

interface VideoPageProps {
    params: Promise<{ slug: string }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
    const { slug } = await params;
    const video = getVideoBySlug(slug);

    if (!video) {
        notFound();
    }

    // Get YouTube video ID
    const youtubeId = video.youtubeUrl ? getYoutubeVideoId(video.youtubeUrl) : null;

    // Get related videos (same category, exclude current)
    const relatedVideos = videos
        .filter(v => v.category === video.category && v.id !== video.id)
        .slice(0, 3);

    return (
        <div className="pt-24 pb-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/videos"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
                >
                    <ArrowLeft size={20} />
                    กลับไปหน้าวิดีโอ
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Video Player */}
                        <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-6 relative">
                            {youtubeId ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    title={video.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : video.coverImage ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={video.coverImage}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition">
                                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 rounded text-sm text-white">
                                        {video.duration}
                                    </span>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-purple-700 transition">
                                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-white/70">คลิกเพื่อเล่นวิดีโอ</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                                {video.category}
                            </span>

                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                                {video.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                                <span className="flex items-center gap-1">
                                    <Eye size={16} />
                                    {video.views} ครั้ง
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {video.publishedAt}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {video.duration}
                                </span>
                            </div>

                            {/* Share Button Only */}
                            <div className="flex gap-3 mb-6 pb-6 border-b border-gray-100">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition">
                                    <Share2 size={18} />
                                    แชร์
                                </button>
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User className="text-white" size={28} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{video.author}</p>
                                    <p className="text-sm text-gray-500">{video.authorTitle}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-gray max-w-none">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">รายละเอียด</h3>
                                <div className="text-gray-600 whitespace-pre-line">
                                    {video.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Related Videos */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">วิดีโอที่เกี่ยวข้อง</h2>
                        <div className="space-y-4">
                            {relatedVideos.length > 0 ? (
                                relatedVideos.map((related) => (
                                    <Link key={related.id} href={`/videos/${related.slug}`}>
                                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex">
                                            <div className="w-40 h-24 flex-shrink-0 relative overflow-hidden">
                                                {related.coverImage ? (
                                                    <img
                                                        src={related.coverImage}
                                                        alt={related.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700" />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                                                    {related.duration}
                                                </span>
                                            </div>
                                            <div className="p-3 flex-1">
                                                <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                                                    {related.title}
                                                </h3>
                                                <p className="text-xs text-gray-500">{related.author}</p>
                                                <p className="text-xs text-gray-400">{related.views} ครั้ง</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">ไม่มีวิดีโอที่เกี่ยวข้อง</p>
                            )}

                            {/* More Videos */}
                            <div className="pt-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">วิดีโอทั้งหมด</h3>
                                {videos.filter(v => v.id !== video.id).slice(0, 3).map((v) => (
                                    <Link key={v.id} href={`/videos/${v.slug}`}>
                                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex mb-3">
                                            <div className="w-32 h-20 flex-shrink-0 relative overflow-hidden">
                                                {v.coverImage ? (
                                                    <img
                                                        src={v.coverImage}
                                                        alt={v.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700" />
                                                )}
                                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                                                    {v.duration}
                                                </span>
                                            </div>
                                            <div className="p-2 flex-1">
                                                <h4 className="font-medium text-gray-800 text-sm line-clamp-2">{v.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{v.views} ครั้ง</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
