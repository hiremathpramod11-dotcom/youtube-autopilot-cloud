require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { execSync } = require('child_process');
const { GoogleGenAI } = require('@google/genai');

console.log('═'.repeat(65));
console.log('☁️ YOUTUBE PERPETUAL LIFETIME CLOUD AUTOPILOT ENGINE');
console.log('   Mode: Perpetual Infinite Autonomous Production & Cloud Scheduling');
console.log('   Language: 100% English Global Curiosities, Mysteries & Inventions');
console.log('═'.repeat(65));

const EVERGREEN_TOPICS_POOL = [
  {
    title: 'The 12,000-Year-Old Megaliths of Göbekli Tepe 🏛️⚡ | Oldest Temple on Earth',
    topic: 'Gobekli Tepe Prehistoric Megaliths',
    wikiTitles: ['Göbekli_Tepe', 'Neolithic_architecture', 'Younger_Dryas'],
    hook: 'Built seven thousand years before Stonehenge and the Great Pyramids, a massive complex of carved stone pillars was discovered buried beneath a Turkish hilltop. Hunter-gatherers allegedly had no agriculture or wheel, yet they quarried and sculpted twenty-ton megaliths with astronomical alignments. Who really built Göbekli Tepe?',
    sections: [
      {
        title: '1. The Discovery That Rewrote History',
        narration: 'In 1994, archaeologist Klaus Schmidt uncovered circular enclosures with gigantic T-shaped pillars intricately carved with lions, scorpions, and vultures, predating all known human civilization.'
      },
      {
        title: '2. The Technology Paradox',
        narration: 'Standard history claims complex monumental architecture required farming surpluses and specialized labor. Göbekli Tepe proves monumental stone engineering existed while humans were still nomadic foragers.'
      },
      {
        title: '3. Deliberately Buried in Soil',
        narration: 'Most astonishing of all, the entire sanctuary was not destroyed by nature—it was deliberately backfilled with hundreds of tons of soil and entombed for reasons that remain a mystery.'
      },
      {
        title: '4. The Lost Ancestor Civilization',
        narration: 'Only five percent of the site has been excavated. What remains buried beneath the earth may soon reveal the forgotten beginnings of human knowledge.'
      }
    ],
    tags: ['Gobekli Tepe', 'Ancient History', 'Archaeology', 'Lost Civilizations', 'Ancient Mysteries', 'Stonehenge', 'Aperture']
  },
  {
    title: 'What If the Sun Disappeared for 7 Days? ☀️❄️ | Cosmic Survival Simulation',
    topic: 'What If the Sun Disappeared Simulation',
    wikiTitles: ['Sun', 'Atmosphere_of_Earth', 'Geothermal_energy'],
    hook: 'If the Sun vanished this instant, Earth would plunge into perpetual darkness in precisely eight minutes and twenty seconds. Without solar gravity, our planet would hurtle off into interstellar space at sixty-seven thousand miles per hour. Here is what would happen to humanity over the next seven days.',
    sections: [
      {
        title: '1. Day 1: The Final Twilight and Black Sky',
        narration: 'As the last rays of sunlight reach Earth, global temperatures drop by ten degrees within twenty-four hours. Photosynthesis stops instantly, and absolute panic grips the world.'
      },
      {
        title: '2. Days 2 to 4: The Deep Freeze Begins',
        narration: 'By Day Three, surface temperatures drop below freezing everywhere on Earth. The electrical grid buckles under demand as rivers, lakes, and power plants freeze solid.'
      },
      {
        title: '3. Days 5 to 7: Humanity Retreats Underground',
        narration: 'Only deep geothermal bunkers and nuclear submarine crews survive as surface temperatures hit minus one hundred degrees Fahrenheit and the oceans begin freezing from the surface downward.'
      },
      {
        title: '4. The Return of the Light',
        narration: 'When the Sun miraculously reappears, the shock of instant atmospheric reheating would unleash colossal storms, demonstrating the fragile razor-thin margin of cosmic habitability that protects Earth.'
      }
    ],
    tags: ['What If', 'Sun Disappears', 'Space Simulation', 'Astrophysics', 'Cosmic Catastrophe', 'Science Documentary', 'Aperture']
  },
  {
    title: 'The Deepest Hole on Earth: The Kola Superdeep Borehole 🕳️🔥 | Into the Abyss',
    topic: 'Kola Superdeep Borehole Geothermal Secrets',
    wikiTitles: ['Kola_Superdeep_Borehole', 'Earth%27s_crust', 'Geothermal_gradient'],
    hook: 'During the Cold War, Soviet scientists spent two decades drilling deeper into the Earth than anyone in human history. At over seven and a half miles down, the drill bits began melting in scorching heat, boiling water was discovered locked in stone, and subterranean acoustic sensors recorded bizarre sounds. Here is what they discovered at the gates of the underworld.',
    sections: [
      {
        title: '1. The 20-Year Race to the Earth Core',
        narration: 'Beginning in 1970 on the icy Kola Peninsula, Soviet drillers aimed to pierce straight through the continental crust to reach the boundary with the Earth mantle.'
      },
      {
        title: '2. Water Trapped in Solid Granite',
        narration: 'Geologists believed rocks at forty thousand feet would be bone-dry and dense. Instead, they found fractured rock saturated with boiling, pressurized water that defied all existing geological models.'
      },
      {
        title: '3. Extreme Temperatures That Melted Steel',
        narration: 'At twelve kilometers down, temperatures rocketed to three hundred and fifty-six degrees Fahrenheit, turning rock into plastic and forcing the team to weld the hole shut with a heavy steel cap.'
      },
      {
        title: '4. The Sealed Metal Cap Today',
        narration: 'Today, the site lies abandoned in the Russian Arctic, its seven-and-a-half-mile abyss sealed by a rusted metal hatch bolted into the ground—a testament to how little we know about what lies beneath our feet.'
      }
    ],
    tags: ['Kola Superdeep Borehole', 'Deep Earth', 'Geology', 'Science Documentary', 'Unsolved Mysteries', 'Earth Crust']
  },
  {
    title: 'The Unsolved Alien Radio Signal: The 1977 "Wow!" Signal 📡👽 | Cosmic Enigma',
    topic: 'The 1977 Wow Signal Deep Space Mystery',
    wikiTitles: ['Wow!_signal', 'Big_Ear', 'SETI'],
    hook: 'On August 15, 1977, the Big Ear radio telescope in Ohio detected a powerful narrowband radio burst originating from the constellation Sagittarius. It lasted for seventy-two seconds, peaked at thirty times louder than background cosmic noise, and matched the exact frequency of interstellar hydrogen. Forty-nine years later, scientists still cannot explain what broadcast it.',
    sections: [
      {
        title: '1. The 72-Second Cosmic Broadcast',
        narration: 'Astronomer Jerry Ehman was reviewing computer printouts when he spotted the alphanumeric sequence 6EQUJ5, representing an unprecedented spike in signal strength that prompted him to circle it in red ink and write "Wow!".'
      },
      {
        title: '2. The Hydrogen Line Connection',
        narration: 'The signal came in at fourteen hundred and twenty megahertz—the precise electromagnetic frequency where hydrogen naturally resonates, long considered the universal communication frequency for interstellar civilizations.'
      },
      {
        title: '3. Why It Was Never Natural Interference',
        narration: 'Every known natural astronomical source produces broad radio emissions. The Wow! Signal was razor-sharp, narrow-band, and never observed repeating, ruling out satellites, planets, or pulsars.'
      },
      {
        title: '4. Modern Deep Space Scans',
        narration: 'Modern radio observatories continuously train their dishes on Sagittarius. Whether it was a passing interstellar probe or a bizarre astrophysical flare, it remains humanity\'s closest encounter with the unknown.'
      }
    ],
    tags: ['Wow Signal', 'SETI', 'Space Mysteries', 'Alien Signal', 'Astrophysics', 'Cosmology', 'Science Documentary']
  },
  {
    title: 'The Sunken Pyramid City of Yonaguni 🌊🏛️ | Underwater Archaeology',
    topic: 'Yonaguni Underwater Monument Japan',
    wikiTitles: ['Yonaguni_Monument', 'Submerged_continent', 'Marine_geology'],
    hook: 'Off the coast of southern Japan lies a submerged stone structure rising eighty feet from the ocean floor. Featuring stepped terraces, straight ninety-degree walls, circular carved pillars, and massive carved channels, it resembles a submerged citadel. Was it built by an ice age civilization before sea levels rose ten thousand years ago?',
    sections: [
      {
        title: '1. Divers Discover a Sunken Megalith',
        narration: 'In 1986, a scuba diving instructor surveying hammerhead sharks stumbled upon colossal architectural monoliths carved from solid bedrock underwater.'
      },
      {
        title: '2. The Evidence of Human Craftsmanship',
        narration: 'Marine geologists documented two giant parallel steps, rectangular plazas, and rock faces with tool marks and drainage trenches that strongly resemble ancient Okinawan gusuku castles.'
      },
      {
        title: '3. The Ice Age Submersion Timeline',
        narration: 'The last time the Yonaguni plateau stood dry above sea level was over ten thousand years ago during the peak of the last glacial maximum. If artificial, it predates the oldest known cities on Earth.'
      },
      {
        title: '4. Nature or Lost Civilization?',
        narration: 'While some geologists argue natural sandstone fracturing formed the angles, the mystery of Yonaguni continues to captivate underwater explorers worldwide.'
      }
    ],
    tags: ['Yonaguni Monument', 'Underwater City', 'Ancient Mysteries', 'Archaeology', 'Sunken Ruins', 'Ocean Mysteries']
  }
];

