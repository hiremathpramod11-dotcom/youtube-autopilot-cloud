const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function testApertureThumbnail() {
  const bgImage = path.join(__dirname, '..', 'data', 'assets', 'day_24', 'img_0.jpg');
  const outPath = path.join(__dirname, '..', 'uploads', 'thumbnails', 'test_aperture_day_24.jpg');

  const headline = ['WHAT LIES AT', 'THE VERY BOTTOM?', '7 MILES DOWN'];
  const tag = 'DEEP OCEAN ABYSS • UNSOLVED';

  const svgOverlay = `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Cinematic Deep Vignette -->
        <radialGradient id="apertureVignette" cx="65%" cy="45%" r="75%">
          <stop offset="0%" stop-color="rgba(0, 0, 0, 0.15)"/>
          <stop offset="55%" stop-color="rgba(5, 8, 18, 0.70)"/>
          <stop offset="100%" stop-color="rgba(2, 3, 8, 0.96)"/>
        </radialGradient>

        <linearGradient id="neonGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFE600"/>
          <stop offset="100%" stop-color="#FF9900"/>
        </linearGradient>

        <filter id="heavyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="1"/>
        </filter>
        <filter id="glowAccent">
          <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#FFE600" flood-opacity="0.8"/>
        </filter>
      </defs>

      <!-- Vignette Overlay -->
      <rect width="1280" height="720" fill="url(#apertureVignette)"/>

      <!-- Sleek Minimalist Aperture Category Tag -->
      <g filter="url(#heavyShadow)">
        <rect x="60" y="50" width="400" height="42" rx="8" fill="rgba(10, 15, 28, 0.88)" stroke="#FF9900" stroke-width="2"/>
        <circle cx="82" cy="71" r="5" fill="#FF3333"/>
        <text x="100" y="77" font-family="'Arial Black', Impact, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" letter-spacing="3">${tag}</text>
      </g>

      <!-- Aperture Bold Heavy Typography -->
      <g filter="url(#heavyShadow)">
        <text x="60" y="240" font-family="'Arial Black', Impact, sans-serif" font-size="92" font-weight="900" fill="#FFFFFF" letter-spacing="1">${headline[0]}</text>
        <text x="60" y="345" font-family="'Arial Black', Impact, sans-serif" font-size="94" font-weight="900" fill="url(#neonGold)" letter-spacing="1">${headline[1]}</text>
        <text x="60" y="445" font-family="'Arial Black', Impact, sans-serif" font-size="82" font-weight="900" fill="#00E5FF" letter-spacing="1">${headline[2]}</text>
      </g>

      <!-- Minimalist Cinematic Crosshair / Tech Accent -->
      <g opacity="0.75" filter="url(#heavyShadow)">
        <circle cx="1080" cy="360" r="140" fill="none" stroke="#FFCC00" stroke-width="3" stroke-dasharray="12, 12"/>
        <line x1="1080" y1="200" x2="1080" y2="520" stroke="#FFCC00" stroke-width="2" stroke-dasharray="8, 8"/>
        <line x1="920" y1="360" x2="1240" y2="360" stroke="#FFCC00" stroke-width="2" stroke-dasharray="8, 8"/>
        <circle cx="1080" cy="360" r="8" fill="#FF3333"/>
      </g>

      <!-- Bottom Cinematic Brand Watermark -->
      <g filter="url(#heavyShadow)">
        <text x="60" y="655" font-family="'Arial Black', Impact, sans-serif" font-size="22" font-weight="800" fill="#AAAAAA" letter-spacing="4">APERTURE SPEC • GLOBAL MYSTERIES</text>
      </g>
    </svg>
  `;

  await sharp(bgImage)
    .resize(1280, 720, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.90, saturation: 1.40 })
    .composite([{ input: Buffer.from(svgOverlay), blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile(outPath);

  console.log('✓ Aperture Shadow Thumbnail Created:', outPath);
}

testApertureThumbnail().catch(console.error);
