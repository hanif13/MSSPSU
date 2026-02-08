// ============================================
// app/page.tsx
// หน้าแรก - ดึงข้อมูลจาก API จริง
// ============================================

import { HeroSection } from "@/components/content/HeroSection";
import { ContentSection } from "@/components/content/ContentSection";

const API_BASE_URL = (typeof window === 'undefined' && process.env.INTERNAL_API_URL)
  ? process.env.INTERNAL_API_URL
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');

// Fetch data from API
async function getHomePageData() {
  try {
    const [articlesRes, videosRes, journalsRes, salamRes] = await Promise.all([
      fetch(`${API_BASE_URL}/articles/published`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/videos/published`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/journals/published`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/salam-articles/published`, { cache: 'no-store' }),
    ]);

    const articles = articlesRes.ok ? await articlesRes.json() : [];
    const videos = videosRes.ok ? await videosRes.json() : [];
    const journals = journalsRes.ok ? await journalsRes.json() : [];
    const salamArticles = salamRes.ok ? await salamRes.json() : [];

    return { articles, videos, journals, salamArticles };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { articles: [], videos: [], journals: [], salamArticles: [] };
  }
}

// Transform API data to match component interface
function transformForDisplay(items: any[], limit: number = 3) {
  return items.slice(0, limit).map((item: any) => ({
    ...item,
    id: item._id, // MongoDB uses _id
  }));
}

export default async function HomePage() {
  const { articles, videos, journals, salamArticles } = await getHomePageData();

  const displayArticles = transformForDisplay(articles);
  const displayVideos = transformForDisplay(videos);
  const displayJournals = transformForDisplay(journals);
  const displaySalam = transformForDisplay(salamArticles);

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