async function autoExpandCalendar(calendar) {
  const pending = calendar.filter(c => c.status === 'pending');
  if (pending.length >= 15) return calendar;

  console.log(`⚡ Pending queue has ${pending.length} days (target minimum: 15). Expanding calendar via AI...`);
  const lastDay = calendar[calendar.length - 1]?.day || 34;
  const lastDate = new Date(calendar[calendar.length - 1]?.scheduledDate || new Date());

  const prompt = `You are a senior YouTube content director for a viral global infotainment & science mysteries channel.
Generate 10 new high-curiosity, worldwide viral video topics (in the cinematic storytelling style of Aperture, What If, Thoughty2, and Kurzgesagt).
Topics MUST be in English and cover:
- Cosmic "What If" simulations (e.g. Earth without gravity, moon falling, rogue planets, collision with Andromeda)
- Deep ocean abyss mysteries, Mariana trench discoveries & bizarre marine phenomena
- Ancient engineering enigmas & megalithic precision masonry (Pyramids, Baalbek, Göbekli Tepe, Tiwanaku, underwater ruins)
- Unsolved scientific paradoxes, quantum anomalies, acoustic phenomena, or classified expeditions

Return ONLY a valid JSON array of objects with this schema:
[
  {
    "title": "Compelling High-CTR English Title with emojis (under 80 chars)",
    "topic": "Brief topic summary",
    "wikiTitles": ["ValidWikipediaPage1", "ValidWikipediaPage2", "ValidWikipediaPage3"],
    "hook": "Gripping 3-sentence English hook presenting an unbelievable paradox or question and promising answers",
    "sections": [
      {
        "title": "1. Section Heading",
        "narration": "Detailed dramatic storytelling narration in English explaining the science, theories, and mystery."
      },
      {
        "title": "2. Section Heading",
        "narration": "Detailed dramatic storytelling narration in English."
      },
      {
        "title": "3. Section Heading",
        "narration": "Detailed dramatic storytelling narration in English."
      },
      {
        "title": "4. Section Heading",
        "narration": "Detailed dramatic storytelling narration in English."
      }
    ],
    "tags": ["World Mysteries", "Science Facts", "Mind Blowing", "Unsolved Mysteries", "Aperture", "What If"]
  }
]`;

  let newTopics = [];

  // Attempt 1: OpenRouter Llama 3.3 70B
  if (process.env.OPENROUTER_API_KEY) {
    try {
      console.log('🤖 Querying OpenRouter Llama 3.3 70B for global mystery scripts...');
      const axios = require('axios');
      const orRes = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'meta-llama/llama-3.3-70b-instruct',
        messages: [{ role: 'user', content: prompt }]
      }, {
        headers: {
          'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
          'HTTP-Referer': 'https://kannadiga369.com',
          'X-Title': 'Kannadiga 369'
        },
        timeout: 45000
      });
      const text = orRes.data.choices[0]?.message?.content;
      const match = text?.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) newTopics = JSON.parse(match[0]);
    } catch (e) {
      console.warn('OpenRouter expansion notice:', e.message);
    }
  }

  // Attempt 2: Gemini Flash fallback
  if (newTopics.length === 0 && process.env.GEMINI_API_KEY) {
    try {
      console.log('🤖 Querying Gemini Flash for global mystery scripts...');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt
      });
      const text = response.text;
      const match = text?.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) newTopics = JSON.parse(match[0]);
    } catch (e) {
      console.warn('Gemini expansion notice:', e.message);
    }
  }

  // Attempt 3: Evergreen Curated Pool fallback
  if (newTopics.length === 0) {
    console.log('🛡️ Using Evergreen Global Mysteries Pool fallback...');
    const existingTitles = new Set(calendar.map(c => c.title));
    newTopics = EVERGREEN_TOPICS_POOL.filter(p => !existingTitles.has(p.title));
  }

  if (newTopics.length > 0) {
    for (let i = 0; i < newTopics.length; i++) {
      const t = newTopics[i];
      const nextDate = new Date(lastDate.getTime() + ((i + 1) * 24 * 60 * 60 * 1000)).toISOString();
      calendar.push({
        day: lastDay + i + 1,
        status: 'pending',
        scheduledDate: nextDate,
        title: t.title,
        topic: t.topic,
        wikiTitles: t.wikiTitles || ['Universe', 'Ocean'],
        hook: t.hook,
        sections: t.sections || [],
        tags: t.tags || ['World Mysteries', 'Science Facts', 'Unsolved Mysteries', 'Mind Blowing', 'Curiosities']
      });
    }
    console.log(`✓ Added ${newTopics.length} new days! Total programmed days: ${calendar.length}`);
  }

  return calendar;
}

