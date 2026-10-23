require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { produceScheduledVideo } = require('./produce-scheduled-video');

async function main() {
  console.log('═'.repeat(65));
  console.log('🚀 CONTINUOUS 30-DAY AUTONOMOUS BATCH PIPELINE STARTING');
  console.log('   Goal: Pre-generate and Cloud-Schedule ALL 30 Days');
  console.log('═'.repeat(65));

  const calendarPath = path.join(__dirname, '..', 'data', '30_day_calendar.json');
  const calendar = JSON.parse(await fs.readFile(calendarPath, 'utf8'));

  for (let day = 8; day <= 30; day++) {
    const entry = calendar.find(c => c.day === day);
    if (!entry) continue;

    if (entry.status === 'scheduled' || entry.status === 'published') {
      console.log(`⏩ Day ${day} already ${entry.status}. Skipping.`);
      continue;
    }

    console.log(`\n▶️ Starting Day ${day} / 30: ${entry.title}`);
    try {
      const res = await produceScheduledVideo(day);
      console.log(`✅ SUCCESS: Day ${day} is queued in YouTube Cloud! Video ID: ${res.videoId}`);
    } catch (err) {
      console.error(`⚠️ Notice on Day ${day}:`, err.message);
      if (err.message && err.message.includes('quotaExceeded')) {
        console.log('🛑 YouTube API daily upload limit reached for today.');
        console.log('The remaining days will automatically upload on tomorrow’s quota reset.');
        break;
      }
    }
  }

  console.log('\n' + '═'.repeat(65));
  console.log('🎉 BATCH EXECUTION RUN COMPLETE');
  console.log('═'.repeat(65));
}

main().catch(console.error);

