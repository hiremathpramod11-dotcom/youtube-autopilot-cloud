require('dotenv').config();
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { execSync } = require('child_process');
const { GoogleGenAI } = require('@google/genai');

console.log('═'.repeat(65));
console.log('☁️ YOUTUBE 365-DAY CLOUD AUTOPILOT ENGINE');
console.log('   Mode: Perpetual 365-Day Infinite Autonomous Production');
console.log('═'.repeat(65));

async function autoExpandCalendar(calendar) {
  const pending = calendar.filter(c => c.status === 'pending');
  if (pending.length >= 10) return calendar;

  console.log('⚡ Pending queue is low. Auto-generating next 15 days of Karnataka content via Gemini...');
  const lastDay = calendar[calendar.length - 1]?.day || 30;
  const lastDate = new Date(calendar[calendar.length - 1]?.scheduledDate || new Date());

  const prompt = `You are a senior YouTube content director for a Kannada infotainment channel '@Kannadiga_369'.
Generate 10 new high-curiosity video topics about Karnataka history, mysteries, architecture, unsolved legends, or ancient empires.
Return ONLY a valid JSON array of objects with this schema:
[
  {
    "title": "Shocking Kannada Title with emojis (under 80 chars)",
    "topic": "Brief English topic summary",
    "wikiTitles": ["WikipediaPageTitle1", "WikipediaPageTitle2"],
    "hook": "Compelling 3-sentence Kannada hook asking a question and promising answers",
    "sections": [
      {
        "title": "1. Section Heading",
        "narration": "Detailed storytelling narration in Kannada explaining the history and mystery."
      }
    ],
    "tags": ["Karnataka mysteries", "Kannadiga 369", "Kannada history"]
  }
]`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt
    });
    const text = response.text;

    const cleanJson = text?.replace(/```json/g, '')?.replace(/```/g, '')?.trim();
    const newTopics = JSON.parse(cleanJson);

    for (let i = 0; i < newTopics.length; i++) {
      const t = newTopics[i];
      const nextDate = new Date(lastDate.getTime() + ((i + 1) * 24 * 60 * 60 * 1000)).toISOString();
      calendar.push({
        day: lastDay + i + 1,
        status: 'pending',
        scheduledDate: nextDate,
        title: t.title,
        topic: t.topic,
        wikiTitles: t.wikiTitles || ['Karnataka'],
        hook: t.hook,
        sections: t.sections || [],
        tags: t.tags || ['Kannadiga 369', 'Karnataka mysteries']
      });
    }

    console.log(`✓ Added ${newTopics.length} new days! Total calendar days: ${calendar.length}`);
  } catch (err) {
    console.warn('Auto-expansion notice:', err.message);
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

  // Ensure calendar perpetually expands for full 365 days
  calendar = await autoExpandCalendar(calendar);
  await fs.writeFile(calendarPath, JSON.stringify(calendar, null, 2), 'utf8');

  const pending = calendar.filter(c => c.status === 'pending');
  console.log(`📊 Total Days Programmed: ${calendar.length}`);
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
    } catch (err) {
      console.error(`⚠️ Notice on Day ${item.day}:`, err.message);
      if (err.message.includes('quotaExceeded') || err.message.includes('exceeded the number of videos')) {
        console.log('Reached daily YouTube upload limit. Next batch will run on tomorrow’s cloud trigger.');
        break;
      }
    }
  }

  console.log('\n═'.repeat(65));
  console.log('✅ Cloud batch run complete. Progress saved.');
  console.log('═'.repeat(65));
}

run().catch(err => {
  console.error('Fatal cloud error:', err);
  process.exit(1);
});
