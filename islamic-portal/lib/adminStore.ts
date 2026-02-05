// ============================================
// lib/adminStore.ts
// State management สำหรับ Admin (mock data + CRUD)
// ============================================

// Types
export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    authorTitle: string;
    publishedAt: string;
    readTime: string;
    views: number;
    status: "draft" | "pending" | "published" | "rejected";
}

export interface Video {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    description: string;
    category: string;
    author: string;
    authorTitle: string;
    duration: string;
    views: string;
    publishedAt: string;
    status: "draft" | "pending" | "published" | "rejected";
}

export interface Journal {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    issue: string;
    date: string;
    status: "draft" | "pending" | "published" | "rejected";
}

export interface SalamArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    icon: string;
    publishedAt: string;
    status: "draft" | "pending" | "published" | "rejected";
}

export interface Category {
    id: string;
    name: string;
    description: string;
    contentCount: number;
    color: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "editor" | "author";
    status: "active" | "inactive";
    avatar?: string;
    createdAt: string;
    lastLogin: string;
}

// Initial mock data
export const initialCategories: Category[] = [
    { id: "1", name: "อากีดะห์", description: "หลักความเชื่อ", contentCount: 12, color: "blue" },
    { id: "2", name: "ฟิกห์", description: "นิติศาสตร์อิสลาม", contentCount: 8, color: "green" },
    { id: "3", name: "อัคลาก", description: "จริยธรรม", contentCount: 15, color: "purple" },
    { id: "4", name: "ซีเราะห์", description: "ประวัติศาสตร์", contentCount: 10, color: "orange" },
    { id: "5", name: "ตัฟซีร", description: "อรรถาธิบายอัลกุรอาน", contentCount: 6, color: "pink" },
];

export const initialUsers: User[] = [
    {
        id: "1",
        name: "อ.ดร. อับดุลเลาะ สะอะดี",
        email: "abdullah@islamic.edu",
        role: "admin",
        status: "active",
        createdAt: "1 ม.ค. 2567",
        lastLogin: "วันนี้",
    },
    {
        id: "2",
        name: "อ.ซอลิห์ มะห์มูด",
        email: "solih@islamic.edu",
        role: "editor",
        status: "active",
        createdAt: "15 ม.ค. 2567",
        lastLogin: "เมื่อวาน",
    },
    {
        id: "3",
        name: "นางสาว ฟาติมะห์ ยูซุฟ",
        email: "fatimah@islamic.edu",
        role: "author",
        status: "active",
        createdAt: "1 ก.พ. 2567",
        lastLogin: "3 วันที่แล้ว",
    },
];

// Content type options
export const contentTypes = [
    { value: "article", label: "บทความ" },
    { value: "video", label: "วิดีโอ" },
    { value: "journal", label: "วารสาร" },
    { value: "salam", label: "สวัสดีอิสลาม" },
];

export const statusOptions = [
    { value: "draft", label: "แบบร่าง", color: "gray" },
    { value: "pending", label: "รออนุมัติ", color: "yellow" },
    { value: "published", label: "เผยแพร่แล้ว", color: "green" },
    { value: "rejected", label: "ถูกปฏิเสธ", color: "red" },
];

export const roleOptions = [
    { value: "admin", label: "ผู้ดูแลระบบ", color: "red" },
    { value: "editor", label: "บรรณาธิการ", color: "blue" },
    { value: "author", label: "ผู้เขียน", color: "green" },
];

// Helper functions
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-ก-๙]/g, "")
        .substring(0, 50);
}

export function formatDate(date: Date): string {
    const months = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
}
