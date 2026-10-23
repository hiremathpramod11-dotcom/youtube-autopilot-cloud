require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const sharp = require('sharp');
const { Database } = require('../database/db');
const { runFFmpeg } = require('../utils/ffmpeg');
const { GoogleGenAI } = require('@google/genai');
const { google } = require('googleapis');

// 1. Chitradurga Master Kannada Script (Documentary Storytelling Formula)
const SCRIPT_SECTIONS = [
  {
    id: 'hook',
    title: 'ಪೀಠಿಕೆ: ಬ್ರಿಟಿಷರು ಮತ್ತು ಹೈದರಾಲಿ ನಡುಗಿದ ಕೋಟೆ',
    narration: 'ನಮಸ್ಕಾರ ಕನ್ನಡಿಗರೇ! ನಮ್ಮ ಕರುನಾಡಿನ ಹೆಮ್ಮೆಯ ಕಲ್ಲಿನ ಕೋಟೆ ಚಿತ್ರದುರ್ಗ! ಹೈದರಾಲಿ ಮತ್ತು ಬ್ರಿಟಿಷರ ಬೃಹತ್ ಸೈನ್ಯಕ್ಕೂ ಬರೋಬ್ಬರಿ ಹತ್ತಾರು ವರ್ಷಗಳ ಕಾಲ ಈ ಕೋಟೆಯನ್ನು ಸುಲಭವಾಗಿ ಗೆಲ್ಲಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ ಏಕೆ ಗೊತ್ತಾ? 7 ಸುತ್ತಿನ ಕಲ್ಲಿನ ಚಕ್ರವ್ಯೂಹ, 38 ರಹಸ್ಯ ಬಾಗಿಲುಗಳು, ಮತ್ತು ಒನಕೆ ಹಿಡಿದ ಒಬ್ಬ ವೀರ ಮಹಿಳೆ ನೂರಾರು ಸೈನಿಕರನ್ನು ಸದೆಬಡಿದ ಆ ರೋಚಕ ರಹಸ್ಯ ಇಲ್ಲಿದೆ!',
    images: ['citadel.jpg', 'panoramic.jpg', 'ramparts.jpg']
  },
  {
    id: 'part1',
    title: '1. ಏಳು ಸುತ್ತಿನ ಕಲ್ಲಿನ ಚಕ್ರವ್ಯೂಹ (The 7-Ringed Labyrinth)',
    narration: 'ಚಿತ್ರದುರ್ಗದ ಕೋಟೆಯನ್ನು ಏಳು ಸುತ್ತಿನ ಕೋಟೆ ಎಂದೇ ಕರೆಯುತ್ತಾರೆ. ಹೊರಗಿನಿಂದ ಬರುವ ಶತ್ರು ಸೈನ್ಯಕ್ಕೆ ಮುಖ್ಯ ಕೋಟೆ ಕಾಣುವುದೇ ಇಲ್ಲ! ಒಂದೊಂದು ಬಾಗಿಲು ದಾಟಿದ ಮೇಲೂ ಶತ್ರುಗಳು ಕಲ್ಲಿನ ಚಕ್ರವ್ಯೂಹದಲ್ಲಿ ಸಿಲುಕಿಕೊಳ್ಳುವಂತೆ ಅಂಕುಡೊಂಕಾದ ರಸ್ತೆಗಳನ್ನು ನಿರ್ಮಿಸಲಾಗಿತ್ತು. ಆನೆಗಳು ಬಾಗಿಲುಗಳನ್ನು ಒಡೆಯಲು ಬಂದರೆ, ಅವುಗಳ ವೇಗವನ್ನು ತಗ್ಗಿಸಲು ಗೋಡೆಗಳನ್ನು ವಕ್ರವಾಗಿ ಕಟ್ಟಲಾಗಿತ್ತು!',
    images: ['gate.jpg', 'passage.jpg', 'walls.jpg']
  },
  {
    id: 'part2',
    title: '2. ಮಳೆನೀರು ಕೊಯ್ಲಿನ ಪವಾಡ (Ancient Water Engineering)',
    narration: 'ಇಷ್ಟೊಂದು ಬೃಹತ್ ಕಲ್ಲಿನ ಬೆಟ್ಟದ ಮೇಲೆ ಸಾವಿರಾರು ಜನರಿಗೆ ನೀರು ಎಲ್ಲಿಂದ ಬರುತ್ತಿತ್ತು? ಕೋಟೆಯ ಮೇಲೆ ನೈಸರ್ಗಿಕ ಬಂಡೆಗಳನ್ನು ಬಳಸಿ ಮಳೆನೀರನ್ನು ಹಿಡಿದಿಡಲು ಅಕ್ಕ-ತಂಗಿ ಹೊಂಡ ಮತ್ತು ಸಂತೆ ಹೊಂಡಗಳನ್ನು ನಿರ್ಮಿಸಲಾಗಿತ್ತು. ಎಷ್ಟೇ ವರ್ಷ ಮಳೆ ಬರದಿದ್ದರೂ ಅಥವಾ ಶತ್ರುಗಳು ಕೋಟೆಯನ್ನು ಸುತ್ತುವರಿದರೂ ನೀರಿನ ಕೊರತೆ ಎಂದಿಗೂ ಬರುತ್ತಿರಲಿಲ್ಲ!',
    images: ['boulders.jpg', 'watchtower.jpg', 'map.jpg']
  },
  {
    id: 'part3',
    title: '3. ಒನಕೆ ಓಬವ್ವನ ಅಪ್ರತಿಮ ಸಾಹಸ (Legend of Onake Obavva)',
    narration: 'ಹೈದರಾಲಿಯ ಸೈನಿಕರು ಕೋಟೆಯ ಗೋಡೆಯ ನಡುವಿನ ಕಿರಿದಾದ ಕಿಂಡಿಯನ್ನು ಪತ್ತೆಹಚ್ಚಿ, ಒಬ್ಬೊಬ್ಬರಾಗಿ ಒಳನುಸುಳಲು ಪ್ರಯತ್ನಿಸಿದಾಗ, ಕಾವಲುಗಾರನ ಪತ್ನಿ ಓಬವ್ವ ನೀರು ತರಲು ಬಂದಾಗ ಇದನ್ನು ಗಮನಿಸುತ್ತಾಳೆ. ಕಿಂಚಿತ್ತೂ ಭಯಪಡದೆ, ಕೈಯಲ್ಲಿ ಬೀಸುವ ಕಲ್ಲಿನ ಒನಕೆಯನ್ನು ಎತ್ತಿಕೊಂಡು, ಕಿಂಡಿಯಿಂದ ತಲೆಹಾಕಿದ ಪ್ರತಿಯೊಬ್ಬ ಶತ್ರು ಸೈನಿಕನ ತಲೆಗೆ ಬಡಿದು, ರಕ್ತದ ಮಡುವಿನಲ್ಲಿ ಸದ್ದಿಲ್ಲದೆ ಮುಗಿಸುತ್ತಾಳೆ! ಆ ಕಿಂಡಿಯೇ ಇಂದಿನ ಓಬವ್ವನ ಕಿಂಡಿ.',
    images: ['kindi1.jpg', 'kindi2.jpg', 'walls.jpg']
  },
  {
    id: 'part4',
    title: '4. ಮದಕರಿ ನಾಯಕನ ಅಂತಿಮ ಶೌರ್ಯ (The Legacy of Madakari Nayaka)',
    narration: 'ಚಿತ್ರದುರ್ಗದ ಪಾಳೆಯಗಾರರ ಕೊನೆಯ ದೊರೆ ವೀರ ಮದಕರಿ ನಾಯಕನ ಶೌರ್ಯ ಇಡೀ ದಕ್ಷಿಣ ಭಾರತದಲ್ಲೇ ಚಿರಪರಿಚಿತ. ಕೋಟೆಯ ಪ್ರತಿಯೊಂದು ಕಲ್ಲು ಬಂಡೆಯೂ ನಮ್ಮ ಪೂರ್ವಜರ ಶೌರ್ಯ, ಸ್ವಾಭಿಮಾನ ಮತ್ತು ಕಲೆಯ ಜೀವಂತ ಪ್ರತೀಕವಾಗಿ ಇಂದಿಗೂ ಮುಗಿಲೆತ್ತರಕ್ಕೆ ನಿಂತಿದೆ.',
    images: ['panoramic.jpg', 'citadel.jpg', 'ramparts.jpg']
  },
  {
    id: 'outro',
    title: 'ಕೊನೆಯ ಮಾತು & ಸಬ್‌ಸ್ಕ್ರೈಬ್',
    narration: 'ಕರುನಾಡಿನ ಈ ಅಪ್ರತಿಮ ಕೋಟೆಯ ರಹಸ್ಯಗಳಲ್ಲಿ ನಿಮಗೆ ಅತ್ಯಂತ ರೋಮಾಂಚನ ಉಂಟುಮಾಡಿದ ವಿಷಯ ಯಾವುದು? ತಪ್ಪದೆ ಕಾಮೆಂಟ್ ಮಾಡಿ! ಇಂತಹ ಮತ್ತಷ್ಟು ರೋಚಕ ಐತಿಹಾಸಿಕ ವಿಡಿಯೋಗಳಿಗಾಗಿ ಈಗಲೇ ನಮ್ಮ Kannadiga 369 ಚಾನೆಲ್‌ಗೆ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ! ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!',
    images: ['citadel.jpg', 'gate.jpg']
  }
];

