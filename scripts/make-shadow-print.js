const { google } = require('googleapis');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function makeShadowPrint() {
  console.log('═'.repeat(65));
  console.log('📸 GENERATING FULL SHADOW PRINT (MASTER SNAPSHOT & ARCHIVE)');
  console.log('   Channel, Video, Audio, Calendar & Setup');
  console.log('═'.repeat(65));

  const rootDir = path.join(__dirname, '..');
  const shadowDir = path.join(rootDir, 'shadow-print');
  await fs.mkdir(shadowDir, { recursive: true });

  // 1. YouTube Client
  const creds = JSON.parse(await fs.readFile(path.join(rootDir, 'config', 'credentials.json'), 'utf8'));
  const tokens = JSON.parse(await fs.readFile(path.join(rootDir, 'config', 'tokens.json'), 'utf8'));
  const auth = new google.auth.OAuth2(creds.youtube.client_id, creds.youtube.client_secret);
  auth.setCredentials(tokens.youtube || tokens);
  const yt = google.youtube({ version: 'v3', auth });

  // 2. Fetch Channel Snapshot
  console.log('📡 Fetching complete YouTube channel snapshot...');
  const chRes = await yt.channels.list({
    part: ['id', 'snippet', 'statistics', 'brandingSettings', 'contentDetails', 'status'],
    mine: true
  });
  const channelData = chRes.data.items[0];

  // 3. Fetch All Playlists
  console.log('📑 Fetching all channel playlists...');
  const plRes = await yt.playlists.list({
    part: ['id', 'snippet', 'contentDetails', 'status'],
    mine: true,
    maxResults: 50
  });
  const playlists = plRes.data.items || [];

  // 4. Fetch All Videos from Calendar
  const calendarPath = path.join(rootDir, 'data', '30_day_calendar.json');
  const calendar = JSON.parse(await fs.readFile(calendarPath, 'utf8'));

  const trackedVideos = [];
  calendar.forEach(c => {
    if (c.videoId) trackedVideos.push({ day: c.day, type: 'Long-Form', id: c.videoId, status: c.status, title: c.title, scheduledDate: c.scheduledDate });
    if (c.shortVideoId) trackedVideos.push({ day: c.day, type: 'Short', id: c.shortVideoId, status: c.status, title: c.title, scheduledDate: c.scheduledDate });
  });

  console.log(`🎬 Fetching YouTube cloud live state for ${trackedVideos.length} tracked videos...`);
  const liveVideoDetails = [];
  const chunkSize = 50;
  for (let i = 0; i < trackedVideos.length; i += chunkSize) {
    const chunk = trackedVideos.slice(i, i + chunkSize);
    const vRes = await yt.videos.list({
      part: ['id', 'snippet', 'status', 'statistics', 'contentDetails'],
      id: chunk.map(v => v.id).join(',')
    });
    (vRes.data.items || []).forEach(item => {
      const matched = trackedVideos.find(t => t.id === item.id);
      liveVideoDetails.push({
        day: matched?.day,
        type: matched?.type,
        id: item.id,
        title: item.snippet.title,
        privacyStatus: item.status.privacyStatus,
        publishAt: item.status.publishAt,
        views: item.statistics?.viewCount || 0,
        likes: item.statistics?.likeCount || 0,
        comments: item.statistics?.commentCount || 0,
        tags: item.snippet.tags || [],
        descriptionPreview: (item.snippet.description || '').substring(0, 120) + '...'
      });
    });
  }

  // 5. Scan Audio Assets
  console.log('🎵 Scanning audio production assets...');
  const audioAssets = [];
  const audioDir = path.join(rootDir, 'assets', 'audio');
  if (fsSync.existsSync(audioDir)) {
    const files = await fs.readdir(audioDir);
    for (const f of files) {
      const stat = await fs.stat(path.join(audioDir, f));
      audioAssets.push({ name: f, path: `assets/audio/${f}`, sizeBytes: stat.size });
    }
  }

  // 6. System Manifest & Setup Configuration
  const systemManifest = {
    generatedAt: new Date().toISOString(),
    channel: {
      id: channelData.id,
      title: channelData.snippet.title,
      handle: channelData.snippet.customUrl,
      subscribers: channelData.statistics.subscriberCount,
      totalViews: channelData.statistics.viewCount,
      totalVideos: channelData.statistics.videoCount,
      keywords: channelData.brandingSettings?.channel?.keywords,
      description: channelData.snippet.description
    },
    ecommerce: {
      storeName: 'AquaFlow Direct',
      url: process.env.PROMOTIONAL_STORE_URL || 'https://latinas-plastic-manitoba-handling.trycloudflare.com/',
      status: 'Active Injected in All Descriptions and Pinned Comments'
    },
    cloudAutomation: {
      repository: 'https://github.com/hiremathpramod11-dotcom/youtube-autopilot-cloud.git',
      workflowFile: '.github/workflows/youtube-30day-autopilot.yml',
      triggers: [
        '12:45 PM IST (07:15 UTC)',
        '5:15 PM IST (11:45 UTC)',
        '11:45 PM IST (18:15 UTC)',
        'Manual workflow_dispatch'
      ],
      keepalive: 'gautamkrishnar/keepalive-workflow@v2 (Active)'
    },
    localAutomation: {
      windowsTaskName: 'YouTube30DayAutoPublish',
      daemonScript: 'scripts/autonomous-30day-daemon.js',
      batchLauncher: 'scripts/run-autonomous-daemon.bat'
    },
    audioEngine: {
      primaryTTS: 'Gemini 3.8 Flash TTS (Voice: Fenrir)',
      fallbackTTS: 'Neural Edge-TTS (Voice: en-US-ChristopherNeural)',
      backgroundMusic: audioAssets
    },
    videoEngine: {
      resolution: '1920x1080 (Long-Form) / 1080x1920 (Shorts)',
      motion: 'Ken Burns Multi-Cut (Push, Pull, Pan)',
      imagePipeline: 'Wikipedia API + Wikimedia Commons 1920px Search + Procedural Dynamic SVG fallback',
      subtitles: 'Clean burned-in subtitle-free (High Retention)',
      masterThumbnail: 'Sharp dynamic SVG typography overlay (1280x720)'
    },
    contentCalendar: {
      totalDaysProgrammed: calendar.length,
      scheduledOrPublishedDays: calendar.filter(c => c.status === 'scheduled' || c.status === 'published').length,
      pendingDays: calendar.filter(c => c.status === 'pending').length
    },
    playlists: playlists.map(p => ({ id: p.id, title: p.snippet.title, itemCount: p.contentDetails.itemCount })),
    trackedVideosCount: trackedVideos.length,
    liveVideoDetails
  };

  // 7. Write shadow print files
  await fs.writeFile(path.join(shadowDir, 'channel_snapshot.json'), JSON.stringify(channelData, null, 2), 'utf8');
  await fs.writeFile(path.join(shadowDir, 'playlists_snapshot.json'), JSON.stringify(playlists, null, 2), 'utf8');
  await fs.writeFile(path.join(shadowDir, 'calendar_snapshot.json'), JSON.stringify(calendar, null, 2), 'utf8');
  await fs.writeFile(path.join(shadowDir, 'videos_snapshot.json'), JSON.stringify(liveVideoDetails, null, 2), 'utf8');
  await fs.writeFile(path.join(shadowDir, 'system_manifest.json'), JSON.stringify(systemManifest, null, 2), 'utf8');

  console.log('\n✓ Saved channel_snapshot.json');
  console.log('✓ Saved playlists_snapshot.json');
  console.log('✓ Saved calendar_snapshot.json');
  console.log('✓ Saved videos_snapshot.json');
  console.log('✓ Saved system_manifest.json');
  console.log('\n═'.repeat(65));
  console.log('🎉 SHADOW PRINT CREATED IN ./shadow-print/');
  console.log('═'.repeat(65));

  return systemManifest;
}

if (require.main === module) {
  makeShadowPrint().catch(console.error);
}

module.exports = { makeShadowPrint };
