import fs from 'fs';
import path from 'path';
import https from 'https';

const framesDir = path.resolve('public', 'frames');
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

const imagesToDownload = [
  { file: 'frame1.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//m/i/grey-black-full-rim-geometric-meller-mel-s18831-sunglasses_238654_1_meller_22_11_2025.jpg' },
  { file: 'frame2.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//j/i/grey-blue-full-rim-rectangle-john-jacobs-jj-flip-3---geson-e70437-clip-on-eyeglasses_243824dsc_3933_03_07_2026.jpg' },
  { file: 'frame3.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//v/i/vincent-chase-vc-s13112-c3-sunglasses_g_8818.jpg' },
  { file: 'frame4.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//l/e/lenskart-air-la-e13069-c1-eyeglasses_g_7842.jpg' },
  { file: 'frame5.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//h/u/hustlr-hu-e15012-c2-eyeglasses_g_4412.jpg' },
  { file: 'frame6.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//j/i/john-jacobs-jj-e10235-c1-eyeglasses_g_8835.jpg' },
  { file: 'frame7.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//v/i/vincent-chase-vc-e12432-c1-eyeglasses_g_4914.jpg' },
  { file: 'frame8.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//m/i/meller-mel-s18831-black-sunglasses_238654_2_28_09_2025.jpg' },
  { file: 'frame9.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//l/e/lenskart-air-la-e14188-c1-eyeglasses_g_0023.jpg' },
  { file: 'frame10.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//j/i/grey-blue-full-rim-rectangle-john-jacobs-jj-flip-3---geson-e70437-clip-on-eyeglasses_243824dsc_3930_03_07_2026.jpg' },
  { file: 'frame11.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//v/i/vincent-chase-vc-s11107-c1-sunglasses_g_6021.jpg' },
  { file: 'frame12.jpg', url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//h/u/hustlr-hu-e15014-c1-eyeglasses_g_1102.jpg' },
];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.lenskart.com/'
      }
    };

    https.get(options, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading 12 studio eyewear assets to public/frames/ ...');
  for (const item of imagesToDownload) {
    const dest = path.join(framesDir, item.file);
    try {
      await downloadImage(item.url, dest);
      const stats = fs.statSync(dest);
      console.log(`✓ Downloaded ${item.file} (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.file}:`, err.message);
    }
  }
}

run();
