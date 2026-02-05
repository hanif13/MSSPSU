// ============================================
// ไฟล์ที่ 3: app/layout.tsx
// วิธีใช้: แทนที่ไฟล์ app/layout.tsx ทั้งหมด
// ============================================

import type { Metadata } from "next";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

export const metadata: Metadata = {
  title: "Islamic Portal - แหล่งความรู้อิสลามศาสตร์",
  description: "ศูนย์รวมบทความ วิดีโอ และวารสารวิชาการอิสลามคุณภาพ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}