// Short Script (35-45 seconds)
const SHORT_SCRIPT = {
  title: 'ಒಬ್ಬಳೇ 100 ಶತ್ರುಗಳನ್ನು ಮುಗಿಸಿದ ವೀರವನಿತೆ ಒನಕೆ ಓಬವ್ವ! ⚔️😱 #Shorts #Kannada #Chitradurga',
  narration: 'ಚಿತ್ರದುರ್ಗದ ಕಲ್ಲಿನ ಕೋಟೆಯಲ್ಲಿ ಒನಕೆ ಹಿಡಿದ ಒಬ್ಬ ಮಹಿಳೆ ಹೈದರಾಲಿಯ ನೂರಾರು ಸೈನಿಕರನ್ನು ಸದ್ದಿಲ್ಲದೆ ಹೇಗೆ ಮುಗಿಸಿದಳು ಗೊತ್ತಾ? ಕೋಟೆಯ ಕಿರಿದಾದ ಕಿಂಡಿಯಿಂದ ಶತ್ರು ಸೈನಿಕರು ಒಬ್ಬೊಬ್ಬರಾಗಿ ನುಸುಳುತ್ತಿದ್ದಾಗ, ವೀರವನಿತೆ ಓಬವ್ವ ಕೈಯಲ್ಲಿದ್ದ ಒನಕೆಯಿಂದ ತಲೆಗೆ ಬಡಿದು ರಕ್ತದ ಮಡುವಿನಲ್ಲಿ ಮುಗಿಸಿದಳು! ನಮ್ಮ ಕರುನಾಡಿನ ಹೆಮ್ಮೆಯ ನಾರಿ ಒನಕೆ ಓಬವ್ವನ ಶೌರ್ಯಕ್ಕೆ ಒಂದು ಲೈಕ್ ಕೊಡಿ ಮತ್ತು ಪೂರ್ಣ ರಹಸ್ಯಕ್ಕಾಗಿ Kannadiga 369 ಚಾನೆಲ್ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ!',
  images: ['kindi1.jpg', 'kindi2.jpg', 'citadel.jpg', 'walls.jpg', 'gate.jpg']
};

