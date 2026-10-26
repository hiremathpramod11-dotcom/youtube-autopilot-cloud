const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const fs = require('fs').promises;
const fsSync = require('fs');
const cron = require('node-cron');
const { exec } = require('child_process');

console.log('═'.repeat(65));
console.log('🤖 30-DAY AUTONOMOUS YOUTUBE CLOUD SCHEDULER DAEMON ACTIVE');
console.log('   Channel: @Kannadiga_369');
console.log('   Mode: 100% Zero-Touch Autonomous Video Production & Cloud Scheduling');
console.log('═'.repeat(65));

async function getNextPendingDay() {
  const calendarPath = path.join(__dirname, '..', 'data', '30_day_calendar.json');
  if (!fsSync.existsSync(calendarPath)) return null;
  const calendar = JSON.parse(await fs.readFile(calendarPath, 'utf8'));
  return calendar.find(c => c.status === 'pending');
}

async function runProductionJob() {
  console.log(`\n[${new Date().toISOString()}] Checking 30-day queue...`);
  try {
    const nextDay = await getNextPendingDay();
    if (!nextDay) {
      console.log('🎉 All 30 days are scheduled and queued in YouTube cloud!');
      return;
    }

    console.log(`⚡ Found next pending day: Day ${nextDay.day} (${nextDay.title})`);
    console.log(`Starting autonomous production...`);

    const producerScript = path.join(__dirname, 'produce-scheduled-video.js');
    exec(`node "${producerScript}" ${nextDay.day}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Error producing Day ${nextDay.day}:`, err.message);
        if (stderr.includes('quotaExceeded')) {
          console.log('⚠️ YouTube quota reached for today. Will automatically resume tomorrow after quota reset.');
        }
      } else {
        console.log(stdout);
        console.log(`✅ Day ${nextDay.day} successfully scheduled into YouTube cloud!`);
      }
    });
  } catch (err) {
    console.error('Job error:', err.message);
  }
}

// Run immediately on boot
runProductionJob();

// Scheduled to run every day at 1:00 PM IST (07:30 UTC), immediately after YouTube quota resets
cron.schedule('30 7 * * *', () => {
  console.log('⏰ Scheduled daily trigger running (1:00 PM IST)...');
  runProductionJob();
});

console.log('✓ Cron daemon is alive and watching schedule queue.');

