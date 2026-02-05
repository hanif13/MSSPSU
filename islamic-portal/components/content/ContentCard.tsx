// ============================================
// components/content/ContentCard.tsx
// การ์ดบทความพร้อมรูปปก
// ============================================

import Link from "next/link";
import { BookOpen, User, Clock, Calendar } from "lucide-react";

interface ContentCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorTitle?: string;
  slug: string;
  coverImage?: string;
  readTime?: string;
  publishedAt?: string;
  className?: string;
}

export function ContentCard({
  title,
  excerpt,
  category,
  author,
  authorTitle,
  slug,
  coverImage,
  readTime,
  publishedAt,
  className = ""
}: ContentCardProps) {
  return (
    <Link href={`/articles/${slug}`}>
      <div className={`content-card bg-white rounded-xl overflow-hidden h-full flex flex-col ${className}`}>
        {/* Cover Image */}
        <div className="h-48 relative overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-primary-700">
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
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">{author}</p>
              {authorTitle && <p className="text-xs text-gray-500 truncate">{authorTitle}</p>}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            {publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {publishedAt}
              </span>
            )}
            {readTime && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {readTime}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}