async function generateGeminiAudio(text, outputPath) {
  console.log('🎙️ Generating natural dramatic Kannada narration via Gemini TTS...');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash-tts',
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: 'Puck'
          }
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

async function renderKenBurnsClip(imagePath, durationSeconds, motionType, outputPath, isVertical = false) {
  const frames = Math.max(30, Math.round(durationSeconds * 30));
  let zoomExpr;
  
  if (isVertical) {
    // 1080x1920 (9:16)
    if (motionType === 'push') {
      zoomExpr = `scale=2160x3840:force_original_aspect_ratio=increase,crop=2160:3840,zoompan=z='min(zoom+0.0018,1.20)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30`;
    } else {
      zoomExpr = `scale=2160x3840:force_original_aspect_ratio=increase,crop=2160:3840,zoompan=z='if(lte(zoom,1.0),1.20,max(1.001,zoom-0.0018))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30`;
    }
  } else {
    // 1920x1080 (16:9)
    if (motionType === 'push') {
      zoomExpr = `scale=3840x2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='min(zoom+0.0015,1.18)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30`;
    } else if (motionType === 'pull') {
      zoomExpr = `scale=3840x2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='if(lte(zoom,1.0),1.18,max(1.001,zoom-0.0015))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30`;
    } else {
      zoomExpr = `scale=3840x2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='1.14':x='(on/${frames})*(iw-iw/zoom)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30`;
    }
  }

  await runFFmpeg([
    '-y',
    '-loop', '1',
    '-i', imagePath,
    '-vf', zoomExpr,
    '-t', durationSeconds.toFixed(2),
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-pix_fmt', 'yuv420p',
    outputPath
  ]);
}

