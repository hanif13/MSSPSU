const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

const categories = [
    // Articles
    { name: 'อากีดะห์', description: 'หลักความเชื่อ', type: 'article', color: 'blue' },
    { name: 'ฟิกห์', description: 'นิติศาสตร์อิสลาม', type: 'article', color: 'green' },
    { name: 'อัคลาก', description: 'จริยธรรม', type: 'article', color: 'purple' },

    // Videos
    { name: 'ตัฟซีร', description: 'อรรถาธิบายอัลกุรอาน', type: 'video', color: 'pink' },
    { name: 'ซีเราะห์', description: 'ประวัติศาสตร์', type: 'video', color: 'orange' },

    // Journal
    { name: 'งานวิจัย', description: 'บทความวิจัยทางวิชาการ', type: 'journal', color: 'teal' },

    // Salam (Hello Islam)
    { name: 'พื่นฐานศาสนา', description: 'สำหรับผู้สนใจทั่วไป', type: 'salam', color: 'yellow' }
];

async function seed() {
    console.log('🌱 Seeding categories...');
    for (const cat of categories) {
        try {
            const slug = cat.name.toLowerCase().replace(/\s+/g, '-');
            await axios.post(`${API_BASE_URL}/categories`, { ...cat, slug });
            console.log(`✅ Created category: ${cat.name} (${cat.type})`);
        } catch (err) {
            console.error(`❌ Failed to create category ${cat.name}:`, err.response?.data || err.message);
        }
    }
    console.log('✅ Seeding complete!');
}

seed();
