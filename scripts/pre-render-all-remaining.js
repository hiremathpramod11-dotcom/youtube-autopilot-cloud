require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const { runFFmpeg } = require('../utils/ffmpeg');
const { GoogleGenAI } = require('@google/genai');

const WIKIPEDIA_USER_AGENT = 'Kannadiga369Bot/1.0 (contact@kannadiga369.com)';

async function downloadImage(url, dest) {
  const res = await axios({ method: 'GET', url, responseType: 'arraybuffer', headers: { 'User-Agent': WIKIPEDIA_USER_AGENT } });
  await fs.writeFile(dest, res.data);
  return dest;
}

async function fetchWikiImages(wikiTitles, outDir) {
  await fs.mkdir(outDir, { recursive: true });
  const query = `https://en.wikipedia.org/w/api.php?action=query&titles=${wikiTitles.join('|')}&prop=pageimages&format=json&pithumbsize=1920`;
  const res = await axios.get(query, { headers: { 'User-Agent': WIKIPEDIA_USER_AGENT } });
  const pages = Object.values(res.data.query?.pages || {});
  const images = [];

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

  if (images.length === 0) {
    const defaultAssets = ['hampi.jpg', 'badami_cave_temples.jpg', 'belur__karnataka.jpg', 'shivagange.jpg', 'talakadu.jpg'];
    for (const d of defaultAssets) {
      const p = path.join(__dirname, '..', 'data', 'assets', d);
      if (fsSync.existsSync(p)) images.push(p);
    }
  }

  return images;
}

async function generateGeminiAudio(text, outputPath) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash-tts',
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' }
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
}

async function renderKenBurnsClip(imagePath, durationSeconds, motionType, outputPath) {
  const frames = Math.max(30, Math.round(durationSeconds * 30));
  let zoomExpr;
  
  if (motionType === 'push') {
    zoomExpr = `scale=3840x2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='min(zoom+0.0015,1.18)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30`;
  } else if (motionType === 'pull') {
    zoomExpr = `scale=3840x2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='if(lte(zoom,1.0),1.18,max(1.001,zoom-0.0015))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30`;
  } else {
    zoomExpr = `scale=3840x2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='1.14':x='(on/${frames})*(iw-iw/zoom)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30`;
  }

  await runFFmpeg([
    '-y',
    '-loop', '1',
    '-i', imagePath,
    '-vf', zoomExpr,
    '-t', durationSeconds.toFixed(2),
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-pix_fmt', 'yuv420p',
    outputPath
  ]);
}

