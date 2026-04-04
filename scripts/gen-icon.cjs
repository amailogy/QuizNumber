const sharp = require('sharp');

const R = 420;
const C = 2 * Math.PI * R;
const progress = 1.0;

const svg = `
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#0f0f1a"/>
  <!-- Circular gauge track -->
  <circle cx="512" cy="512" r="${R}" fill="none" stroke="rgba(108,92,231,0.2)" stroke-width="40"/>
  <!-- Circular gauge progress -->
  <circle cx="512" cy="512" r="${R}" fill="none" stroke="#6c5ce7" stroke-width="40"
    stroke-linecap="round"
    stroke-dasharray="${C}"
    stroke-dashoffset="${C * (1 - progress)}"
    transform="rotate(-90 512 512)"/>
  <!-- 問 character -->
  <text x="512" y="540" text-anchor="middle" dominant-baseline="central"
    font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-weight="900"
    font-size="460" fill="#f0f0f0">問</text>
</svg>
`;

sharp(Buffer.from(svg))
  .resize(1024, 1024)
  .flatten({ background: { r: 15, g: 15, b: 26 } })
  .png()
  .toFile('ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png')
  .then(() => console.log('Icon created'));
