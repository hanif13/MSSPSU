// ============================================
// components/content/SalamCard.tsx
// การ์ดสวัสดีอิสลามพร้อมรูปปก
// ============================================

import Link from "next/link";
import { User, ArrowRight } from "lucide-react";

interface SalamCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  slug: string;
  icon: string;
  coverImage?: string;
  publishedAt?: string;
  className?: string;
}

export function SalamCard({
  title,
  excerpt,
  category,
  author,
  slug,
  icon,
  coverImage,
  className = ""
}: SalamCardProps) {
  return (
    <Link href={`/salam-islam/${slug}`}>
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
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <span className="text-6xl">{icon}</span>
            </div>
          )}
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-orange-700">
            {category}
          </span>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User size={12} />
              <span>{author}</span>
            </div>
            <span className="text-orange-600 text-sm font-medium inline-flex items-center gap-1">
              อ่านเพิ่มเติม
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}