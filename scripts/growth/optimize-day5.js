const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const basePath = 'C:/Users/PRAMOD/Downloads/youtube-automation-agent-master/youtube-automation-agent';
const creds = JSON.parse(fs.readFileSync(path.join(basePath, 'config/credentials.json'), 'utf8'));
const tokens = JSON.parse(fs.readFileSync(path.join(basePath, 'config/tokens.json'), 'utf8'));

const auth = new google.auth.OAuth2(creds.youtube.client_id, creds.youtube.client_secret);
auth.setCredentials(tokens.youtube || tokens);
const yt = google.youtube({ version: 'v3', auth });

async function optimizeDay5() {
  const videoId = 'XBE8AFZ3_yo';
  console.log('🚀 Optimizing Day 5 Video:', videoId);

  const title = 'ಕರ್ನಾಟಕದ ವಿಚಿತ್ರ ಜ್ವಾಲಾಮುಖಿ ದ್ವೀಪ: ಸೈಂಟ್ ಮೇರಿಸ್ ಐಲ್ಯಾಂಡ್! 😱🏝️ | St Mary\'s Island Malpe';
  const description = `ಕರ್ನಾಟಕದ ವಿಚಿತ್ರ ಜ್ವಾಲಾಮುಖಿ ದ್ವೀಪ: ಸೈಂಟ್ ಮೇರಿಸ್ ಐಲ್ಯಾಂಡ್! 😱🏝️ | St Mary's Island Malpe | Kannadiga 369

ನಮಸ್ಕಾರ ಕನ್ನಡಿಗರೇ! ಕರ್ನಾಟಕದ ಕರಾವಳಿಯಲ್ಲಿ ಜ್ವಾಲಾಮುಖಿ ಸ್ಫೋಟದಿಂದ ಸೃಷ್ಟಿಯಾದ ವಿಚಿತ್ರ ಷಟ್ಕೋನ ಕಲ್ಲಿನ ದ್ವೀಪವಿದೆಯೇ? 88 ದಶಲಕ್ಷ ವರ್ಷಗಳ ಹಿಂದೆ ಮಡಗಾಸ್ಕರ್ ಮತ್ತು ಭಾರತ ಬೇರ್ಪಟ್ಟಾಗ ಸೃಷ್ಟಿಯಾದ ಸೈಂಟ್ ಮೇರಿಸ್ ಐಲ್ಯಾಂಡ್‌ನ ಅಚ್ಚರಿಯ ಭೂವೈಜ್ಞಾನಿಕ ರಹಸ್ಯ ಮತ್ತು ವಾಸ್ಕೋ ಡ ಗಾಮಾ ಈ ದ್ವೀಪಕ್ಕೆ ನೀಡಿದ ಹೆಸರಿನ ಇತಿಹಾಸ ಇಲ್ಲಿದೆ!

📌 ಅಧ್ಯಾಯಗಳು (Chapters / Timestamps):
0:00 - ಸೈಂಟ್ ಮೇರಿಸ್ ಐಲ್ಯಾಂಡ್‌ನ ಅಚ್ಚರಿಯ ಪರಿಚಯ
0:35 - 88 ಮಿಲಿಯನ್ ವರ್ಷಗಳ ಹಳೆಯ ಜ್ವಾಲಾಮುಖಿ ಕಲ್ಲುಗಳು
1:10 - ಷಟ್ಕೋನ ಆಕಾರದ ಶಿಲೆಗಳ ವೈಜ್ಞಾನಿಕ ವಿಸ್ಮಯ
1:35 - ವಾಸ್ಕೋ ಡ ಗಾಮಾ ಭೇಟಿ ಮತ್ತು ಇತಿಹಾಸ
1:55 - ಕರುನಾಡಿನ ನೈಸರ್ಗಿಕ ವಿಸ್ಮಯ & ಕೃತಜ್ಞತೆ

🔔 ಇಂತಹ ಮತ್ತಷ್ಟು ರೋಚಕ ಐತಿಹಾಸಿಕ ಮತ್ತು ಭೌಗೋಳಿಕ ವಿಸ್ಮಯಗಳಿಗಾಗಿ ಈಗಲೇ ನಮ್ಮ ಚಾನೆಲ್‌ಗೆ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ:
👉 https://www.youtube.com/@Kannadiga_369?sub_confirmation=1

🎬 ಕರ್ನಾಟಕದ ರಹಸ್ಯಗಳ ಸಂಪೂರ್ಣ ಪ್ಲೇಲಿಸ್ಟ್ ವೀಕ್ಷಿಸಿ:
👉 https://www.youtube.com/playlist?list=PLfeygpKYFwkM

#StMarysIsland #Malpe #Udupi #KarnatakaMysteries #Kannadiga369 #VolcanicIsland #GeologicalWonder #KannadaDocumentary #KarnatakaTourism`;

  const tags = [
    'St Marys Island', 'Malpe beach', 'Udupi tourism', 'Volcanic island Karnataka',
    'Hexagonal basaltic rocks', 'Karnataka mysteries', 'Kannadiga 369', 'Kannada history',
    'Vasco da Gama Karnataka', 'Udupi hidden places', 'Kannada documentary'
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
  console.log('✅ Day 5 Description, Timestamps & Tags updated successfully!');

  // Post engaging comment
  const comment = 'ಕರ್ನಾಟಕದ ಈ ವಿಶಿಷ್ಟ ಜ್ವಾಲಾಮುಖಿ ದ್ವೀಪ ಸೈಂಟ್ ಮೇರಿಸ್ ಐಲ್ಯಾಂಡ್‌ಗೆ ನೀವು ಎಂದಾದರೂ ಭೇಟಿ ನೀಡಿದ್ದೀರಾ? ನಿಮ್ಮ ಅನಿಸಿಕೆಯನ್ನು ತಪ್ಪದೆ ಕಾಮೆಂಟ್ ಮಾಡಿ! 🏝️👇 ಇಂತಹ ರೋಚಕ ವಿಡಿಯೋಗಳಿಗಾಗಿ ನಮ್ಮ ಚಾನೆಲ್‌ಗೆ ಈಗಲೇ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ!';
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
  console.log('✅ Day 5 Engagement comment posted!');
}

optimizeDay5().catch(console.error);
