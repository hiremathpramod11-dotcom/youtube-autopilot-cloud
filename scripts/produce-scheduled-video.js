require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const { runFFmpeg } = require('../utils/ffmpeg');
const { GoogleGenAI } = require('@google/genai');
const { google } = require('googleapis');

const WIKIPEDIA_USER_AGENT = 'Kannadiga369Bot/1.0 (contact@kannadiga369.com)';

async function downloadImage(url, dest) {
  const res = await axios({ method: 'GET', url, responseType: 'arraybuffer', headers: { 'User-Agent': WIKIPEDIA_USER_AGENT } });
  await fs.writeFile(dest, res.data);
  return dest;
}

async function fetchVisualAssets(topic, wikiTitles, outDir) {
  await fs.mkdir(outDir, { recursive: true });
  const images = [];
  const videos = [];

  // A. Fetch Wikipedia lead images
  try {
    const query = `https://en.wikipedia.org/w/api.php?action=query&titles=${wikiTitles.join('|')}&prop=pageimages&format=json&pithumbsize=1920`;
    const res = await axios.get(query, { headers: { 'User-Agent': WIKIPEDIA_USER_AGENT } });
    const pages = Object.values(res.data.query?.pages || {});
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (page.thumbnail?.source) {
        const imgPath = path.join(outDir, `img_${i}.jpg`);
        try {
          await downloadImage(page.thumbnail.source, imgPath);
          images.push(imgPath);
        } catch (e) {
          console.warn(`Failed image for ${page.title}:`, e.message);
        }
      }
    }
  } catch (err) {
    console.warn('Wikipedia image notice:', err.message);
  }

  // B. Query Wikimedia Commons for authentic high-res photos
  if (images.length < 6 && wikiTitles.length > 0) {
    try {
      const searchTerm = (wikiTitles[0] || topic || '').replace(/_/g, ' ');
      console.log(`🌐 Searching Wikimedia Commons for HD photography: "${searchTerm}"...`);
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=1920&format=json`;
      const commonsRes = await axios.get(commonsUrl, { headers: { 'User-Agent': WIKIPEDIA_USER_AGENT } });
      const commonsPages = Object.values(commonsRes.data.query?.pages || {});

      for (let j = 0; j < commonsPages.length && images.length < 8; j++) {
        const info = commonsPages[j].imageinfo?.[0];
        const imgUrl = info?.thumburl || info?.url;
        if (imgUrl && !imgUrl.endsWith('.svg') && !imgUrl.endsWith('.ogg') && !imgUrl.endsWith('.webm')) {
          const imgPath = path.join(outDir, `commons_${j}.jpg`);
          try {
            await downloadImage(imgUrl, imgPath);
            images.push(imgPath);
          } catch (e) {
            // ignore individual image download errors
          }
        }
      }
    } catch (err) {
      console.warn('Commons search notice:', err.message);
    }
  }

  // C. Fetch Authentic HD Motion Video B-Roll from NASA Open Video Archive
  const topicLower = `${topic} ${wikiTitles.join(' ')}`.toLowerCase();
  const isCosmicOrPhysical = /(space|sun|solar|earth|ocean|abyss|sea|black hole|star|planet|atmosphere|ice|borehole|drill|geology|science|cosmic|astronomy|inventions|technology)/i.test(topicLower);

  if (isCosmicOrPhysical) {
    try {
      const nasaSearchTerms = [];
      if (/ocean|sea|abyss|trench|marianas|water/i.test(topicLower)) nasaSearchTerms.push('ocean earth', 'sea surface');
      if (/sun|solar|light/i.test(topicLower)) nasaSearchTerms.push('sun solar flare', 'solar dynamics');
      if (/black hole|supernova|galaxy|nebula/i.test(topicLower)) nasaSearchTerms.push('black hole simulation', 'supernova');
      if (/earth|spin|atmosphere|drill|crust|geology/i.test(topicLower)) nasaSearchTerms.push('earth rotation', 'earth atmosphere');
      if (nasaSearchTerms.length === 0) nasaSearchTerms.push('earth science');

      console.log(`🚀 Searching NASA Open Video Archive for authentic motion B-roll: "${nasaSearchTerms[0]}"...`);
      const nasaUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(nasaSearchTerms[0])}&media_type=video`;
      const nasaRes = await axios.get(nasaUrl, { timeout: 8000 });
      const items = nasaRes.data.collection?.items || [];

      for (let k = 0; k < Math.min(items.length, 2); k++) {
        const mediaHref = items[k]?.href;
        if (mediaHref) {
          const formatsRes = await axios.get(mediaHref, { timeout: 6000 });
          const formats = formatsRes.data || [];
          const mp4Url = formats.find(u => u.includes('~small.mp4')) ||
                         formats.find(u => u.includes('~preview.mp4')) ||
                         formats.find(u => u.includes('~mobile.mp4')) ||
                         formats.find(u => u.includes('~medium.mp4') && !u.includes('~orig.mp4'));
          if (mp4Url) {
            const vidPath = path.join(outDir, `nasa_broll_${k}.mp4`);
            console.log(`⬇️ Downloading authentic NASA video B-roll clip (${k + 1})...`);
            try {
              const vidBuf = await axios({
                method: 'GET',
                url: mp4Url,
                responseType: 'arraybuffer',
                timeout: 25000,
                maxContentLength: 45 * 1024 * 1024
              });
              await fs.writeFile(vidPath, vidBuf.data);
              videos.push(vidPath);
            } catch (dlErr) {
              console.warn(`Skipping oversized or timed out video clip (${k + 1}):`, dlErr.message);
            }
          }
        }
      }
      if (videos.length > 0) {
        console.log(`✓ Acquired ${videos.length} authentic motion video B-roll clips!`);
      }
    } catch (nasaErr) {
      console.warn('NASA video fetch notice:', nasaErr.message);
    }
  }

  // Fallback procedural visual if network has zero imagery
  if (images.length === 0 && videos.length === 0) {
    console.log('🌌 Generating procedural dark cinematic HD visual backdrop...');
    const fallbackPath = path.join(outDir, 'procedural_cinematic_bg.jpg');
    const svgBg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="deep" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#181c30"/>
          <stop offset="60%" stop-color="#0b0d18"/>
          <stop offset="100%" stop-color="#020306"/>
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#deep)"/>
    </svg>`;
    await sharp(Buffer.from(svgBg)).jpeg({ quality: 95 }).toFile(fallbackPath);
    images.push(fallbackPath);
  }

  return { images, videos };
}

async function generateGeminiAudio(text, outputPath, voiceName = 'Fenrir') {
  try {
    console.log(`🎙️ Generating natural dramatic narration via Gemini TTS (${voiceName})...`);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    const audioData = part?.inlineData?.data;
    if (!audioData) throw new Error('No audio returned by Gemini TTS');

    const pcmBuffer = Buffer.from(audioData, 'base64');
    const tempPcm = outputPath.replace('.mp3', '_raw.pcm');
    await fs.writeFile(tempPcm, pcmBuffer);

    await runFFmpeg([
      '-y',
      '-f', 's16le',
      '-ar', '24000',
      '-ac', '1',
      '-i', tempPcm,
      '-c:a', 'libmp3lame',
      '-b:a', '192k',
      outputPath
    ]);

    await fs.unlink(tempPcm).catch(() => {});
    return outputPath;
  } catch (err) {
    console.warn(`⚠️ Gemini TTS notice: ${err.message}. Activating Neural Edge-TTS fallback (Christopher)...`);
    const textFile = outputPath.replace('.mp3', '_input.txt');
    await fs.writeFile(textFile, text, 'utf8');
    const { execSync } = require('child_process');
    execSync(`python -m edge_tts --voice en-US-ChristopherNeural --file "${textFile}" --write-media "${outputPath}"`);
    await fs.unlink(textFile).catch(() => {});
    console.log('✓ Neural Edge-TTS narration generated successfully!');
    return outputPath;
  }
}

async function renderCinematicScene(mediaPath, durationSeconds, motionType, outputPath, isShort = false) {
  const isVideo = mediaPath.endsWith('.mp4') || mediaPath.endsWith('.webm') || mediaPath.endsWith('.ogv');

  if (isVideo) {
    // Authentic Motion Video B-Roll with Aperture / TechZone Film Grade
    const scaleCrop = isShort
      ? 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920'
      : 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080';

    const colorGrade = isShort
      ? 'eq=contrast=1.16:brightness=-0.01:saturation=1.35,unsharp=5:5:0.6:5:5:0.0'
      : 'eq=contrast=1.12:brightness=-0.02:saturation=1.22,vignette=PI/6,unsharp=5:5:0.6:5:5:0.0';

    await runFFmpeg([
      '-y',
      '-ss', '2',
      '-t', durationSeconds.toFixed(2),
      '-i', mediaPath,
      '-vf', `${scaleCrop},${colorGrade}`,
      '-an',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '18',
      '-tune', 'film',
      '-pix_fmt', 'yuv420p',
      '-r', '30',
      outputPath
    ]);
  } else {
    // High-Res Stills with Smooth Ken Burns Motion + Aperture Film Grade
    const frames = Math.max(30, Math.round(durationSeconds * 30));
    let zoomExpr;

    if (isShort) {
      if (motionType === 'push') {
        zoomExpr = `scale=2160x3840:force_original_aspect_ratio=increase,crop=2160:3840,zoompan=z='min(zoom+0.0018,1.22)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30,eq=contrast=1.16:brightness=-0.01:saturation=1.35,unsharp=5:5:0.6:5:5:0.0`;
      } else {
        zoomExpr = `scale=2160x3840:force_original_aspect_ratio=increase,crop=2160:3840,zoompan=z='if(lte(zoom,1.0),1.22,max(1.001,zoom-0.0018))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30,eq=contrast=1.16:brightness=-0.01:saturation=1.35,unsharp=5:5:0.6:5:5:0.0`;
      }
    } else {
      if (motionType === 'push') {
        zoomExpr = `scale=3840x2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='min(zoom+0.0014,1.18)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30,eq=contrast=1.12:brightness=-0.02:saturation=1.22,vignette=PI/6,unsharp=5:5:0.6:5:5:0.0`;
      } else if (motionType === 'pull') {
        zoomExpr = `scale=3840x2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='if(lte(zoom,1.0),1.18,max(1.001,zoom-0.0014))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30,eq=contrast=1.12:brightness=-0.02:saturation=1.22,vignette=PI/6,unsharp=5:5:0.6:5:5:0.0`;
      } else {
        zoomExpr = `scale=3840x2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='1.12':x='(on/${frames})*(iw-iw/zoom)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30,eq=contrast=1.12:brightness=-0.02:saturation=1.22,vignette=PI/6,unsharp=5:5:0.6:5:5:0.0`;
      }
    }

    await runFFmpeg([
      '-y',
      '-loop', '1',
      '-i', mediaPath,
      '-vf', zoomExpr,
      '-t', durationSeconds.toFixed(2),
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '18',
      '-tune', 'film',
      '-pix_fmt', 'yuv420p',
      '-r', '30',
      outputPath
    ]);
  }
}

