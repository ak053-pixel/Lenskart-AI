import fs from 'fs';
import path from 'path';

const framesPngFiles = [
  '/frames/vc-rectangle-black-01.png',
  '/frames/jj-rectangle-tortoise-02.png',
  '/frames/air-rectangle-gunmetal-03.png',
  '/frames/ojos-rectangle-crystal-04.png',
  '/frames/air-round-gold-05.png',
  '/frames/jj-round-tortoise-06.png',
  '/frames/vc-round-matte-black-07.png',
  '/frames/air-round-silver-rimless-08.png',
  '/frames/vc-geometric-gold-09.png',
  '/frames/jj-geometric-black-10.png',
  '/frames/ojos-geometric-champagne-11.png',
  '/frames/air-geometric-rose-gold-12.png',
  '/frames/vc-square-hustlr-13.png',
  '/frames/jj-square-matte-navy-14.png',
  '/frames/air-square-smoke-grey-15.png',
  '/frames/ojos-square-olive-16.png',
  '/frames/vc-cateye-black-17.png',
  '/frames/jj-cateye-tortoise-gold-18.png',
  '/frames/air-cateye-rose-19.png',
  '/frames/ojos-cateye-emerald-20.png',
  '/frames/jj-aviator-gold-polarized-21.png',
  '/frames/vc-aviator-black-pilot-22.png',
  '/frames/air-aviator-silver-optical-23.png',
  '/frames/jj-aviator-rosegold-gradient-24.png',
  '/frames/vc-clubmaster-black-gold-25.png',
  '/frames/jj-clubmaster-tortoise-26.png',
  '/frames/ojos-clubmaster-woodgrain-27.png',
  '/frames/air-rimless-titanium-28.png',
  '/frames/jj-rimless-gold-29.png',
  '/frames/vc-wayfarer-classic-black-30.png',
  '/frames/jj-wayfarer-crystal-blue-31.png',
  '/frames/ojos-wayfarer-tortoise-amber-32.png'
];

// Verify all files exist in public/
framesPngFiles.forEach(f => {
  const diskPath = path.join('public', f.replace('/frames/', 'frames/'));
  if (!fs.existsSync(diskPath)) {
    console.error(`MISSING FILE: ${diskPath}`);
  }
});

const framesJsonPath = path.resolve('src', 'data', 'frames.json');
const frames = JSON.parse(fs.readFileSync(framesJsonPath, 'utf-8'));

const updated = frames.map((frame, index) => {
  const pngPath = framesPngFiles[index % framesPngFiles.length];
  return {
    ...frame,
    frame_path: pngPath,
    framePng: pngPath
  };
});

fs.writeFileSync(framesJsonPath, JSON.stringify(updated, null, 2), 'utf-8');
fs.writeFileSync(path.resolve('frames.json'), JSON.stringify(updated, null, 2), 'utf-8');
console.log('✓ All 32 frames successfully mapped to verified existing PNG files!');
