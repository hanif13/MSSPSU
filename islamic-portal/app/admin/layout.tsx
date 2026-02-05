// ============================================
// ไฟล์: app/admin/layout.tsx
// Layout สำหรับหน้า Admin (ไม่แสดง Navbar/Footer หลัก)
// ============================================

"use client";

import { AuthGuard } from "@/components/admin/AuthGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="admin-layout">
                {children}
            </div>
        </AuthGuard>
    );
}
