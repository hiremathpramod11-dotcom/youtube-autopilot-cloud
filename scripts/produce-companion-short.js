const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
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
    console.warn('Wikipedia image search notice:', err.message);
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

async function renderCinematicScene(mediaPath, durationSeconds, motionType, outputPath, isShort = true) {
  const isVideo = mediaPath.endsWith('.mp4') || mediaPath.endsWith('.webm') || mediaPath.endsWith('.ogv');

  if (isVideo) {
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
      } else {
        zoomExpr = `scale=3840x2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='if(lte(zoom,1.0),1.18,max(1.001,zoom-0.0014))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30,eq=contrast=1.12:brightness=-0.02:saturation=1.22,vignette=PI/6,unsharp=5:5:0.6:5:5:0.0`;
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

async function mixMasterAudio(voicePath, bgMusicPath, outputPath, isShort = true) {
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
            prebuiltVoiceConfig: {
              voiceName
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
  const { images, videos } = await fetchVisualAssets(entry.topic || entry.title, entry.wikiTitles || ['Universe'], assetDir);
  console.log(`✓ Fetched ${images.length} HD photos and ${videos.length} motion video B-roll clips`);

  const audioDir = path.join(__dirname, '..', 'data', 'audio');
  await fs.mkdir(audioDir, { recursive: true });
  const shortAudioPath = path.join(audioDir, `day_${entry.day}_short_narration.mp3`);
  const isEnglish = (entry.day >= 21) || /^[A-Za-z0-9\s.,!?'"():|—–-]+$/.test(entry.title.substring(0, 30));
  const hookText = entry.hook || entry.title;
  const shortNarration = isEnglish
    ? `${hookText} Subscribe to Kannadiga 369 for more mind-blowing discoveries, and check out today's trending viral gadgets in the comments below!`
    : `${hookText} ಪೂರ್ಣ ಆಘಾತಕಾರಿ ಸತ್ಯ ತಿಳಿಯಲು ಈಗಲೇ ನಮ್ಮ Kannadiga 369 ಚಾನೆಲ್ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ!`;
  await generateGeminiAudio(shortNarration, shortAudioPath, isEnglish ? 'Fenrir' : 'Kore');

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

  const shortTotalClips = 6;
  const shortClipDur = shortDur / shortTotalClips;
  const shortClipPaths = [];

  for (let i = 0; i < shortTotalClips; i++) {
    let mediaFile;
    if (videos.length > 0 && i % 3 === 1) {
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

  const candidateBg1 = path.join(__dirname, '..', 'assets', 'audio', 'cinematic_suspense.mp3');
  const candidateBg2 = path.join(__dirname, '..', 'data', 'audio', 'cinematic_suspense.mp3');
  const bgMusicPath = fsSync.existsSync(candidateBg1) ? candidateBg1 : (fsSync.existsSync(candidateBg2) ? candidateBg2 : null);

  const sMixedAudio = path.join(shortClipsDir, 'smixed.m4a');
  await mixMasterAudio(shortAudioPath, bgMusicPath, sMixedAudio, true);

  const videosDir = path.join(__dirname, '..', 'data', 'videos');
  await fs.mkdir(videosDir, { recursive: true });
  const finalShortVideo = path.join(videosDir, `day_${entry.day}_short_${Date.now()}.mp4`);
  await runFFmpeg([
    '-y', '-i', sRaw, '-i', sMixedAudio,
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest',
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
          title: isEnglish
            ? `${entry.title.substring(0, 55)} #Shorts #Technology`
            : `${entry.title.substring(0, 50)}... 😱 #Shorts #Kannada`,
          description: isEnglish
            ? `🛍️ Trending Viral Inventions (Flat 50% OFF + Free Express Delivery): ${storeUrl}\n\n${entry.hook || entry.title}\n\n#Shorts #TechZone #ViralTech #Inventions #SmartGadgets #ScienceFacts`
            : `🛍️ Shop Trending Viral Inventions (Flat 50% OFF + Free Delivery): ${storeUrl}\n\n${entry.hook || entry.title}\n\n#Shorts #KannadaShorts #Kannadiga369 #ViralShorts`,
          tags: isEnglish
            ? ['Shorts', 'Viral Inventions', 'TechZone', 'Quantum Tech HD', 'Smart Gadgets', 'Satisfying Tech', 'Technology', 'Science Facts', ...(entry.tags || [])]
            : ['Shorts', 'Kannada Shorts', 'Kannadiga 369', 'Viral Kannada', ...(entry.tags || [])],
          categoryId: '28',
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
