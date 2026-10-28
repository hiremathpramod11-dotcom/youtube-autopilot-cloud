const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const fs = require('fs').promises;
const fsSync = require('fs');
const axios = require('axios');
const { runFFmpeg } = require('../utils/ffmpeg');
const { GoogleGenAI } = require('@google/genai');
const { google } = require('googleapis');

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
    const defaultAssets = ['hampi.jpg', 'badami_cave_temples.jpg', 'belur__karnataka.jpg'];
    for (const d of defaultAssets) {
      const p = path.join(__dirname, '..', 'data', 'assets', d);
      if (fsSync.existsSync(p)) images.push(p);
    }
  }

  return images;
}

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
            voiceName: 'Kore'
          }
        }
      }
    }
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (!part?.inlineData?.data) {
    throw new Error('TTS returned no audio data');
  }

  const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
  const tempPcm = outputPath.replace('.mp3', '.pcm');
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

  try { await fs.unlink(tempPcm); } catch (e) {}
  return outputPath;
}

async function getYouTubeClient() {
  const tokenData = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'config', 'tokens.json'), 'utf8'));
  const creds = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'config', 'credentials.json'), 'utf8'));
  const auth = new google.auth.OAuth2(creds.youtube.client_id, creds.youtube.client_secret);
  auth.setCredentials(tokenData.youtube || tokenData);
  return google.youtube({ version: 'v3', auth });
}

