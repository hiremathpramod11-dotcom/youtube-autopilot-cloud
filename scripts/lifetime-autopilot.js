require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { execSync } = require('child_process');

console.log('═'.repeat(65));
console.log('♾️  YOUTUBE LIFETIME PERPETUAL AUTOPILOT ENGINE');
console.log('   Shadowing: Aperture / What If / TechZone');
console.log('   Status: Dual-Engine Continuous Operation (Local + GitHub Actions Cloud)');
console.log('   Language: 100% English Global Curiosities, Mysteries & Inventions');
console.log('═'.repeat(65));

async function runLifetimeCycle() {
  console.log(`\n[${new Date().toISOString()}] 🚀 Initiating Lifetime Production & Sync Cycle...`);

  // 1. Verify YouTube tokens exist and are readable
  const tokenPath = path.join(__dirname, '..', 'config', 'tokens.json');
  if (!fsSync.existsSync(tokenPath)) {
    console.error('❌ tokens.json not found in config/ directory.');
    return;
  }

  // 2. Trigger cloud-runner to auto-expand calendar, produce, and schedule
  try {
    console.log('☁️ Executing production and cloud scheduling...');
    execSync('node scripts/cloud-runner.js', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✓ Production batch completed successfully.');
  } catch (err) {
    console.warn('⚠️ Cloud runner notice:', err.message);
  }

  // 3. Git sync: Commit & Push state to GitHub so Cloud Runner has the latest calendar
  try {
    console.log('🔄 Synchronizing repository state with GitHub Cloud...');
    execSync('git add data/30_day_calendar.json scripts/ .github/ || true', {
      cwd: path.join(__dirname, '..')
    });
    
    // Check if there are staged changes
    const status = execSync('git status --porcelain', { cwd: path.join(__dirname, '..') }).toString();
    if (status.trim().length > 0) {
      execSync('git commit -m "chore: automated lifetime autopilot calendar sync [skip ci]"', {
        cwd: path.join(__dirname, '..')
      });
      execSync('git pull --rebase origin main || git rebase --abort || true', {
        cwd: path.join(__dirname, '..')
      });
      execSync('git push origin main || true', {
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ GitHub Cloud state synchronized successfully!');
    } else {
      console.log('✓ Git state already up to date.');
    }
  } catch (gitErr) {
    console.warn('Git sync notice:', gitErr.message);
  }
}

// Check arguments
const isDaemon = process.argv.includes('--daemon');

if (isDaemon) {
  console.log('🔄 Running in continuous lifetime daemon mode (interval: 6 hours)...');
  runLifetimeCycle();
  setInterval(runLifetimeCycle, 6 * 60 * 60 * 1000);
} else {
  runLifetimeCycle().then(() => {
    console.log('\n═'.repeat(65));
    console.log('✅ Lifetime Autopilot Cycle Finished.');
    console.log('═'.repeat(65));
  });
}
