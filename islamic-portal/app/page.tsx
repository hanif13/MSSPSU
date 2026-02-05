// ============================================
// app/page.tsx
// หน้าแรกพร้อมข้อมูลครบถ้วน (รูปปก, ผู้เขียน, วันที่)
// ============================================

import { HeroSection } from "@/components/content/HeroSection";
import { ContentSection } from "@/components/content/ContentSection";
import { articles, videos, journals, salamArticles } from "@/lib/mockData";

export default function HomePage() {
  // ใช้ข้อมูลจาก mockData แทน - เพื่อให้มีข้อมูลครบถ้วน (รูปปก, ผู้เขียน, วันที่)
  const displayArticles = articles.slice(0, 3);
  const displayVideos = videos.slice(0, 3);
  const displayJournals = journals.slice(0, 3);
  const displaySalam = salamArticles.slice(0, 3);

  return (
    <>
      <HeroSection />

      {/* พื้นหลังสีขาวล้วน */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Articles Section */}
          <ContentSection
            title="บทความ"
            description="บทความวิชาการและความรู้อิสลาม"
            items={displayArticles}
            type="article"
            viewAllLink="/articles"
          />

          {/* Videos Section */}
          <ContentSection
            title="วิดีโอ"
            description="คลิปวิดีโอความรู้และบรรยายพิเศษ"
            items={displayVideos}
            type="video"
            viewAllLink="/videos"
          />

          {/* Annur Journal Section */}
          <ContentSection
            title="วารสารอันนูร"
            description="วารสารวิชาการอิสลามศึกษา"
            items={displayJournals}
            type="journal"
            viewAllLink="/annur-journal"
          />

          {/* Salam Islam Section */}
          <ContentSection
            title="สวัสดีอิสลาม"
            description="บทความเบื้องต้นสำหรับผู้สนใจศึกษา"
            items={displaySalam}
            type="salam"
            viewAllLink="/salam-islam"
            showDivider={false}
          />

        </div>
      </section>
    </>
  );
}