async function produceCompanionShort(targetDay) {
  const calendarPath = path.join(__dirname, '..', 'data', '30_day_calendar.json');
  const calendar = JSON.parse(await fs.readFile(calendarPath, 'utf8'));
  const entry = calendar.find(c => c.day === targetDay);
  if (!entry) throw new Error(`Day ${targetDay} not found in calendar`);

  if (entry.shortVideoId) {
    console.log(`Day ${targetDay} already has companion short: ${entry.shortVideoId}`);
    return entry.shortVideoId;
  }

  console.log('\n' + '═'.repeat(65));
  console.log(`🎬 PRODUCING COMPANION SHORT: DAY ${entry.day} - ${entry.title}`);
  console.log('═'.repeat(65));

  const assetDir = path.join(__dirname, '..', 'data', 'assets', `day_${entry.day}`);
  const images = await fetchWikiImages(entry.wikiTitles || ['Karnataka'], assetDir);
  console.log(`✓ Fetched ${images.length} images`);

  const audioDir = path.join(__dirname, '..', 'data', 'audio');
  await fs.mkdir(audioDir, { recursive: true });
  const shortAudioPath = path.join(audioDir, `day_${entry.day}_short_narration.mp3`);
  const hookText = entry.hook || entry.title;
  const shortNarration = `${hookText} ಪೂರ್ಣ ಆಘಾತಕಾರಿ ಸತ್ಯ ತಿಳಿಯಲು ಈಗಲೇ ನಮ್ಮ Kannadiga 369 ಚಾನೆಲ್ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ!`;
  await generateGeminiAudio(shortNarration, shortAudioPath);

  const shortDur = await new Promise((resolve) => {
    const { exec } = require('child_process');
    exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${shortAudioPath}"`, (err, stdout) => {
      resolve(parseFloat(stdout) || 35);
    });
  });

  const tempDir = path.join(__dirname, '..', 'temp', `short_day_${entry.day}_${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });
  const shortClipsDir = path.join(tempDir, 'short_clips');
  await fs.mkdir(shortClipsDir, { recursive: true });

  const shortImages = images.slice(0, 4);
  const shortClipDur = shortDur / shortImages.length;
  const shortClipPaths = [];

  for (let i = 0; i < shortImages.length; i++) {
    const sOut = path.join(shortClipsDir, `sclip_${i}.mp4`);
    const motion = i % 2 === 0 ? 'push' : 'pull';
    const frames = Math.max(30, Math.round(shortClipDur * 30));
    const zExpr = motion === 'push'
      ? `scale=2160x3840:force_original_aspect_ratio=increase,crop=2160:3840,zoompan=z='min(zoom+0.002,1.22)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30`
      : `scale=2160x3840:force_original_aspect_ratio=increase,crop=2160:3840,zoompan=z='if(lte(zoom,1.0),1.22,max(1.001,zoom-0.002))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30`;

    await runFFmpeg([
      '-y', '-loop', '1', '-i', shortImages[i],
      '-vf', zExpr,
      '-t', shortClipDur.toFixed(2),
      '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p',
      sOut
    ]);
    shortClipPaths.push(sOut);
  }

  const sConcat = path.join(shortClipsDir, 'sconcat.txt');
  await fs.writeFile(sConcat, shortClipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'), 'utf8');
  const sRaw = path.join(shortClipsDir, 'sraw.mp4');
  await runFFmpeg(['-y', '-f', 'concat', '-safe', '0', '-i', sConcat, '-c', 'copy', sRaw]);

  const candidateBg1 = path.join(__dirname, '..', 'assets', 'audio', 'cinematic_suspense.mp3');
  const candidateBg2 = path.join(__dirname, '..', 'data', 'audio', 'cinematic_suspense.mp3');
  const bgMusicPath = fsSync.existsSync(candidateBg1) ? candidateBg1 : (fsSync.existsSync(candidateBg2) ? candidateBg2 : null);

  const sMixedAudio = path.join(shortClipsDir, 'smixed.mp3');
  if (bgMusicPath) {
    await runFFmpeg([
      '-y', '-i', shortAudioPath, '-stream_loop', '-1', '-i', bgMusicPath,
      '-filter_complex', '[0:a]volume=1.1[v];[1:a]volume=0.15[bg];[v][bg]amix=inputs=2:duration=first[aout]',
      '-map', '[aout]', '-c:a', 'libmp3lame', '-b:a', '192k',
      sMixedAudio
    ]);
  } else {
    await runFFmpeg(['-y', '-i', shortAudioPath, '-c:a', 'libmp3lame', '-b:a', '192k', sMixedAudio]);
  }

  const videosDir = path.join(__dirname, '..', 'data', 'videos');
  await fs.mkdir(videosDir, { recursive: true });
  const finalShortVideo = path.join(videosDir, `day_${entry.day}_short_${Date.now()}.mp4`);
  await runFFmpeg([
    '-y', '-i', sRaw, '-i', sMixedAudio,
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest',
    finalShortVideo
  ]);

  // Schedule short 4.5 hours earlier than long-form (1:30 PM IST / 08:00 UTC)
  const shortDate = new Date(new Date(entry.scheduledDate).getTime() - (4.5 * 60 * 60 * 1000)).toISOString();
  console.log(`📤 Uploading Companion Short scheduled for ${shortDate}...`);

  const yt = await getYouTubeClient();
  try {
    const storeUrl = process.env.PROMOTIONAL_STORE_URL || 'https://latinas-plastic-manitoba-handling.trycloudflare.com/';
    const shortUpload = await yt.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: `${entry.title.substring(0, 50)}... 😱 #Shorts #Kannada`,
          description: `🛍️ Shop Trending Viral Inventions (Flat 50% OFF + Free Delivery): ${storeUrl}\n\n${entry.hook || entry.title}\n\n#Shorts #KannadaShorts #Kannadiga369 #ViralShorts`,
          tags: ['Shorts', 'Kannada Shorts', 'Kannadiga 369', 'Viral Kannada', ...(entry.tags || [])],
          categoryId: '27',
          defaultLanguage: 'kn',
          defaultAudioLanguage: 'kn'
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

    try {
      await yt.commentThreads.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            videoId: shortId,
            topLevelComment: {
              snippet: {
                textOriginal: `🛍️ 🔥 EXCLUSIVE FLASH SALE: Flat 50% OFF + Free Express Delivery on trending viral gadgets & smart lifestyle inventions! 👉 ${storeUrl} (COD & UPI Accepted! Limited Stock Available 🛒👇)`
              }
            }
          }
        }
      });
      console.log('✅ Short promotional pinned comment posted!');
    } catch (cErr) {
      console.warn('Short comment notice:', cErr.message);
    }

    entry.shortVideoId = shortId;
    await fs.writeFile(calendarPath, JSON.stringify(calendar, null, 2), 'utf8');

    return shortId;
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    console.error(`❌ Upload failed for Day ${entry.day} Short: ${errMsg}`);
    throw new Error(errMsg);
  }
}

module.exports = { produceCompanionShort };

if (require.main === module) {
  const day = parseInt(process.argv[2] || '6', 10);
  produceCompanionShort(day).catch(console.error);
}
