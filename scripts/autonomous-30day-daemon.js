const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const cron = require('node-cron');
const { execSync } = require('child_process');

console.log('═'.repeat(65));
console.log('🤖 PERPETUAL LIFETIME YOUTUBE AUTOPILOT DAEMON ACTIVE');
console.log('   Channel: @Kannadiga_369');
console.log('   Mode: 100% Zero-Touch Autonomous Production & Cloud Scheduling');
console.log('   Content: Worldwide English Curiosities, Mysteries & Inventions');
console.log('═'.repeat(65));

function runCloudRunner() {
  console.log(`\n[${new Date().toISOString()}] 🚀 Triggering Cloud Autopilot Production Batch...`);
  try {
    execSync('node scripts/cloud-runner.js', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log(`[${new Date().toISOString()}] ✅ Production batch completed successfully.`);
  } catch (err) {
    console.warn(`[${new Date().toISOString()}] Batch run notice:`, err.message);
  }
}

// 1. Run immediately on daemon launch / Windows Task Scheduler start
runCloudRunner();

// 2. Scheduled daily trigger at 1:00 PM IST (07:30 UTC), immediately after daily quota resets
cron.schedule('30 7 * * *', () => {
  console.log('⏰ Scheduled daily trigger running (1:00 PM IST)...');
  runCloudRunner();
});

// 3. Secondary catch-up trigger at 6:30 PM IST (13:00 UTC)
cron.schedule('0 13 * * *', () => {
  console.log('⏰ Secondary catch-up trigger running (6:30 PM IST)...');
  runCloudRunner();
});

console.log('✓ Lifetime Daemon is active and watching schedule triggers.');