async function run() {
  const calendarPath = path.join(__dirname, '..', 'data', '30_day_calendar.json');
  if (!fsSync.existsSync(calendarPath)) {
    console.error('Calendar file not found:', calendarPath);
    process.exit(1);
  }

  let calendar = JSON.parse(await fs.readFile(calendarPath, 'utf8'));

  // Ensure calendar perpetually expands for full 365+ days
  calendar = await autoExpandCalendar(calendar);
  await fs.writeFile(calendarPath, JSON.stringify(calendar, null, 2), 'utf8');

  let scheduledCount = 0;
  let quotaReached = false;
  const encounteredErrors = [];

  // Phase 1: Backfill missing companion Shorts on scheduled days
  const missingShorts = calendar.filter(c => c.status === 'scheduled' && !c.shortVideoId && c.day >= 6);
  if (missingShorts.length > 0) {
    console.log(`⚡ Found ${missingShorts.length} scheduled days missing companion Shorts. Prioritizing: Days [${missingShorts.map(m => m.day).join(', ')}]`);
    for (const item of missingShorts) {
      console.log(`\n☁️ [Cloud Job] Producing missing companion Short for Day ${item.day}: ${item.title}`);
      try {
        execSync(`node scripts/produce-companion-short.js ${item.day}`, {
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        });
        scheduledCount++;
      } catch (err) {
        console.error(`⚠️ Notice on Day ${item.day} Short:`, err.message);
        if (err.message.includes('quotaExceeded') || err.message.includes('exceeded the number of videos')) {
          console.log('Reached daily YouTube upload limit. Will resume on next cloud trigger.');
          quotaReached = true;
          break;
        } else {
          encounteredErrors.push(`Day ${item.day} Short: ${err.message}`);
        }
      }
    }
    calendar = JSON.parse(await fs.readFile(calendarPath, 'utf8'));
  }

  if (quotaReached) {
    console.log('Daily YouTube upload quota reached. Safe exit; will resume tomorrow.');
    return;
  }

  const pending = calendar.filter(c => c.status === 'pending');
  console.log(`📊 Total Programmed Days: ${calendar.length}`);
  console.log(`⏳ Pending Days to Schedule: ${pending.length}`);

  if (pending.length === 0) {
    console.log('🎉 All available days are scheduled in YouTube cloud!');
    return;
  }

  // Process next pending batch (up to 4-5 videos per cloud run to stay within daily quota)
  const batch = pending.slice(0, 5);
  console.log(`🚀 Processing Cloud Batch of ${batch.length} days: Days [${batch.map(b => b.day).join(', ')}]`);

  for (const item of batch) {
    console.log(`\n☁️ [Cloud Job] Producing & Scheduling Day ${item.day}: ${item.title}`);
    try {
      execSync(`node scripts/produce-scheduled-video.js ${item.day}`, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log(`✅ Day ${item.day} successfully scheduled into YouTube Cloud!`);
      scheduledCount++;
    } catch (err) {
      console.error(`⚠️ Notice on Day ${item.day}:`, err.message);
      if (err.message.includes('quotaExceeded') || err.message.includes('exceeded the number of videos')) {
        console.log('Reached daily YouTube upload limit. Next batch will run on tomorrow’s cloud trigger.');
        quotaReached = true;
        break;
      } else {
        encounteredErrors.push(`Day ${item.day}: ${err.message}`);
      }
    }
  }

  console.log('\n═'.repeat(65));
  console.log(`✅ Cloud batch run complete. Scheduled ${scheduledCount} days.`);
  console.log('═'.repeat(65));

  if (scheduledCount === 0 && encounteredErrors.length > 0 && !quotaReached) {
    throw new Error('Cloud batch failed to schedule any videos:\n' + encounteredErrors.join('\n'));
  }
}

run().catch(err => {
  console.error('Fatal cloud error:', err);
  process.exit(1);
});
