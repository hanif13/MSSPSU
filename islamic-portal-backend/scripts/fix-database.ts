/**
 * Database Fix Script
 * Fixes all data issues:
 * 1. Future publication dates (2569 -> 2567/current)
 * 2. Repetitive excerpts (same as title)
 * 3. Empty cover images (add default placeholders)
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/islamic-portal';

// Default cover images
const DEFAULT_COVERS = {
    article: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=600&fit=crop',
    video: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop',
    journal: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    salam: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=600&fit=crop',
};

// Proper excerpts for each content
const EXCERPTS: Record<string, string> = {
    'เหตุใดมุสลิมไม่สามารถเฉลิมฉลองวันวาเลนไทน์': 'ทำความเข้าใจเกี่ยวกับมุมมองของอิสลามต่อการเฉลิมฉลองวันวาเลนไทน์ และเหตุผลที่มุสลิมไม่สามารถมีส่วนร่วมในงานเฉลิมฉลองนี้ได้',
    ' อิสลาม หลังฉาก สงคราม': 'การบรรยายพิเศษเรื่อง "อิสลาม หลังฉาก สงคราม" โดย อ.ปวีณ ฤทธิ์งาม จากชมรมมุสลิม ม.อ. หาดใหญ่',
    'คุณค่าของการกระทำ ขึ้นอยู่กับเจตนาในหัวใจ': 'บทความจากวารสารอันนูร ฉบับที่ 1 กล่าวถึงความสำคัญของเจตนาในการกระทำของมุสลิม และผลกระทบต่อการได้รับบุญกุศล',
    '❝ถ้าจักรวาลนี้มีผู้สร้าง แล้วใครสร้างผู้สร้าง ?❞ ': 'คำถามที่พบบ่อยเกี่ยวกับการมีอยู่ของพระเจ้า และคำตอบจากมุมมองของอิสลาม ที่อธิบายด้วยเหตุผลและตรรกะ',
};

async function fixDatabaseIssues() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully!');

        const db = mongoose.connection.db!;

        // Fix Articles
        console.log('\n📝 Fixing Articles...');
        const articlesCollection = db.collection('articles');
        const articles = await articlesCollection.find({}).toArray();

        for (const article of articles) {
            const updates: any = {};

            // Fix date (2569 -> 2567)
            if (article.publishedAt && article.publishedAt.includes('2569')) {
                updates.publishedAt = article.publishedAt.replace('2569', '2567');
            }

            // Fix excerpt
            if (article.excerpt === article.title && article.title in EXCERPTS) {
                updates.excerpt = EXCERPTS[article.title as string];
            }

            // Fix cover image
            if (!article.coverImage || article.coverImage === '') {
                updates.coverImage = DEFAULT_COVERS.article;
            }

            if (Object.keys(updates).length > 0) {
                await articlesCollection.updateOne(
                    { _id: article._id },
                    { $set: updates }
                );
                console.log(`✅ Updated article: ${article.title}`);
            }
        }

        // Fix Videos
        console.log('\n🎥 Fixing Videos...');
        const videosCollection = db.collection('videos');
        const videos = await videosCollection.find({}).toArray();

        for (const video of videos) {
            const updates: any = {};

            // Fix date
            if (video.publishedAt && video.publishedAt.includes('2569')) {
                updates.publishedAt = video.publishedAt.replace('2569', '2567');
            }

            // Fix excerpt
            if (video.excerpt === video.title && video.title in EXCERPTS) {
                updates.excerpt = EXCERPTS[video.title as string];
            }

            // Fix cover image
            if (!video.coverImage || video.coverImage === '') {
                updates.coverImage = DEFAULT_COVERS.video;
            }

            if (Object.keys(updates).length > 0) {
                await videosCollection.updateOne(
                    { _id: video._id },
                    { $set: updates }
                );
                console.log(`✅ Updated video: ${video.title}`);
            }
        }

        // Fix Journals
        console.log('\n📚 Fixing Journals...');
        const journalsCollection = db.collection('journals');
        const journals = await journalsCollection.find({}).toArray();

        for (const journal of journals) {
            const updates: any = {};

            // Fix date
            if (journal.date && journal.date.includes('2569')) {
                updates.date = journal.date.replace('2569', '2567');
            }

            // Fix excerpt
            if (journal.excerpt === journal.title && journal.title in EXCERPTS) {
                updates.excerpt = EXCERPTS[journal.title as string];
            }

            // Fix cover image
            if (!journal.coverImage || journal.coverImage === '') {
                updates.coverImage = DEFAULT_COVERS.journal;
            }

            if (Object.keys(updates).length > 0) {
                await journalsCollection.updateOne(
                    { _id: journal._id },
                    { $set: updates }
                );
                console.log(`✅ Updated journal: ${journal.title}`);
            }
        }

        // Fix Salam Articles
        console.log('\n💬 Fixing Salam Articles...');
        const salamCollection = db.collection('salamarticles');
        const salamArticles = await salamCollection.find({}).toArray();

        for (const salam of salamArticles) {
            const updates: any = {};

            // Fix date
            if (salam.publishedAt && salam.publishedAt.includes('2569')) {
                updates.publishedAt = salam.publishedAt.replace('2569', '2567');
            }

            // Fix excerpt
            if (salam.excerpt === salam.title && salam.title in EXCERPTS) {
                updates.excerpt = EXCERPTS[salam.title as string];
            }

            // Fix cover image
            if (!salam.coverImage || salam.coverImage === '') {
                updates.coverImage = DEFAULT_COVERS.salam;
            }

            if (Object.keys(updates).length > 0) {
                await salamCollection.updateOne(
                    { _id: salam._id },
                    { $set: updates }
                );
                console.log(`✅ Updated salam article: ${salam.title}`);
            }
        }

        console.log('\n✅ All fixes completed successfully!');

    } catch (error) {
        console.error('❌ Error fixing database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

// Run the script
fixDatabaseIssues();
