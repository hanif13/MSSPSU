// ============================================
// ไฟล์: app/admin/layout.tsx
// Layout สำหรับหน้า Admin (ไม่แสดง Navbar/Footer หลัก)
// ============================================

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard - Islamic Portal",
    description: "ระบบจัดการเนื้อหา Islamic Portal",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-layout">
            {children}
        </div>
    );
}
