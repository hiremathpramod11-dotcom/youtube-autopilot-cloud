const { ModernAuth } = require('../modern-auth');
const fs = require('fs');
const path = require('path');

async function runReauth() {
  console.log('═'.repeat(60));
  console.log('🔐 YOUTUBE ONE-CLICK OAUTH RE-AUTHENTICATION');
  console.log('═'.repeat(60));

  const auth = new ModernAuth();
  try {
    const tokens = await auth.authenticate();
    console.log('🎉 Fresh OAuth tokens successfully acquired!');
    
    // Also sync shadow-print snapshot
    try {
      const tokensPath = path.join(__dirname, '..', 'config', 'tokens.json');
      const manifestPath = path.join(__dirname, '..', 'shadow-print', 'system_manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        manifest.updated_at = new Date().toISOString();
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      }
    } catch (e) {}

    console.log('✓ Token refresh completed. System ready.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Re-authentication failed:', err.message);
    process.exit(1);
  }
}

runReauth();