async function mixMasterAudio(voicePath, bgMusicPath, outputPath, isShort = false) {
  const voiceFilter = isShort
    ? 'highpass=f=80,equalizer=f=3200:t=q:w=1.2:g=2.5,loudnorm=I=-14:TP=-1.0:LRA=9'
    : 'highpass=f=80,equalizer=f=3200:t=q:w=1.2:g=2.5,equalizer=f=200:t=q:w=1.5:g=1.2,loudnorm=I=-16:TP=-1.5:LRA=11';

  const bgVolume = isShort ? 'volume=0.14' : 'volume=0.12';

  if (bgMusicPath) {
    await runFFmpeg([
      '-y',
      '-i', voicePath,
      '-stream_loop', '-1',
      '-i', bgMusicPath,
      '-filter_complex', `[0:a]${voiceFilter}[v];[1:a]${bgVolume}[bg];[v][bg]amix=inputs=2:duration=first:dropout_transition=2[aout]`,
      '-map', '[aout]',
      '-c:a', 'aac',
      '-b:a', '256k',
      outputPath
    ]);
  } else {
    await runFFmpeg([
      '-y',
      '-i', voicePath,
      '-af', voiceFilter,
      '-c:a', 'aac',
      '-b:a', '256k',
      outputPath
    ]);
  }
}

