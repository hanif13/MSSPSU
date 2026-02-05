// ============================================
// components/content/HeroSection.tsx
// Hero Section พร้อมปุ่มสีขาว
// ============================================

"use client";

import Link from "next/link";

export function HeroSection() {
  const scrollToContent = () => {
    const element = document.getElementById('content-highlights');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-gradient pt-32 pb-24 relative">
      {/* Decorative Circles */}
      <div className="decorative-circle w-96 h-96 bg-blue-400 top-10 -right-48" />
      <div className="decorative-circle w-72 h-72 bg-sky-300 bottom-10 -left-36" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            แหล่งความรู้อิสลามศาสตร์
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light">
            ศูนย์รวมบทความ วิดีโอ และวารสารวิชาการอิสลามคุณภาพ
            เพื่อการเรียนรู้และเผยแผ่ความรู้ที่ถูกต้อง
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToContent}
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition transform hover:-translate-y-1 hover:shadow-xl"
            >
              เริ่มต้นเรียนรู้
            </button>
            <Link
              href="/login"
              className="border-2 border-white/80 bg-white/10 backdrop-blur-sm !text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 hover:border-white transition transform hover:-translate-y-1"
            >
              สำหรับผู้ดูแล
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}