async function createChitradurgaThumbnail(bgImagePath, outputPath) {
  console.log('🎨 Generating high-CTR Master YouTube Thumbnail for Chitradurga...');
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

      <!-- Vignette & dramatic glow -->
      <rect width="1280" height="720" fill="url(#glow)"/>

      <!-- Red Alert Badge -->
      <g filter="url(#shadow)">
        <rect x="50" y="45" width="480" height="60" rx="30" fill="#E60000" />
        <text x="75" y="86" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">🏰 7 ಸುತ್ತಿನ ಕಲ್ಲಿನ ರಹಸ್ಯ!</text>
      </g>

      <!-- Main High-CTR Headline -->
      <g filter="url(#shadow)">
        <text x="50" y="235" font-family="Arial, sans-serif" font-size="92" font-weight="900" fill="#FFE500">ಚಿತ್ರದುರ್ಗದ</text>
        <text x="50" y="335" font-family="Arial, sans-serif" font-size="92" font-weight="900" fill="#FFFFFF">ಬೆಚ್ಚಿಬೀಳಿಸುವ</text>
        <text x="50" y="435" font-family="Arial, sans-serif" font-size="86" font-weight="900" fill="#00FFCC">ಒನಕೆ ಓಬವ್ವ!</text>
      </g>

      <!-- Lower Channel Pill -->
      <g filter="url(#shadow)">
        <rect x="50" y="595" width="640" height="65" rx="16" fill="rgba(15, 15, 25, 0.92)" stroke="#FFAA00" stroke-width="3"/>
        <text x="75" y="638" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="#FFAA00">🔴 KANNADIGA 369 • HISTORICAL MYSTERY</text>
      </g>

      <!-- Mystery Callout Circle -->
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

  console.log('✓ Master Thumbnail created:', outputPath);
}

async function getYouTubeClient() {
  const tokenData = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'config', 'tokens.json'), 'utf8'));
  const creds = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'config', 'credentials.json'), 'utf8'));
  const auth = new google.auth.OAuth2(creds.youtube.client_id, creds.youtube.client_secret);
  auth.setCredentials(tokenData.youtube || tokenData);
  return google.youtube({ version: 'v3', auth });
}

