// ============================================
// ไฟล์ที่ 8: components/content/ContentSection.tsx
// วิธีใช้: สร้างไฟล์ components/content/ContentSection.tsx แล้ว copy โค้ดนี้ลงไป
// ============================================

"use client";

import Link from "next/link";
import { ContentCard } from "./ContentCard";
import { VideoCard } from "./VideoCard";
import { JournalCard } from "./JournalCard";
import { SalamCard } from "./SalamCard";
import { useEffect, useRef, useState } from "react";

interface ContentSectionProps {
  title: string;
  description: string;
  items: any[];
  type: 'article' | 'video' | 'journal' | 'salam';
  viewAllLink: string;
  showDivider?: boolean;
}

export function ContentSection({
  title,
  description,
  items,
  type,
  viewAllLink,
  showDivider = true
}: ContentSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const renderCard = (item: any, index: number) => {
    const delay = `delay-${index + 1}`;

    switch (type) {
      case 'video':
        return <VideoCard key={item.id} {...item} className={`fade-in-up ${delay}`} />;
      case 'journal':
        return <JournalCard key={item.id} {...item} className={`fade-in-up ${delay}`} />;
      case 'salam':
        return <SalamCard key={item.id} {...item} className={`fade-in-up ${delay}`} />;
      default:
        return <ContentCard key={item.id} {...item} className={`fade-in-up ${delay}`} />;
    }
  };

  return (
    <div
      ref={sectionRef}
      id="content-highlights"
      className={`${showDivider ? 'mb-20' : ''} scroll-reveal ${isVisible ? 'active' : ''}`}
    >
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {title}
          </h2>
          <p className="text-gray-600">{description}</p>
        </div>
        <Link
          href={viewAllLink}
          className="bg-gradient-to-r from-primary-600 to-primary-800 !text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition"
        >
          ดูทั้งหมด →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => renderCard(item, index))}
      </div>
    </div>
  );
}