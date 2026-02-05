// ============================================
// components/content/JournalCard.tsx
// การ์ดวารสารพร้อมรูปปก
// ============================================

import Link from "next/link";
import { FileText, Calendar } from "lucide-react";

interface JournalCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  slug: string;
  date: string;
  issue?: string;
  coverImage?: string;
  className?: string;
}

export function JournalCard({
  title,
  excerpt,
  category,
  slug,
  date,
  issue,
  coverImage,
  className = ""
}: JournalCardProps) {
  return (
    <Link href={`/annur-journal/${slug}`}>
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
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <FileText className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-green-700">
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

          {/* Issue Info */}
          {issue && (
            <div className="bg-green-50 rounded-lg p-2 mb-3">
              <p className="text-xs font-medium text-green-700">{issue}</p>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
