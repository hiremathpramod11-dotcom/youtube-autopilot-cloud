const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', '..');
require('dotenv').config({ path: path.join(basePath, '.env') });
const creds = JSON.parse(fs.readFileSync(path.join(basePath, 'config/credentials.json'), 'utf8'));
const tokens = JSON.parse(fs.readFileSync(path.join(basePath, 'config/tokens.json'), 'utf8'));

const auth = new google.auth.OAuth2(creds.youtube.client_id, creds.youtube.client_secret);
auth.setCredentials(tokens.youtube || tokens);
const yt = google.youtube({ version: 'v3', auth });

const STORE_URL = process.env.PROMOTIONAL_STORE_URL || 'https://latinas-plastic-manitoba-handling.trycloudflare.com/';
const PROMO_HEADER = `🛍️ 🔥 EXCLUSIVE FLASH SALE: Flat 50% OFF + Free Express Delivery on trending viral gadgets!\n👉 Shop AquaFlow Direct: ${STORE_URL}\n(Cash on Delivery & PhonePe / GPay Accepted | 7-Day Replacement Guarantee)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
const PROMO_COMMENT = `🛍️ 🔥 FLASH SALE: Get Flat 50% OFF + Free Express Delivery on trending viral gadgets & smart lifestyle inventions! 👉 ${STORE_URL} (Cash on Delivery & Instant UPI Accepted! Limited Stock Available 🛒👇)`;

async function promoteDropshipping() {
  console.log('═'.repeat(65));
  console.log('🚀 PROMOTING DROPSHIPPING STORE ON YOUTUBE CHANNEL');
  console.log(`   Store URL: ${STORE_URL}`);
  console.log('═'.repeat(65));

  // 1. Load all tracked videos from 30_day_calendar.json
  const calendarPath = path.join(basePath, 'data', '30_day_calendar.json');
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));

  const videoList = [];
  calendar.forEach(c => {
    if (c.videoId) videoList.push({ day: c.day, type: 'Long-Form', id: c.videoId, title: c.title });
    if (c.shortVideoId) videoList.push({ day: c.day, type: 'Short', id: c.shortVideoId, title: c.title });
  });

  console.log(`\nFound ${videoList.length} videos to promote dropshipping store.`);

  // 2. Fetch video details from YouTube in chunks
  const videoIds = videoList.map(v => v.id);
  const chunkSize = 50;
  for (let i = 0; i < videoIds.length; i += chunkSize) {
    const chunk = videoIds.slice(i, i + chunkSize);
    const res = await yt.videos.list({
      part: ['snippet', 'status'],
      id: chunk.join(',')
    });

    for (const item of res.data.items) {
      const vidId = item.id;
      const snippet = item.snippet;
      const matched = videoList.find(v => v.id === vidId);
      const tag = matched ? `[Day ${matched.day} ${matched.type}]` : '[Video]';

      console.log(`\n▶ Processing ${tag} ${vidId}: ${snippet.title.substring(0, 40)}...`);

      // A. Update description if link is missing
      if (!snippet.description.includes(STORE_URL)) {
        const updatedDesc = PROMO_HEADER + snippet.description;
        try {
          await yt.videos.update({
            part: ['snippet'],
            requestBody: {
              id: vidId,
              snippet: {
                title: snippet.title,
                description: updatedDesc,
                categoryId: snippet.categoryId,
                tags: snippet.tags || [],
                defaultLanguage: snippet.defaultLanguage || 'kn',
                defaultAudioLanguage: snippet.defaultAudioLanguage || 'kn'
              }
            }
          });
          console.log(`  ✅ Store link injected into description!`);
        } catch (e) {
          console.warn(`  ⚠️ Description update warning:`, e.message);
        }
      } else {
        console.log(`  ✓ Description already contains store link.`);
      }

      // B. Post promotional pinned comment
      try {
        await yt.commentThreads.insert({
          part: ['snippet'],
          requestBody: {
            snippet: {
              videoId: vidId,
              topLevelComment: {
                snippet: {
                  textOriginal: PROMO_COMMENT
                }
              }
            }
          }
        });
        console.log(`  ✅ Promotional pinned comment posted!`);
      } catch (commErr) {
        // Comments may be disabled on some scheduled videos or rate-limited
        console.log(`  ℹ️ Comment notice:`, commErr.message);
      }
    }
  }

  console.log('\n═'.repeat(65));
  console.log('🎉 ALL VIDEOS UPDATED WITH DROPSHIPPING STORE PROMOTION!');
  console.log('═'.repeat(65));
}

promoteDropshipping().catch(console.error);
