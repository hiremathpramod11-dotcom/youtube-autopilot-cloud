const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const basePath = 'C:/Users/PRAMOD/Downloads/youtube-automation-agent-master/youtube-automation-agent';
const creds = JSON.parse(fs.readFileSync(path.join(basePath, 'config/credentials.json'), 'utf8'));
const tokens = JSON.parse(fs.readFileSync(path.join(basePath, 'config/tokens.json'), 'utf8'));

const auth = new google.auth.OAuth2(creds.youtube.client_id, creds.youtube.client_secret);
auth.setCredentials(tokens.youtube || tokens);
const yt = google.youtube({ version: 'v3', auth });

const optimizations = [
  {
    videoId: 'uZ_57yZkjIU',
    title: '57 ಅಡಿ ಎತ್ತರದ ಶ್ರವಣಬೆಳಗೊಳದ ಗೊಮ್ಮಟೇಶ್ವರನ ಬೆಚ್ಚಿಬೀಳಿಸುವ ರಹಸ್ಯಗಳು! 😱🗿 | Shravanabelagola Gommateshwara',
    description: `57 ಅಡಿ ಎತ್ತರದ ಶ್ರವಣಬೆಳಗೊಳದ ಗೊಮ್ಮಟೇಶ್ವರನ ಬೆಚ್ಚಿಬೀಳಿಸುವ ರಹಸ್ಯಗಳು! 😱🗿 | Shravanabelagola Gommateshwara | Kannadiga 369

ನಮಸ್ಕಾರ ಕನ್ನಡಿಗರೇ! ಜಗತ್ತಿನಲ್ಲೇ ಅತಿ ಎತ್ತರದ ಏಕಶಿಲಾ ವಿಗ್ರಹ ಶ್ರವಣಬೆಳಗೊಳದ ಗೊಮ್ಮಟೇಶ್ವರ! 1000 ವರ್ಷಗಳ ಹಿಂದೆಯೇ ಒಂದೇ ಒಂದು ಬೃಹತ್ ಕಲ್ಲಿನಲ್ಲಿ 57 ಅಡಿ ಎತ್ತರದ ಈ ದೈತ್ಯ ಮೂರ್ತಿಯನ್ನು ಇಂದ್ರಗಿರಿ ಬೆಟ್ಟದ ತುದಿಯಲ್ಲಿ ಹೇಗೆ ನಿರ್ಮಿಸಿದರು? ಬಿಸಿಲು, ಮಳೆ, ಗಾಳಿಗೆ ಕಿಂಚಿತ್ತೂ ಮங்கದ ಈ ಕಲ್ಲಿನ ರಹಸ್ಯ ಮತ್ತು ಮಹಾಮಸ್ತಕಾಭಿಷೇಕದ ಪವಾಡ ಇಲ್ಲಿದೆ!

📌 ಟೈಮ್‌ಸ್ಟ್ಯಾಂಪ್ಸ್ (Timestamps):
0:00 - ಶ್ರವಣಬೆಳಗೊಳದ ಅದ್ಭುತ ಪರಿಚಯ
0:35 - ಚಾವುಂಡರಾಯನ ಪ್ರತಿಜ್ಞೆ ಮತ್ತು ಗಂಗರ ಇತಿಹಾಸ
1:10 - 57 ಅಡಿ ಏಕಶಿಲಾ ಮೂರ್ತಿಯ ಕೆತ್ತನೆಯ ರಹಸ್ಯ
1:35 - 1000 ವರ್ಷಗಳಿಂದ ಹಾಳಾಗದ ಕಲ್ಲಿನ ವೈಜ್ಞಾನಿಕ ವಿಸ್ಮಯ
1:55 - ಮಹಾಮಸ್ತಕಾಭಿಷೇಕದ ಪವಾಡ & ಕೃತಜ್ಞತೆ

🔔 ಇಂತಹ ಮತ್ತಷ್ಟು ರೋಚಕ ಐತಿಹಾಸಿಕ ವಿಡಿಯೋಗಳಿಗಾಗಿ ಈಗಲೇ ನಮ್ಮ ಚಾನೆಲ್‌ಗೆ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ:
👉 https://www.youtube.com/@Kannadiga_369?sub_confirmation=1

💬 ನೀವು ಶ್ರವಣಬೆಳಗೊಳಕ್ಕೆ ಭೇಟಿ ನೀಡಿದ್ದೀರಾ? ನಿಮ್ಮ ಅನುಭವವನ್ನು ಕೆಳಗೆ ಕಾಮೆಂಟ್ ಮಾಡಿ!

#Shravanabelagola #Gommateshwara #KarnatakaMysteries #Kannadiga369 #KannadaHistory #Bahubali #Hassan #IncredibleKarnataka #KannadaDocumentary #TrendingKannada`,
    tags: [
      'Shravanabelagola', 'Gommateshwara', 'Bahubali statue', 'Hassan tourism', 
      'Karnataka mysteries', 'Kannada history', 'Chavundaraya', 'Ganga dynasty',
      'Kannadiga 369', 'World tallest monolith', 'Kannada facts', 'Karnataka heritage'
    ],
    comment: 'ಶ್ರವಣಬೆಳಗೊಳದ ಈ 57 ಅಡಿ ಏಕಶಿಲಾ ಗೊಮ್ಮಟೇಶ್ವರನ ಅದ್ಭುತ ರಹಸ್ಯದಲ್ಲಿ ನಿಮಗೆ ಅತ್ಯಂತ ಅಚ್ಚರಿ ತಂದ ಸಂಗತಿ ಯಾವುದು? ನಿಮ್ಮ ಅನಿಸಿಕೆಯನ್ನು ತಪ್ಪದೆ ಕಾಮೆಂಟ್ ಮಾಡಿ! 👇❤️ ಇಂತಹ ರೋಚಕ ವಿಡಿಯೋಗಳಿಗಾಗಿ ನಮ್ಮ ಚಾನೆಲ್‌ಗೆ ಈಗಲೇ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ!'
  },
  {
    videoId: 'DVw06PqujMs',
    title: 'ಬ್ರಿಟಿಷರನ್ನೇ ನಡುಗಿಸಿದ ಚಿತ್ರದುರ್ಗದ 7 ಸುತ್ತಿನ ಕೋಟೆಯ ರಹಸ್ಯ & ಒನಕೆ ಓಬವ್ವ! 🏰😱 | Chitradurga Fort',
    description: `ಬ್ರಿಟಿಷರನ್ನೇ ನಡುಗಿಸಿದ ಚಿತ್ರದುರ್ಗದ 7 ಸುತ್ತಿನ ಕೋಟೆಯ ರಹಸ್ಯ & ಒನಕೆ ಓಬವ್ವ! 🏰😱 | Chitradurga Fort | Kannadiga 369

ಚಿತ್ರದುರ್ಗದ ಕಲ್ಲಿನ ಕೋಟೆ ಕೇವಲ ಕೋಟೆಯಲ್ಲ, ಅದು ಶತ್ರುಗಳಿಗೆ ಸಾವಿನ ಚಕ್ರವ್ಯೂಹ! ಹೈದರ್ ಅಲಿ ಸೈನ್ಯವನ್ನೇ ನಡುಗಿಸಿದ ಏಳು ಸುತ್ತಿನ ಕೋಟೆಯ ಕಳ್ಳಂಡಿ ಕಿಂಡಿ ರಹಸ್ಯ, ಒನಕೆ ಓಬವ್ವನ ಅಪ್ರತಿಮ ಶೌರ್ಯ ಮತ್ತು ಮದಕರಿ ನಾಯಕರ ರೋಚಕ ಇತಿಹಾಸ ಇಲ್ಲಿದೆ!

📌 ಟೈಮ್‌ಸ್ಟ್ಯಾಂಪ್ಸ್ (Timestamps):
0:00 - ಕಲ್ಲಿನ ಕೋಟೆಯ ಪರಿಚಯ
0:35 - ಏಳು ಸುತ್ತಿನ ರಕ್ಷಣಾ ಚಕ್ರವ್ಯೂಹ
1:10 - ಕಿಂಡಿಯ ರಹಸ್ಯ & ಒನಕೆ ಓಬವ್ವನ ಸಾಹಸ
1:40 - ಮದಕರಿ ನಾಯಕರ ತ್ಯಾಗ ಮತ್ತು ಇತಿಹಾಸ

🔔 ತಪ್ಪದೆ ನಮ್ಮ Kannadiga 369 ಚಾನೆಲ್‌ಗೆ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ:
👉 https://www.youtube.com/@Kannadiga_369?sub_confirmation=1

#ChitradurgaFort #OnakeObavva #MadakariNayaka #KarnatakaHistory #Kannadiga369 #KarnatakaMysteries #KannadaShorts #KannadaDocumentary`,
    tags: [
      'Chitradurga Fort', 'Onake Obavva', 'Madakari Nayaka', 'Chitradurga fort history Kannada',
      '7 suttina kote', 'Karnataka history', 'Kannadiga 369', 'Hyder Ali Chitradurga', 'Kannada facts'
    ],
    comment: 'ವೀರವನಿತೆ ಒನಕೆ ಓಬವ್ವನ ಸಾಹಸ ಮತ್ತು ಚಿತ್ರದುರ್ಗದ ಕೋಟೆಯ ರಹಸ್ಯ ನಿಮಗೆ ಹೇಗೆ ಅನಿಸಿತು? ತಪ್ಪದೆ ಕಾಮೆಂಟ್ ಮಾಡಿ! 🚩🔥'
  },
  {
    videoId: 'brMGSd7J8V4',
    title: 'ಬ್ರಿಟಿಷರನ್ನೇ ಬೆಚ್ಚಿಬೀಳಿಸಿದ ಕರ್ನಾಟಕದ 5 ನಿಗೂಢ ರಹಸ್ಯಗಳು! 😱 | Kannadiga 369',
    description: `ಬ್ರಿಟಿಷರನ್ನೇ ಬೆಚ್ಚಿಬೀಳಿಸಿದ ಕರ್ನಾಟಕದ 5 ನಿಗೂಢ ರಹಸ್ಯಗಳು! 😱 | 5 Unsolved British Mysteries of Karnataka | Kannadiga 369

ಬ್ರಿಟಿಷ್ ಸಾಮ್ರಾಜ್ಯವನ್ನೇ ಬೆಚ್ಚಿಬೀಳಿಸಿದ ಕರ್ನಾಟಕದ 5 ಅತಿ ದೊಡ್ಡ ನಿಗೂಢ ರಹಸ್ಯಗಳು! ಹಂಪಿಯ ಸಂಗೀತ ಸ್ತಂಭಗಳು, ಟಿಪ್ಪು ಸುಲ್ತಾನನ ಮಿಸೈಲ್ ರಹಸ್ಯ, ಪಟ್ಟದಕಲ್ಲಿನ ವಿಸ್ಮಯ ಮತ್ತು ಬ್ರಿಟಿಷರಿಗೆ ಉತ್ತರ ಸಿಗದ ಅಸಲಿ ಇತಿಹಾಸ!

📌 ಟೈಮ್‌ಸ್ಟ್ಯಾಂಪ್ಸ್ (Timestamps):
0:00 - ರಹಸ್ಯಗಳ ಪರಿಚಯ
0:30 - ಹಂಪಿಯ ಕಲ್ಲಿನ ರಥ & ಸಂಗೀತ ಕಂಬಗಳು
1:00 - ಟಿಪ್ಪು ಸುಲ್ತಾನನ ರಾಕೆಟ್ ತಂತ್ರಜ್ಞಾನ
1:30 - ಬ್ರಿಟಿಷರ ದಾಖಲೆಗಳಲ್ಲಿನ ನಿಗೂಢ ಘಟನೆಗಳು

🔔 ತಪ್ಪದೆ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ:
👉 https://www.youtube.com/@Kannadiga_369?sub_confirmation=1

#KarnatakaMysteries #KannadaHistory #Kannadiga369 #HampiMysteries #TipuSultan #KannadaFacts #TrendingKannada`,
    tags: [
      'Karnataka mysteries', 'Kannada history', 'Hampi musical pillars', 'Tipu Sultan rockets',
      'Kannadiga 369', 'British mysteries Karnataka', 'Kannada documentary', 'Kannada facts'
    ],
    comment: 'ಕರ್ನಾಟಕದ ಈ 5 ರಹಸ್ಯಗಳಲ್ಲಿ ನಿಮಗೆ ಅತ್ಯಂತ ರೋಮಾಂಚನ ಉಂಟುಮಾಡಿದ ವಿಷಯ ಯಾವುದು? ಕಾಮೆಂಟ್ ಮಾಡಿ! 🔥👇'
  }
];

async function applyOptimizations() {
  for (const opt of optimizations) {
    console.log(`\n🚀 Optimizing Video: ${opt.videoId}...`);
    try {
      // 1. Update snippet (title, description, tags)
      await yt.videos.update({
        part: ['snippet'],
        requestBody: {
          id: opt.videoId,
          snippet: {
            title: opt.title,
            description: opt.description,
            tags: opt.tags,
            categoryId: '27',
            defaultLanguage: 'kn',
            defaultAudioLanguage: 'kn'
          }
        }
      });
      console.log(`✅ SEO Description, Timestamps & Tags updated for ${opt.videoId}!`);

      // 2. Post engaging comment
      const commentRes = await yt.commentThreads.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            videoId: opt.videoId,
            topLevelComment: {
              snippet: {
                textOriginal: opt.comment
              }
            }
          }
        }
      });
      console.log(`✅ Engagement comment posted for ${opt.videoId}!`);
    } catch (err) {
      console.error(`⚠️ Error optimizing ${opt.videoId}:`, err.message);
    }
  }
}

applyOptimizations().catch(console.error);

