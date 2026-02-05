// ============================================
// ไฟล์ที่ 6: components/layout/Footer.tsx
// วิธีใช้: สร้างไฟล์ components/layout/Footer.tsx แล้ว copy โค้ดนี้ลงไป
// ============================================

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Islamic Portal</h3>
            <p className="text-blue-200 text-sm">
              แหล่งความรู้อิสลามศาสตร์ที่ครบครันและน่าเชื่อถือ
            </p>
          </div>

          {/* Main Menu */}
          <div>
            <h4 className="font-semibold mb-4">เมนูหลัก</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white transition">
                  บทความ
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-white transition">
                  วิดีโอ
                </Link>
              </li>
              <li>
                <Link href="/annur-journal" className="hover:text-white transition">
                  วารสารอันนูร
                </Link>
              </li>
              <li>
                <Link href="/salam-islam" className="hover:text-white transition">
                  สวัสดีอิสลาม
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Links Section */}
          <div>
            <h4 className="font-semibold mb-4">ลิงค์อื่น ๆ</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>
                <Link href="https://msspsuhatyai.org/activities" className="hover:text-white transition">
                  กิจกรรม
                </Link>
              </li>
              <li>
                <a href="https://msspsuhatyai.org/about" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  เกี่ยวกับเรา
                </a>
              </li>
              <li>
                <a href="https://msspsuhatyai.org/prayer-rooms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  สถานที่ละหมาด
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold mb-4">ติดต่อเรา</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>065-394-5821 (อมีร)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>msspsuhatyai1@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>มหาวิทยาลัยสงขลานครินทร์
                  <br />วิทยาเขตหาดใหญ่</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-blue-200 text-sm">
          <p>&copy; 2025 ชมรมมุสลิม ม.อ.หาดใหญ่ MSS PSU Hatyai. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </footer>
  );
}