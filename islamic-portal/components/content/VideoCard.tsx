// ============================================
// components/content/VideoCard.tsx
// การ์ดวิดีโอพร้อมรูปปก
// ============================================

import Link from "next/link";
import { Play, User, Clock, Eye } from "lucide-react";

interface VideoCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorTitle?: string;
  slug: string;
  duration: string;
  views: string;
  coverImage?: string;
  className?: string;
}

export function VideoCard({
  title,
  excerpt,
  category,
  author,
  authorTitle,
  slug,
  duration,
  views,
  coverImage,
  className = ""
}: VideoCardProps) {
  return (
    <Link href={`/videos/${slug}`}>
      <div className={`content-card bg-white rounded-xl overflow-hidden h-full flex flex-col ${className}`}>
        {/* Cover Image with Play Button */}
        <div className="h-48 relative overflow-hidden group cursor-pointer">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700" />
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
            {duration}
          </div>

          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-purple-700">
            {category}
          </span>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {excerpt}
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">{author}</p>
              {authorTitle && <p className="text-xs text-gray-500 truncate">{authorTitle}</p>}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {duration}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