async function createMasterThumbnail(bgImagePath, headline, badge, outputPath) {
  const buffer = await fs.readFile(bgImagePath);

  const svgOverlay = `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="35%" cy="50%" r="65%">
          <stop offset="0%" stop-color="rgba(255, 140, 0, 0.4)"/>
          <stop offset="60%" stop-color="rgba(0, 0, 0, 0.65)"/>
          <stop offset="100%" stop-color="rgba(0, 0, 0, 0.95)"/>
        </radialGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.95"/>
        </filter>
      </defs>

      <rect width="1280" height="720" fill="url(#glow)"/>

      <g filter="url(#shadow)">
        <rect x="50" y="45" width="480" height="60" rx="30" fill="#E60000" />
        <text x="75" y="86" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">${badge}</text>
      </g>

      <g filter="url(#shadow)">
        <text x="50" y="235" font-family="Arial, sans-serif" font-size="88" font-weight="900" fill="#FFE500">${headline[0] || 'ಕರ್ನಾಟಕದ'}</text>
        <text x="50" y="335" font-family="Arial, sans-serif" font-size="88" font-weight="900" fill="#FFFFFF">${headline[1] || 'ಬೆಚ್ಚಿಬೀಳಿಸುವ'}</text>
        <text x="50" y="435" font-family="Arial, sans-serif" font-size="82" font-weight="900" fill="#00FFCC">${headline[2] || 'ನಿಗೂಢ ರಹಸ್ಯ!'}</text>
      </g>

      <g filter="url(#shadow)">
        <rect x="50" y="595" width="640" height="65" rx="16" fill="rgba(15, 15, 25, 0.92)" stroke="#FFAA00" stroke-width="3"/>
        <text x="75" y="638" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="#FFAA00">🔴 KANNADIGA 369 • HISTORICAL MYSTERY</text>
      </g>

      <g filter="url(#shadow)">
        <circle cx="1040" cy="360" r="185" fill="none" stroke="#E60000" stroke-width="10" stroke-dasharray="16, 12"/>
        <text x="970" y="385" font-family="Arial, sans-serif" font-size="84" font-weight="900" fill="#E60000">😱</text>
      </g>
    </svg>
  `;

  await sharp(buffer)
    .resize(1280, 720, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.92, saturation: 1.35 })
    .composite([{ input: Buffer.from(svgOverlay), blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile(outputPath);
}

async function preRenderDay(entry) {
  console.log(`\n🎬 Pre-rendering video for Day ${entry.day}: ${entry.title}...`);

  const assetDir = path.join(__dirname, '..', 'data', 'assets', `day_${entry.day}`);
  const images = await fetchWikiImages(entry.wikiTitles || [], assetDir);

  const fullNarration = [
    entry.hook,
    ...entry.sections.map(s => `${s.title}\n${s.narration}`),
    'ಕರುನಾಡಿನ ಈ ಅಪ್ರತಿಮ ರಹಸ್ಯದಲ್ಲಿ ನಿಮಗೆ ಅತ್ಯಂತ ರೋಮಾಂಚನ ತಂದ ವಿಷಯ ಯಾವುದು? ತಪ್ಪದೆ ಕಾಮೆಂಟ್ ಮಾಡಿ! ಇಂತಹ ಮತ್ತಷ್ಟು ರೋಚಕ ಐತಿಹಾಸಿಕ ವಿಡಿಯೋಗಳಿಗಾಗಿ ಈಗಲೇ ನಮ್ಮ Kannadiga 369 ಚಾನೆಲ್‌ಗೆ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ! ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!'
  ].join('\n\n');

  const audioDir = path.join(__dirname, '..', 'data', 'audio');
  await fs.mkdir(audioDir, { recursive: true });
  const audioPath = path.join(audioDir, `day_${entry.day}_narration.mp3`);
  await generateGeminiAudio(fullNarration, audioPath);

  const duration = await new Promise((resolve) => {
    const { exec } = require('child_process');
    exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`, (err, stdout) => {
      resolve(parseFloat(stdout) || 120);
    });
  });

  const tempDir = path.join(__dirname, '..', 'temp', `clips_day_${entry.day}_${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });

  const totalClips = 16;
  const clipDur = duration / totalClips;
  const clipPaths = [];
  const motions = ['push', 'pull', 'pan'];

  for (let i = 0; i < totalClips; i++) {
    const img = images[i % images.length];
    const out = path.join(tempDir, `clip_${String(i).padStart(3, '0')}.mp4`);
    await renderKenBurnsClip(img, clipDur, motions[i % motions.length], out);
    clipPaths.push(out);
  }

  const concatList = path.join(tempDir, 'concat.txt');
  await fs.writeFile(concatList, clipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'), 'utf8');

  const rawVisual = path.join(tempDir, 'raw_visual.mp4');
  await runFFmpeg(['-y', '-f', 'concat', '-safe', '0', '-i', concatList, '-c', 'copy', rawVisual]);

  const bgMusicPath = path.join(__dirname, '..', 'data', 'audio', 'cinematic_suspense.mp3');
  const mixedAudio = path.join(tempDir, 'mixed_audio.mp3');
  await runFFmpeg([
    '-y',
    '-i', audioPath,
    '-stream_loop', '-1',
    '-i', bgMusicPath,
    '-filter_complex', '[0:a]volume=1.05[v];[1:a]volume=0.13[bg];[v][bg]amix=inputs=2:duration=first:dropout_transition=2[aout]',
    '-map', '[aout]',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    mixedAudio
  ]);

  const videosDir = path.join(__dirname, '..', 'data', 'videos');
  await fs.mkdir(videosDir, { recursive: true });
  const finalVideo = path.join(videosDir, `day_${entry.day}_ready.mp4`);
  await runFFmpeg([
    '-y',
    '-i', rawVisual,
    '-i', mixedAudio,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    finalVideo
  ]);

  const thumbDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
  await fs.mkdir(thumbDir, { recursive: true });
  const thumbPath = path.join(thumbDir, `thumb_day_${entry.day}.jpg`);
  await createMasterThumbnail(images[0], ['ಕರ್ನಾಟಕದ', 'ಬೆಚ್ಚಿಬೀಳಿಸುವ', 'ನಿಗೂಢ ರಹಸ್ಯ!'], '😱 ಐತಿಹಾಸಿಕ ರಹಸ್ಯ!', thumbPath);

  entry.renderedVideo = finalVideo;
  entry.renderedThumbnail = thumbPath;
  entry.isRendered = true;
  console.log(`✓ Day ${entry.day} 1080p Video & Thumbnail Ready!`);
}

async function main() {
  const calendarPath = path.join(__dirname, '..', 'data', '30_day_calendar.json');
  const calendar = JSON.parse(await fs.readFile(calendarPath, 'utf8'));

  for (let day = 8; day <= 30; day++) {
    const entry = calendar.find(c => c.day === day);
    if (!entry) continue;
    if (entry.status === 'scheduled' || entry.status === 'published' || entry.isRendered) continue;

    try {
      await preRenderDay(entry);
      await fs.writeFile(calendarPath, JSON.stringify(calendar, null, 2), 'utf8');
    } catch (e) {
      console.error(`Error on Day ${day}:`, e.message);
    }
  }

  console.log('🎉 ALL REMAINING DAYS PRE-RENDERED AND READY ON DISK!');
}

main().catch(console.error);

