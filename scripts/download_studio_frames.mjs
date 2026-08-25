import fs from 'fs';
import path from 'path';

const framesDir = path.resolve('public', 'frames');
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

// 12 Real High-Resolution Eyewear Studio Photography Images
const studioEyewearList = [
  {
    file: "frame1.jpg",
    url: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop&q=80",
    name: "Vincent Chase Polarized Aviator",
    brand: "Vincent Chase",
    shape: "Aviator",
    size: "Wide",
    price: 1999
  },
  {
    file: "frame2.jpg",
    url: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80",
    name: "John Jacobs Geson Rectangle",
    brand: "John Jacobs",
    shape: "Rectangle",
    size: "Medium",
    price: 3500
  },
  {
    file: "frame3.jpg",
    url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    name: "Meller Geometric Black",
    brand: "Meller",
    shape: "Geometric",
    size: "Wide",
    price: 2800
  },
  {
    file: "frame4.jpg",
    url: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80",
    name: "Lenskart Air Round Acetate",
    brand: "Lenskart Air",
    shape: "Round",
    size: "Narrow",
    price: 1999
  },
  {
    file: "frame5.jpg",
    url: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80",
    name: "Hustlr Transparent Square",
    brand: "Vincent Chase",
    shape: "Square",
    size: "Medium",
    price: 1500
  },
  {
    file: "frame6.jpg",
    url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    name: "John Jacobs Heritage Tortoise",
    brand: "John Jacobs",
    shape: "Clubmaster",
    size: "Wide",
    price: 3499
  },
  {
    file: "frame7.jpg",
    url: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop&q=80",
    name: "Vincent Chase Urban Matte Black",
    brand: "Vincent Chase",
    shape: "Round",
    size: "Medium",
    price: 1499
  },
  {
    file: "frame8.jpg",
    url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    name: "Meller Gold Pilot Sunglasses",
    brand: "Meller",
    shape: "Aviator",
    size: "Extra Wide",
    price: 2999
  },
  {
    file: "frame9.jpg",
    url: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80",
    name: "Lenskart Air Silver Minimalist Rimless",
    brand: "Lenskart Air",
    shape: "Round",
    size: "Medium",
    price: 2799
  },
  {
    file: "frame10.jpg",
    url: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80",
    name: "John Jacobs Crystal Blue Wayfarer",
    brand: "John Jacobs",
    shape: "Wayfarer",
    size: "Wide",
    price: 3600
  },
  {
    file: "frame11.jpg",
    url: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80",
    name: "Vincent Chase Glam Cat-Eye Black",
    brand: "Vincent Chase",
    shape: "Cat-Eye",
    size: "Medium",
    price: 1799
  },
  {
    file: "frame12.jpg",
    url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    name: "Hustlr Bold Black Square",
    brand: "Vincent Chase",
    shape: "Square",
    size: "Medium",
    price: 1500
  }
];

async function run() {
  console.log("Downloading 12 high-resolution studio eyewear images...");

  for (const item of studioEyewearList) {
    const dest = path.join(framesDir, item.file);
    try {
      const res = await fetch(item.url);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buffer));
      const stats = fs.statSync(dest);
      console.log(`✓ Saved ${item.file}: ${(stats.size / 1024).toFixed(1)} KB`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.file}:`, err.message);
    }
  }

  // Update src/data/frames.json to use /frames/frameX.jpg
  const framesJsonPath = path.resolve('src', 'data', 'frames.json');
  const existingFrames = JSON.parse(fs.readFileSync(framesJsonPath, 'utf-8'));

  const updatedFrames = existingFrames.map((frame, index) => {
    const imgIndex = (index % 12) + 1;
    const localImg = `/frames/frame${imgIndex}.jpg`;
    return {
      ...frame,
      image: localImg,
      image_path: localImg,
      image_url: localImg
    };
  });

  fs.writeFileSync(framesJsonPath, JSON.stringify(updatedFrames, null, 2), 'utf-8');
  fs.writeFileSync(path.resolve('frames.json'), JSON.stringify(updatedFrames, null, 2), 'utf-8');

  console.log(`\n✓ Successfully mapped all catalog items to local studio paths (/frames/frame1.jpg ... /frames/frame12.jpg)`);
}

run().catch(console.error);
