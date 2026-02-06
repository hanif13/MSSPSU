#!/bin/bash

# Fix Database via API
# Updates all content to fix dates, excerpts, and cover images

API_URL="http://localhost:3001/api"

echo "🔧 Fixing Content Data via API..."
echo ""

# Default cover images
ARTICLE_COVER="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=600&fit=crop"
VIDEO_COVER="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop"
JOURNAL_COVER="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop"
SALAM_COVER="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=600&fit=crop"

# Fix Articles
echo "📝 Fixing Articles..."
ARTICLE_ID=$(curl -s "$API_URL/articles" | jq -r '.[0]._id')
if [ ! -z "$ARTICLE_ID" ]; then
    curl -s -X PUT "$API_URL/articles/$ARTICLE_ID" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "เหตุใดมุสลิมไม่สามารถเฉลิมฉลองวันวาเลนไทน์",
            "excerpt": "ทำความเข้าใจเกี่ยวกับมุมมองของอิสลามต่อการเฉลิมฉลองวันวาเลนไทน์ และเหตุผลที่มุสลิมไม่สามารถมีส่วนร่วมในงานเฉลิมฉลองนี้ได้",
            "publishedAt": "5 ก.พ. 2567",
            "coverImage": "'$ARTICLE_COVER'"
        }' > /dev/null
    echo "✅ Updated article"
fi

# Fix Videos
echo "🎥 Fixing Videos..."
VIDEO_ID=$(curl -s "$API_URL/videos" | jq -r '.[0]._id')
if [ ! -z "$VIDEO_ID" ]; then
    curl -s -X PUT "$API_URL/videos/$VIDEO_ID" \
        -H "Content-Type: application/json" \
        -d '{
            "title": " อิสลาม หลังฉาก สงคราม",
            "excerpt": "การบรรยายพิเศษเรื่อง \"อิสลาม หลังฉาก สงคราม\" โดย อ.ปวีณ ฤทธิ์งาม จากชมรมมุสลิม ม.อ. หาดใหญ่",
            "publishedAt": "5 ก.พ. 2567",
            "coverImage": "'$VIDEO_COVER'"
        }' > /dev/null
    echo "✅ Updated video"
fi

# Fix Journals
echo "📚 Fixing Journals..."
JOURNAL_ID=$(curl -s "$API_URL/journals" | jq -r '.[0]._id')
if [ ! -z "$JOURNAL_ID" ]; then
    curl -s -X PUT "$API_URL/journals/$JOURNAL_ID" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "คุณค่าของการกระทำ ขึ้นอยู่กับเจตนาในหัวใจ",
            "excerpt": "บทความจากวารสารอันนูร ฉบับที่ 1 กล่าวถึงความสำคัญของเจตนาในการกระทำของมุสลิม และผลกระทบต่อการได้รับบุญกุศล",
            "date": "5 ก.พ. 2567",
            "coverImage": "'$JOURNAL_COVER'"
        }' > /dev/null
    echo "✅ Updated journal"
fi

# Fix Salam Articles
echo "💬 Fixing Salam Articles..."
SALAM_ID=$(curl -s "$API_URL/salam-articles" | jq -r '.[0]._id')
if [ ! -z "$SALAM_ID" ]; then
    curl -s -X PUT "$API_URL/salam-articles/$SALAM_ID" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "❝ถ้าจักรวาลนี้มีผู้สร้าง แล้วใครสร้างผู้สร้าง ?❞ ",
            "excerpt": "คำถามที่พบบ่อยเกี่ยวกับการมีอยู่ของพระเจ้า และคำตอบจากมุมมองของอิสลาม ที่อธิบายด้วยเหตุผลและตรรกะ",
            "publishedAt": "5 ก.พ. 2567",
            "coverImage": "'$SALAM_COVER'"
        }' > /dev/null
    echo "✅ Updated salam article"
fi

echo ""
echo "✅ All content fixed successfully!"