async function createMasterThumbnail(bgImagePath, headline, badge, outputPath, footerText = 'APERTURE SPEC • GLOBAL MYSTERIES') {
  console.log('🎨 Generating Aperture/What If-style Master YouTube Thumbnail...');
  const buffer = await fs.readFile(bgImagePath);

  const svgOverlay = `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="apertureVignette" cx="65%" cy="45%" r="75%">
          <stop offset="0%" stop-color="rgba(0, 0, 0, 0.15)"/>
          <stop offset="55%" stop-color="rgba(5, 8, 18, 0.70)"/>
          <stop offset="100%" stop-color="rgba(2, 3, 8, 0.96)"/>
        </radialGradient>

        <linearGradient id="neonGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFE600"/>
          <stop offset="100%" stop-color="#FF9900"/>
        </linearGradient>

        <filter id="heavyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="1"/>
        </filter>
      </defs>

      <rect width="1280" height="720" fill="url(#apertureVignette)"/>

      <!-- Sleek Aperture Category Tag -->
      <g filter="url(#heavyShadow)">
        <rect x="60" y="50" width="420" height="42" rx="8" fill="rgba(10, 15, 28, 0.88)" stroke="#FF9900" stroke-width="2"/>
        <circle cx="82" cy="71" r="5" fill="#FF3333"/>
        <text x="100" y="77" font-family="'Arial Black', Impact, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" letter-spacing="3">${badge}</text>
      </g>

      <!-- Bold Aperture / What If Typography -->
      <g filter="url(#heavyShadow)">
        <text x="60" y="240" font-family="'Arial Black', Impact, sans-serif" font-size="90" font-weight="900" fill="#FFFFFF" letter-spacing="1">${headline[0] || 'UNSOLVED'}</text>
        <text x="60" y="345" font-family="'Arial Black', Impact, sans-serif" font-size="92" font-weight="900" fill="url(#neonGold)" letter-spacing="1">${headline[1] || 'WORLD MYSTERY'}</text>
        <text x="60" y="445" font-family="'Arial Black', Impact, sans-serif" font-size="80" font-weight="900" fill="#00E5FF" letter-spacing="1">${headline[2] || 'EXPLAINED'}</text>
      </g>

      <!-- Minimalist Cinematic Tech Crosshair -->
      <g opacity="0.75" filter="url(#heavyShadow)">
        <circle cx="1080" cy="360" r="140" fill="none" stroke="#FFCC00" stroke-width="3" stroke-dasharray="12, 12"/>
        <line x1="1080" y1="200" x2="1080" y2="520" stroke="#FFCC00" stroke-width="2" stroke-dasharray="8, 8"/>
        <line x1="920" y1="360" x2="1240" y2="360" stroke="#FFCC00" stroke-width="2" stroke-dasharray="8, 8"/>
        <circle cx="1080" cy="360" r="8" fill="#FF3333"/>
      </g>

      <!-- Bottom Cinematic Watermark -->
      <g filter="url(#heavyShadow)">
        <text x="60" y="655" font-family="'Arial Black', Impact, sans-serif" font-size="22" font-weight="800" fill="#AAAAAA" letter-spacing="4">${footerText}</text>
      </g>
    </svg>
  `;

  await sharp(buffer)
    .resize(1280, 720, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.90, saturation: 1.40 })
    .composite([{ input: Buffer.from(svgOverlay), blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile(outputPath);

  console.log('✓ Master Aperture-Style Thumbnail created:', outputPath);
}

async function getYouTubeClient() {
  const tokenData = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'config', 'tokens.json'), 'utf8'));
  const creds = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'config', 'credentials.json'), 'utf8'));
  const auth = new google.auth.OAuth2(creds.youtube.client_id, creds.youtube.client_secret);
  auth.setCredentials(tokenData.youtube || tokenData);
  return google.youtube({ version: 'v3', auth });
}

