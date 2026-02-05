"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto = __importStar(require("crypto"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/islamic_portal?authSource=admin';
const ArticleSchema = new mongoose_1.default.Schema({
    title: String,
    excerpt: String,
    content: String,
    category: String,
    author: String,
    authorTitle: String,
    slug: { type: String, unique: true },
    publishedAt: String,
    readTime: String,
    views: { type: Number, default: 0 },
    coverImage: String,
    status: { type: String, default: 'published' },
}, { timestamps: true });
const VideoSchema = new mongoose_1.default.Schema({
    title: String,
    excerpt: String,
    description: String,
    category: String,
    author: String,
    authorTitle: String,
    slug: { type: String, unique: true },
    duration: String,
    views: String,
    publishedAt: String,
    youtubeUrl: String,
    coverImage: String,
    status: { type: String, default: 'published' },
}, { timestamps: true });
const JournalSchema = new mongoose_1.default.Schema({
    title: String,
    excerpt: String,
    content: String,
    category: String,
    author: String,
    slug: { type: String, unique: true },
    date: String,
    issue: String,
    coverImage: String,
    pdfUrl: String,
    status: { type: String, default: 'published' },
}, { timestamps: true });
const SalamArticleSchema = new mongoose_1.default.Schema({
    title: String,
    excerpt: String,
    content: String,
    category: String,
    author: String,
    slug: { type: String, unique: true },
    icon: String,
    publishedAt: String,
    coverImage: String,
    status: { type: String, default: 'published' },
}, { timestamps: true });
const UserSchema = new mongoose_1.default.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    avatar: String,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const CategorySchema = new mongoose_1.default.Schema({
    name: String,
    slug: { type: String, unique: true },
    description: String,
    type: String,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Article = mongoose_1.default.model('Article', ArticleSchema);
const Video = mongoose_1.default.model('Video', VideoSchema);
const Journal = mongoose_1.default.model('Journal', JournalSchema);
const SalamArticle = mongoose_1.default.model('SalamArticle', SalamArticleSchema);
const User = mongoose_1.default.model('User', UserSchema);
const Category = mongoose_1.default.model('Category', CategorySchema);
const articles = [
    {
        title: "หลักการศรัทธาในอิสลาม",
        excerpt: "การเข้าใจหลักการศรัทธาที่ถูกต้องตามแนวทางอิสลาม...",
        content: "# หลักการศรัทธาในอิสลาม\n\n## บทนำ\nหลักการศรัทธา (อีมาน) เป็นรากฐานสำคัญที่สุดของศาสนาอิสลาม...",
        category: "อากีดะห์",
        author: "อ.ดร. อับดุลเลาะ สะอะดี",
        authorTitle: "อาจารย์ประจำสาขาอิสลามศึกษา",
        slug: "islamic-faith-principles",
        publishedAt: "15 มกราคม 2567",
        readTime: "10 นาที",
        views: 1250,
        coverImage: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&h=450&fit=crop",
        status: "published",
    },
    {
        title: "บทบาทของซะกาตในสังคม",
        excerpt: "ความสำคัญและหลักการการจ่ายซะกาตตามหลักศาสนา...",
        content: "# บทบาทของซะกาตในสังคม\n\n## ความหมายของซะกาต\nซะกาต (زكاة) หมายถึง การชำระให้บริสุทธิ์...",
        category: "ฟิกห์",
        author: "ผศ.ดร. มุหัมมัด อาลี",
        authorTitle: "รองคณบดีฝ่ายวิชาการ",
        slug: "zakat-in-society",
        publishedAt: "12 มกราคม 2567",
        readTime: "8 นาที",
        views: 890,
        coverImage: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=450&fit=crop",
        status: "published",
    },
    {
        title: "จริยธรรมอิสลามในชีวิตประจำวัน",
        excerpt: "การนำหลักจริยธรรมอิสลามมาประยุกต์ใช้ในสังคมปัจจุบัน...",
        content: "# จริยธรรมอิสลามในชีวิตประจำวัน\n\n## บทนำ\nจริยธรรมในอิสลาม (อัคลาก) เป็นส่วนสำคัญ...",
        category: "อัคลาก",
        author: "อ.ฟาฏิมะห์ ฮุสเซน",
        authorTitle: "อาจารย์พิเศษ",
        slug: "islamic-ethics-daily-life",
        publishedAt: "5 มกราคม 2567",
        readTime: "7 นาที",
        views: 756,
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop",
        status: "published",
    },
];
const videos = [
    {
        title: "การละหมาดที่สมบูรณ์",
        excerpt: "คำบรรยายเกี่ยวกับหลักการและวิธีการละหมาดที่ถูกต้อง...",
        description: "การละหมาดเป็นเสาหลักที่สำคัญที่สุดของอิสลาม...",
        category: "บรรยายพิเศษ",
        author: "อิหม่าม ยุสุฟ",
        authorTitle: "นักวิชาการด้านฟิกฮ์",
        slug: "perfect-prayer",
        duration: "15:30",
        views: "2.5K",
        publishedAt: "10 มกราคม 2567",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        coverImage: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=800&h=450&fit=crop",
        status: "published",
    },
    {
        title: "ตะฟซีรสูเราะห์อัลฟาติฮะห์",
        excerpt: "การตีความและคำอธิบายสูเราะห์อัลฟาติฮะห์อย่างละเอียด...",
        description: "สูเราะห์อัลฟาติฮะห์เป็นสูเราะห์ที่สำคัญที่สุดในอัลกุรอาน...",
        category: "อัลกุรอาน",
        author: "ดร.อาห์มัด",
        authorTitle: "ผู้เชี่ยวชาญด้านตัฟซีร",
        slug: "tafsir-al-fatihah",
        duration: "22:15",
        views: "4.1K",
        publishedAt: "8 มกราคม 2567",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        coverImage: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=450&fit=crop",
        status: "published",
    },
    {
        title: "ชีวิตศาสดามุหัมมัด ﷺ",
        excerpt: "เรื่องราวและบทเรียนจากชีวประวัติท่านศาสดา...",
        description: "ซีเราะห์นบะวียะห์ (ชีวประวัติท่านนบี ﷺ) เป็นบทเรียนอันล้ำค่า...",
        category: "ซีเราะห์",
        author: "อ.อิสมาอีล",
        authorTitle: "นักประวัติศาสตร์อิสลาม",
        slug: "prophet-muhammad-life",
        duration: "18:45",
        views: "6.8K",
        publishedAt: "5 มกราคม 2567",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        coverImage: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=450&fit=crop",
        status: "published",
    },
];
const journals = [
    {
        title: "บทบาทมัสยิดในสังคมร่วมสมัย",
        excerpt: "การศึกษาบทบาทและความสำคัญของมัสยิดในสังคมปัจจุบัน...",
        content: "# บทบาทมัสยิดในสังคมร่วมสมัย\n\n## บทคัดย่อ\nการศึกษานี้มีวัตถุประสงค์เพื่อวิเคราะห์...",
        category: "ฉบับที่ 15",
        author: "วารสารอันนูร",
        slug: "mosque-role-modern-society",
        date: "มกราคม 2567",
        issue: "ปีที่ 8 ฉบับที่ 15",
        coverImage: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=450&fit=crop",
        status: "published",
    },
    {
        title: "การศึกษาอิสลามในยุคดิจิทัล",
        excerpt: "แนวทางและความท้าทายในการศึกษาศาสนายุคเทคโนโลยี...",
        content: "# การศึกษาอิสลามในยุคดิจิทัล\n\n## บทคัดย่อ\nบทความนี้ศึกษาแนวทางการจัดการศึกษาอิสลาม...",
        category: "ฉบับที่ 14",
        author: "วารสารอันนูร",
        slug: "islamic-education-digital-age",
        date: "ธันวาคม 2566",
        issue: "ปีที่ 8 ฉบับที่ 14",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop",
        status: "published",
    },
];
const salamArticles = [
    {
        title: "อิสลามคืออะไร?",
        excerpt: "ความหมายและหลักการพื้นฐานของศาสนาอิสลามสำหรับผู้เริ่มต้น...",
        content: "# อิสลามคืออะไร?\n\n## ความหมายของอิสลาม\nคำว่า \"อิสลาม\" มาจากรากศัพท์ภาษาอาหรับ...",
        category: "พื้นฐาน",
        author: "ทีมบรรณาธิการ",
        slug: "what-is-islam",
        icon: "🤲",
        publishedAt: "1 มกราคม 2567",
        coverImage: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=450&fit=crop",
        status: "published",
    },
    {
        title: "เสาหลัก 5 ประการของอิสลาม",
        excerpt: "ศะฮาดะห์ ศอลาต ซะกาต เศาม์ ฮัจญ์ - หลักปฏิบัติสำคัญ...",
        content: "# เสาหลัก 5 ประการของอิสลาม\n\nเสาหลัก 5 ประการ (อัรกานุลอิสลาม) เป็นพื้นฐานสำคัญ...",
        category: "การปฏิบัติ",
        author: "อ.ซอลิห์ มะห์มูด",
        slug: "five-pillars-islam",
        icon: "📿",
        publishedAt: "15 ธันวาคม 2566",
        coverImage: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=800&h=450&fit=crop",
        status: "published",
    },
    {
        title: "ประเพณีและวัฒนธรรมอิสลาม",
        excerpt: "การเรียนรู้ประเพณีและวัฒนธรรมสำคัญในอิสลาม...",
        content: "# ประเพณีและวัฒนธรรมอิสลาม\n\n## การทักทาย\nมุสลิมทักทายกันด้วยคำว่า...",
        category: "วัฒนธรรม",
        author: "ดร.ไอชะห์ นูรี",
        slug: "islamic-traditions-culture",
        icon: "🌙",
        publishedAt: "10 ธันวาคม 2566",
        coverImage: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&h=450&fit=crop",
        status: "published",
    },
];
const categories = [
    { name: "อากีดะห์", slug: "aqeedah", description: "หลักความเชื่อในอิสลาม", type: "article" },
    { name: "ฟิกห์", slug: "fiqh", description: "หลักนิติศาสตร์อิสลาม", type: "article" },
    { name: "อัคลาก", slug: "akhlaq", description: "จริยธรรมอิสลาม", type: "article" },
    { name: "บรรยายพิเศษ", slug: "lecture", description: "การบรรยายพิเศษ", type: "video" },
    { name: "อัลกุรอาน", slug: "quran", description: "การศึกษาอัลกุรอาน", type: "video" },
    { name: "ซีเราะห์", slug: "seerah", description: "ชีวประวัติท่านนบี", type: "video" },
    { name: "พื้นฐาน", slug: "basics", description: "ความรู้พื้นฐาน", type: "salam" },
    { name: "การปฏิบัติ", slug: "practice", description: "การปฏิบัติในอิสลาม", type: "salam" },
    { name: "วัฒนธรรม", slug: "culture", description: "วัฒนธรรมอิสลาม", type: "salam" },
];
const users = [
    {
        name: "Admin",
        email: "admin@islamicportal.com",
        password: crypto.createHash('sha256').update('admin123').digest('hex'),
        role: "admin",
        isActive: true,
    },
    {
        name: "Editor",
        email: "editor@islamicportal.com",
        password: crypto.createHash('sha256').update('editor123').digest('hex'),
        role: "editor",
        isActive: true,
    },
];
async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        console.log('🗑️  Clearing existing data...');
        await Article.deleteMany({});
        await Video.deleteMany({});
        await Journal.deleteMany({});
        await SalamArticle.deleteMany({});
        await User.deleteMany({});
        await Category.deleteMany({});
        console.log('📝 Inserting articles...');
        await Article.insertMany(articles);
        console.log('🎬 Inserting videos...');
        await Video.insertMany(videos);
        console.log('📚 Inserting journals...');
        await Journal.insertMany(journals);
        console.log('🌙 Inserting salam articles...');
        await SalamArticle.insertMany(salamArticles);
        console.log('📁 Inserting categories...');
        await Category.insertMany(categories);
        console.log('👤 Inserting users...');
        await User.insertMany(users);
        console.log('');
        console.log('✅ Seed completed successfully!');
        console.log('');
        console.log('📊 Summary:');
        console.log(`   - Articles: ${articles.length}`);
        console.log(`   - Videos: ${videos.length}`);
        console.log(`   - Journals: ${journals.length}`);
        console.log(`   - Salam Articles: ${salamArticles.length}`);
        console.log(`   - Categories: ${categories.length}`);
        console.log(`   - Users: ${users.length}`);
        console.log('');
        console.log('🔐 Default users:');
        console.log('   - admin@islamicportal.com / admin123');
        console.log('   - editor@islamicportal.com / editor123');
        await mongoose_1.default.disconnect();
        console.log('');
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map