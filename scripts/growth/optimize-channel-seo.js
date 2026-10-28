const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const creds = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'config', 'credentials.json'), 'utf8'));
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'config', 'tokens.json'), 'utf8'));
const auth = new google.auth.OAuth2(creds.youtube.client_id, creds.youtube.client_secret);
auth.setCredentials(tokens.youtube || tokens);
const yt = google.youtube({ version: 'v3', auth });

const STORE_URL = process.env.PROMOTIONAL_STORE_URL || 'https://latinas-plastic-manitoba-handling.trycloudflare.com/';

async function optimizeChannelSEO() {
  console.log('═'.repeat(65));
  console.log('🎯 AUTONOMOUS CHANNEL SEO & BRANDING OPTIMIZATION');
  console.log('═'.repeat(65));

  // 1. Fetch channel
  const chRes = await yt.channels.list({ part: ['id', 'brandingSettings', 'snippet'], mine: true });
  const ch = chRes.data.items[0];
  console.log(`Current Channel: ${ch.snippet.title} (${ch.id})`);

  // 2. High-CTR Worldwide Keywords for Algorithm Indexing
  const globalKeywords = [
    'World Mysteries',
    'Unsolved Mysteries',
    'Science Documentary',
    'What If',
    'Aperture',
    'Thoughty2',
    'Deep Sea Mysteries',
    'Ancient Engineering',
    'Megalithic Wonders',
    'Viral Inventions',
    'Smart Gadgets',
    'Mind Blowing Facts',
    'Cosmic Mysteries',
    'Space Documentary',
    'AquaFlow Direct',
    'Kannadiga 369'
  ].map(k => `"${k}"`).join(' ');

  const optimizedDescription = `Welcome to Kannadiga 369! 🌍 Exploring the world's most astonishing unsolved mysteries, deep ocean abysses, cosmic 'What If' simulations, ancient engineering enigmas, and viral technological inventions.

🛍️ Official Flash Sale (Flat 50% OFF + Free Express Delivery):
👉 Shop AquaFlow Direct: ${STORE_URL}
(Cash on Delivery & Instant PhonePe / GPay Accepted | 7-Day Guarantee)

Subscribe for daily mind-bending documentaries and viral discoveries!`;

  try {
    const updateRes = await yt.channels.update({
      part: ['brandingSettings'],
      requestBody: {
        id: ch.id,
        brandingSettings: {
          channel: {
            description: optimizedDescription,
            keywords: globalKeywords
          }
        }
      }
    });

    console.log('✅ Channel branding & SEO successfully optimized!');
    console.log('Indexed Keywords:', updateRes.data.brandingSettings?.channel?.keywords);
  } catch (err) {
    console.warn('Channel branding notice:', err.message);
  }

  // 3. Create high-retention playlists for new content archetypes
  const desiredPlaylists = [
    {
      title: 'Cosmic & Deep Ocean Mysteries | Unsolved Science & What If 🌊🌌',
      description: 'Journey into the deepest abysses of our oceans, cosmic "what if" simulations, and unexplained scientific phenomena. Explore the Mariana Trench, rogue black holes, and the wonders of the cosmos.'
    },
    {
      title: 'Viral Inventions & Smart Gadgets | Mind-Blowing Tech ⚡💡',
      description: 'The most satisfying viral inventions, everyday life-hacks, and groundbreaking technology gadgets. Check out exclusive trending products and smart lifestyle tools!'
    },
    {
      title: 'Ancient Engineering & Megalithic Enigmas 🏛️🗿',
      description: 'Uncovering the lost technologies of our ancestors: from the Great Pyramid Muon Void and 2,000-year-old Antikythera computer to the thousand-ton stones of Baalbek.'
    }
  ];

  const existingPlaylistsRes = await yt.playlists.list({ part: ['snippet'], mine: true, maxResults: 50 });
  const existingTitles = new Set((existingPlaylistsRes.data.items || []).map(p => p.snippet.title));

  for (const pl of desiredPlaylists) {
    if (!existingTitles.has(pl.title)) {
      try {
        const created = await yt.playlists.insert({
          part: ['snippet', 'status'],
          requestBody: {
            snippet: {
              title: pl.title,
              description: pl.description
            },
            status: {
              privacyStatus: 'public'
            }
          }
        });
        console.log(`✅ Created Playlist: "${pl.title}" (ID: ${created.data.id})`);
      } catch (plErr) {
        console.warn(`Playlist creation notice for "${pl.title}":`, plErr.message);
      }
    } else {
      console.log(`✓ Playlist already exists: "${pl.title}"`);
    }
  }

  console.log('\n═'.repeat(65));
  console.log('🎉 CHANNEL ARCHITECTURE UPGRADE COMPLETE!');
  console.log('═'.repeat(65));
}

optimizeChannelSEO().catch(console.error);