async function produceScheduledVideo(targetDay) {
  const calendarPath = path.join(__dirname, '..', 'data', '30_day_calendar.json');
  const calendar = JSON.parse(await fs.readFile(calendarPath, 'utf8'));

  const entry = calendar.find(c => c.day === targetDay);
  if (!entry) throw new Error(`Day ${targetDay} not found in calendar`);

  console.log('\n' + '═'.repeat(65));
  console.log(`🚀 AUTONOMOUS PRODUCTION: DAY ${entry.day} - ${entry.topic}`);
  console.log(`   Scheduled Release: ${entry.scheduledDate}`);
  console.log('═'.repeat(65));

  // 1. Fetch visual assets (HD photos + authentic motion video B-roll)
  const assetDir = path.join(__dirname, '..', 'data', 'assets', `day_${entry.day}`);
  const { images, videos } = await fetchVisualAssets(entry.topic, entry.wikiTitles || [], assetDir);
  console.log(`✓ Fetched ${images.length} HD photos and ${videos.length} motion video B-roll clips`);

  // 2. Build Narration
  const isEnglish = (entry.day >= 21) || /^[A-Za-z0-9\s.,!?'"():|—–-]+$/.test(entry.title.substring(0, 30));
  const closingCTA = isEnglish
    ? "Which of these mind-blowing mysteries surprised you the most? Share your thoughts in the comments below! Don't forget to like and subscribe for more extraordinary discoveries, and check out today's trending viral gadgets in the pinned comment!"
    : "ಕರುನಾಡಿನ ಈ ಅಪ್ರತಿಮ ರಹಸ್ಯದಲ್ಲಿ ನಿಮಗೆ ಅತ್ಯಂತ ರೋಮಾಂಚನ ತಂದ ವಿಷಯ ಯಾವುದು? ತಪ್ಪದೆ ಕಾಮೆಂಟ್ ಮಾಡಿ! ಇಂತಹ ಮತ್ತಷ್ಟು ರೋಚಕ ಐತಿಹಾಸಿಕ ವಿಡಿಯೋಗಳಿಗಾಗಿ ಈಗಲೇ ನಮ್ಮ Kannadiga 369 ಚಾನೆಲ್‌ಗೆ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ! ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!";

  const fullNarration = [
    entry.hook,
    ...entry.sections.map(s => `${s.title}\n${s.narration}`),
    closingCTA
  ].join('\n\n');

  const audioDir = path.join(__dirname, '..', 'data', 'audio');
  await fs.mkdir(audioDir, { recursive: true });
  const audioPath = path.join(audioDir, `day_${entry.day}_narration.mp3`);
  await generateGeminiAudio(fullNarration, audioPath, isEnglish ? 'Fenrir' : 'Puck');

  const duration = await new Promise((resolve) => {
    const { exec } = require('child_process');
    exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`, (err, stdout) => {
      resolve(parseFloat(stdout) || 120);
    });
  });
  console.log(`✓ Narration Duration: ${duration.toFixed(1)} seconds`);

  // 3. Render High-Fidelity Cinematic Scenes (CRF 18 Film Grade, dynamic cuts)
  const tempDir = path.join(__dirname, '..', 'temp', `clips_day_${entry.day}_${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });

  const totalClips = 16;
  const clipDur = duration / totalClips;
  const clipPaths = [];
  const motions = ['push', 'pull', 'pan'];

  for (let i = 0; i < totalClips; i++) {
    // Interleave authentic motion video B-roll with Ken Burns stills
    let mediaFile;
    if (videos.length > 0 && (i % 4 === 1 || i % 4 === 3)) {
      mediaFile = videos[Math.floor(i / 4) % videos.length];
    } else {
      mediaFile = images[i % images.length];
    }

    const out = path.join(tempDir, `clip_${String(i).padStart(3, '0')}.mp4`);
    await renderCinematicScene(mediaFile, clipDur, motions[i % motions.length], out, false);
    clipPaths.push(out);
  }

  const concatList = path.join(tempDir, 'concat.txt');
  await fs.writeFile(concatList, clipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'), 'utf8');

  const rawVisual = path.join(tempDir, 'raw_visual.mp4');
  await runFFmpeg(['-y', '-f', 'concat', '-safe', '0', '-i', concatList, '-c', 'copy', rawVisual]);

  // 4. Mix Mastered Vocal & Suspense Audio (Broadcast -16 LUFS, Ducking, 256k AAC)
  const candidateBg1 = path.join(__dirname, '..', 'assets', 'audio', 'cinematic_suspense.mp3');
  const candidateBg2 = path.join(__dirname, '..', 'data', 'audio', 'cinematic_suspense.mp3');
  const bgMusicPath = fsSync.existsSync(candidateBg1) ? candidateBg1 : (fsSync.existsSync(candidateBg2) ? candidateBg2 : null);
  const mixedAudio = path.join(tempDir, 'mixed_audio.m4a');
  await mixMasterAudio(audioPath, bgMusicPath, mixedAudio, false);

  // 5. Final Subtitle-Free Lossless Video
  const videosDir = path.join(__dirname, '..', 'data', 'videos');
  await fs.mkdir(videosDir, { recursive: true });
  const finalVideo = path.join(videosDir, `day_${entry.day}_final_${Date.now()}.mp4`);
  await runFFmpeg([
    '-y',
    '-i', rawVisual,
    '-i', mixedAudio,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '256k',
    '-shortest',
    finalVideo
  ]);
  console.log('✓ Clean Lossless Aperture-Spec Video Produced:', finalVideo);

  // 6. Thumbnail
  const thumbPath = path.join(__dirname, '..', 'uploads', 'thumbnails', `thumb_day_${entry.day}.jpg`);
  await fs.mkdir(path.dirname(thumbPath), { recursive: true });

  const words = (entry.title || '').replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(w => w.length > 0);
  const headline = isEnglish
    ? [
        words.slice(0, 3).join(' ').toUpperCase() || 'UNSOLVED',
        words.slice(3, 6).join(' ').toUpperCase() || 'WORLD MYSTERY',
        words.slice(6, 9).join(' ').toUpperCase() || 'EXPLAINED!'
      ]
    : [
        words.slice(0, 2).join(' ') || 'ಕರ್ನಾಟಕದ',
        words.slice(2, 4).join(' ') || 'ಬೆಚ್ಚಿಬೀಳಿಸುವ',
        words.slice(4, 7).join(' ') || 'ನಿಗೂಢ ರಹಸ್ಯ!'
      ];
  const badge = isEnglish
    ? `${(entry.topic || 'GLOBAL DISCOVERY').toUpperCase().substring(0, 26)} • UNSOLVED`
    : `🚩 DAY ${entry.day} • ${entry.topic || 'ರಹಸ್ಯ ಇತಿಹಾಸ'}`.substring(0, 30);
  const footerText = isEnglish
    ? 'APERTURE SPEC • GLOBAL MYSTERIES'
    : '🔴 KANNADIGA 369 • HISTORICAL MYSTERY';
  await createMasterThumbnail(images[0], headline, badge, thumbPath, footerText);

  // 7. Upload to YouTube with native Cloud Scheduling (`publishAt`)
  console.log(`📤 Uploading to YouTube Cloud Scheduled for: ${entry.scheduledDate}...`);
  const yt = await getYouTubeClient();
  const storeUrl = process.env.PROMOTIONAL_STORE_URL || 'https://latinas-plastic-manitoba-handling.trycloudflare.com/';
  const promoBlock = `🛍️ 🔥 EXCLUSIVE FLASH SALE: Flat 50% OFF + Free Express Delivery on trending viral gadgets!\n👉 Shop AquaFlow Direct: ${storeUrl}\n(Cash on Delivery & PhonePe / GPay Accepted | 7-Day Guarantee)\n\n`;

  const tags = isEnglish
    ? [...(entry.tags || []), 'World Mysteries', 'Science Facts', 'Unsolved Mysteries', 'Mind Blowing', 'AquaFlow Direct', 'Aperture', 'What If']
    : (entry.tags || []);

  const uploadRes = await yt.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: entry.title,
        description: `${promoBlock}${entry.title} | Kannadiga 369\n\n${entry.hook}\n\n#WorldMysteries #ScienceFacts #UnsolvedMysteries #ViralTech`,
        tags,
        categoryId: '27',
        defaultLanguage: isEnglish ? 'en' : 'kn',
        defaultAudioLanguage: isEnglish ? 'en' : 'kn'
      },
      status: {
        privacyStatus: 'private',
        publishAt: entry.scheduledDate,
        selfDeclaredMadeForKids: false
      }
    },
    media: {
      body: fsSync.createReadStream(finalVideo)
    }
  });

  const videoId = uploadRes.data.id;
  console.log(`✅ VIDEO SCHEDULED IN YOUTUBE CLOUD! Video ID: ${videoId}`);
  console.log(`Cloud Auto-Publish Time: ${entry.scheduledDate}`);

  // Thumbnail
  try {
    await yt.thumbnails.set({
      videoId,
      media: {
        mimeType: 'image/jpeg',
        body: fsSync.createReadStream(thumbPath)
      }
    });
    console.log('✅ Custom thumbnail applied successfully!');

    // Post dropshipping promotional pinned comment
    try {
      await yt.commentThreads.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            videoId,
            topLevelComment: {
              snippet: {
                textOriginal: `🛍️ 🔥 EXCLUSIVE FLASH SALE: Flat 50% OFF + Free Express Delivery on trending viral gadgets & smart home inventions! 👉 ${storeUrl} (Cash on Delivery & PhonePe / GPay Accepted! Limited Stock Available 🛒👇)`
              }
            }
          }
        }
      });
      console.log('✅ Dropshipping promotional pinned comment posted!');
    } catch (commErr) {
      console.warn('Comment post notice:', commErr.message);
    }
  } catch (err) {
    console.warn('Thumbnail set warning:', err.message);
  }

  // 8. Produce & Schedule Companion Viral Short (9:16 Vertical)
  try {
    console.log(`🎬 Producing Companion Viral YouTube Short for Day ${entry.day}...`);
    const shortAudioPath = path.join(audioDir, `day_${entry.day}_short_narration.mp3`);
    const shortNarration = isEnglish
      ? `${entry.hook} Subscribe for more extraordinary discoveries, and check out today's trending viral gadgets in the comments below!`
      : `${entry.hook} ಪೂರ್ಣ ಆಘಾತಕಾರಿ ಸತ್ಯ ತಿಳಿಯಲು ಈಗಲೇ ನಮ್ಮ Kannadiga 369 ಚಾನೆಲ್ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ!`;
    await generateGeminiAudio(shortNarration, shortAudioPath, isEnglish ? 'Fenrir' : 'Puck');

    const shortDur = await new Promise((resolve) => {
      const { exec } = require('child_process');
      exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${shortAudioPath}"`, (err, stdout) => {
        resolve(parseFloat(stdout) || 35);
      });
    });

    const shortClipsDir = path.join(tempDir, 'short_clips');
    await fs.mkdir(shortClipsDir, { recursive: true });
    const shortClipPaths = [];
    const shortTotalClips = 6;
    const shortClipDur = shortDur / shortTotalClips;

    for (let i = 0; i < shortTotalClips; i++) {
      let mediaFile;
      if (videos.length > 0 && (i % 3 === 1)) {
        mediaFile = videos[i % videos.length];
      } else {
        mediaFile = images[i % images.length];
      }

      const sOut = path.join(shortClipsDir, `sclip_${i}.mp4`);
      const motion = i % 2 === 0 ? 'push' : 'pull';
      await renderCinematicScene(mediaFile, shortClipDur, motion, sOut, true);
      shortClipPaths.push(sOut);
    }

    const sConcat = path.join(shortClipsDir, 'sconcat.txt');
    await fs.writeFile(sConcat, shortClipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'), 'utf8');
    const sRaw = path.join(shortClipsDir, 'sraw.mp4');
    await runFFmpeg(['-y', '-f', 'concat', '-safe', '0', '-i', sConcat, '-c', 'copy', sRaw]);

    const sMixedAudio = path.join(shortClipsDir, 'smixed.m4a');
    await mixMasterAudio(shortAudioPath, bgMusicPath, sMixedAudio, true);

    const finalShortVideo = path.join(videosDir, `day_${entry.day}_short_${Date.now()}.mp4`);
    await runFFmpeg([
      '-y', '-i', sRaw, '-i', sMixedAudio,
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest',
      finalShortVideo
    ]);

    // Schedule short 4.5 hours earlier (1:30 PM IST / 08:00 UTC)
    const shortDate = new Date(new Date(entry.scheduledDate).getTime() - (4.5 * 60 * 60 * 1000)).toISOString();
    console.log(`📤 Uploading Companion Short scheduled for ${shortDate}...`);

    const shortUpload = await yt.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: isEnglish
            ? `${entry.title.substring(0, 50)}... 😱 #Shorts #Viral`
            : `${entry.title.substring(0, 50)}... 😱 #Shorts #Kannada`,
          description: isEnglish
            ? `🛍️ Shop Trending Viral Inventions (Flat 50% OFF + Free Delivery): ${storeUrl}\n\n${entry.hook}\n\n#Shorts #ViralShorts #MindBlowing #Curiosity #ScienceFacts`
            : `🛍️ Shop Trending Viral Inventions (Flat 50% OFF + Free Delivery): ${storeUrl}\n\n${entry.hook}\n\n#Shorts #KannadaShorts #Kannadiga369 #ViralShorts`,
          tags: isEnglish
            ? ['Shorts', 'Viral Shorts', 'Mind Blowing', 'Unsolved Mysteries', 'Science Facts', 'Curiosities', 'Gadgets', ...(entry.tags || [])]
            : ['Shorts', 'Kannada Shorts', 'Kannadiga 369', 'Viral Kannada', ...(entry.tags || [])],
          categoryId: '27',
          defaultLanguage: isEnglish ? 'en' : 'kn',
          defaultAudioLanguage: isEnglish ? 'en' : 'kn'
        },
        status: {
          privacyStatus: 'private',
          publishAt: shortDate,
          selfDeclaredMadeForKids: false
        }
      },
      media: {
        body: fsSync.createReadStream(finalShortVideo)
      }
    });

    const shortId = shortUpload.data.id;
    console.log(`✅ COMPANION SHORT SCHEDULED! Video ID: ${shortId}`);
    entry.shortVideoId = shortId;

    // Post dropshipping promotional pinned comment on short
    try {
      await yt.commentThreads.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            videoId: shortId,
            topLevelComment: {
              snippet: {
                textOriginal: `🛍️ 🔥 EXCLUSIVE FLASH SALE: Flat 50% OFF + Free Express Delivery on trending viral gadgets & smart lifestyle inventions! 👉 ${storeUrl} (Cash on Delivery & PhonePe / GPay Accepted! Limited Stock Available 🛒👇)`
              }
            }
          }
        }
      });
      console.log('✅ Short promotional pinned comment posted!');
    } catch (cErr) {
      console.warn('Short comment notice:', cErr.message);
    }
  } catch (shortErr) {
    console.warn('Companion short notice:', shortErr.message);
  }

  // Update calendar
  entry.status = 'scheduled';
  entry.videoId = videoId;
  await fs.writeFile(calendarPath, JSON.stringify(calendar, null, 2), 'utf8');

  return { videoId, title: entry.title, scheduledDate: entry.scheduledDate };
}

module.exports = { produceScheduledVideo };

if (require.main === module) {
  const targetDay = parseInt(process.argv[2] || '3', 10);
  produceScheduledVideo(targetDay).catch(console.error);
}