async function produceLongFormVideo() {
  console.log('\n' + '═'.repeat(65));
  console.log('🚀 PRODUCING DAY 2 LONG-FORM MASTER DOCUMENTARY: CHITRADURGA FORT');
  console.log('═'.repeat(65));

  const audioDir = path.join(__dirname, '..', 'data', 'audio');
  await fs.mkdir(audioDir, { recursive: true });
  const videosDir = path.join(__dirname, '..', 'data', 'videos');
  await fs.mkdir(videosDir, { recursive: true });
  const tempClipsDir = path.join(__dirname, '..', 'temp', `clips_chitradurga_${Date.now()}`);
  await fs.mkdir(tempClipsDir, { recursive: true });

  const fullNarration = SCRIPT_SECTIONS.map(s => s.narration).join('\n\n');
  const audioPath = path.join(audioDir, `chitradurga_narration_${Date.now()}.mp3`);
  await generateGeminiAudio(fullNarration, audioPath);

  // Measure audio duration
  const totalDuration = await new Promise((resolve) => {
    const { exec } = require('child_process');
    exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`, (err, stdout) => {
      resolve(parseFloat(stdout) || 120);
    });
  });
  console.log(`✓ Narration Duration: ${totalDuration.toFixed(1)} seconds`);

  // Render multi-cut Ken Burns clips
  console.log('🎬 Rendering 18+ Ken Burns 1080p clips for Chitradurga Fort...');
  const totalChars = SCRIPT_SECTIONS.reduce((sum, s) => sum + s.narration.length, 0);
  const clipPaths = [];
  const motions = ['push', 'pull', 'pan'];
  let clipIndex = 0;

  for (const section of SCRIPT_SECTIONS) {
    const sectionDuration = (section.narration.length / totalChars) * totalDuration;
    const clipDuration = sectionDuration / section.images.length;

    for (let i = 0; i < section.images.length; i++) {
      const imgFile = section.images[i];
      const imgPath = path.join(__dirname, '..', 'data', 'assets', 'chitradurga', imgFile);
      const clipOut = path.join(tempClipsDir, `clip_${String(clipIndex++).padStart(3, '0')}.mp4`);
      const motion = motions[clipIndex % motions.length];
      await renderKenBurnsClip(imgPath, clipDuration, motion, clipOut, false);
      clipPaths.push(clipOut);
    }
  }

  // Concatenate clips
  const concatList = path.join(tempClipsDir, 'concat_list.txt');
  await fs.writeFile(concatList, clipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'), 'utf8');

  const rawVisual = path.join(tempClipsDir, 'raw_visual.mp4');
  console.log('⚡ Assembling visual shots into master 1080p timeline...');
  await runFFmpeg(['-y', '-f', 'concat', '-safe', '0', '-i', concatList, '-c', 'copy', rawVisual]);

  // Master audio mixing (voice + cinematic suspense)
  console.log('🎵 Mixing voiceover with cinematic suspense soundtrack...');
  const bgMusicPath = path.join(__dirname, '..', 'data', 'audio', 'cinematic_suspense.mp3');
  const mixedAudio = path.join(tempClipsDir, 'mixed_audio.mp3');
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

  // Assemble clean master video (zero subtitles)
  const finalVideo = path.join(videosDir, `chitradurga_master_${Date.now()}.mp4`);
  console.log('🎬 Muxing final 1080p clean master video...');
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
  console.log('✓ Master Video Created:', finalVideo);

  // Generate thumbnail
  const thumbPath = path.join(__dirname, '..', 'uploads', 'thumbnails', `thumb_chitradurga_${Date.now()}.jpg`);
  const thumbBg = path.join(__dirname, '..', 'data', 'assets', 'chitradurga', 'citadel.jpg');
  await createChitradurgaThumbnail(thumbBg, thumbPath);

  // Upload to YouTube
  console.log('📤 Uploading Chitradurga Master Documentary to YouTube as PUBLIC...');
  const yt = await getYouTubeClient();

  const title = 'ಬ್ರಿಟಿಷರನ್ನೇ ನಡುಗಿಸಿದ ಚಿತ್ರದುರ್ಗದ 7 ಸುತ್ತಿನ ಕೋಟೆಯ ರಹಸ್ಯ & ಒನಕೆ ಓಬವ್ವ! 🏰😱 | Chitradurga Fort';
  const description = `ಬ್ರಿಟಿಷರನ್ನೇ ನಡುಗಿಸಿದ ಚಿತ್ರದುರ್ಗದ 7 ಸುತ್ತಿನ ಕೋಟೆಯ ರಹಸ್ಯ & ಒನಕೆ ಓಬವ್ವ! 🏰😱 | Chitradurga Fort Mysteries & Onake Obavva | Kannadiga 369

ನಮ್ಮ ಕರುನಾಡಿನ ಹೆಮ್ಮೆಯ ಕಲ್ಲಿನ ಕೋಟೆ ಚಿತ್ರದುರ್ಗ! ಹೈದರಾಲಿ ಮತ್ತು ಬ್ರಿಟಿಷರ ಬೃಹತ್ ಸೈನ್ಯಕ್ಕೂ ಸುಲಭವಾಗಿ ಗೆಲ್ಲಲಾಗದ 7 ಸುತ್ತಿನ ಕಲ್ಲಿನ ಚಕ್ರವ್ಯೂಹ, 38 ರಹಸ್ಯ ಬಾಗಿಲುಗಳು, ಪ್ರಾಚೀನ ಮಳೆನೀರು ಕೊಯ್ಲು ಪದ್ಧತಿ, ಮತ್ತು ಒಬ್ಬಳೇ ನೂರಾರು ಶತ್ರು ಸೈನಿಕರನ್ನು ಸದೆಬಡಿದ ವೀರವನಿತೆ ಒನಕೆ ಓಬವ್ವನ ರೋಚಕ ಇತಿಹಾಸ ಇಲ್ಲಿದೆ!

📌 ಟೈಮ್‌ಸ್ಟ್ಯಾಂಪ್‌ಗಳು (Chapters):
00:00 - ಪೀಠಿಕೆ: ಶತ್ರುಗಳನ್ನೇ ನಡುಗಿಸಿದ ಕಲ್ಲಿನ ಕೋಟೆ (Intro)
00:20 - 1. ಏಳು ಸುತ್ತಿನ ಕಲ್ಲಿನ ಚಕ್ರವ್ಯೂಹ (The 7-Ringed Labyrinth)
00:46 - 2. ಮಳೆನೀರು ಕೊಯ್ಲಿನ ಪವಾಡ (Ancient Water Engineering)
01:10 - 3. ಒನಕೆ ಓಬವ್ವನ ಅಪ್ರತಿಮ ಸಾಹಸ (The Legend of Onake Obavva)
01:38 - 4. ಮದಕರಿ ನಾಯಕನ ಅಂತಿಮ ಶೌರ್ಯ (The Legacy of Madakari Nayaka)
01:58 - ಕೊನೆಯ ಮಾತು & ಸಬ್‌ಸ್ಕ್ರೈಬ್ (Conclusion)

🔔 ಇಂತಹ ಮತ್ತಷ್ಟು ರೋಚಕ ಐತಿಹಾಸಿಕ ವಿಡಿಯೋಗಳು ಮತ್ತು ರಹಸ್ಯಗಳಿಗಾಗಿ ಈಗಲೇ ನಮ್ಮ 'Kannadiga 369' ಚಾನೆಲ್‌ಗೆ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ!

#ChitradurgaFort #OnakeObavva #Kannadiga369 #KarnatakaMysteries #KannadaHistory #KannadaFacts #MadakariNayaka #KarnatakaTourism #DrBroStyle #CharitreKannada`;

  const tags = [
    'Chitradurga Fort history in Kannada',
    'Onake Obavva history',
    'Chitradurga fort mysteries',
    'Kannadiga 369',
    'Karnataka historical places',
    'Chitradurga 7 suttina kote',
    'Madakari Nayaka',
    'Hyder Ali Chitradurga',
    'Kannada facts',
    'unsolved mysteries Karnataka',
    'Dr Bro style Kannada',
    'Charitre Kannada',
    'Karnataka tourism documentary'
  ];

  const uploadRes = await yt.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title,
        description,
        tags,
        categoryId: '27',
        defaultLanguage: 'kn',
        defaultAudioLanguage: 'kn'
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false
      }
    },
    media: {
      body: fsSync.createReadStream(finalVideo)
    }
  });

  const videoId = uploadRes.data.id;
  console.log(`✅ LONG-FORM MASTERPIECE UPLOADED! Video ID: ${videoId}`);
  console.log(`Live URL: https://www.youtube.com/watch?v=${videoId}`);

  // Apply Thumbnail
  try {
    await yt.thumbnails.set({
      videoId,
      media: {
        mimeType: 'image/jpeg',
        body: fsSync.createReadStream(thumbPath)
      }
    });
    console.log('✅ Custom thumbnail applied successfully!');
  } catch (err) {
    console.warn('⚠️ Thumbnail set notice:', err.message);
  }

  return { videoId, title, url: `https://www.youtube.com/watch?v=${videoId}` };
}

