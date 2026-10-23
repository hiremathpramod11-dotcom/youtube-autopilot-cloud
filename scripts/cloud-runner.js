require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { execSync } = require('child_process');

console.log('═'.repeat(65));
console.log('☁️ YOUTUBE 30-DAY CLOUD AUTOPILOT RUNNER');
console.log('   Running in GitHub Cloud (24/7 Serverless VM)');
console.log('═'.repeat(65));

async function run() {
  const calendarPath = path.join(__dirname, '..', 'data', '30_day_calendar.json');
  if (!fsSync.existsSync(calendarPath)) {
    console.error('Calendar file not found:', calendarPath);
    process.exit(1);
  }

  const calendar = JSON.parse(await fs.readFile(calendarPath, 'utf8'));
  const pending = calendar.filter(c => c.status === 'pending');

  console.log(`📊 Total Days in Queue: ${calendar.length}`);
  console.log(`⏳ Pending Days to Schedule: ${pending.length}`);

  if (pending.length === 0) {
    console.log('🎉 ALL 30 DAYS ARE FULLY PRODUCED & SCHEDULED IN YOUTUBE CLOUD!');
    return;
  }

  // Process next pending batch (up to 4-5 videos per cloud run to stay within daily quota)
  const batch = pending.slice(0, 5);
  console.log(`🚀 Processing Cloud Batch of ${batch.length} days: Days [${batch.map(b => b.day).join(', ')}]`);

  for (const item of batch) {
    console.log(`\n☁️ [Cloud Job] Producing & Scheduling Day ${item.day}: ${item.title}`);
    try {
      execSync(`node scripts/produce-scheduled-video.js ${item.day}`, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log(`✅ Day ${item.day} successfully scheduled into YouTube Cloud!`);
    } catch (err) {
      console.error(`⚠️ Notice on Day ${item.day}:`, err.message);
      if (err.message.includes('quotaExceeded')) {
        console.log('Reached daily YouTube quota for this cloud run. Next batch will run on tomorrow’s cloud trigger.');
        break;
      }
    }
  }

  console.log('\n═'.repeat(65));
  console.log('✅ Cloud batch run complete. Progress saved.');
  console.log('═'.repeat(65));
}

run().catch(err => {
  console.error('Fatal cloud error:', err);
  process.exit(1);
});

