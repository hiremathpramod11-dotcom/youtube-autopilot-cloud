const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const basePath = 'C:/Users/PRAMOD/Downloads/youtube-automation-agent-master/youtube-automation-agent';
const creds = JSON.parse(fs.readFileSync(path.join(basePath, 'config/credentials.json'), 'utf8'));
const tokens = JSON.parse(fs.readFileSync(path.join(basePath, 'config/tokens.json'), 'utf8'));

const auth = new google.auth.OAuth2(creds.youtube.client_id, creds.youtube.client_secret);
auth.setCredentials(tokens.youtube || tokens);
const yt = google.youtube({ version: 'v3', auth });

async function optimizeDay4() {
  const videoId = '49s3LFMrkEw';
  console.log('🚀 Optimizing Day 4 Video:', videoId);

  const title = 'ಮೈಸೂರು ಅರಮನೆಯಿಂದ ಶ್ರೀರಂಗಪಟ್ಟಣಕ್ಕೆ ರಹಸ್ಯ ಸುರಂಗ ಮಾರ್ಗ! 😱🏰 | Mysore Palace Hidden Tunnels';
  const description = `ಮೈಸೂರು ಅರಮನೆಯಿಂದ ಶ್ರೀರಂಗಪಟ್ಟಣಕ್ಕೆ ರಹಸ್ಯ ಸುರಂಗ ಮಾರ್ಗ! 😱🏰 | Mysore Palace Hidden Tunnels | Kannadiga 369

ನಮಸ್ಕಾರ ಕನ್ನಡಿಗರೇ! ಮೈಸೂರು ಅರಮನೆಯ ಅಡಿಯಲ್ಲಿ ನಿಜವಾಗಿಯೂ ಶ್ರೀರಂಗಪಟ್ಟಣಕ್ಕೆ ರಹಸ್ಯ ಭೂಗತ ಸುರಂಗ ಮಾರ್ಗವಿದೆಯೇ? ಯುದ್ಧದ ಸಮಯದಲ್ಲಿ ಒಡೆಯರ್ ರಾಜಮನೆತನ ಮತ್ತು ಟಿಪ್ಪು ಸುಲ್ತಾನ್ ಬಳಸುತ್ತಿದ್ದ ಈ ನಿಗೂಢ ಸುರಂಗದ ಇಂದಿನ ಸ್ಥಿತಿ ಏನು? ಬ್ರಿಟಿಷರ ಕಣ್ಣಿಗೆ ಬೀಳದಂತೆ ನಿರ್ಮಿಸಲಾದ ಈ ಭೂಗತ ಮಾರ್ಗದ ಸತ್ಯ ಇಲ್ಲಿದೆ!

📌 ಅಧ್ಯಾಯಗಳು (Chapters / Timestamps):
0:00 - ಮೈಸೂರು ಅರಮನೆಯ ನಿಗೂಢ ಸುರಂಗದ ಕಥೆ
0:30 - ಒಡೆಯರ್ ರಾಜವಂಶ & ಭೂಗತ ರಕ್ಷಣಾ ಮಾರ್ಗ
1:00 - ಶ್ರೀರಂಗಪಟ್ಟಣದ ಕೋಟೆಗೆ ಸಂಪರ್ಕ ಕಲ್ಪಿಸುವ ರಹಸ್ಯ
1:30 - ಸುರಂಗವನ್ನು ಮುಚ್ಚಲು ಕಾರಣವೇನು?
1:50 - ಕರುನಾಡಿನ ಐತಿಹಾಸಿಕ ವಿಸ್ಮಯ & ಕೃತಜ್ಞತೆ

🔔 ಇಂತಹ ಮತ್ತಷ್ಟು ರೋಚಕ ಐತಿಹಾಸಿಕ ವಿಡಿಯೋಗಳಿಗಾಗಿ ಈಗಲೇ ನಮ್ಮ ಚಾನೆಲ್‌ಗೆ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ:
👉 https://www.youtube.com/@Kannadiga_369?sub_confirmation=1

🎬 ಕರ್ನಾಟಕದ ರಹಸ್ಯಗಳ ಸಂಪೂರ್ಣ ಪ್ಲೇಲಿಸ್ಟ್ ವೀಕ್ಷಿಸಿ:
👉 https://www.youtube.com/playlist?list=PLfeygpKYFwkM

#MysorePalace #MysorePalaceTunnels #Srirangapatna #WodeyarDynasty #TipuSultan #KarnatakaMysteries #Kannadiga369 #KannadaHistory #Mysuru #KarnatakaHeritage`;

  const tags = [
    'Mysore Palace', 'Mysore Palace secret tunnel', 'Srirangapatna', 'Wodeyar dynasty',
    'Tipu Sultan', 'Mysore Palace history in Kannada', 'Karnataka mysteries',
    'Kannadiga 369', 'Kannada history', 'Mysore secret places', 'Kannada documentary'
  ];

  await yt.videos.update({
    part: ['snippet'],
    requestBody: {
      id: videoId,
      snippet: {
        title,
        description,
        tags,
        categoryId: '27',
        defaultLanguage: 'kn',
        defaultAudioLanguage: 'kn'
      }
    }
  });
  console.log('✅ Day 4 Description, Timestamps & Tags updated successfully!');

  // Post engaging comment
  const comment = 'ಮೈಸೂರು ಅರಮನೆಯ ಈ ರಹಸ್ಯ ಸುರಂಗ ಮಾರ್ಗದ ಬಗ್ಗೆ ನಿಮಗೆ ಮೊದಲೇ ತಿಳಿದಿತ್ತಾ? ನಿಮ್ಮ ಅನಿಸಿಕೆಯನ್ನು ತಪ್ಪದೆ ಕಾಮೆಂಟ್ ಮಾಡಿ! 🏰👇 ಇಂತಹ ರೋಚಕ ವಿಡಿಯೋಗಳಿಗಾಗಿ ನಮ್ಮ ಚಾನೆಲ್‌ಗೆ ಈಗಲೇ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ!';
  await yt.commentThreads.insert({
    part: ['snippet'],
    requestBody: {
      snippet: {
        videoId,
        topLevelComment: {
          snippet: {
            textOriginal: comment
          }
        }
      }
    }
  });
  console.log('✅ Day 4 Engagement comment posted!');
}

optimizeDay4().catch(console.error);