async function produceShortsVideo() {
  console.log('\n' + '═'.repeat(65));
  console.log('🚀 PRODUCING DAY 2 VIRAL YOUTUBE SHORT: ONAKE OBAVVA 9:16');
  console.log('═'.repeat(65));

  const audioDir = path.join(__dirname, '..', 'data', 'audio');
  const videosDir = path.join(__dirname, '..', 'data', 'videos');
  const tempClipsDir = path.join(__dirname, '..', 'temp', `clips_short_${Date.now()}`);
  await fs.mkdir(tempClipsDir, { recursive: true });

  const audioPath = path.join(audioDir, `short_obavva_${Date.now()}.mp3`);
  await generateGeminiAudio(SHORT_SCRIPT.narration, audioPath);

  const duration = await new Promise((resolve) => {
    const { exec } = require('child_process');
    exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`, (err, stdout) => {
      resolve(parseFloat(stdout) || 35);
    });
  });
  console.log(`✓ Short Narration Duration: ${duration.toFixed(1)} seconds`);

  // Render vertical clips (1080x1920)
  const images = SHORT_SCRIPT.images;
  const clipDur = duration / images.length;
  const clipPaths = [];
  const motions = ['push', 'pull'];

  for (let i = 0; i < images.length; i++) {
    const imgPath = path.join(__dirname, '..', 'data', 'assets', 'chitradurga', images[i]);
    const clipOut = path.join(tempClipsDir, `short_clip_${i}.mp4`);
    await renderKenBurnsClip(imgPath, clipDur, motions[i % motions.length], clipOut, true);
    clipPaths.push(clipOut);
  }

  const concatList = path.join(tempClipsDir, 'short_concat.txt');
  await fs.writeFile(concatList, clipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'), 'utf8');

  const rawShort = path.join(tempClipsDir, 'raw_short.mp4');
  await runFFmpeg(['-y', '-f', 'concat', '-safe', '0', '-i', concatList, '-c', 'copy', rawShort]);

  // Mix audio with suspense
  const bgMusicPath = path.join(__dirname, '..', 'data', 'audio', 'cinematic_suspense.mp3');
  const mixedAudio = path.join(tempClipsDir, 'mixed_short_audio.mp3');
  await runFFmpeg([
    '-y',
    '-i', audioPath,
    '-stream_loop', '-1',
    '-i', bgMusicPath,
    '-filter_complex', '[0:a]volume=1.1[v];[1:a]volume=0.15[bg];[v][bg]amix=inputs=2:duration=first[aout]',
    '-map', '[aout]',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    mixedAudio
  ]);

  const finalShort = path.join(videosDir, `short_obavva_${Date.now()}.mp4`);
  await runFFmpeg([
    '-y',
    '-i', rawShort,
    '-i', mixedAudio,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    finalShort
  ]);
  console.log('✓ Master Vertical Short Created:', finalShort);

  // Upload Short
  console.log('📤 Uploading Viral Short to YouTube as PUBLIC...');
  const yt = await getYouTubeClient();

  const title = 'ಒಬ್ಬಳೇ 100 ಶತ್ರುಗಳನ್ನು ಮುಗಿಸಿದ ವೀರವನಿತೆ ಒನಕೆ ಓಬವ್ವ! ⚔️😱 #Shorts #Chitradurga #Kannada';
  const description = `ಒಬ್ಬಳೇ 100 ಶತ್ರುಗಳನ್ನು ಮುಗಿಸಿದ ವೀರವನಿತೆ ಒನಕೆ ಓಬವ್ವ! ⚔️😱

ಚಿತ್ರದುರ್ಗದ ಕಲ್ಲಿನ ಕೋಟೆಯಲ್ಲಿ ಹೈದರಾಲಿಯ ನೂರಾರು ಸೈನಿಕರನ್ನು ಒಬ್ಬಳೇ ಒನಕೆ ಹಿಡಿದು ಮುಗಿಸಿದ ವೀರ ಮಹಿಳೆ ಓಬವ್ವನ ಸಾಹಸಗಾಥೆ! ಪೂರ್ಣ ವಿಡಿಯೋಗಾಗಿ ನಮ್ಮ ಚಾನೆಲ್ ವೀಕ್ಷಿಸಿ!

#Shorts #OnakeObavva #ChitradurgaFort #KannadaShorts #Kannadiga369 #ViralShorts #KarnatakaHeritage #KannadaFacts`;

  const tags = ['Shorts', 'Onake Obavva', 'Chitradurga Fort', 'Kannada Shorts', 'Kannadiga 369', 'Viral Kannada', 'Historical Shorts'];

  const uploadRes = await yt.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title,
        description,
        tags,
        categoryId: '27',
        defaultLanguage: 'kn',
        defaultAudioLanguage: 'kn'
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false
      }
    },
    media: {
      body: fsSync.createReadStream(finalShort)
    }
  });

  const shortId = uploadRes.data.id;
  console.log(`✅ VIRAL SHORT UPLOADED! Video ID: ${shortId}`);
  console.log(`Live Short URL: https://www.youtube.com/watch?v=${shortId}`);

  return { shortId, title, url: `https://www.youtube.com/watch?v=${shortId}` };
}

async function main() {
  try {
    const longForm = await produceLongFormVideo();
    const short = await produceShortsVideo();

    console.log('\n' + '═'.repeat(65));
    console.log('🎉 DAY 2 PRODUCTION COMPLETE & PUBLISHED TO YOUTUBE!');
    console.log('═'.repeat(65));
    console.log('📺 Long-Form Master URL:', longForm.url);
    console.log('📱 Viral Short URL:     ', short.url);
    console.log('📊 Dashboard:            http://localhost:3456');
    console.log('═'.repeat(65));
  } catch (err) {
    console.error('❌ Production error:', err);
  }
}

main();

