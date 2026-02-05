// ============================================
// app/videos/[slug]/page.tsx
// หน้ารายละเอียดวิดีโอ - ดึงข้อมูลจาก API จริง
// ============================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Clock, Eye, Calendar, Share2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Video {
    _id: string;
    title: string;
    excerpt: string;
    description: string;
    category: string;
    author: string;
    authorTitle?: string;
    slug: string;
    duration?: string;
    views?: string;
    publishedAt?: string;
    youtubeUrl?: string;
    coverImage?: string;
}

interface VideoPageProps {
    params: Promise<{ slug: string }>;
}

function getYoutubeVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

async function getVideo(slug: string): Promise<Video | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/videos/slug/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching video:', error);
        return null;
    }
}

async function getRelatedVideos(category: string, currentId: string): Promise<Video[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/videos/published`, { cache: 'no-store' });
        if (!res.ok) return [];
        const videos = await res.json();
        return videos.filter((v: Video) => v._id !== currentId).slice(0, 5);
    } catch (error) {
        return [];
    }
}

export default async function VideoPage({ params }: VideoPageProps) {
    const { slug } = await params;
    const video = await getVideo(slug);

    if (!video) {
        notFound();
    }

    const youtubeId = video.youtubeUrl ? getYoutubeVideoId(video.youtubeUrl) : null;
    const relatedVideos = await getRelatedVideos(video.category, video._id);

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
                                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
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

                            <div className="flex gap-3 mb-6 pb-6 border-b border-gray-100">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition">
                                    <Share2 size={18} />
                                    แชร์
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User className="text-white" size={28} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{video.author}</p>
                                    <p className="text-sm text-gray-500">{video.authorTitle}</p>
                                </div>
                            </div>

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
                        <h2 className="text-xl font-bold text-gray-800 mb-4">วิดีโออื่นๆ</h2>
                        <div className="space-y-4">
                            {relatedVideos.length > 0 ? (
                                relatedVideos.map((related) => (
                                    <Link key={related._id} href={`/videos/${related.slug}`}>
                                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex mb-3">
                                            <div className="w-32 h-20 flex-shrink-0 relative overflow-hidden">
                                                {related.coverImage ? (
                                                    <img
                                                        src={related.coverImage}
                                                        alt={related.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700" />
                                                )}
                                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                                                    {related.duration}
                                                </span>
                                            </div>
                                            <div className="p-2 flex-1">
                                                <h4 className="font-medium text-gray-800 text-sm line-clamp-2">{related.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{related.views} ครั้ง</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">ไม่มีวิดีโออื่น</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
